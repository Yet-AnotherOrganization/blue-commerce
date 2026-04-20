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
        table?: 'product' | 'cart' | 'user' | 'favorite' | 'review'
    }
}

const AdminPage = async ({ searchParams }: Props) => {


    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const activeTable = searchParams.table || "product"


    const data = await prisma.product.findMany({
        where: {
            name: { contains: query, mode: "insensitive" },
        },
        take: 10,
        skip: (page - 1) * 10
    })

    return (
        <div className='flex-[4] flex flex-col h-full justify-center mx-[10vw]'>
            <TableSelector data={data}/>
            <TableControls />
        </div>
    )
}

export default AdminPage