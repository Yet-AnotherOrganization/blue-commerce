import { activateProduct } from '@/app/actions/productActions'
import { Product, Store } from '@/generated/prisma'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import React, { Dispatch } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'

type StoreWithCount = Store & {
  _count?: {
    products: number;
  };
};

type Props = {
    item: StoreWithCount,
}

const TableProductRow = ({ item }: Props) => {

    console.log(item)

    const color = item.status == "ACTIVE" ? "lightgreen" : item.status == "DISABLED" ? 'red' : "gray"
    return (
        <tr className='border-y'>
            <td className='px-4'>
                <Image width={50} height={50} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={item.avatar || ''} className='w-12 h-12' alt="" />
            </td>
            <td>{item.storeName}</td>
            <td>
                <div className='inline-flex items-center justify-center gap-1'>
                    <FaCircle color={color} />
                    <span className={`text-${color}-500`}>{item.status}</span>
                </div>
            </td>
            <td className=''>
                <div className='text-right w-[20%] '>
                    {Number(item._count?.products)}
                </div>
            </td>
            {/* <td className=''>
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
            </td> */}
        </tr>
    )
}

export default TableProductRow