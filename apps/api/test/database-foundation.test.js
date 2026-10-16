import test from "node:test";
import assert from "node:assert/strict";

import {
  prisma,
  getPrismaClient,
  createPrismaClient,
  connectDatabase,
  disconnectDatabase,
  isDatabaseConnected,
  resetPrismaClient,
} from "../dist/db/index.js";
import { PrismaClient } from "@prisma/client";

test("Database Foundation - Prisma Client & Lifecycle", async (t) => {
  t.beforeEach(() => {
    resetPrismaClient();
  });

  t.afterEach(async () => {
    resetPrismaClient();
  });

  await t.test(
    "exports canonical database symbols and lifecycle functions",
    () => {
      assert.ok(prisma, "prisma export must exist");
      assert.equal(typeof getPrismaClient, "function");
      assert.equal(typeof createPrismaClient, "function");
      assert.equal(typeof connectDatabase, "function");
      assert.equal(typeof disconnectDatabase, "function");
      assert.equal(typeof isDatabaseConnected, "function");
      assert.equal(typeof resetPrismaClient, "function");
    },
  );

  await t.test(
    "getPrismaClient() returns a singleton PrismaClient instance",
    () => {
      const client1 = getPrismaClient();
      const client2 = getPrismaClient();

      assert.ok(client1, "client1 must exist");
      assert.equal(typeof client1.$connect, "function");
      assert.equal(typeof client1.$disconnect, "function");
      assert.equal(
        client1,
        client2,
        "Subsequent calls must return identical singleton instance",
      );
    },
  );

  await t.test(
    "createPrismaClient() returns new configured PrismaClient instance",
    () => {
      const customClient = createPrismaClient({
        datasources: {
          db: {
            url: "postgresql://custom_user:custom_pass@localhost:5432/custom_db",
          },
        },
      });

      assert.ok(customClient, "customClient must exist");
      assert.equal(typeof customClient.$connect, "function");
      assert.equal(typeof customClient.$disconnect, "function");
      const singleton = getPrismaClient();
      assert.notEqual(
        customClient,
        singleton,
        "createPrismaClient must produce a distinct instance",
      );
    },
  );

  await t.test(
    "connectDatabase and disconnectDatabase manage lifecycle state safely",
    async () => {
      let connectCalled = 0;
      let disconnectCalled = 0;

      const mockClient = {
        $connect: async () => {
          connectCalled++;
        },
        $disconnect: async () => {
          disconnectCalled++;
        },
      };

      assert.equal(isDatabaseConnected(), false);

      // 1. Initial connect
      await connectDatabase(mockClient);
      assert.equal(connectCalled, 1);
      assert.equal(isDatabaseConnected(), true);

      // 2. Idempotent secondary connect (should not reconnect if already connected)
      await connectDatabase(mockClient);
      assert.equal(connectCalled, 1, "connectDatabase must be idempotent");
      assert.equal(isDatabaseConnected(), true);

      // 3. Disconnect
      await disconnectDatabase(mockClient);
      assert.equal(disconnectCalled, 1);
      assert.equal(isDatabaseConnected(), false);

      // 4. Safe redundant disconnect
      await disconnectDatabase(mockClient);
      assert.equal(
        disconnectCalled,
        1,
        "disconnectDatabase must be safe when already disconnected",
      );
      assert.equal(isDatabaseConnected(), false);
    },
  );

  await t.test(
    "connectDatabase propagates errors and keeps connection state false on failure",
    async () => {
      const failureError = new Error("Connection refused (ECONNREFUSED)");
      const failingMockClient = {
        $connect: async () => {
          throw failureError;
        },
        $disconnect: async () => {},
      };

      await assert.rejects(
        async () => {
          await connectDatabase(failingMockClient);
        },
        (err) => {
          assert.equal(err.message, "Connection refused (ECONNREFUSED)");
          return true;
        },
      );

      assert.equal(
        isDatabaseConnected(),
        false,
        "Connection state must be false after failed connect",
      );
    },
  );

  await t.test(
    "proxy prisma forwards properties and methods to singleton instance",
    () => {
      assert.ok(typeof prisma.$connect === "function");
      assert.ok(typeof prisma.$disconnect === "function");
      assert.ok(typeof prisma.$on === "function");
    },
  );
});
