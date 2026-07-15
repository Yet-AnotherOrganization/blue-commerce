"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCartPlus, FaStar, FaRegStar } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavoriteById,
} from "../redux/slices/favoriteSlice";
import { openCartModal } from "@/redux/slices/uiSlice";
import { RootState } from "@/redux/store";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import Loader from "./Loader";
import { Serialized } from "@/types/product";
import { Product } from "@/generated/prisma";

// Optional extras a caller can pass if the product was fetched with reviews.
type ProductCardProps = {
  product: Serialized<Product>;
  rating?: number; // 0–5 average
  reviewCount?: number;
  badge?: string; // e.g. "Trending", "New"
};

const ProductCard = ({ product, rating, reviewCount, badge }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const isFavorite = useSelector(
    (state: RootState) => !!selectFavoriteById(state, product.id),
  );

  const handleAddToCart = async () => {
    setLoading(true);
    const res = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    setLoading(false);
    if (res.meta.requestStatus === "fulfilled") dispatch(openCartModal());
  };

  const handleFavorite = async () => {
    setLoading(true);
    await dispatch(
      isFavorite ? removeFromFavorites(product.id) : addToFavorites(product.id),
    );
    setLoading(false);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/60">
      {/* Top-left badge */}
      {badge && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          {badge}
        </span>
      )}

      {/* Favorite */}
      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={handleFavorite}
        className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur transition hover:scale-110 hover:text-red-500 max-lg:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
      >
        {isFavorite ? <IoHeart className="text-red-500" size={18} /> : <IoHeartOutline size={18} />}
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block">
        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white p-5">
          {loading && (
            <div className="absolute inset-0 z-30 grid place-items-center backdrop-blur-[2px]">
              <Loader />
            </div>
          )}
          <Image
            width={220}
            height={220}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(220, 220))}`}
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {isOutOfStock && (
            <span className="absolute bottom-3 left-3 rounded-md bg-gray-900/80 px-2 py-1 text-[10px] font-semibold text-white">
              Out of stock
            </span>
          )}
          {isLowStock && (
            <span className="absolute bottom-3 left-3 rounded-md bg-amber-500/90 px-2 py-1 text-[10px] font-semibold text-white">
              Only {product.stock} left
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-left text-[13px] font-medium leading-snug text-gray-800 transition-colors group-hover:text-blue-700">
            {product.name}
          </h3>

          {/* Rating */}
          {typeof rating === "number" && (
            <div className="mt-1.5 flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) =>
                  i < Math.round(rating) ? (
                    <FaStar key={i} size={12} />
                  ) : (
                    <FaRegStar key={i} size={12} className="text-gray-300" />
                  ),
                )}
              </div>
              {typeof reviewCount === "number" && (
                <span className="text-[11px] text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}
        </Link>

        {/* Price + Add to cart */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          <motion.button
            whileTap={{scale: 0.92 }}
            transition={{duration: 0.2 }}
            disabled={isOutOfStock || loading}
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <FaCartPlus size={13} />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </div >
  );
};

export default ProductCard;