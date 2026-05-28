
import { User } from '@/generated/prisma'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import React from 'react'

type Props = {
    item: User,
}

const TableUserRow = ({ item }: Props) => {


    return (
        <tr className='border-y'>
            <td className='px-4 py-2'>
                <div className='relative aspect-square'>
                    <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={item.avatar || ''} className='w-12 h-12' alt="" />
                </div>
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