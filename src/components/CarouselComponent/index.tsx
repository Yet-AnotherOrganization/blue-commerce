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
        <a href={`/product/${product.id}`} className='block h-full'>
          <img src={imageUrl} className="rounded-md w-full h-full object-cover" alt="carousel photo" />
          {/* <ArrowAnimation /> */}
        </a>
  );
};

export default CarouselComponent;
