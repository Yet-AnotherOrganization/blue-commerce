import { Prisma, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Alice",
        email: "alice@example.com",
        password: "alice123",
    },
    {
        name: "Bob",
        email: "bob@example.com",
        password: "bob123",
    },
]

async function main() {
    // Seed data goes here

}