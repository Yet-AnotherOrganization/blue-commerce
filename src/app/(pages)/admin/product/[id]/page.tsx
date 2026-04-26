import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'
import { FaArchive, FaEdit } from 'react-icons/fa'
import ControlBar from './ControlBar'
import { notFound, redirect } from 'next/navigation'

type Props = {
    params: {
        id: string
    }
}

const ProductDetailPage = async ({ params }: Props) => {

    const product = await prisma.product.findFirst({
        where: {
            id: params.id
        },
        include: {
            seller: true,
        }
    })

    if(!product) return notFound();

    return (
        <div className='mx-[5vw] pt-[3vh] lg:mx-[15vw] flex flex-col'>
            <div className='flex gap-4 pb-4'>
                <Link className='hover:text-blue-400' href={`/admin/product`}>Products</Link>
                &gt;
                <Link className='hover:text-blue-400' href={`#`}>{product?.name}</Link>
            </div>
            <div className='flex bg-neutral-100 p-[50px] relative'>
                <div className=' flex-1'>
                    <img
                        src={product?.imageUrl}
                        alt=""
                        className='rounded-md shadow-lg'
                    />
                </div>
                <div className='flex-[2] flex flex-col border-l-2 ml-4'>

                    <ControlBar product={product} />

                    <h1 className='text-center text-xl font-semibold'>Product Details</h1>
                    <div className='flex pt-4 pl-8 flex-col text-lg  gap-2'>
                        <div className='flex flex-col'>
                            <div className='flex'>
                                <div className='flex-1'>Name:</div>
                                <div className='flex-1'>{product?.name}</div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex'>
                                <div className='flex-1'>Slug:</div>
                                <div className='flex-1'>{product?.nameSlug}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductDetailPage