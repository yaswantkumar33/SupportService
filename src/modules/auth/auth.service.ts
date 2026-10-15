import { db } from "../../db";
import { registerInput } from "./auth.schema";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AppErr } from "../../shared/errors/app-error";
import bcrypt from 'bcryptjs';


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