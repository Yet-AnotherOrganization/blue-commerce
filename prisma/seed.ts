import { Prisma, PrismaClient, User } from "../src/generated/prisma";
import { prisma } from "../src/lib/prisma";

async function main() {
    // Seed data goes here
    await prisma.user.createMany({
        data: [
            {
                name: "Yılmaz Erjohn",
                email: "yilmaz2014@gmail.com",
                password: "123456",
            }
        ],
    })

    const allUsers: User[] = await prisma.user.findMany({
        include: {
            reviews: true,
            orders: true
        }
    })

    console.log("ALL USERS: ", allUsers)
}

main()
    .then(async ():Promise<void> => {
        await prisma.$disconnect()
    })
    .catch(async (e):Promise<Error | void> => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })