'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'

type Props = {}

const SearchInput = (props: Props) => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [input, setInput] = useState<string>('');

    useEffect(() => { 

        const params = new URLSearchParams(searchParams.toString());
        params.set('q', input);

        router.replace(`${pathname}?${params}`);

    }, [input])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.currentTarget.value
        .replaceAll(' ', '')
        .replaceAll('-', '')
        .toLowerCase();

        console.log("amogus")

        setInput(searchValue);
    }

    return (
        <div className='bg-'>
            <input placeholder='Enter user name' onChange={handleInputChange} />
        </div>
    )
}

export default SearchInput