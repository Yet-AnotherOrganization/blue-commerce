import { Category, Prisma, PrismaClient, User, Store, Product } from "../src/generated/prisma";
import { prisma } from "../src/lib/prisma";
import { faker } from '@faker-js/faker';

async function main() {
    console.log("Starting Seeding...")
    console.log("Clearing old data...");

    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();


    const users: User[] = [];
    let ids: string[] = [];
    const stores: Store[] = [];
    const products: Product[] = [];

    // * CREATE USERS
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data:
            {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                avatar: faker.image.avatar()
            }
        })

        users.push(user)
        ids.push(user.id)
    }

    // CREATE STORES

    for (let i = 0; i < 5; i++) {

        const randomIndex = Math.floor(Math.random() * ids.length)

        // remove the id that has already been picked
        const [oId] = ids.splice(randomIndex, 1)

        const store: Store = await prisma.store.create({
            data: {
                ownerId: oId,
                storeName: faker.company.name(),
                avatar: faker.image.avatarGitHub()
            }
        })

        stores.push(store)


    }

    const categories: Category[] = [];

    // * CREATE CATEGORIES

    for (let i = 0; i < 10; i++) {
        const cat = await prisma.category.create({
            data: {
                name: faker.commerce.department(),
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.urlLoremFlickr({ category: "business" })
            }
        })

        categories.push(cat);
    }


    // * CREATE PRODUCTS
    for (let i = 0; i < 20; i++) {
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 200 })).toFixed(2),
                imageUrl: faker.image.urlLoremFlickr({ category: "business" }),
                categoryId: categories[Math.floor(Math.random() * categories.length)].id,
                stock: faker.number.int({ min: 3, max: 200 }),
                sellerId: stores[Math.floor(Math.random() * stores.length)].id
            },
            include: {
                category: true
            }
        })

        products.push(product)
    }

    // * CREATE REVIEWS

    for (let product of products) {
        await prisma.review.create({
            data: {
                ownerId: users[Math.floor(Math.random() * users.length)].id,
                rating: faker.number.int({
                    min: 1,
                    max: 5
                }),
                text: faker.lorem.sentences({ min: 3, max: 5 }),
                productId: product.id
            }
        })
    }

    console.log("Seeding Finished")

}

// const allUsers: User[] = await prisma.user.findMany({
//     include: {
//         reviews: true,
//         orders: true
//     }
// })

// console.log("ALL USERS: ", allUsers)


main()
    .then(async (): Promise<void> => {
        await prisma.$disconnect()
    })
    .catch(async (e): Promise<Error | void> => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })