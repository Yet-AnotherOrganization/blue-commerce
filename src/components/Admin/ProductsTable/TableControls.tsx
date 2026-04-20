'use client'
import { changePage } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

type Props = {
  totalAmount: number
}

const TableControls = ({ totalAmount }: Props) => {

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', "10")
    params.set('page', "1")
    router.replace(`${pathname}?${params.toString()}`)
  }, [])

  return (
    <Suspense>
      <div className='flex-col w-full items-center justify-center mb-4'>
        <div className='mx-auto justify-center flex gap-4 text-2xl my-5'>
          <button
            onClick={() => changePage(searchParams, -1, router, pathname)}
            disabled={Number(page) == 1}
            className={`${Number(page) == 1 && 'text-gray-200'}`}
          ><FaArrowLeft /></button>
          <span>{page}</span>
          <button
            disabled={totalAmount / Number(limit) <= Number(page)}
            className={`${totalAmount / Number(limit) <= Number(page) && 'text-gray-200'}`}
            onClick={() => changePage(searchParams, 1, router, pathname)}
          ><FaArrowRight /></button>
        </div>

        {/* limit */}
        <div className='flex justify-center gap-2 items-center'>
          <label htmlFor="itemsPP">Items Per Page</label>
          <select name="itemsPP" id="itemsPP" className='border border-black'
            onChange={(e) => {
              console.log("mougs")
              const params = new URLSearchParams(searchParams.toString())
              params.set('limit', e.currentTarget.value)
              params.set('page', "1")
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