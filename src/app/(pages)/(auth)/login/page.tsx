import React from 'react'
import LoginForm from './LoginForm'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import Link from 'next/link'



const login = async () => {

  const session = await getServerSession(authOptions);

  console.log(session)

  if (session?.user) {
    return redirect('/')

  }


  return (
    <div className='flex justify-center items-center w-full h-[60vh] box-border'>
      <div className='border-2 border-neutral-500 bg-white shadow-xl rounded-xl pt-12 py-6 px-8 flex gap-3 flex-col justify-center items-center'>
        <h1 className='text-lg font-semibold'>Let's get you back in</h1>

        <LoginForm />


        <Link href={'/register'} className='hover:text-blue-400'>I don't have an account.</Link>
      </div>
    </div>
  )
}

export default login