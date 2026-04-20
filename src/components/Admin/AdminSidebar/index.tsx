'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { FaArrowLeft, FaBars, FaShoppingBag, FaUser } from 'react-icons/fa';

const AdminSidebar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();



    return (
        <div className={`flex flex-col text-xl w-[150px] gap-4 pl-4 py-8 h-screen bg-neutral-100 z-20 fixed transition-all ${sidebarOpen ? 'left-0' : '-left-[150px]'} `}>
            <Link className='inline-flex items-center gap-1' href='/admin/product' onClick={() => setSidebarOpen(false)}><span><FaShoppingBag /></span> Products</Link>
            <Link className='inline-flex items-center gap-1' href='/admin/user' onClick={() => setSidebarOpen(false)}><span><FaUser /></span>Users</Link>
            <Link href='/admin/store' onClick={() => setSidebarOpen(false)}>Stores</Link>
            <button
                className='absolute right-[-20px] top-1/2 -translate-y-1/2 bg-neutral-100 p-1 rounded-r-md'
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FaBars />
            </button>

            {
                pathname == '/admin' && 
                <div className='absolute left-[250px] top-1/2 inline-flex text-2xl'>
                    {/* <FaArrowLeft className='text-4xl '/>
                    <span className=''>You can start interacting by clicking on the menu button.</span> */}
                </div>
            }
        </div>
    )
}

export default AdminSidebar