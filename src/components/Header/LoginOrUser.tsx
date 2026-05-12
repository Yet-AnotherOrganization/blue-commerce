'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { FaUser } from 'react-icons/fa'

type Props = {}

const LoginOrUser = (props: Props) => {

    const { data } = useSession();
    const user = data?.user;

    return (
        <Link href={
            '/login'
            // auth.currentUser ? `/profile/${user?.uid}` : '/login'
        }>
            <div className='flex items-center justify-start gap-4 text-2xl lg:text-[40px]'><FaUser /><span className='text-[20px] hidden lg:block'>{user?.name}</span>
            </div>
        </Link>
    )
}

export default LoginOrUser