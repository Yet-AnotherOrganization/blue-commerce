'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {

  console.log("visited admin page layout")
  return (
    <div className='flex-col relative'>
      <AdminSidebar />
      <div className='flex-1 h-full'>
          {children}
      </div>
    </div>
  )
}

export default AdminLayout;