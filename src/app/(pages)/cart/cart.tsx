'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { FaTrash } from "react-icons/fa";
import { TotalComponent } from './TotalComponent'
import '../../../components/css/index.css'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '../../../redux/hooks'
import { decrementItem, removeItem } from '../../../redux/slices/cartSlice'
import CartItem from './CartItem';

const CartDiv = () => {
    const {cart, loading} = useSelector((store: RootState) => store.cartReducer)



    return (
        <div className='flex h-full'>
            <div className='h-full lg:w-[75%] min-h-[40vh] w-full p-1 lg:p-4 flex flex-col items-center bg-white rounded-xl m-4'>
                {cart && cart.length > 0 ? cart?.map((item, i) => (
                    <CartItem item={item} disabled={loading} />
                )) :
                    <div className='text-[1rem] lg:text-[2rem] gap-8 flex flex-col items-center text-blue-400 justify-center text-center'>Your Cart is Currently Empty
                        <a className='rounded-xl bg-blue-400 text-white p-4' href='/'>Go Back to Shopping</a>
                    </div>}
            </div>
            <TotalComponent cart={cart} />
        </div>
    )
}

export default CartDiv