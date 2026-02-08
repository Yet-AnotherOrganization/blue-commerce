import React from 'react'
import Button from './Button'
import LoginForm from './LoginForm'



const login = () => {


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