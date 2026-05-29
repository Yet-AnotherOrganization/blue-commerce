"use client";

import { getActiveUserFromStorage } from "../utils/clientOnlyUtils";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToFavorites, removeFromFavorites } from "@/redux/slices/favoriteSlice";
import { Product } from "@/generated/prisma";
import { SerializedProduct } from "@/types/product";

const ProductButtons = ({ product, style }: { product: SerializedProduct, style?: string }) => {
  const dispatch = useAppDispatch();
  const [isAddClicked, setIsAddClicked] = useState<boolean>(false)
  const [isFavClicked, setIsFavClicked] = useState<boolean>(false)
  const favorites = useAppSelector(state => state.favoriteReducer.ids)
  const isFavorited = favorites.includes(product.id);

  return (
    <div className={`${style} gap-2`}>
      <button
        className="bg-green-500  max-lg:text-xs shadow-md relative p-2 lg:p-4 max-lg:m-0 m-4 flex flex-1 justify-center items-center rounded-xl hover:translate-y-[-5px] transition-all"
        onClick={async () => {
          const confirm = await dispatch(addToCart({ product: product }))
          if (confirm.meta.requestStatus == 'fulfilled') {
            setIsAddClicked(true)
            !isAddClicked ? setTimeout(() => setIsAddClicked(false), 2000) : '';
          }
        }}
      >
        <motion.span
          whileTap={{ scale: 0.9 }}
          animate={{ y: isAddClicked ? 30 : 0, opacity: isAddClicked ? 0 : 100 }}
          transition={{ duration: 0.3 }}
        >
          ADD TO CART
        </motion.span>

        <motion.span
          onClick={() => { setIsAddClicked(true); setTimeout(() => setIsAddClicked(false), 2000); }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: isAddClicked ? 0 : -30, opacity: isAddClicked ? 100 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >ITEM ADDED</motion.span>
      </button>


      <button
        onClick={async () => dispatch(!isFavorited ? addToFavorites(product.id) : removeFromFavorites(product.id))}
        className="bg-blue-500 max-lg:text-xs shadow-md p-2 lg:p-4 max-lg:m-0 m-4 rounded-xl flex flex-1 justify-center items-center hover:translate-y-[-5px] text-center transition-all">
        <motion.span
          // onClick={() => { setIsFavClicked(true); !isFavClicked ? setTimeout(() => setIsFavClicked(false), 2000) : ''; }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: isFavClicked ? 30 : 0, opacity: isFavClicked ? 0 : 100 }}
          transition={{ duration: 0.3 }}
        >
          {!isFavorited ? 'ADD TO WISHLIST' : 'REMOVE FROM WISHLIST'}
        </motion.span>

        {/* <motion.span
          onClick={() => { setIsFavClicked(true); setTimeout(() => setIsFavClicked(false), 2000); }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: isFavClicked ? 0 : -30, opacity: isFavClicked ? 100 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >{!isFavorited ? 'ITEM ADDED TO WISHLIST' : 'ITEM REMOVED FROM WISHLIST'}</motion.span> */}
      </button>

    </div>
  );
};

export default ProductButtons;
