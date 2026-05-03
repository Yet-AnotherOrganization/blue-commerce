import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import SearchInput from '@/components/Admin/UsersTable/SearchInput'
import { Product } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    }
}

const ProductsPage = async ({ searchParams }: Props) => {

    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10
    const sort = searchParams.sort;
    const order = searchParams.order;


    const [data, totalAmount] = await Promise.all([
        prisma.product.findMany({
            where: { nameSlug: { contains: query, mode: "insensitive" } },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: sort ? { [sort]: order || 'asc' } : undefined
        }),
        prisma.product.count({
            where: { nameSlug: { contains: query, mode: "insensitive" } }
        })
    ]);

    const serializedData = data.map((item) => { return ({ ...item, price: item.price.toNumber() }) })

    return (
        <>

            <div className='flex-[4] flex flex-col h-full mx-[10vw]'>
                <SearchInput placeholder='product name' />
                <ProductsTable data={serializedData} />
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