'use client'
import React, { useEffect, useState } from 'react'
import { ProductParams } from '../../constants/constants'
import { Product } from '../../generated/prisma'
import ProductButtons from '../ProductButtons'

const PriceComponent = ({ currentProduct }: { currentProduct: Product }) => {


  return (
    <div className={`w-full z-30 flex flex-col text-center price-component bg-white bottom-0 py-8`}>
      <span className=" font-semibold">${(currentProduct?.price).toString()}</span>
      <ProductButtons product={currentProduct.id} style='max-lg:flex hidden text-white font-medium' />
    </div>
  )
}

export default PriceComponent