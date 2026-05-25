import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import React from 'react'
import { FaHeart } from 'react-icons/fa';

type Props = {
  params: { id: string }
}

const Confirmed = async ({ params }: Props) => {

  const { id } = params;

  const user = await prisma.user.update({
    where: {
      activateAccountCode: id
    },
    data: {
      status: 'ENABLED'
    }
  });



  return (
    user ?
      <div className='flex flex-col h-[60vh] items-center justify-center gap-4'>
        <h3 className='flex items-center justify-center gap-2 font-bold'>Thank you {user.name}! <FaHeart color='red'/></h3>
        <span>Your account has been successfully created</span>
        <Link href='/login' className='text-blue-400 hover:text-blue-600'>Click here to log in and start shopping.</Link>
      </div>
      :
      <div>
        <h3>We're sorry!</h3>
        <span>Your activation link is probably invalid or expired.</span>
        <Link href='/login'>Click here to log in and create another one.</Link>
      </div>
  )
}

export default Confirmed