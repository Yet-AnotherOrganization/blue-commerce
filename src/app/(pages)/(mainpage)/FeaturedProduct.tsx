import { Product } from '@/generated/prisma'
import { Serialized } from '@/types/product'
import React from 'react'

type Props = {
    product: Serialized<Product>
}

const FeaturedProduct = (props: Props) => {
  return (
    <div>FeaturedProduct</div>
  )
}

export default FeaturedProduct