'use client'
import { activateProduct, deleteProduct } from '@/app/actions/productActions';
import { Product, User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
type Props = {
    // fix any
    data: Product[];
}

const ProductsTable = ({ data }: Props) => {

    const [page, setPage] = useState(1);
    const limit = 20;
    const [prods, setProds] = useState([])

    useEffect(() => {

    }, [page])

    return (
        <table className='border border-black flex-1 overflow-scroll mt-[2vh]'>
            <thead className='border'>
                <tr className='font-bold bg-blue-100 sticky top-0'>
                    <td className='px-4 py-8'>#</td>
                    <td>Name</td>
                    <td>Status</td>
                    <td>Price</td>
                    <td>Stock</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody className='border'>
                {
                    data.map((item) => {
                        return (
                            <tr className='border-y'>
                                <td className='px-4'>
                                    <img src={item.imageUrl} className='w-12 h-12' alt="" />
                                </td>
                                <td>{item.name}</td>
                                <td>
                                    <FaCircle color={item.status == "ACTIVE" ? "lightgreen" : item.status == "DRAFT" ? 'orange' : "red"} />
                                </td>
                                <td>{Number(item.price)}</td>
                                <td>{item.stock}</td>
                                <td>
                                    {
                                        item.status == "ACTIVE" ?
                                            <button onClick={async () => {
                                                const confirmed = window.confirm('Are you sure you want to delete this product?');

                                                if (confirmed) {
                                                    const res = await deleteProduct(item.id)
                                                    if (!res?.success) {
                                                        alert(res?.message)
                                                    }
                                                }
                                            }}>
                                                <FaTrash />
                                            </button> :
                                            <button onClick={async () => {
                                                const confirmed = window.confirm('Are you sure you want to activate this product for listing?');

                                                if (confirmed) {
                                                    const res = await activateProduct(item.id)
                                                    if (!res?.success) {
                                                        alert(res?.message)
                                                    }
                                                }
                                            }}>
                                                <TiTick />
                                            </button>
                                    }
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default ProductsTable