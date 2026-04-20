'use client'
import React, { Dispatch, SetStateAction } from 'react'
import Links from '../constants/constants'
import { handleLogOut } from '../utils/clientOnlyUtils.tsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { IoIosLogIn } from 'react-icons/io'

type SidebarProps = {
    setSidebar: Dispatch<SetStateAction<boolean>>,
    sidebar: boolean
}

const Sidebar = ({ setSidebar, sidebar }: SidebarProps) => {

    const user = useSession().data?.user

    return (
        <div style={{ 'zIndex': '10001', 'right': `${sidebar ? '0' : '-60vw'}` }} className={`fixed top-0 pt-[10vh] bg-blue-500 text-white inline-block w-[60vw] lg:w-[15vw] h-[100vh] transition-all p-4`} >
            <button className='mb-[3vh] rounded-[50%] bg-red-700 w-[3rem] h-[3rem] font-bold text-[30px]' onClick={() => setSidebar(false)}>X</button>
            <ul className='flex gap-6 flex-col'>
                {
                    !user && <li>
                        <Link href={'/login'} className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold'
                            onClick={() => setSidebar(false)}
                        >
                            <IoIosLogIn />LOGIN/REGISTER
                        </Link>
                    </li>
                }
                {Links.map((link, i) => (
                    <li key={i}>
                        <Link className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold' href={link.href}
                            onClick={() => setSidebar(false)}
                        >{link.logo}{link.name}
                        </Link>
                    </li>))}
                {
                    user?.role == 'ADMIN' && <Link href={'/admin'}
                        onClick={() => setSidebar(false)}
                        className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold'>
                        ADMIN PANEL
                    </Link>
                }
                {user && <li>
                    <a href='/'>
                        <button onClick={async () => { await signOut(); setSidebar(false) }} className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold'>LOG OUT</button>
                    </a>
                </li>}
            </ul>
        </div>
    )
}

export default Sidebar