import { activateProduct, deleteProduct } from '@/app/actions/productActions'
import { Product } from '@/generated/prisma'
import React, { Dispatch } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'

type Props = {
    item: Product,
}

const TableProductRow = ({ item }: Props) => {


    const color = item.status === "ACTIVE" ? "green" : item.status === "DRAFT" ? "orange" : "red"
    return (
        <tr className='border-y'>
            <td className='px-4'>
                <img src={item.imageUrl} className='w-12 h-12' alt="" />
            </td>
            <td>
                <a href={`/admin/product/${item.id}`}>
                    {item.name}
                </a>
            </td>
            <td>
                <div className='inline-flex items-center justify-center gap-1'>
                    <FaCircle color={item.status == "ACTIVE" ? "lightgreen" : item.status == "DRAFT" ? 'orange' : "red"} />
                    <span className={`text-${color}-500`}>{item.status}</span>
                </div>
            </td>
            <td className=''>
                <div className='text-right w-[20%] '>
                    {Number(item.price).toFixed(2)}
                </div>
            </td>
            <td className=''>
                <div className={`text-right w-[20%] ${item.stock === 0 && 'text-red-600 font-semibold'} `}>
                    {item.stock === 0 ? 'OUT' : item.stock}
                </div>
            </td>
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
}

export default TableProductRow