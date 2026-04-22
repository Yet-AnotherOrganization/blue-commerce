'use client'
import InputWithSearch from '@/components/Common/InputWithSearch'
import { Button } from '@/components/ui/button'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Category, Product, Store } from '@/generated/prisma'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    categories: Category[],
    stores: Store[],
}

const CreateProductForm = ({ categories, stores }: Props) => {



    const [productData, setProductData] = useState<Product>()
    const [selectedStore, setSelectedStore] = useState<Store>()
    const [selectedCategory, setSelectedCategory] = useState<Category>()
    const [image, setImage] = useState<string | null>(null)

    const handleStoreChange = (value: string) => {
        setSelectedStore(stores.find((store) => store.id === value))
    }
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(categories.find((cat) => cat.id === value))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0]

        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);

            return () => URL.revokeObjectURL(url);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement);

        const product = Object.fromEntries(formData.entries())

        const file = product.image as File;

        if (file.size > 1024 * 1024 * 4) {toast.error('File size exceeds the limit of 4MB.'); return;}

        const allowedTypes = ['image/jpg','image/jpeg','image/png']
        
        if(!allowedTypes.includes(file.type)) {toast.error('File type is invalid.'); return;}
    
        
    }

    return (
        <form onSubmit={handleSubmit} className='border px-16 py-8 rounded-xl shadow-md '>
            <h1 className='text-center text-2xl font-bold mb-16'>Create a New Product</h1>
            <div className='flex gap-8 items-start flex-col lg:flex-row'>
                <div className='flex-[4] flex gap-8  max-lg:w-full flex-col '>
                    <div className='flex-1 flex flex-col gap-4 '>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="name" className='text-lg'>Name</label>
                            <input type="text" id='name' className='border border-gray-400 rounded-md px-2 py-1 mt-2' />
                        </div>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="price" className='text-lg'>Price</label>
                            <input type="number" id='price' min='0' className='border border-gray-400 rounded-md px-2 py-1' />
                        </div>
                        <div className='input-wrapper inline-flex flex-col'>
                            <label htmlFor="category" className='text-lg mb-2'>Category</label>
                            <InputWithSearch
                                placeholder='Select a category'
                                searchPlaceholder={'Search categories'}
                                items={categories.map((item) => ({ label: item.name, value: item.id }))}
                                onChange={(value: string) => handleCategoryChange(value)}
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
                    {/* description part */}
                    <div className='flex-1 flex flex-col'>
                        <label htmlFor="description" className='text-lg'>Description</label>
                        <textarea name="description" id='description' className='border mt-2 border-gray-400 rounded-md px-2 py-1 min-h-[200px] resize-none'></textarea>
                    </div>
                </div>
                <div className='flex-[2] max-lg:w-full flex flex-col'>
                    <label htmlFor="image" className='text-lg'>Image</label>
                    <input name='image' id='image' type="file" placeholder='Select Image' className='hidden' onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)} />
                    <label htmlFor="image" className='mt-2 shadow-md rounded-md border'>
                        <img src={image || '/assets/select-image.jpg'} alt="" className='aspect-square rounded-md w-full' />
                    </label>

                    <div className='flex justify-center items-center my-4'>
                        <button className='bg-blue-400 rounded-lg shadow-md p-4 text-white transition-all hover:scale-105 text-xl'>Finalize</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreateProductForm