'use client';
import { toggleCartModal } from '@/redux/slices/uiSlice'
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import CartModal from '../CartModal'
import { RootState } from '@/redux/store'

type Props = {}

const CartAndControls = (props: Props) => {
    const dispatch = useDispatch()
    const cart = useSelector((store: RootState) => store.cartReducer.cart)

    return (
        <div className='relative z-10'>
            <button onClick={() => {
                dispatch(toggleCartModal())
            }}
                className='text-blue-400 cart-text flex items-center border-2 hover:border-neutral-800 cursor-pointer border-transparent hover:shadow-lg transition-all relative bg-white rounded-xl font-semibold p-2 justify-center'>
                <div className='relative'>
                    <span className='text-white text-sm lg:text-[15px] font-semibold absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2'>{cart.length}</span>
                    <FaShoppingCart className='cart-text text-2xl lg:text-[30px]' />
                </div>

                <span className='hidden lg:block'>MY CART</span>
            </button>
            <CartModal />
        </div>
    )
}

export default CartAndControls