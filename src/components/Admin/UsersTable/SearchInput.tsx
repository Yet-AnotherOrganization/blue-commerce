'use client'
import { debounce } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

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
        <div className='bg-'>
            <input placeholder={`Enter ${placeholder}...`} onChange={handleInputChange} />
        </div>
    )
}

export default SearchInput