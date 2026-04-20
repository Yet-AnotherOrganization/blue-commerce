import { activateProduct, deleteProduct } from '@/app/actions/productActions'
import { Product, User } from '@/generated/prisma'
import React, { Dispatch } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'

type Props = {
    item: User,
}

const TableUserRow = ({ item }: Props) => {


    return (
        <tr className='border-y'>
            <td className='px-4'>
                <img src={item.avatar || ''} className='w-12 h-12' alt="" />
            </td>
            <td>{item.name}</td>
            <td>
                {item.status}
            </td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>
                {/* {
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
                } */}
            </td>
        </tr>
    )
}

export default TableUserRow