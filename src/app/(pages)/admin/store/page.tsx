import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import StoresTable from '@/components/Admin/StoresTable'
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


    const getStoresTable = async (query: string, limit: number, page: number) => {
        const data = await prisma.store.findMany({
            where: {
                storeName: { contains: query, mode: "insensitive" },
                // status: "ACTIVE"
            },
            include: {
                owner: true,
                products: true,
                _count: {
                    select: { products: true }
                }
            },
            take: limit,
            skip: (page - 1) * 10,
            orderBy:
                // if the sort parameter is productCount then special sort by it
                sort === 'productCount' ?
                    {
                        products: {
                            _count: order || 'asc'
                        }
                    }
                    // if anything else do a normal sort
                    : sort ?
                        { [sort]: order || 'asc' }
                        :
                    // if there is no sort field at all then don't do anything (undefined)
                        undefined

        })
        totalAmount = await prisma.store.count() || 0;

        return data
    }
    return (
        <>

            <div className='flex-[4] flex flex-col h-full mx-[10vw]'>
                <StoresTable data={(await getStoresTable(query, limit, page))} />
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