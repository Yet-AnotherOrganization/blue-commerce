import AdminSidebar from '@/components/Admin/AdminSidebar'
import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import UsersTable from '@/components/Admin/UsersTable'
import { Product, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import React from 'react'
import { FaArrowLeft, FaBox, FaDatabase, FaShoppingCart, FaUser } from 'react-icons/fa'

type Props = {

}

const AdminPage = async (props: Props) => {









    return (
        <>
            <h1 className='text-4xl flex justify-center pt-20 font-semibold'><FaDatabase color='blue' /></h1>
            <h1 className='text-2xl m-auto text-center pt-5 font-semibold'>Welcome to Blue-Commerce Admin Panel</h1>
            <div className='flex justify-center gap-16 mx-[20vw] mt-[10vh]'>
                <a href="/admin/product" className='flex flex-1 flex-col items-center justify-center border p-8 shadow-md hover:bg-black hover:text-white transition-all group'>
                    <FaBox className='text-4xl' />
                    <h1 className='text-xl mt-4'>Products</h1>
                    <span className='text-md text-center mt-4 text-gray-700 hover:text-white group-hover:text-white'>Control and analyze products on the database</span>
                </a>
                <a href="/admin/user" className='flex flex-1 flex-col items-center justify-center border p-8 shadow-md hover:bg-black hover:text-white transition-all group'>
                    <FaUser className='text-4xl'/>
                    <h1 className='text-xl mt-4'>Users</h1>
                    <span className='text-md text-center mt-4 text-gray-700 hover:text-white group-hover:text-white'>Administrate users and stores existing on the database</span>
                </a>
                <a href="" className='flex flex-1 flex-col items-center justify-center border p-8 shadow-md hover:bg-black hover:text-white transition-all group'>
                    <FaShoppingCart className='text-4xl' />
                    <h1 className='text-xl mt-4'>Carts</h1>
                    <span className='text-md text-center mt-4 text-gray-700 group-hover:text-white'>Manage carts & items in carts on the database</span>
                </a>
            </div>
        </>
    )
}

export default AdminPage