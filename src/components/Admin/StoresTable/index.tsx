'use client'
import { activateProduct } from '@/app/actions/productActions';
import { Product, Store, User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaCircle, FaTrash } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import TableStoreRow from './TableStoreRow';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
type Props = {
    // fix any
    data: Store[];
}

const StoresTable = ({ data }: Props) => {

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
        <div className='overflow-y-scroll mt-[2vh] h-[565px]'>
            <table className='border border-black w-full table-fixed overflow-y-scroll'>
                <thead className='border'>
                    <tr className='font-bold bg-blue-100 sticky top-0'>
                        <td className='px-4 py-8'>

                        </td>
                        <td className='w-[30%]' onClick={() => reqSort('storeName')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Name
                                <span className='w-4'>
                                    {getSortIcon('storeName')}
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
                        <td className='' onClick={() => reqSort('productCount')}>
                            <div className='inline-flex justify-center items-center gap-1'>
                                Product Count
                                <span className='w-4'>
                                    {getSortIcon('productCount')}
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
                        <td className='w-[10%]'>
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
                                <TableStoreRow item={item} key={item.id} />
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default StoresTable