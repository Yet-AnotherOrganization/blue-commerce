import AdminSidebar from '@/components/Admin/AdminSidebar'
import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import UsersTable from '@/components/Admin/UsersTable'
import { Product, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import React from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        table: 'product' | 'cart' | 'user' | 'favorite' | 'review',
        limit: number,
        sort: string,
        order: 'asc' | 'desc' | ''
    }
}

const AdminPage = async ({ searchParams }: Props) => {


    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const activeTable = searchParams.table || "product"
    const limit = Number(searchParams.limit) || 10
    const sort = searchParams.sort;
    const order = searchParams.order;


    let data: Product[] | User[];
    let totalAmount;

    const getProductsTable = async (query: string, limit: number, page: number) => {
        const data = await prisma.product.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
                // status: "ACTIVE"
            },
            take: limit,
            skip: (page - 1) * 10,
            orderBy: sort ? { [sort]: order || 'asc' } : undefined
        })
        totalAmount = await prisma.product.count() || 0;

        return data
    }

    const getUsersTable = async (query: string, limit: number, page: number) => {
        const data = await prisma.user.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
            },
            take: limit,
            skip: (page - 1) * 10
        })
        totalAmount = await prisma.product.count();

        return data;
    }

    switch (activeTable) {
        case 'user':
            data = await prisma.user.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: limit,
                skip: (page - 1) * 10
            })
            totalAmount = await prisma.user.count();
            break;
        default:

            break;
    }

    console.log("\n\n\n total: ", totalAmount)

    return (
        <>
            <div className='flex-[4] flex flex-col h-full mx-[10vw]'>
                {
                    activeTable == 'product' && <ProductsTable data={(await getProductsTable(query, limit, page))} />
                }
                {
                    activeTable == 'user' && <UsersTable data={(await getUsersTable(query, limit, page))} />
                }
            </div>

            <TableControls totalAmount={totalAmount || 0} />
        </>
    )
}

export default AdminPage