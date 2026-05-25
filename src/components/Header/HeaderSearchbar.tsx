'use client';
import { Product } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearchbarVisible } from '@/redux/slices/uiSlice';
import { RootState } from '@/redux/store';
import { SerializedProduct } from '@/types/product';
import { debounce } from '@/utils/clientOnlyUtils';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';

type Props = {
    product: SerializedProduct
}


const HeaderProduct = ({ product }: Props) => {

    const dispatch = useAppDispatch();
    const router = useRouter();


    return (
        <div  onMouseUp={() => {dispatch(setSearchbarVisible(false)); router.push(`/product/${product.id}`)}}  className='cursor-pointer flex items-center gap-4 border-b p-2'>
            <img src={product.imageUrl} className='w-10 h-10 rounded-md' alt="" />
            <span className='text-ellipsis text-base text-pretty'>{product.name}</span>

            <span></span>
        </div>
    )
}


const HeaderSearchbar = () => {

    const [query, setQuery] = useState('');
    const [foundProducts, setFoundProducts] = useState<SerializedProduct[]>([])
    const dispatch = useAppDispatch();
    const { headerSearchbarVisible: isVisible } = useAppSelector((state: RootState) => state.uiReducer)
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (query === '') { setFoundProducts([]); dispatch(setSearchbarVisible(false)); return };

        (async () => {
            const req = await axios.get(`/api/product?query=${query}`);
            const found = req.data.data as SerializedProduct[];

            console.log(found)
            setFoundProducts(found);
            dispatch(setSearchbarVisible(true));
        })();


    }, [query]);

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            // If the click is NOT inside our wrapper ref, close it
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                dispatch(setSearchbarVisible(false));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onSearch = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
        {

                dispatch(setSearchbarVisible(true));
            setQuery(e.target.value)
            // const searchInput = formRef.current as HTMLInputElement
            // const encodedSearchQuery = encodeURI(searchInput.value)
            // formRef.current.value.trim() === "" ? router.push('/') : router.push(`/search?q=${encodedSearchQuery}`)
        }
    }, 300)
    return (
        <div className='w-[30%] relative' ref={wrapperRef}>
            <form id='searchbar' onSubmit={(e) => { }} >
                <input onInput={onSearch} type="search" className={`outline-none w-full  rounded-xl border-2 border-gray-500 text-black p-1 lg:p-4 ${isVisible && 'border-b-0 rounded-b-none'} z-[21]`} placeholder='Search for products...' />
                <button className='absolute transform top-[50%] right-4 translate-y-[-50%] text-xl text-gray-500'><FaSearch className='hidden lg:block' /></button>
            </form>
            {
                isVisible &&

                <div className='display-products flex flex-col w-[200%] md:w-[150%] xl:w-full min-h-8 p-4 bg-white text-black border-neutral-400 rounded-b-md border-2 z-20 absolute '>
                    {
                        foundProducts.slice(0, 8).map((prod) => <HeaderProduct product={prod} key={prod.id} />)
                    }
                    {
                        foundProducts.length > 8 && <div className='pt-4'>{foundProducts.length - 8} more results</div>
                    }
                    {
                        foundProducts.length == 0 && <div className='pt-4'>No products matching your query were found.</div>
                    }
                </div>
            }
        </div>
    )
}

export default HeaderSearchbar