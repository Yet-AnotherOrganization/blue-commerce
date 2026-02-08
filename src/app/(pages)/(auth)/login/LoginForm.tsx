'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'

type Props = {}

const LoginForm = (props: Props): React.ReactElement => {

    const router = useRouter();
    const [data, setData] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [loading, setLoading] = useState<boolean>(false);

    // form submit event
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        setLoading(true);

        // login func from nauth
        const callback = await signIn('credentials', {
            ...data,
            redirect: false
        });

        setLoading(false);

        if (callback?.ok) {
            alert('Giriş Başarılı')
        }

        if (callback?.error) {
            alert('Giriş başarısız.')
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input className='border p-4 rounded-md' type="text" placeholder='Email' onChange={(e: ChangeEvent<HTMLInputElement>) => { setData({ ...data, email: e.target.value }); console.log(data) }} />
            <input className='border p-4 rounded-md' type="password" placeholder='Password' onChange={(e: ChangeEvent<HTMLInputElement>) => { setData({ ...data, email: e.target.value }); console.log(data) }} />
            <button>Login</button>
        </form>
    )
}

export default LoginForm