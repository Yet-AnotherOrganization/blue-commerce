'use client'
import React from "react";
import { ProductParams } from "../../constants/constants";
import ArrowAnimation from "./ArrowAnimation";
import { Product } from "../../generated/prisma";
import { ProductWithCategory } from "../../types/product";

const CarouselComponent = ({ product }: { product: ProductWithCategory }):React.ReactNode => {
  const {
    price,
    category,
    createdAt,
    description,
    id,
    name,
    imageUrl,
    stock,
} = product;

return (
  <div className="p-1 bg-[#ffffff] flex flex-col justify-center items-center rounded-xl py-5 border h-auto shadow-md">
    <div className="relative bg-yellow-200">
      <a href={`/product/${product.id}`}>
        <img src={imageUrl} className="bg-red-400 w-[50vw] object-fill aspect-square lg:aspect-[5/3]" alt="carousel photo" />
        <ArrowAnimation />
      </a>

    </div>

    <p className="text-center mt-2">{name}</p>
  </div>
);
};

export default CarouselComponent;
