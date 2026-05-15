import { SerializedFavorite } from '@/types/product'
import Link from 'next/link'
import React from 'react'
import { FaTrash } from 'react-icons/fa'

type Props = {
    favorites: SerializedFavorite[]
}


const FavoriteCard = ({ fav }: { fav: SerializedFavorite }) => {

    const stockText = fav.item.stock > 10 ? 'IN STOCK' :
        fav.item.stock > 0 ? 'LOW STOCK' :
            'OUT OF STOCK'
    const stockColor = fav.item.stock > 10 ? 'text-green-400' :
        fav.item.stock > 0 ? 'text-orange-400' :
            'text-red-600'

    return (
        <div
            className='xl:max-w-[300px] p-2 lg:p-4 shadow-md border rounded-xl flex flex-col'
        >
            <div className='w-full'>
                <Link href={`/product/${fav.item.id}`}>
                    <img src={fav.item.imageUrl} className='aspect-square rounded-md' alt="" />
                </Link>
            </div>
            <div className='text-content px-2'>
                <div className='py-4 h-max'>
                    <h1 className='text-sm lg:text-lg font-semibold line-clamp-1' title={fav.item.name}>{fav.item.name}</h1>
                </div>
                <div className='flex justify-between max-lg:flex-col'>
                    <span className={`font-semibold text-xl ${stockColor}`}>
                        {
                            stockText
                        }
                    </span>
                    <span className='font-bold text-xl'>
                        ${fav.item.price.toLocaleString()}
                    </span>
                </div>
                <div className='btns flex gap-4 pt-4 max-lg:flex-col'>
                    <button className='block py-2 text-center flex-[3] bg-green-400 rounded-xl text-white hover:bg-green-500 transition-all text-lg'>
                        ADD TO CART
                    </button>
                    <button className='inline-flex py-3 flex-1 justify-center items-center bg-red-400 text-white rounded-xl hover:bg-red-500 transition-all'>
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    )
}

const FavoritesGrid = ({ favorites }: Props) => {
    return (
        <div className='mx-auto w-[90vw] shadow-md border m-8 rounded-xl'>
            <h1 className='text-center text-4xl py-8 font-bold tracking-wider'>Your Favorited Items</h1>
            <div className='p-4 px-4 lg:px-20 gap-y-4 gap-x-4 grid max-md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]  max-lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center justify-center'>
                {
                    favorites.map((fav) => <FavoriteCard key={fav.id} fav={fav} />)
                }
            </div>
        </div>
    )
}

export default FavoritesGrid