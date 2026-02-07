'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { ReviewParams } from '../../constants/constants'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { Review as ReviewType, User } from '../../generated/prisma'

const Review = ({ i, user, review }: { i: number, user: User, review: ReviewType }) => {


  return (
    <div className='bg-white relative rounded-xl py-4 mt-1 w-full h-full border border-gray-400'>

      <div className="flex items-center justify-end absolute top-4 right-1 p-2 w-auto text-center">
        <span className="flex items-center justify-center md:text-[1rem] lg:text-[1.5rem] text-yellow-400 mt-[-1rem]">{
          [...Array(5)].map((_, index) => {
            return index < (review.rating || 3) ? <FaStar key={index} /> : <FaRegStar key={index} />;
          })
        }</span>
      </div>



      <div key={i} className="relative flex py-1 gap-2  items-center justify-center w-full">

        <div className="flex flex-col items-center justify-center mx-5 w-[10vw]">
          <a href={`/profile/${user.id}`}><img src={user?.avatar || '/vercel.svg'} className="w-[6.8vw] h-[6.8vw] rounded-full" alt="" /></a>
          <span className="md:text-[1rem] lg:text-[1.5rem] font-semibold text-center">{user?.name}</span>
        </div>

        <div className="w-full">
          <p className="md:text-[1rem] lg:text-[1.5rem] p-1 overflow-auto">{review?.text}</p>
        </div>

      </div>
    </div>
  )
}

export default Review

