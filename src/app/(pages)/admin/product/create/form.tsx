'use client'
import InputWithSearch from '@/components/Common/InputWithSearch'
import { Button } from '@/components/ui/button'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Category, Product, Store } from '@/generated/prisma'
import React, { useEffect, useState } from 'react'

type Props = {
    categories: Category[],
    stores: Store[],
}

const CreateProductForm = ({ categories, stores }: Props) => {



    const [productData, setProductData] = useState<Product>()
    const [selectedStore, setSelectedStore] = useState<Store>()
    const [selectedCategory, setSelectedCategory] = useState<Category>()

    const handleStoreChange = (value: string) => {
        setSelectedStore(stores.find((store) => store.id === value))
    }
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(categories.find((cat) => cat.id === value))
    }

    return (
        <form action="" className='border px-16 py-8 rounded-xl shadow-md'>
            <h1 className='text-center text-2xl font-bold mb-16'>Create a New Product</h1>
            <div className='flex'>
                <div className='flex-[3] flex gap-8 lg:flex-row flex-col'>
                    <div className='flex-1 flex flex-col gap-4'>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="name" className='text-lg'>Name</label>
                            <input type="text" id='name' className='border border-gray-400 rounded-md px-2 py-1' />
                        </div>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="price" className='text-lg'>Price</label>
                            <input type="number" id='price' min='0' className='border border-gray-400 rounded-md px-2 py-1' />
                        </div>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="category" className='text-lg'>Category</label>
                            <InputWithSearch
                                placeholder='Select a category'
                                searchPlaceholder={'Search categories'}
                                items={categories.map((item) => ({ label: item.name, value: item.id }))}
                                onChange={(value: string) => handleStoreChange(value)}
                            />
                        </div>
                        <div className='input-wrapper inline-flex flex-col z-50'>
                            <label htmlFor="store" className='text-lg'>Store</label>
                            <InputWithSearch
                                placeholder='Select a store'
                                searchPlaceholder={'Search stores'}
                                items={stores.map((item) => ({ label: item.storeName, value: item.id }))}
                                onChange={(value: string) => handleStoreChange(value)}
                            />
                        </div>
                    </div>
                    <div className='flex-1 bg-red-400 h-full'>
                        
                    </div>
                </div>
                <div className='flex-[1] bg-green-400'>
                    World
                </div>
            </div>
        </form>
    )
}

export default CreateProductForm