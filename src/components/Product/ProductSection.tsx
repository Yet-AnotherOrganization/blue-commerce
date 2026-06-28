import { Product } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import React from 'react'
import ProductCard from '../ProductCard'
import { SerializedProduct } from '@/types/product'
import { serializeProducts } from '@/utils/clientOnlyUtils'

type Props = {}

const ProductSection = async (props: Props) => {
    const products: SerializedProduct[] = serializeProducts((await prisma.product.findMany({
        where: {
            stock: { gt: 0 },
            status: "ACTIVE"
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })))
    return (
        <div className="flex justify-center">
            <div className="grid-container mx-[3vw] mb-10 md:px-6 px-6 w-[90vw] mt-8">
                {Array.isArray(products) ? (products.map((product, i: number): React.ReactNode => (<ProductCard key={product.id} product={product} />))) : (<div>Error loading products.</div>)}
            </div>
        </div>
    )
}

export default ProductSection