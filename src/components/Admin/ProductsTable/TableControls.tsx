'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

type Props = {}

const TableControls = (props: Props) => {

  const pathname = usePathname();
  const router = useRouter();

  const searchParams:string = useSearchParams().toString();
  const params = new URLSearchParams(searchParams)

  console.log(params)

  return (
    <Suspense>
      <div className='mx-auto flex gap-4 text-2xl '>
        <button>{'<-'}</button>
        <span></span>
        <button>{'->'}</button>
      </div>
    </Suspense>
  )
}

export default TableControls