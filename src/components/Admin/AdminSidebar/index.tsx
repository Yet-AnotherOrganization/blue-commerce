'use client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeAdminSidebar, openAdminSidebar, toggleAdminSidebar } from '@/redux/slices/uiSlice';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaBars, FaShoppingBag, FaStore, FaUser } from 'react-icons/fa';

const AdminSidebar = () => {

    const dispatch = useAppDispatch();
    const { adminSidebarOpen } = useAppSelector(state => state.uiReducer);
    const pathname = usePathname();


    useEffect(() => { console.log('sidebar: ', adminSidebarOpen) }, [adminSidebarOpen])
    return (
        <div className={`flex flex-col text-xl w-[150px] gap-4 pl-4 py-8 h-[90vh] bg-neutral-100 z-20 absolute transition-all ${adminSidebarOpen ? 'left-0' : '-left-[150px]'} `}>
            <Link
                className='inline-flex items-center gap-1 hover:text-blue-600 transition-all'
                href='/admin/product'>
                <span><FaShoppingBag /></span> Products
            </Link>
            <Link
                className='inline-flex items-center gap-1 hover:text-blue-600 transition-all'
                href='/admin/user'>
                <span><FaUser /></span>Users
            </Link>
            <Link
                className='inline-flex items-center gap-1 hover:text-blue-600 transition-all'
                href='/admin/store'>
                <FaStore />Stores
            </Link>
            <button
                className='absolute right-[-20px] top-1/2 -translate-y-1/2 bg-neutral-100 p-1 rounded-r-md'
                onClick={() => dispatch(toggleAdminSidebar())}>
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