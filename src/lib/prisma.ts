import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { slugify } from "@/utils/utils";

const unwantedStrings = ['.', ',', "'", "-", "_", "~", ""]

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const extendedClient = (baseClient: PrismaClient) => {
    return baseClient.$extends({
        query: {
            user: {
                // intercept create operation for slugging manually
                async create({ args, query }) {
                    if (args.data.name) args.data.nameSlug = slugify(args.data.name)

                    return query(args);
                },

                // intercept update/upsert ops
                async update({ args, query }) {
                    if (args.data.name)
                        args.data.nameSlug = slugify(args.data.name?.toString())
                    return query(args);
                }
            },
            product: {
                // intercept create operation for slugging manually
                async create({ args, query }) {
                    if (args.data.name) args.data.nameSlug = slugify(args.data.name)

                    return query(args);
                },

                // intercept update/upsert ops
                async update({ args, query }) {
                    if (args.data.name)
                        args.data.nameSlug = slugify(args.data.name?.toString())
                    return query(args);
                }
            },
            store: {
                // intercept create operation for slugging manually
                async create({ args, query }) {
                    if (args.data.storeName) args.data.nameSlug = slugify(args.data.storeName)

                    return query(args);
                },

                // intercept update/upsert ops
                async update({ args, query }) {
                    if (args.data.storeName)
                        args.data.nameSlug = slugify(args.data.storeName?.toString())
                    return query(args);
                }
            }
        }
    })
}

type PrismaClientExtended = ReturnType<typeof extendedClient>;


const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })

const baseClient = globalForPrisma.prisma ?? new PrismaClient({ adapter });


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = baseClient;

export const prisma = extendedClient(baseClient);