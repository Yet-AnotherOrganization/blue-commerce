import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'
import { FaArchive, FaEdit } from 'react-icons/fa'
import ControlBar from './ControlBar'
import { notFound, redirect } from 'next/navigation'
import ViewProductDetails from './ViewProductDetails'
import EditProductDetails from './EditProductDetails'

type Props = {
    params: {
        id: string
    },
    searchParams: {
        mode: 'EDIT' | 'VIEW'
    }
}

const ProductDetailPage = async ({ params, searchParams }: Props) => {

    const product = await prisma.product.findFirst({
        where: {
            id: params.id
        },
        include: {
            seller: true,
            category: true
        }
    })

    if (!product) return notFound();

    const serializedProduct = {
        ...product,
        price: product.price.toNumber()
    }

    if (searchParams.mode === 'EDIT') return (<EditProductDetails product={serializedProduct} />)

    return (
        <ViewProductDetails product={serializedProduct} />
    )
}

export default ProductDetailPage