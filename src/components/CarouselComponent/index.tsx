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

  const photos = ['aircleaner.jpg','coffee.jpg','vacuum.jpg']

  return (
        <a href={`/product/${product.id}`} className='block'>
          <img src={`/assets/banners/${photos[Math.floor(photos.length * Math.random())]}`} className="rounded-xl w-full object-cover" alt="carousel photo" />
          {/* <ArrowAnimation /> */}
        </a>
  );
};

export default CarouselComponent;
