'use client'
import React from "react";
import { ProductParams } from "../../constants/constants";
import ArrowAnimation from "./ArrowAnimation";
import { Product } from "../../generated/prisma";
import { ProductWithCategory } from "../../types/product";

const CarouselComponent = ({ product }: { product: ProductWithCategory }): React.ReactNode => {
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
    <div className="p-4 bg-[#ffffff] flex flex-col justify-center items-center rounded-xl  border h-[40vh] shadow-md">
      <div className="relative bg-yellow-200  aspect-square lg:aspect-video h-[90%] w-full">
        <a href={`/product/${product.id}`} className="">
          <img src={imageUrl} className="w-full h-full object-fill" alt="carousel photo" />
          <ArrowAnimation />
        </a>

      </div>
    </div>
  );
};

export default CarouselComponent;
