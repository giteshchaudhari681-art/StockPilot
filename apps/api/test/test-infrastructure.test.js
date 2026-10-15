import test from "node:test";
import assert from "node:assert/strict";
import express from "express";

import { withIsolatedEnv, createEnvSnapshot } from "./helpers/env.js";
import { startTestServer, withTestServer } from "./helpers/test-server.js";
import {
  assertValidUuid,
  assertErrorEnvelope,
  assertHealthOk,
  UUID_REGEX,
} from "./helpers/assertions.js";
import {
  createTestAppConfig,
  createTestErrorEnvelope,
  TEST_CONSTANTS,
} from "./fixtures/index.js";

test("Testing Foundation - Infrastructure Verification", async (t) => {
  await t.test(
    "withIsolatedEnv overrides and restores process.env on success",
    async () => {
      process.env["TEST_INFRA_VAR"] = "original_value";

      await withIsolatedEnv(
        {
          TEST_INFRA_VAR: "overridden_value",
          TEST_NEW_KEY: "added_value",
        },
        () => {
          assert.equal(process.env["TEST_INFRA_VAR"], "overridden_value");
          assert.equal(process.env["TEST_NEW_KEY"], "added_value");
        },
      );

      assert.equal(process.env["TEST_INFRA_VAR"], "original_value");
      assert.equal(process.env["TEST_NEW_KEY"], undefined);
      delete process.env["TEST_INFRA_VAR"];
    },
  );

  await t.test(
    "withIsolatedEnv restores process.env even if callback throws",
    async () => {
      process.env["TEST_FAIL_SAFE"] = "initial";

      await assert.rejects(
        async () => {
          await withIsolatedEnv(
            {
              TEST_FAIL_SAFE: "mutated",
              TEST_LEAK_CHECK: "temporary",
            },
            () => {
              throw new Error("Intentional test failure");
            },
          );
        },
        { message: "Intentional test failure" },
      );

      assert.equal(process.env["TEST_FAIL_SAFE"], "initial");
      assert.equal(process.env["TEST_LEAK_CHECK"], undefined);
      delete process.env["TEST_FAIL_SAFE"];
    },
  );

  await t.test(
    "createEnvSnapshot restore() reverts environment accurately",
    () => {
      process.env["TEST_SNAP_1"] = "val_1";
      const snapshot = createEnvSnapshot();

      process.env["TEST_SNAP_1"] = "mutated_val";
      process.env["TEST_SNAP_2"] = "brand_new";

      snapshot.restore();

      assert.equal(process.env["TEST_SNAP_1"], "val_1");
      assert.equal(process.env["TEST_SNAP_2"], undefined);
      delete process.env["TEST_SNAP_1"];
    },
  );

  await t.test(
    "startTestServer & withTestServer bind ephemeral port and release resources",
    async () => {
      const mockApp = express();
      mockApp.get("/test-ping", (_req, res) => {
        res.json({ pong: true });
      });

      await withTestServer(mockApp, async (client) => {
        assert.ok(client.port > 0, "Ephemeral port must be greater than 0");
        assert.ok(client.baseUrl.includes(`:${client.port}`));

        const res = await client.fetch("/test-ping");
        assert.equal(res.status, 200);

        const body = await res.json();
        assert.equal(body.pong, true);
      });
    },
  );

  await t.test(
    "assertValidUuid passes on valid UUID and throws on invalid",
    () => {
      assert.doesNotThrow(() => {
        assertValidUuid(TEST_CONSTANTS.MOCK_CORRELATION_ID);
      });

      assert.throws(
        () => {
          assertValidUuid("invalid-uuid-string");
        },
        (err) => err instanceof assert.AssertionError,
      );
    },
  );

  await t.test(
    "assertErrorEnvelope passes on valid envelope and throws on malformed",
    () => {
      const validEnvelope = createTestErrorEnvelope(
        "NOT_FOUND",
        "Resource was not found",
        TEST_CONSTANTS.MOCK_CORRELATION_ID,
      );

      assert.doesNotThrow(() => {
        assertErrorEnvelope(
          validEnvelope,
          "NOT_FOUND",
          "Resource was not found",
        );
      });

      assert.throws(
        () => {
          assertErrorEnvelope({ status: 500 }, "INTERNAL_ERROR");
        },
        (err) => err instanceof assert.AssertionError,
      );
    },
  );

  await t.test("assertHealthOk validates compliant health status", () => {
    assert.doesNotThrow(() => {
      assertHealthOk({ status: "ok" });
    });

    assert.throws(
      () => {
        assertHealthOk({ status: "down" });
      },
      (err) => err instanceof assert.AssertionError,
    );
  });

  await t.test(
    "createTestAppConfig generates deeply frozen configuration fixtures",
    () => {
      const config = createTestAppConfig({
        nodeEnv: "production",
        port: 9000,
      });

      assert.equal(config.nodeEnv, "production");
      assert.equal(config.port, 9000);
      assert.equal(config.isProduction, true);
      assert.equal(config.isTest, false);
      assert.ok(Object.isFrozen(config));
      assert.ok(Object.isFrozen(config.server));
      assert.ok(Object.isFrozen(config.logging));
      assert.ok(Object.isFrozen(config.cors));
      assert.ok(Object.isFrozen(config.metadata));
    },
  );
});
