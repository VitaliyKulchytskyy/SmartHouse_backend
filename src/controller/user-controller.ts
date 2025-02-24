import type { User } from "@/schemas/schema";
import { signInSchema, newUserSchema } from "@/schemas/user-schema";
import { addUser, getAllUsers, getUserByEmail, getUserByLogin } from "@/services/user-services";
import { createHandler } from "@/utils/create";
import { BackendError } from "@/utils/errors";
import generateToken from "@/utils/jwt";
import argon2 from 'argon2';


export const handleGetUser = createHandler(async (_req, res) => {
    const { user } = res.locals as { user: User };

    res.status(200).json({
        user: {
            id: user.id,
            login: user.login,
            email: user.email,
            roleId: user.roleId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        },
    });
});

export const handleFetchListOfUsers = createHandler(async (req, res) => {
    const allUsers = await getAllUsers();

    const safeUsers = allUsers.map((user: User) => ({
        id: user.id,
        login: user.login,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));


    res.status(200).json({
        users: safeUsers,
    });
});

export const handleUserSignUp = createHandler(newUserSchema, async (req, res) => {
    const user = req.body;
  
    const existingUser = await getUserByEmail(user.email);
  
    if (existingUser) {
      throw new BackendError('CONFLICT', {
        message: 'User already exists',
      });
    }
  
    const { user: addedUser } = await addUser(user);
    res.status(201).json(addedUser);
});

export const handleUserSignIn = createHandler(signInSchema, async (req, res) => {
    const { login, password } = req.body;
    const user = await getUserByLogin(login);

    if (!user)
        throw new BackendError('USER_NOT_FOUND');

    const matchPassword = await argon2.verify(user.password, password);
    if (!matchPassword)
        throw new BackendError('INVALID_PASSWORD');

    const token = generateToken(user.id);
    res.status(200).json({ token });
});