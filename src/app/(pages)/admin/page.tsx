import AdminSidebar from '@/components/Admin/AdminSidebar'
import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import { prisma } from '@/lib/prisma'
import React from 'react'

type Props = {}

const AdminPage = (props: Props) => {

    

    return (
        <div className='flex-[4] flex flex-col justify-center'>
            <ProductsTable />
            <TableControls />
        </div>
    )
}

export default AdminPage