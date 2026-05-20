import { useAppDispatch } from '@/redux/hooks'
import { addToCart } from '@/redux/slices/cartSlice'
import { SerializedFavorite } from '@/types/product'
import Link from 'next/link'
import React from 'react'
import { FaShoppingBasket, FaTrash } from 'react-icons/fa'
import FavoriteCard from './FavoritesCard'

type Props = {
    favorites: SerializedFavorite[]
}




const FavoritesGrid = ({ favorites }: Props) => {
    return (
        <div className='mx-auto w-[90vw] shadow-md border m-8 rounded-xl'>
            <h1 className='text-center text-3xl md:text-2xl py-8 font-bold tracking-wider'>Your Favorited Items</h1>
            <div className='p-4 px-4 lg:px-20 gap-y-4 gap-x-4 grid max-md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]  max-lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center justify-center'>
                {
                    favorites.map((fav) => <FavoriteCard key={fav.id} fav={fav} />)
                }
                {
                    favorites.length == 0 &&
                    <div className='text-center text-xl pb-10 gap-10 flex flex-col items-center'>
                        You don't have any products in your favorites list.

                        <Link href={'/'} className='bg-blue-400 text-white py-4 px-8 rounded-xl hover:bg-blue-600 transition-all inline-flex items-center justify-center'>Back To Shopping <FaShoppingBasket /></Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default FavoritesGrid