import AdminSidebar from '@/components/Admin/AdminSidebar'
import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import TableSelector from '@/components/Admin/TableSelector/TableSelector'
import { prisma } from '@/lib/prisma'
import React from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        table: 'product' | 'cart' | 'user' | 'favorite' | 'review',
        limit: number
    }
}

const AdminPage = async ({ searchParams }: Props) => {


    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const activeTable = searchParams.table || "product"
    const limit = Number(searchParams.limit) || 10


    let data;
    let totalAmount;
    switch (activeTable) {
        case 'product':
            data = await prisma.product.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: limit,
                skip: (page - 1) * 10
            })
            totalAmount = await prisma.product.count();
            break;
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
            data = await prisma.product.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: limit,
                skip: (page - 1) * 10
            })
            totalAmount = await prisma.product.count();
            break;
    }

    console.log("\n\n\n total: ", totalAmount)

    return (
        <>
            <div className='flex-[4] flex flex-col h-full mx-[10vw] overflow-scroll'>
                <TableSelector data={data} />
            </div>
            
            <TableControls totalAmount={totalAmount} />
        </>
    )
}

export default AdminPage