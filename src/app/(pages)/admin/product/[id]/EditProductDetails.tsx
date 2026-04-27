'use client';
import { Category, Product, Store } from '@/generated/prisma'
import Link from 'next/link'
import React, { ChangeEvent, useState } from 'react'
import ControlBar from './ControlBar'
import { SerializedProduct } from '@/types/product';
import SelectWithSearch from '@/components/Common/SelectWithSearch';

type Props = {
    product: SerializedProduct,
    categories: Category[],
    stores: Store[]
}

type ProductDetailInputProps = {
    fieldKey: string,
    placeholder: string,
    value: string,
    fn: (val: string) => void,
}

const ProductDetailInput = ({ fieldKey, value, placeholder, fn }: ProductDetailInputProps) => {
    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <label className='block flex-1 font-semibold'>{fieldKey}:</label>
                <input value={value} onChange={(e) => fn(e.currentTarget.value)} placeholder={`Enter ${placeholder}`} className='flex-1 inline-flex items-center gap-1' />
            </div>
        </div>
    )
}


const EditProductDetails = ({ product, categories, stores }: Props) => {

    const [name, setName] = useState(product.name);
    const [slug, setSlug] = useState(product.nameSlug);
    const [category, setCategory] = useState<string>(categories.find((cat) => cat.id === product.categoryId)?.id || '');
    const [store, setStore] = useState<string>(stores.find((store) => store.id === product.sellerId)?.id || '');

    return (
        <form onSubmit={(e) => e.preventDefault()} className='mx-[5vw] pt-[3vh] lg:mx-[15vw] flex flex-col'>
            <div className='flex gap-4 pb-4'>
                <Link className='hover:text-blue-400' href={`/admin/product`}>Products</Link>
                &gt;
                <Link className='hover:text-blue-400' href={`#`}>{product?.name}</Link>
            </div>
            <div className='flex bg-neutral-50 shadow-md border rounded-xl p-[50px] relative  flex-wrap flex-col lg:flex-row'>
                <div className='flex-1'>
                    <img
                        src={product?.imageUrl}
                        alt=""
                        className='rounded-md shadow-lg aspect-square max-w-[300px] m-auto mb-0 max-lg:mb-10'
                    />
                </div>
                <div className='flex-[2] flex flex-col lg:border-l-2 md:ml-4'>

                    <ControlBar product={product} />

                    <h1 className='text-center text-xl font-semibold'>Product Details</h1>
                    <div className='flex pt-4 pl-8 flex-col text-lg  gap-2'>
                        <ProductDetailInput fieldKey='Name' value={name} fn={setName} placeholder='product name' />
                        <div className='flex items-center'>
                            <label htmlFor="" className='flex-1 font-semibold'>Category:</label>
                            <SelectWithSearch classes='flex-1 block' id='category' items={categories.map((cat) => ({ label: cat.name, value: cat.id }))} onChange={setCategory} placeholder='Select new category...' defaultSelected={category} />
                        </div>
                        <div className='flex items-center'>
                            <label htmlFor="" className='flex-1 font-semibold'>Store:</label>
                            <SelectWithSearch classes='flex-1 block' id='category' items={stores.map((store) => ({ label: store.storeName, value: store.id }))} onChange={setStore} placeholder='Select seller store...' defaultSelected={store} />
                        </div>
                        {/* 
                        <DetailRow fieldKey='Slug'>
                            {product.nameSlug || ''}
                        </DetailRow>

                        <DetailRow fieldKey='Date Created'>
                            {product.createdAt.toLocaleDateString()} - {product.createdAt.toLocaleTimeString()}
                        </DetailRow>

                        <DetailRow fieldKey='Last Updated'>
                            {product.updatedAt.toLocaleDateString()} - {product.updatedAt.toLocaleTimeString()}
                        </DetailRow>

                        <DetailRow fieldKey='Status'>
                            <FaCircle size={10} color={product.status === 'ACTIVE' ? 'lightgreen' : product.status === 'DRAFT' ? 'orange' : 'red'} />
                            {product.status}
                        </DetailRow>

                        <DetailRow fieldKey='Category'>
                            {product.category.name}
                        </DetailRow>

                        <DetailRow fieldKey='Stock'>
                            {product.stock}
                        </DetailRow>

                        <DetailRow fieldKey='Seller'>
                            {product.seller.storeName}
                        </DetailRow> */}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default EditProductDetails