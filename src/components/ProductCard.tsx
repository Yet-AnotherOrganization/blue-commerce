"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./css/index.css";
import { FaCartPlus, FaHeart, FaRegStar, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { Product } from "../generated/prisma";
import { addToCart } from "../redux/slices/cartSlice";
import { useAppDispatch } from "../redux/hooks";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { addToFavorites, removeFromFavorites, selectFavoriteById } from "../redux/slices/favoriteSlice";
import Link from "next/link";
import { RootState } from "@/redux/store";
import Loader from "./Loader";

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isDivHovered, setIsDivHovered] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0)
  const isFavorite = useSelector((state: RootState) => !!selectFavoriteById(state, product.id))

  useEffect(() => {
    // const userExists = JSON.parse(localStorage.getItem("user"));
    // const randomID = randomUUID();
    // setId(userExists ? JSON.parse(localStorage.getItem("user")).uid : randomID);
    // window?setIsClient(true):''
  }, []);

  useEffect(() => {
    isClient ? setWidth(window.innerWidth) : ''
  }, [isClient])


  const handleAddToCart = async () => {
    setLoading(true);

    const res = await dispatch(addToCart({ productId: product.id, quantity: 1 }));

    if (res.meta.requestStatus) setLoading(false);
  }

  const handleFavorite = async () => {
    setLoading(true);

    const res = !isFavorite ? await dispatch(addToFavorites(product?.id)) : await dispatch(removeFromFavorites(product?.id))

    if (res.meta.requestStatus) setLoading(false);
  }

  return (
    <div
      style={{ zIndex: `${isHovered ? "9999999999" : "1"}` }}
      className={` relative grid-container group`}
      onMouseEnter={() => {
        setIsDivHovered(true);
      }}
      onMouseLeave={() => {
        setIsDivHovered(false);
      }}
    >
      <div className="flex-col justify-between hover:translate-y-[-1px] hover:shadow-gray-200 transition-all border border-gray-150 shadow-md shadow-gray-100 rounded-xl flex group">
        <button className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 z-20 bg-white rounded-full p-1 hover:scale-110 transition hover:text-red-600"
          onClick={handleFavorite}
        >
          {isFavorite ? <IoHeart color="red" /> : <IoHeartOutline />}
        </button>
        <Link className="text-center relative" href={`/product/${product.id}`}>
          <div className="flex justify-center items-center relative">
            {
              loading &&
              <div className="absolute z-50 flex bottom-0 top-0 left-0 right-0 items-center justify-center backdrop-blur-[1px]">
                <Loader />
              </div>
            }
            <img
              // onMouseEnter={() => {
              //   setIsHovered(true);
              // }}
              // onMouseLeave={() => {
              //   setIsHovered(false);
              // }}
              src={product?.imageUrl}
              style={{ zIndex: `${isHovered ? "3" : "1"}` }}
              alt=""
              className={`${isHovered ? "scale-[150%]" : "scale-100"
                }  transition-all w-full h-full relative rounded-t-xl  object-scale-up border-x-2 border-t-2 border-neutral-50 aspect-square p-1`}
            />
          </div>

          {/* NAME */}
          <div className="flex my-2">
            {product ? (
              <p className=" ml-2 font-normal text-[12px] p-1 overflow-auto">
                {product.name}
              </p>
            ) : (
              <span>Loading Product...</span>
            )}
          </div>
          {/* STARS */}
          <div className="flex items-center text-yellow-500">
            {/* {[...Array(5)].map((_, index) => {
              return index < (product.stars?.stars || 3) ? (
                <FaStar key={index} />
              ) : (
                <FaRegStar key={index} />
              );
            })} */}

            {/* <span className="text-black px-1">{product.stars?.count || 0}</span> */}
          </div>
        </Link>

        {/* PRICE AND BUTTONS */}
        <div className="flex flex-col justify-center items-center gap-2">
          <motion.div
            animate={{ scale: isDivHovered ? 1.07 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-white flex z-10 lg:flex-row flex-col text-[9px] font-semibold text-nowrap gap-[4px] px-2"
          >
            {/* <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-orange-400 text-center">
              <span>Trending</span>
            </div>
            <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-blue-400 text-center">
              <span>24H Delivery</span>
            </div>
            <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-green-400 text-center">
              <span>1Y Warranty</span>
            </div> */}
          </motion.div>

          <div className="flex items-center justify-between h-8 w-[95%] bg-gray-100 rounded-b-lg px-2 mb-1">

            <span className="md:text-[1rem] text-[1rem] font-medium">
              ${product?.price.toString()}
            </span>
            <motion.button
              animate={{
                // y: isDivHovered ? -5 : 0,
                opacity: isDivHovered ? 100 : width < 1024 ? 100 : 0,
              }}
              transition={{ duration: 0.5 }}
              className="bg-[#7bd0ec] 
             text-white block md:p-1 md:px-2 md:m-2 m-1 p-1 rounded-xl hover:brightness-125 
            relative transition
            border-black text-[0.7rem] md:text-[0.5rem]"
              onClick={handleAddToCart}
            >
              <motion.span
                animate={{ y: isClicked ? 30 : 0, opacity: isClicked ? 0 : 100 }}
                transition={{ duration: 0.3 }}
                className="text-xs"
              >
                <FaCartPlus />
              </motion.span>

              <motion.div
                className="absolute left-1/2 top-1/2 transform translate-y-[-50%] translate-x-[-50%] w-full h-full">
                {isClient ? <motion.span
                  className="absolute top-0 left-0 bottom-0 right-0 h-full w-full"
                  animate={{ y: isClicked ? 10 : -30, opacity: isClicked ? 100 : 0 }}
                  transition={{ duration: 0.3 }}
                >ITEM ADDED
                </motion.span> : ''}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
