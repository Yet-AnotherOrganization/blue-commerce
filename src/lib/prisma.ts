import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter }).$extends({
    query: {
        user: {
            // intercept create operation for slugging manually
            async create({ args, query }) {
                if (args.data.name) {
                    args.data.nameSlug = args.data.name.toLowerCase().replace(/\s+/g, '')
                }

                return query(args);
            },

            // intercept update/upsert ops
            async update({ args, query }) {
                if (args.data.name && typeof args.data.name === 'string') {
                    args.data.nameSlug = args.data.name.toLocaleLowerCase().replace(/\s+/g, '')
                }
                return query(args);
            }
        },
        product: {
            // intercept create operation for slugging manually
            async create({ args, query }) {
                if (args.data.name) {
                    args.data.nameSlug = args.data.name.toLowerCase().replace(/\s+/g, '')
                }

                return query(args);
            },

            // intercept update/upsert ops
            async update({ args, query }) {
                if (args.data.name && typeof args.data.name === 'string') {
                    args.data.nameSlug = args.data.name.toLocaleLowerCase().replace(/\s+/g, '')
                }
                return query(args);
            }
        },
        store: {
            // intercept create operation for slugging manually
            async create({ args, query }) {
                if (args.data.storeName) {
                    args.data.nameSlug = args.data.storeName.toLowerCase().replace(/\s+/g, '').replaceAll('.', '')
                }

                return query(args);
            },

            // intercept update/upsert ops
            async update({ args, query }) {
                if (args.data.storeName && typeof args.data.storeName === 'string') {
                    args.data.nameSlug = args.data.storeName.toLocaleLowerCase().replace(/\s+/g, '').replaceAll('.', '')
                }
                return query(args);
            }
        }
    }
})

export { prisma }