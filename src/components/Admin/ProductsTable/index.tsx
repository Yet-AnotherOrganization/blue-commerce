'use client'
import { Product, User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Props = {
    // fix any
    data: Product[];
}

const ProductsTable = ({data}: Props) => {

    const [page,setPage] = useState(1);
    const limit = 20;
    const [prods,setProds] = useState([])

    useEffect(()=>{

    },[page])

    return (
        <table className='border border-black flex-1 overflow-scroll'>
            <thead className='border'>
                <tr className='font-bold bg-blue-100 sticky top-0'>
                    <td className='px-4 py-8'>#</td>
                    <td>Name</td>
                    <td>Price</td>
                    <td>Stock</td>
                </tr>
            </thead>
            <tbody className='border'>
                {
                    data.map((item) => {
                        return(
                            <tr className='border-y'>
                                <td className='px-4'>
                                    <img src={item.imageUrl} className='w-12 h-12' alt="" />
                                </td>
                                <td>{item.name}</td>
                                <td>{Number(item.price)}</td>
                                <td>{item.stock}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default ProductsTable