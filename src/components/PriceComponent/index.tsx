'use client'
import React, { useEffect, useState } from 'react'
import { ProductParams } from '../../constants/constants'
import { Product } from '../../generated/prisma'

const PriceComponent = ({ currentProduct }: { currentProduct: Product }) => {


  return (
    <div className={`w-full z-30 flex flex-col text-center price-component`}>
      <span className=" font-semibold">${(currentProduct?.price).toString()}</span>
      <span className=" font-normal text-gray-600">Up to 12 installments</span>
    </div>
  )
}

export default PriceComponent