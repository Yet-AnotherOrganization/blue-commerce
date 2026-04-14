'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const AdminLayout = ({children}: Props) => {
  return (
    <div className='flex relative'>
        <AdminSidebar />
        <div className='flex-[4] flex justify-center'>
            {children}
        </div>
    </div>
  )
}

export default AdminLayout;