'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';

const AdminSidebar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`flex flex-col w-[100px] h-screen bg-neutral-100 fixed transition-all ${sidebarOpen ? 'left-0' : '-left-[100px]'} `}>
            <Link href='/admin/products'>Products</Link>
            <Link href='/admin/users'>Users</Link>
            <Link href='/admin/stores'>Stores</Link>
            <button 
            className='absolute right-[-20px] top-1/2 -translate-y-1/2 bg-neutral-100 p-1 rounded-r-md'
            onClick={()=>setSidebarOpen(!sidebarOpen)}>
                <FaBars />
            </button>
        </div>
    )
}

export default AdminSidebar