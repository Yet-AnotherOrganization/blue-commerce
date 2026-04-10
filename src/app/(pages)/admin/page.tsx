'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import React from 'react'

type Props = {}

const AdminPage = (props: Props) => {
  return (
    <div className='flex relative'>
        <AdminSidebar />
        <div className='flex-[4] flex justify-center'>another div</div>
    </div>
  )
}

export default AdminPage