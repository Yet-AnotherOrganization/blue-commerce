import React from 'react'
import { useAppDispatch } from '../../../redux/hooks'
import { CartItemWithProduct } from '../../../types/product'
import { decrementItem, removeItem } from '../../../redux/slices/cartSlice'
import { FaTrash } from 'react-icons/fa'

type Props = {
    item: CartItemWithProduct
    disabled: boolean
}

const CartItem = ({ item, disabled }: Props) => {

    const dispatch = useAppDispatch()

    return (
        <div className='w-full mb-[10px] flex items-center h-full border-b-4 border-gray-200 text-black'>
            <div className='overflow-hidden w-full h-full text-[1.5rem] gap-8 lg:gap-0 m-4 lg:m-4 p-4 bg-white border-gray-500 rounded-xl item-grid flex-col lg:flex-row'>
                <Link href={`/product/${item.product.id}`}>
                    <div className='w-[77vw] h-[40vh] lg:w-[15rem] lg:h-[15rem] object-contain shadow-md rounded-md lg:m-2'>
                        <img src={item.product.imageUrl} alt="" className='object-contain rounded-xl w-full h-full lg:p-2' />
                    </div>
                </Link>
                <span className='text-center font-bold text-2xl'>{item?.product.name}</span>
                <span className='font-semibold text-4xl'>${item?.product.price}</span>
                <span className='text-3xl'>
                    {item.quantity}
                </span>
                <button className='text-[3rem] text-red-600'
                    disabled={disabled}
                    onClick={async () => {
                        if (item.quantity <= 1) await dispatch(removeItem(item.id))
                        else await dispatch(decrementItem(item.id))
                    }}><FaTrash /></button>
            </div>
        </div>
    )
}

export default CartItem