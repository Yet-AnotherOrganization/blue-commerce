import { SerializedFavorite } from '@/types/product'
import React from 'react'

type Props = {
    favorites: SerializedFavorite[]
}


const FavoriteCard = ({ fav }: { fav: SerializedFavorite }) => {
    return (
        <div
            className='w-[200px] max-h-[300px] p-4 bg-red-400 flex flex-col'
        >
            <div className='w-full'>
                <img src={fav.item.imageUrl} className='w-full aspect-square' alt="" />
            </div>
            <div className=''>
                <h1>{fav.item.name}</h1>
            </div>
        </div>
    )
}

const FavoritesGrid = ({ favorites }: Props) => {
    return (
        <div className='grid auto-cols-fr grid-cols-4'>
            {
                favorites.map((fav) => <FavoriteCard fav={fav} />)
            }
        </div>
    )
}

export default FavoritesGrid