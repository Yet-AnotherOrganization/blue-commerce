import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import { Product } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit: number,
        sort: string,
        order: 'asc' | 'desc' | ''
    }
}

const ProductsPage = async ({ searchParams }: Props) => {

    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10
    const sort = searchParams.sort;
    const order = searchParams.order;

    let data: Product[]
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
    return (
        <>

            <div className='flex-[4] flex flex-col h-full mx-[10vw]'>
                <ProductsTable data={(await getProductsTable(query, limit, page))} />
                <TableControls totalAmount={totalAmount || 0} />
                <div className='flex justify-center items-center'>
                    <Link href='/admin/product/create' className='bg-blue-400 px-4 py-2 rounded-md shadow-md text-white hover:scale-105 transition-all'>
                    Create New Product</Link>
                </div>
            </div>

        </>
    )
}

export default ProductsPage