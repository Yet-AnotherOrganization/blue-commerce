import Link from 'next/link'
import React from 'react'

type Props = {
    params: { id: string }
}

const CheckoutPage = ({ params }: Props) => {
    return (
        <div className='flex flex-col text-lg lg:h-[50vh] justify-center items-center gap-4'>
            <h1 className='text-4xl font-semibold'>SUCCESS</h1>
            <p><span className='text-emerald-600'>ORDER NO:</span> {params.id}</p>
            <p>We've received your order and it will shortly be delivered for cargo.</p>
            <p className='text-blue-400 hover:text-blue-600'><Link href={'/orders'}>Check the status of your orders here</Link></p>
        </div>
    )
}

export default CheckoutPage