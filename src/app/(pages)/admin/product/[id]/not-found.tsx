import Link from 'next/link'
import React from 'react'

type Props = {}

const ProductNotFound = (props: Props) => {
  return (
    <div className='text-center h-full justify-center pt-20'>
        <h1 className='text-2xl font-bold'>404 | Product Not Found</h1>
        <Link href={`/admin/product`} className='hover:text-blue-600 text-lg pt-8'>Return to Products Panel</Link>
    </div>
  )
}

export default ProductNotFound