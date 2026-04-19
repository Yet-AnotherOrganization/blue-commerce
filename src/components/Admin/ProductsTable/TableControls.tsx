'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {}

const TableControls = (props: Props) => {

    const pathname = usePathname();
    const router = useRouter();

    const sParams = useSearchParams();
    
  return (
    <div className='mx-auto'>
        {pathname}
    </div>
  )
}

export default TableControls