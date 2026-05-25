import React from 'react'

type Props = {
    params: {
        id: string
    }
}

const ConfirmEmail = ({ params }: Props) => {


    return (
        <div className='h-[60vh] flex items-center justify-center flex-col gap-4 text-center text-xl'>
            <h1 className='text-2xl font-medium'>Almost Set!</h1>
            <p className='font-light'>Confirmation email was sent, please click the link in the email for your account to be activated.</p>
            <span className='text-base font-light'><span className='text-blue-600'>Tip:</span> <span>Make sure to check your Spam folder.</span></span>
        </div>
    )
}

export default ConfirmEmail