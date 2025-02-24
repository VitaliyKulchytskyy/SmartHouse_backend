import type { InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { integer, varchar, timestamp, uuid } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    login: varchar({ length: 64 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 128 }).notNull().unique(),
    roleId: integer('role_id').default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type User = InferSelectModel<typeof users>;

export const roles = pgTable("roles", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 32 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type Role = InferSelectModel<typeof roles>; 