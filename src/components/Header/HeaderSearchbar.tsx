'use client';
import React from 'react'
import { FaSearch } from 'react-icons/fa';

type Props = {}

const HeaderSearchbar = (props: Props) => {
    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // const searchInput = formRef.current as HTMLInputElement
        // const encodedSearchQuery = encodeURI(searchInput.value)
        // formRef.current.value.trim() === "" ? router.push('/') : router.push(`/search?q=${encodedSearchQuery}`)
    }
    return (
        <div className='w-[30%] relative'>
            <form id='searchbar' onSubmit={(e) => { }}>
                <input onInput={(e) => { onSearch(e) }} type="text" className='w-full  rounded-xl border-2 border-gray-500 text-black p-1 lg:p-4' placeholder='Search for products...' />
                <button className='absolute transform top-[50%] right-4 translate-y-[-50%] text-[30px] text-gray-500'><FaSearch className='hidden lg:block' /></button>
            </form>
        </div>
    )
}

export default HeaderSearchbar