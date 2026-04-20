'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div className='flex-col relative h-[85vh]'>
      <AdminSidebar />
      <div className='flex-1 h-full'>
          {children}
      </div>
    </div>
  )
}

export default AdminLayout;