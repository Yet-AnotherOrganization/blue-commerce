// src/components/MainPage/CarouselSection.tsx
import React from "react";
import { prisma } from "../../lib/prisma";
import Slider from "../../components/Carousel";
import { Category, Product } from "../../generated/prisma";

export default async function CarouselSection() {
    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(5000)
    const count = 5;

    // Database fetch isolated here
    const randomProducts = await prisma.$queryRaw<(Omit<Product, 'category'> & { category: Category })[]>`
    SELECT p.*, c.name AS catName FROM "Product" p 
    JOIN "Category" c ON p."categoryId" = c.id 
    WHERE p.stock > 0 AND p.status = 'ACTIVE'::"ProductStatus"
    ORDER BY RANDOM() 
    LIMIT ${Number(count)}`;

    const reversedProducts = [...randomProducts].reverse();

    return (
        <div className="flex w-[100vw] text-[1.5rem] md:text-[2rem] md:px-20 font-semibold gap-4 justify-center my-5 px-5">
            <div className="flex-1 min-w-0">
                <Slider items={randomProducts} />
            </div>
            <div className="flex-1 lg:block min-w-0 hidden">
                <Slider items={reversedProducts} />
            </div>
        </div>
    );
}