import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import UsersTable from '@/components/Admin/UsersTable'
import { Product, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import React, { ChangeEvent } from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit: number,
        sort: string,
        order: 'asc' | 'desc' | ''
    }
}

const UsersPage = async ({ searchParams }: Props) => {

    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10
    const sort = searchParams.sort;
    const order = searchParams.order;

    let data: User[]
    let totalAmount;


    const getUsersTable = async (query: string, limit: number, page: number) => {
        const data = await prisma.user.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
            },
            take: limit,
            skip: (page - 1) * 10
        })
        totalAmount = await prisma.user.count();

        return data;
    }



    return (
        <>

            <div className='flex-[4] flex flex-col h-full mx-[10vw]'>
                
                <UsersTable data={(await getUsersTable(query, limit, page))} />
                <TableControls totalAmount={totalAmount || 0} />
            </div>

        </>
    )
}

export default UsersPage