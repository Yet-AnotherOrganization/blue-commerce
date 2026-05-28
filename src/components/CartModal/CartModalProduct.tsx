import React, { useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { CartItemWithProduct, ProductType } from '../../types/product'
import Image from 'next/image'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import { useAppDispatch } from '@/redux/hooks'
import { CartUIItem, removeItem } from '@/redux/slices/cartSlice'
import { toast } from 'sonner'


type Props = {
  cartItem: CartUIItem;
}

const CartModalProduct = ({ cartItem }: Props) => {

  useEffect(() => {
  }, [])

  const dispatch = useAppDispatch()

  // const user = JSON.parse(localStorage.getItem("user"));



  return (
    <div className='text-center w-full flex text-xl justify-between items-center px-4 my-2 pt-3 border-t-2'>
      <div className='w-[5rem] h-[5rem] relative aspect-square'>
        <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={cartItem.product.imageUrl} className='object-contain rounded w-full h-full' alt="" />
      </div>

      <div className='flex w-1/4 h-full items-center justify-center'>
        <span className='text-ellipsis text-sm'>{cartItem.product.name}</span>
      </div>

      <div className='flex w-1/4 h-full items-center justify-center'>
        <span>${cartItem.product.price}</span>
      </div>

      <button className='flex h-full items-center justify-center' onClick={async () => {
        const res = await dispatch(removeItem(cartItem.id))

        if (res.meta.requestStatus === 'fulfilled') toast.success('Item removed from cart.')
      }}>
        < FaTrashAlt />
      </button>
    </div>
  )
}

export default CartModalProduct