import { db } from "../../db";
import { users } from "../../db/schema";
import { CreateUserInput } from "./users.schema";
import { eq } from "drizzle-orm";
import { AppErr } from "../../shared/errors/app-error";
export const createUser = async (input: CreateUserInput) => {
  // first we check if the user already exist
  const userExist = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (userExist) throw new AppErr("User already exists !!!");
  const newUser = await db.insert(users).values(input).returning();
  return newUser;
};

export const getAllUsers = async () => {
  return await db.select().from(users);
};

export const getUsersWithTicketes = async () => {
  return await db.query.users.findMany({
    with: {
      tickets: {
        columns: {
          title: true,
          priority: true,
          assignedAgentId: true,
        },
      },
    },
  });
};
