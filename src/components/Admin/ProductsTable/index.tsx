'use client'
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Props = {}

const ProductsTable = (props: Props) => {

    const [page,setPage] = useState(1);
    const limit = 20;
    const [prods,setProds] = useState([])

    useEffect(()=>{

        await axios.get('')

    },[page])

    return (
        <table className='border border-black'>
            <thead className='border'>
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>Stock</td>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    )
}

export default ProductsTable