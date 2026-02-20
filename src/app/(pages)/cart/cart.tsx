'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductParams } from '../../../constants/constants'
import { RootState } from '../../../redux/store'
import { getCart, reloadCart, removeFromCart } from '../../../utils/utils'
import { FaTrash } from "react-icons/fa";
import { TotalComponent } from './TotalComponent'
import '../../../components/css/index.css'
import { calculateTotalCost } from '../../../utils/clientOnlyUtils'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '../../../redux/hooks'
import { removeOrDecrement } from '../../../redux/slices/cartSlice'

const CartDiv = () => {

    const [id, setId] = useState(null)
    const cart = useSelector((store: RootState) => store.cartReducer.cart)
    const { data } = useSession()
    const user = data?.user;
    const dispatch = useAppDispatch()



    return (
        <div className='flex h-full'>
            <div className='h-full lg:w-[75%] min-h-[40vh] w-full p-1 lg:p-4 flex flex-col items-center bg-white rounded-xl m-4'>
                {cart && cart.length > 0 ? cart?.map((item, i) => (

                    <div key={i} className='w-full mb-[10px] flex items-center h-full border-b-4 border-gray-200 text-black'>
                        <div className='overflow-hidden w-full h-full text-[1.5rem] gap-8 lg:gap-0 m-4 lg:m-4 p-4 bg-white border-gray-500 rounded-xl item-grid flex-col lg:flex-row'>
                            <a href={`/product/${item.product.id}`}>
                                <div className='w-[77vw] h-[40vh] lg:w-[15rem] lg:h-[15rem] object-contain shadow-md rounded-md lg:m-2'>
                                    <img src={item.product.imageUrl} alt="" className='object-contain rounded-xl w-full h-full lg:p-2' />
                                </div>
                            </a>
                            <span className='text-center font-bold text-2xl'>{item?.product.name}</span>
                            <span className='font-semibold text-4xl'>${item?.product.price}</span>
                            <button className='text-[3rem] text-red-600' onClick={async () => {
                                await dispatch(removeOrDecrement({ productId: item.product.id }))
                            }}><FaTrash /></button>
                        </div>
                    </div>

                )) : <div className='text-[1rem] lg:text-[2rem] gap-8 flex flex-col items-center text-blue-400 justify-center text-center'>Your Cart is Currently Empty
                    <a className='rounded-xl bg-blue-400 text-white p-4' href='/'>Go Back to Shopping</a>
                </div>}
            </div>
            <TotalComponent cart={cart} />
        </div>
    )
}

export default CartDiv