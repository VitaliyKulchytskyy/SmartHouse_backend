/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'node:crypto';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { roles, users } from '@/schemas/schema';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import type { NewUser } from '@/schemas/user-schema';


export async function getUserByUserId(userId: string) {
  const [user] = await db
    .select({
      login: users.login,
      email: users.email,
      roleName: roles.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .limit(1);

  return user;
};

async function getUserByField<F>(field: any, value: F) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(field, value))
    .limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  return await getUserByField(users.email, email);
}

export async function getUserByLogin(login: string) {
  return getUserByField(users.login, login);
}

export async function getAllUsers() {
  return await db.select().from(users);
};

export async function addUser(user: NewUser) {
  const { password, ...userDetails } = user;

  const salt = crypto.randomBytes(32);
  const hashedPassword = await argon2.hash(password, {
    salt,
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      login: users.login,
      email: users.email,
    });

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    });
  }

  return { user: newUser };
}
