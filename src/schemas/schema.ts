import { type InferSelectModel } from "drizzle-orm";
import {
    pgTable,
    serial,
    text,
    integer,
    varchar,
    timestamp,
    uuid,
    jsonb,
    pgEnum,
    time,
    inet,
} from "drizzle-orm/pg-core";


export const roles = pgTable("roles", {
    id: serial().primaryKey(),
    name: varchar({ length: 32 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type Role = InferSelectModel<typeof roles>;

export const users = pgTable("users", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    login: varchar({ length: 64 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 128 }).notNull().unique(),
    // FIXME: !!! NULL CASE DOESNT DEFINED YET !!!
    roleId: integer('role_id').references(() => roles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type User = InferSelectModel<typeof users>;

export const eUserStatus = pgEnum('user_status', ["trigger", "info", "security", "create", "update", "delete", "debug"]);
export const userActionLogs = pgTable("user_action_logs", {
    id: serial().primaryKey(),
    userId: uuid().notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: eUserStatus(),
    message: text().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export type UserActionLogs = InferSelectModel<typeof userActionLogs>;

export const rooms = pgTable("rooms", {
    id: serial().primaryKey(),
    name: varchar({ length: 32 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type Room = InferSelectModel<typeof rooms>;

export const devices = pgTable("devices", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    name: varchar({ length: 32 }).notNull(),
    pluginId: varchar("plugin_id", { length: 64 }).notNull().references(() => plugins.dockerContainerId, { onDelete: 'cascade' }),
    roomId: integer("room_id").references(() => rooms.id, { onDelete: 'set null' }),
    // TODO: which bit is roleId who can access to this device. Root always have an accces. A user with null roleId is a spectator
    access: integer().notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type Device = InferSelectModel<typeof devices>;

export const schedules = pgTable("schedule", {
    id: serial().primaryKey(),
    name: varchar({ length: 32 }).notNull(),
    deviceId: uuid("device_id").references(() => devices.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    command: text(),
    time: time().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export type Schedule = InferSelectModel<typeof schedules>;

interface PluginMetadata {
    name: string,
    author: string,
    version: string,
    description: string,
    icon: string,
    depenedcy: string[]
};

export const plugins = pgTable("plugins", {
    dockerContainerId: varchar("docker_container_id", { length: 64 }).notNull().primaryKey(),
    ip: inet().notNull(),
    port: integer(),
    metadata: jsonb().$type<PluginMetadata>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export type Plugin = InferSelectModel<typeof plugins>;

export const ePluginStatus = pgEnum('plugin_status', ["warning", "error", "info", "schedule", "invoke", "debug"]);
export const pluginActionLogs = pgTable("plugin_action_logs", {
    id: serial().primaryKey(),
    pluginId: varchar("plugin_id", { length: 64 }).notNull().references(() => plugins.dockerContainerId, { onDelete: 'cascade' }),
    status: ePluginStatus(),
    message: text().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export type PluginActionLogs = InferSelectModel<typeof pluginActionLogs>;
