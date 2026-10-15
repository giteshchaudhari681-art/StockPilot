import test from "node:test";
import assert from "node:assert/strict";

import * as shared from "../dist/index.js";

test("@stockpilot/shared public API exports", async (t) => {
  await t.test("exports APP_METADATA with correct values", () => {
    assert.ok(shared.APP_METADATA, "APP_METADATA should be exported");
    assert.equal(shared.APP_METADATA.NAME, "StockPilot");
    assert.equal(shared.APP_METADATA.VERSION, "0.1.0");
  });

  await t.test("exports PAGINATION_DEFAULTS with correct values", () => {
    assert.ok(
      shared.PAGINATION_DEFAULTS,
      "PAGINATION_DEFAULTS should be exported",
    );
    assert.equal(shared.PAGINATION_DEFAULTS.DEFAULT_PAGE, 1);
    assert.equal(shared.PAGINATION_DEFAULTS.DEFAULT_PAGE_SIZE, 25);
    assert.equal(shared.PAGINATION_DEFAULTS.MAX_PAGE_SIZE, 100);
  });

  await t.test("exports SORT_ORDER with correct values", () => {
    assert.ok(shared.SORT_ORDER, "SORT_ORDER should be exported");
    assert.equal(shared.SORT_ORDER.ASC, "asc");
    assert.equal(shared.SORT_ORDER.DESC, "desc");
  });

  await t.test("exports HEALTH_STATUS with correct values", () => {
    assert.ok(shared.HEALTH_STATUS, "HEALTH_STATUS should be exported");
    assert.equal(shared.HEALTH_STATUS.OK, "ok");
    assert.equal(shared.HEALTH_STATUS.DEGRADED, "degraded");
    assert.equal(shared.HEALTH_STATUS.DOWN, "down");
  });

  await t.test("exports contain only authorized runtime symbols", () => {
    const exportedKeys = Object.keys(shared).sort();
    const expectedKeys = [
      "APP_METADATA",
      "DEFAULT_LOG_LEVEL",
      "DEFAULT_REDACT_KEYS",
      "HEALTH_STATUS",
      "LOG_LEVEL_SEVERITY",
      "PAGINATION_DEFAULTS",
      "SORT_ORDER",
      "VALID_LOG_LEVELS",
      "createLogger",
      "serializeError",
    ].sort();

    assert.deepEqual(exportedKeys, expectedKeys);
  });
});
