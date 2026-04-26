'use client'
import { debounce } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    placeholder?: string
}

const SearchInput = ({ placeholder = 'value' }: Props) => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [input, setInput] = useState<string>('');

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value) params.set('q', value)
            else params.delete('q');

            if (Number(searchParams.get('page')) > 1) params.set('page', "1")

            router.replace(`${pathname}?${params}`);
        }, 300),

        [pathname, router, searchParams])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.currentTarget.value
            .replaceAll(' ', '')
            .replaceAll('-', '')
            .toLowerCase();

        debouncedSearch(searchValue);
    }

    return (
        <div className='pt-8'>
            <div className='border inline-flex items-center gap-1 px-4 py-2 rounded-xl border-black'>
                <FaSearch />
                <input
                    className=' pt-1 outline-none'
                    placeholder={`Enter ${placeholder}...`}
                    onChange={handleInputChange} />
            </div>
        </div>
    )
}

export default SearchInput