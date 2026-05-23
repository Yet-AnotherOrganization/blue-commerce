'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import CartModalProduct from './CartModalProduct'
import { ProductParams } from '../../constants/constants'
import { calculateTotalCost } from '../../utils/clientOnlyUtils'
import { getSession, useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { closeCartModal } from '../../redux/slices/uiSlice'

type Props = {}

const CartModal = (props: Props) => {

    // const isCartOpen = useSelector((store: RootState) => store.cartDisplayReducer.cartDisplay)
    const dispatch = useDispatch()
    const cart = useSelector((store: RootState) => store.cartReducer.cart)
    const cartModalOpen = useSelector((state: RootState) => state.uiReducer.cartModalOpen)
    const router: AppRouterInstance = useRouter()


    const user = useSession().data?.user;


    useEffect(() => {
        // setDisplayCart(cart)
    }, [cart])



    return (

        cartModalOpen &&
        <>
            <div>
                <div className='bg-white text-black border flex-col justify-between overflow-hidden rounded-xl h-[40vh] w-[30vw] sm:w-[40vw] absolute bottom-[-42vh] right-0 z-[200000] hidden md:flex'
                >
                    <div className='flex justify-between items-center text-xl font-semibold px-4 py-2 border-b'><div />
                        <span>CART</span>
                        <button className='bg-red-700 rounded-full cursor-pointer relative w-8 h-8' onClick={() => dispatch(closeCartModal())}>

                            <span
                                className='text-white'
                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>X</span>
                        </button>
                    </div>


                    <div className='h-3/5 px-4 my-5 overflow-auto'>

                        {cart?.map((item, i) => {

                            return (

                                <CartModalProduct product={item.product} key={i} />

                            )
                        })}

                    </div>


                    <div className='flex bg-gray-200 border-t-2 justify-between border-gray-300 px-4 py-2'>
                        <button className='bg-orange-400 rounded-xl text-white p-2' onClick={() => { router.push('/cart') }}>GO TO CART</button>
                        <span className='p-2 rounded-xl text-white bg-blue-300'>TOTAL PRICE: {calculateTotalCost(cart)}</span>
                    </div>
                </div>
            </div>
            <div onClick={() => dispatch(closeCartModal())} className='fixed md:hidden top-0 left-0 right-0 bottom-0 backdrop-blur-sm'>
                <div onClick={(e)=>e.stopPropagation()} className='bg-white text-black border flex flex-col justify-between overflow-hidden border-neutral-400 rounded-xl md:h-[40vh] md:w-[30vw] absolute md:bottom-[-42vh] z-[200000] left-1/2 top-1/2 md:right-0 translate-x-[-50%] translate-y-[-50%] md:translate-x-0 md:translate-y-0 w-[90vw] h-[90vh] '>
                    <div className='flex justify-between items-center text-xl font-semibold px-4 py-2 border-b'><div />
                        <span>CART</span>
                        <button className='bg-red-700 rounded-full cursor-pointer relative w-8 h-8' onClick={() => dispatch(closeCartModal())}>

                            <span
                                className='text-white'
                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>X</span>
                        </button>
                    </div>


                    <div className='h-3/5 px-4 my-5 overflow-auto'>

                        {cart?.map((item, i) => {

                            return (

                                <CartModalProduct product={item.product} key={i} />

                            )
                        })}

                    </div>


                    <div className='flex bg-gray-200 border-t-2 justify-between border-gray-300 px-4 py-2'>
                        <button className='bg-orange-400 rounded-xl text-white p-2' onClick={() => { router.push('/cart'); dispatch(closeCartModal()) }}>GO TO CART</button>
                        <span className='p-2 rounded-xl text-white bg-blue-300'>TOTAL PRICE: {calculateTotalCost(cart)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartModal