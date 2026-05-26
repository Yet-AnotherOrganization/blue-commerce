import { activateProduct, softDeleteProduct } from '@/app/actions/productActions'
import { useConfirm } from '@/context/ConfirmContext'
import { Product } from '@/generated/prisma'
import { SerializedProduct } from '@/types/product'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'
import { toast } from 'sonner'

type Props = {
    item: SerializedProduct,
}

const TableProductRow = ({ item }: Props) => {

    const ask = useConfirm();

    const handleArchive = async () => {
        const confirmed = await ask('Are you sure you want to archive this product?');
        if (confirmed) {
            const res = await softDeleteProduct(item.id)
            toast(res.success ? 'Successfully archived.' : `ERROR: ${res.error}`)
        }
    }

    const handlePublish = async () => {
        const confirmed = await ask('Are you sure you want to activate this product for listing?');

        if (confirmed) {
            const res = await activateProduct(item.id)
            toast(res.success ? 'Successfully published.' : `ERROR: ${res.error}`)

        }
    }


    const color = item.status === "ACTIVE" ? "green" : item.status === "DRAFT" ? "orange" : "red"
    return (
        <tr className='border-y'>
            <td className='px-4'>
                <Image width={50} height={50} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={item.imageUrl} className='w-12 h-12' alt="" />
            </td>
            <td>
                <Link href={`/admin/product/${item.id}`}>
                    {item.name}
                </Link>
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
                        <button onClick={handleArchive}>
                            <FaTrash />
                        </button> :
                        <button onClick={handlePublish}>
                            <TiTick />
                        </button>
                }
            </td>
        </tr>
    )
}

export default TableProductRow