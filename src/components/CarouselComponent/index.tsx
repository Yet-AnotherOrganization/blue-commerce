'use client'
import React, { useEffect, useState } from "react";
import { ProductParams } from "../../constants/constants";
import ArrowAnimation from "./ArrowAnimation";
import { Product } from "../../generated/prisma";
import { ProductWithCategory } from "../../types/product";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";

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

  const [photo, setPhoto] = useState<string | null>(null);
  const photos = ['aircleaner.jpg', 'coffee.jpg', 'vacuum.jpg'];

  // Select the photo once on the client to prevent server/client mismatch
  useEffect(() => {
    const randomPhoto = photos[Math.floor(photos.length * Math.random())];
    setPhoto(randomPhoto);
  }, []);

  return (
    <Link href={`/product/${product.id}`} className='block w-full'>
      <Image width={500} height={300} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={`/assets/banners/${photo}`} className="rounded-xl w-full object-cover" alt="carousel photo" />
      {/* <ArrowAnimation /> */}
    </Link>
  );
};

export default CarouselComponent;
