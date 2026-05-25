'use client'
import { User } from '@/generated/prisma';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import TableUserRow from './TableUserRow';

type Props = {
    data: User[]
}

const UsersTable = ({ data }: Props) => {

    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<{ key: string, order: string }>({ key: '', order: 'asc' })
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort.key)
        params.set('order', sort.order)
        if (sort.key == '') params.delete('sort');
        if (sort.order == '') params.delete('order');
        router.replace(`${pathname}?${params.toString()}`)

    }, [sort])

    const reqSort = (key: string) => {
        let direction = 'asc';
        let newKey = key;

        if (key == sort.key && sort.order == 'asc') direction = 'desc'
        else if (key == sort.key && sort.order == 'desc') {
            newKey = '';
            direction = '';
        }
        else direction = 'asc'

        setSort({ key: newKey, order: direction })
    }

    const getSortIcon = (name: string) => {
        if (sort.key !== name) return ''
        return sort.order === 'asc' ? <FaArrowDown /> : <FaArrowUp />
    }

    return (
        <div className='overflow-y-scroll mt-[2vh] min-h-[70vh]'>
            <table className='border border-black w-full'>
                <thead className='border'>
                    <tr className='font-bold bg-blue-100 sticky top-0'>
                        <td className='px-4 py-8'>

                        </td>
                        <td className='' onClick={() => reqSort('name')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Name
                                <span className='w-4'>
                                    {getSortIcon('name')}
                                </span>
                            </div>

                        </td>
                        <td className='' onClick={() => reqSort('status')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Status
                                <span className='w-4'>
                                    {getSortIcon('status')}
                                </span>
                            </div>
                        </td>
                        <td className='' onClick={() => reqSort('price')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Price
                                <span className='w-4'>
                                    {getSortIcon('price')}
                                </span>
                            </div>

                        </td>
                        <td className='' onClick={() => reqSort('stock')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Stock
                                <span className='w-4'>
                                    {getSortIcon('stock')}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Actions
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody className='border overflow-scroll '>
                    {
                        data.map((item) => {
                            return (
                                <TableUserRow item={item} key={item.id}/>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UsersTable