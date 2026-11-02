import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prisma, Role } from "../dist/db/index.js";
import { Prisma } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_PATH = path.resolve(__dirname, "../../../prisma/schema.prisma");

test("PR 12: Core Database Schema — Relational Integrity & Schema Validation", async (t) => {
  await t.test("exports Role enum with all authorized roles", () => {
    assert.ok(Role, "Role enum must be exported");
    assert.equal(Role.ADMIN, "ADMIN");
    assert.equal(Role.INVENTORY_MANAGER, "INVENTORY_MANAGER");
    assert.equal(Role.WAREHOUSE_OPERATOR, "WAREHOUSE_OPERATOR");
    assert.equal(Role.PROCUREMENT_MANAGER, "PROCUREMENT_MANAGER");
    assert.equal(Role.OPERATIONS_MANAGER, "OPERATIONS_MANAGER");

    const roleValues = Object.values(Role);
    assert.equal(roleValues.length, 5, "Exactly 5 authorized roles must exist");
  });

  await t.test("prisma client exposes the User model delegate", () => {
    assert.ok(prisma.user, "prisma.user model delegate must exist");
    assert.equal(typeof prisma.user.findUnique, "function");
    assert.equal(typeof prisma.user.findFirst, "function");
    assert.equal(typeof prisma.user.findMany, "function");
    assert.equal(typeof prisma.user.create, "function");
    assert.equal(typeof prisma.user.update, "function");
    assert.equal(typeof prisma.user.delete, "function");
    assert.equal(typeof prisma.user.upsert, "function");
    assert.equal(typeof prisma.user.count, "function");
    assert.equal(typeof prisma.user.aggregate, "function");
  });

  await t.test(
    "Prisma DMMF metadata confirms User model and fields specification",
    () => {
      const models = Prisma.dmmf.datamodel.models;
      assert.equal(
        models.length,
        1,
        "Only User model must be present in PR 12",
      );

      const userModel = models.find((m) => m.name === "User");
      assert.ok(userModel, "User model must be defined in DMMF");
      assert.equal(
        userModel.dbName,
        "users",
        "User model must map to 'users' table",
      );

      const fieldMap = new Map(userModel.fields.map((f) => [f.name, f]));

      // 1. Primary key id
      const idField = fieldMap.get("id");
      assert.ok(idField, "id field must exist");
      assert.equal(idField.isId, true, "id must be primary key");
      assert.equal(idField.type, "String");
      assert.equal(idField.isRequired, true);
      assert.equal(idField.default?.name, "uuid", "id default must be uuid()");

      // 2. Email unique constraint
      const emailField = fieldMap.get("email");
      assert.ok(emailField, "email field must exist");
      assert.equal(emailField.type, "String");
      assert.equal(emailField.isRequired, true);
      assert.equal(
        emailField.isUnique,
        true,
        "email must have unique constraint",
      );

      // 3. Password hash
      const passwordHashField = fieldMap.get("passwordHash");
      assert.ok(passwordHashField, "passwordHash field must exist");
      assert.equal(passwordHashField.type, "String");
      assert.equal(passwordHashField.isRequired, true);
      assert.equal(passwordHashField.isUnique, false);

      // 4. Name
      const nameField = fieldMap.get("name");
      assert.ok(nameField, "name field must exist");
      assert.equal(nameField.type, "String");
      assert.equal(nameField.isRequired, true);

      // 5. Role enum & least-privilege default
      const roleField = fieldMap.get("role");
      assert.ok(roleField, "role field must exist");
      assert.equal(roleField.type, "Role");
      assert.equal(roleField.isRequired, true);
      assert.equal(
        roleField.default,
        "WAREHOUSE_OPERATOR",
        "role default must be least-privileged WAREHOUSE_OPERATOR",
      );

      // 6. Active status
      const isActiveField = fieldMap.get("isActive");
      assert.ok(isActiveField, "isActive field must exist");
      assert.equal(isActiveField.type, "Boolean");
      assert.equal(isActiveField.isRequired, true);
      assert.equal(
        isActiveField.default,
        true,
        "isActive default must be true",
      );

      // 7. Timestamps
      const createdAtField = fieldMap.get("createdAt");
      assert.ok(createdAtField, "createdAt field must exist");
      assert.equal(createdAtField.type, "DateTime");
      assert.equal(createdAtField.isRequired, true);
      assert.equal(
        createdAtField.default?.name,
        "now",
        "createdAt default must be now()",
      );

      const updatedAtField = fieldMap.get("updatedAt");
      assert.ok(updatedAtField, "updatedAt field must exist");
      assert.equal(updatedAtField.type, "DateTime");
      assert.equal(updatedAtField.isRequired, true);
      assert.equal(
        updatedAtField.isUpdatedAt,
        true,
        "updatedAt must be @updatedAt",
      );
    },
  );

  await t.test("Prisma DMMF metadata confirms Role enum definition", () => {
    const enums = Prisma.dmmf.datamodel.enums;
    assert.equal(enums.length, 1, "Only Role enum must be present in PR 12");

    const roleEnum = enums.find((e) => e.name === "Role");
    assert.ok(roleEnum, "Role enum must exist");

    const values = roleEnum.values.map((v) => v.name);
    assert.deepEqual(values, [
      "ADMIN",
      "INVENTORY_MANAGER",
      "WAREHOUSE_OPERATOR",
      "PROCUREMENT_MANAGER",
      "OPERATIONS_MANAGER",
    ]);
  });

  await t.test(
    "Root schema file contains valid PostgreSQL datasource and index configurations",
    () => {
      assert.ok(fs.existsSync(SCHEMA_PATH), "Root schema.prisma must exist");
      const content = fs.readFileSync(SCHEMA_PATH, "utf8");

      assert.ok(
        content.includes('provider = "postgresql"'),
        "Datasource provider must be postgresql",
      );
      assert.ok(
        content.includes('url      = env("DATABASE_URL")'),
        "Datasource url must read env('DATABASE_URL')",
      );
      assert.ok(
        content.includes('provider = "prisma-client-js"'),
        "Generator client provider must be prisma-client-js",
      );
      assert.ok(
        content.includes('@@map("users")'),
        "User model must map to 'users' table",
      );
      assert.ok(
        content.includes("@@index([role])"),
        "User model must index the role column for RBAC query efficiency",
      );

      // Verify roadmap scope isolation — future models must NOT exist yet
      const forbiddenModels = [
        "model Product",
        "model Category",
        "model Warehouse",
        "model Inventory",
        "model InventoryMovement",
        "model InventoryTransfer",
        "model InventoryReservation",
        "model Supplier",
        "model Order",
        "model AuditRecord",
        "model Forecast",
        "model Recommendation",
      ];

      for (const forbidden of forbiddenModels) {
        assert.ok(
          !content.includes(forbidden),
          `Future roadmap model '${forbidden}' must not be present in PR 12`,
        );
      }
    },
  );
});
