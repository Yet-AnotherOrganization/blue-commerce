'use client';
import Loader from "@/components/Loader";
import { useConfirm } from "@/context/ConfirmContext";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { removeFromFavorites } from "@/redux/slices/favoriteSlice";
import { SerializedFavorite } from "@/types/product";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const FavoriteCard = ({ fav }: { fav: SerializedFavorite }) => {

    const [loading, setLoading] = useState(false);

    const stockText = fav.item.stock > 10 ? 'IN STOCK' :
        fav.item.stock > 0 ? 'LOW STOCK' :
            'OUT OF STOCK'
    const stockColor = fav.item.stock > 10 ? 'text-green-400' :
        fav.item.stock > 0 ? 'text-orange-400' :
            'text-red-600'


    const dispatch = useAppDispatch();

    const ask = useConfirm();

    const handleRemoveFromCart = async () => {
        const confirmed = await ask('Are you sure you want to remove this item from your favorites?');


        if (confirmed) {
            setLoading(true);
            const res = await dispatch(removeFromFavorites(fav.productId));

            if (res.meta.requestStatus == 'fulfilled') {
                return toast.success('Item successfully removed from wishlist.')
            }

            return toast.error(`ERROR: ${res.payload || 'Unknown error.'}`)
        }
    }

    const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <div
            className=' xl:max-w-[300px] p-2 lg:p-4 shadow-md border rounded-xl flex flex-col'
        >
            <div className='w-full'>
                <Link className="relative" href={`/product/${fav.item.id}`}>
                    {
                        loading &&
                        <div className="absolute flex bottom-0 top-0 left-0 right-0 items-center justify-center backdrop-blur-sm">
                            <Loader />
                        </div>
                    }
                    <Image width={150} height={150} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={fav.item.imageUrl} className='border aspect-square rounded-md' alt="" />
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
                        ${formatter.format(fav.item.price)}
                    </span>
                </div>
                <div className='btns flex gap-4 pt-4 max-lg:flex-col'>
                    <button
                        onClick={() => dispatch(addToCart({ productId: fav.productId }))}
                        className='block py-2 text-center flex-[3] bg-green-400 rounded-xl text-white hover:bg-green-500 transition-all text-lg'>
                        ADD TO CART
                    </button>
                    <button
                        onClick={handleRemoveFromCart}
                        className='inline-flex py-3 flex-1 justify-center items-center bg-red-400 text-white rounded-xl hover:bg-red-500 transition-all'>
                        <FaTrash />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default FavoriteCard;