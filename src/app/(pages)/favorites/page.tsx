'use client';
import React from 'react'
import FavoritesGrid from './FavoritesGrid'
import { useAppSelector } from '@/redux/hooks';
import { selectAllFavorites } from '@/redux/slices/favoriteSlice';

type Props = {}

const FavoritesPage = (props: Props) => {

    const favorites = useAppSelector(selectAllFavorites).map((item) => item);

    return (
        <div className='grid auto-cols-fr'>
            <FavoritesGrid favorites={favorites} />
        </div>
    )
}

export default FavoritesPage