'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { ReviewParams } from '../../constants/constants'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { Review as ReviewType, User } from '../../generated/prisma'
import Link from 'next/link'

const Review = ({ i, user, review }: { i: number, user: User, review: ReviewType }) => {


  return (
    <div className='bg-white relative rounded-xl py-4 mt-1 w-full h-full border border-gray-300'>

      <div className="flex items-center justify-end absolute top-4 right-1 p-2 w-auto text-center">
        <span className="flex items-center justify-center md:text-md lg:text-sm text-yellow-400 mt-[-1rem]">{
          [...Array(5)].map((_, index) => {
            return index < (review.rating || 3) ? <FaStar key={index} /> : <FaRegStar key={index} />;
          })
        }</span>
      </div>



      <div key={i} className="relative flex py-1 gap-2  items-center justify-center w-full">

        <Link href={`/profile/${user.id}`} className="flex flex-col items-center justify-center mx-5 w-[10vw]">
          <div><img src={user?.avatar || '/vercel.svg'} className="w-10 h-10 rounded-full" alt="" /></div>
          <span className="md:text-md lg:text-xs font-semibold text-center">{user?.name}</span>
        </Link>

        <div className="w-full">
          <p className="md:text-md lg:text-sm p-1 overflow-auto">{review?.text}</p>
        </div>

      </div>
    </div>
  )
}

export default Review

