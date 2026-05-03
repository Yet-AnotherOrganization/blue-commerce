import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import React from 'react'
import FavoritesGrid from './FavoritesGrid'

type Props = {}

const FavoritesPage = async (props: Props) => {

    const session = await getServerSession();

    const favorites = await prisma.favorite.findMany({
        where: {
            ownerId: session?.user.id
        },
        include: {
            item: true
        }
    });

    const serializedData = favorites.map((fav) => { return { ...fav, item: { ...fav.item, price: fav.item.price.toNumber() } } })



    return (
        <div className='grid auto-cols-fr'>
            <FavoritesGrid favorites={serializedData} />
        </div>
    )
}

export default FavoritesPage