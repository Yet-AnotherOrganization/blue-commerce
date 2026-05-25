'use client'
import React, { useEffect, useState } from 'react'
import { ProductParams } from '../../constants/constants'
import { Product } from '../../generated/prisma'
import ProductButtons from '../ProductButtons'
import { useAppSelector } from '@/redux/hooks'

const PriceComponent = ({ currentProduct }: { currentProduct: Product }) => {

  const {cartModalOpen} = useAppSelector(state => state.uiReducer)


  return (
    <div className={`${cartModalOpen && 'hidden'} w-full z-30 flex flex-col text-center items-center price-component bg-white bottom-0 pt-2`}>
      <span className=" font-semibold">${(currentProduct?.price).toString()}</span>
      <ProductButtons product={currentProduct.id} style='max-lg:flex hidden text-white font-medium pb-2' />
    </div>
  )
}

export default PriceComponent