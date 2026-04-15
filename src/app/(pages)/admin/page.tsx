'use client'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import ProductsTable from '@/components/Admin/ProductsTable'
import { prisma } from '@/lib/prisma'
import React from 'react'

type Props = {}

const AdminPage = (props: Props) => {

    

    return (
        <div className='flex-[4] flex justify-center'>
            <ProductsTable />
        </div>
    )
}

export default AdminPage