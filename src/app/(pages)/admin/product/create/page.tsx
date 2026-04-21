
import { Product } from '@/generated/prisma'
import React, { useState } from 'react'
import CreateProductForm from './form'
import { prisma } from '@/lib/prisma'

type Props = {}

const CreateProductPage = async (props: Props) => {

    const categories = await prisma.category.findMany({});

    const stores = await prisma.store.findMany({})

    return (

        <div className='sm:mx-[5vw] md:mx-[10vw] lg:mx-[20vw] py-[5vh]'>
            <CreateProductForm categories={categories} stores={stores} />
        </div>
    )
}

export default CreateProductPage