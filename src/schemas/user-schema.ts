import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";


const selectUserSchema = createSelectSchema(users).extend({
    email: z.string().email(),
    login: z.string().min(4),
    password: z.string().min(8)
});

export const deleteUserSchema = z.object({
    body: selectUserSchema.pick({
        email: true,
    }),
});

export const signInSchema = z.object({
    body: selectUserSchema.pick({
        login: true, 
        password: true,
    }),
});

export const addUserSchema = z.object({
    body: selectUserSchema.pick({
        login: true,
        email: true,
        password: true,
    }),
});

export const updateUserSchema = z.object({
    body: selectUserSchema
        .pick({
            login: true,
            email: true,
            password: true,
        })
        .partial(),
});

export const newUserSchema = z.object({
    body: selectUserSchema.pick({
        login: true,
        email: true,
        password: true,
    }),
});

export type NewUser = z.infer<typeof newUserSchema>['body'];