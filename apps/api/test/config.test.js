import test from "node:test";
import assert from "node:assert/strict";

import { validateEnv, ConfigurationError } from "../dist/config/index.js";

test("Configuration Architecture - Unit Tests", async (t) => {
  await t.test(
    "valid development environment yields correct typed defaults",
    () => {
      const config = validateEnv({
        NODE_ENV: "development",
      });

      assert.equal(config.nodeEnv, "development");
      assert.equal(config.port, 4000);
      assert.equal(config.host, "0.0.0.0");
      assert.equal(config.logLevel, "debug");
      assert.equal(config.isDevelopment, true);
      assert.equal(config.isProduction, false);
      assert.equal(config.isTest, false);
      assert.equal(config.metadata.name, "StockPilot");
      assert.equal(config.metadata.version, "0.1.0");
      assert.equal(config.cors.credentials, true);
      assert.ok(Object.isFrozen(config), "Config root must be frozen");
      assert.ok(
        Object.isFrozen(config.server),
        "Config server sub-object must be frozen",
      );
    },
  );

  await t.test(
    "valid test environment yields 127.0.0.1 host and error log level",
    () => {
      const config = validateEnv({
        NODE_ENV: "test",
      });

      assert.equal(config.nodeEnv, "test");
      assert.equal(config.port, 4000);
      assert.equal(config.host, "127.0.0.1");
      assert.equal(config.logLevel, "error");
      assert.equal(config.isTest, true);
      assert.equal(config.isProduction, false);
      assert.equal(config.isDevelopment, false);
    },
  );

  await t.test(
    "valid production environment yields info log level by default",
    () => {
      const config = validateEnv({
        NODE_ENV: "production",
      });

      assert.equal(config.nodeEnv, "production");
      assert.equal(config.port, 4000);
      assert.equal(config.host, "0.0.0.0");
      assert.equal(config.logLevel, "info");
      assert.equal(config.isProduction, true);
      assert.equal(config.isDevelopment, false);
      assert.equal(config.isTest, false);
    },
  );

  await t.test("parses custom numeric PORT string to number", () => {
    const config = validateEnv({
      PORT: "8080",
    });

    assert.equal(typeof config.port, "number");
    assert.equal(config.port, 8080);
    assert.equal(config.server.port, 8080);
  });

  await t.test("parses custom LOG_LEVEL", () => {
    const config = validateEnv({
      LOG_LEVEL: "warn",
    });

    assert.equal(config.logLevel, "warn");
    assert.equal(config.logging.level, "warn");
  });

  await t.test("parses single and multiple CORS_ORIGIN values", () => {
    const singleConfig = validateEnv({
      CORS_ORIGIN: "https://stockpilot.app",
    });
    assert.equal(singleConfig.cors.origin, "https://stockpilot.app");

    const multiConfig = validateEnv({
      CORS_ORIGIN: "https://stockpilot.app, https://admin.stockpilot.app",
    });
    assert.deepEqual(multiConfig.cors.origin, [
      "https://stockpilot.app",
      "https://admin.stockpilot.app",
    ]);
  });

  await t.test("rejects invalid NODE_ENV with ConfigurationError", () => {
    assert.throws(
      () => {
        validateEnv({
          NODE_ENV: "staging",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.name, "ConfigurationError");
        assert.equal(err.issues.length, 1);
        assert.equal(err.issues[0]?.variable, "NODE_ENV");
        assert.match(err.message, /NODE_ENV/);
        return true;
      },
    );
  });

  await t.test("rejects non-numeric PORT", () => {
    assert.throws(
      () => {
        validateEnv({
          PORT: "eight-thousand",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "PORT");
        assert.match(err.issues[0]?.reason ?? "", /integer/);
        return true;
      },
    );
  });

  await t.test("rejects out-of-range PORT (< 1)", () => {
    assert.throws(
      () => {
        validateEnv({
          PORT: "0",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "PORT");
        return true;
      },
    );
  });

  await t.test("rejects out-of-range PORT (> 65535)", () => {
    assert.throws(
      () => {
        validateEnv({
          PORT: "70000",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "PORT");
        return true;
      },
    );
  });

  await t.test("rejects floating-point PORT", () => {
    assert.throws(
      () => {
        validateEnv({
          PORT: "3000.5",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "PORT");
        return true;
      },
    );
  });

  await t.test("rejects empty HOST", () => {
    assert.throws(
      () => {
        validateEnv({
          HOST: "   ",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "HOST");
        return true;
      },
    );
  });

  await t.test("rejects invalid LOG_LEVEL", () => {
    assert.throws(
      () => {
        validateEnv({
          LOG_LEVEL: "verbose",
        });
      },
      (err) => {
        assert.ok(err instanceof ConfigurationError);
        assert.equal(err.issues[0]?.variable, "LOG_LEVEL");
        return true;
      },
    );
  });

  await t.test(
    "aggregates multiple configuration issues simultaneously",
    () => {
      assert.throws(
        () => {
          validateEnv({
            NODE_ENV: "invalid_env",
            PORT: "not_a_number",
            LOG_LEVEL: "unsupported_level",
          });
        },
        (err) => {
          assert.ok(err instanceof ConfigurationError);
          assert.equal(err.issues.length, 3);
          const vars = err.issues.map((i) => i.variable);
          assert.ok(vars.includes("NODE_ENV"));
          assert.ok(vars.includes("PORT"));
          assert.ok(vars.includes("LOG_LEVEL"));
          assert.match(err.message, /3 issue\(s\)/);
          return true;
        },
      );
    },
  );

  await t.test("redacts sensitive variables in error messages", () => {
    const errorWithSecret = new ConfigurationError([
      {
        variable: "DATABASE_URL",
        reason: "connection string invalid",
        received: "postgresql://admin:super_secret_pw@db.internal:5432/main",
        isSensitive: true,
      },
    ]);

    assert.match(errorWithSecret.message, /\[REDACTED\]/);
    assert.equal(
      errorWithSecret.message.includes("super_secret_pw"),
      false,
      "Secret passwords must never appear in error message",
    );
  });
});
