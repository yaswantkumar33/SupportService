import { db } from "../../db";
import { loginInput, registerInput } from "./auth.schema";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AppErr } from "../../shared/errors/app-error";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from "../../config/env";


export const registerUser = async (input: registerInput) => {

    // check userExists witth the provided  email 
    const userExists = await db.query.users.findFirst({
        where: eq(users.email, input.email)
    })
    if (userExists) throw new AppErr("User with this email already exist", 400)

    const hashPassword = await bcrypt.hash(input.password, 10);

    const [newUser] = await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashPassword,
        role: input.role
    }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt
    })
    return newUser;
}


export const loginUser = async (input: loginInput) => {

    const userExists = await db.query.users.findFirst({
        where: eq(users.email, input.email)
    })
    if (!userExists) throw new AppErr("Invalid email or password", 401)

    const isPasswordValid = await bcrypt.compare(input.password, userExists.password);
    if (!isPasswordValid) throw new AppErr("Invalid password", 401);

    const token = jwt.sign(
        { userId: userExists.id, userRole: userExists.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    return {
        user: {
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
        },
        token,
    }
}