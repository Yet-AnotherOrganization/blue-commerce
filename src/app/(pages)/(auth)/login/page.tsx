import React from 'react'
import Button from './Button'
import LoginForm from './LoginForm'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'



const login = async () => {

  const session = await getServerSession(authOptions);

  console.log(session)

  if (session?.user) {
    return redirect('/')

  }


  return (
    <div className='flex justify-center items-center w-full h-full box-border'>
      <div className='border-2 border-neutral-500 rounded-xl p-4 flex gap-3 flex-col justify-center items-center'>
        <h1>Already a Member?</h1>

        <LoginForm />

        {/* <Button /> */}
      </div>
    </div>
  )
}

export default login