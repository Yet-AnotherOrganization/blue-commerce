'use client'
import { changePage } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

type Props = {
  totalAmount: number
}

const TableControls = ({ totalAmount }: Props) => {

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')



  return (
    <Suspense>
      <div className='flex-col w-full items-center justify-center mb-4'>
        <div className='mx-auto justify-center flex gap-4 text-2xl '>
          <button
            onClick={() => changePage(searchParams, -1, router, pathname)}
            disabled={Number(page) == 1}
            className={`${Number(page) == 1 && 'text-gray-200'}`}
          >{'<-'}</button>
          <span></span>
          <button
            onClick={() => changePage(searchParams, 1, router, pathname)}
          >{'->'}</button>
        </div>

        {/* limit */}
        <div className='flex justify-center gap-2 items-center'>
          <label htmlFor="itemsPP">Items Per Page</label>
          <select name="itemsPP" id="itemsPP" className='border border-black'
            onChange={(e) => {
              console.log("mougs")
              const params = new URLSearchParams(searchParams.toString())
              params.set('limit', e.currentTarget.value)
              router.replace(`${pathname}?${params.toString()}`)
            }}
          >
            <option value="10" defaultChecked>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

      </div>

    </Suspense>
  )
}

export default TableControls