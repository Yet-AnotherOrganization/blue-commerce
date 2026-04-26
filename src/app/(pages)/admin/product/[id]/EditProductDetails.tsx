'use client';
import { Product } from '@/generated/prisma'
import Link from 'next/link'
import React, { useState } from 'react'
import ControlBar from './ControlBar'
import { SerializedProduct } from '@/types/product';

type Props = {
    product: SerializedProduct
}

const EditProductDetails = ({ product }: Props) => {

    const [name, setName] = useState(product.name);

    return (
        <div className='mx-[5vw] pt-[3vh] lg:mx-[15vw] flex flex-col'>
            <div className='flex gap-4 pb-4'>
                <Link className='hover:text-blue-400' href={`/admin/product`}>Products</Link>
                &gt;
                <Link className='hover:text-blue-400' href={`#`}>{product?.name}</Link>
            </div>
            <div className='flex bg-neutral-50 shadow-md border rounded-xl p-[50px] relative  flex-wrap'>
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
                            <div className='flex items-center'>
                                <div className='flex-1'>Name:</div>
                                <div className='flex-[3]'>
                                    <input className='px-2 py-1 border-2 border-black w-full' type="text" placeholder={product.name} defaultValue={name} />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center'>
                                <div className='flex-1'>Slug:</div>
                                <div className='flex-[3]'>{product?.nameSlug}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EditProductDetails