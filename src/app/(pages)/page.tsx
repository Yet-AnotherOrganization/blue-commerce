import { hotbarElements, ribbons } from "../../constants/constants";
import React, { Suspense } from "react";
import Slider from "../../components/Carousel";
import { prisma } from "../../lib/prisma";
import { Category, Product } from "../../generated/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SkeletonLoader from "@/components/Common/SkeletonLoader";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import { SerializedProduct } from "@/types/product";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: string; category: string };
}) => {
  const products: SerializedProduct[] = (
    await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        status: "ACTIVE",
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  ).map((product: Product) => ({ ...product, price: Number(product.price) }));
  return (
    <main className="w-full overflow-x-hidden">
      <div className="flex bg-white justify-center overflow-x-auto md:overflow-hidden font-semibold text-[0.8rem] lg:text-[0.75rem] text-gray-500 py-1.5 items-center border-b border-t border-gray-200">
        {hotbarElements.map((element, i) => {
          return (
            <div
              key={element.label}
              className={`${i !== 0 ? "border-l" : ""} border-gray-200 p-2 px-6 group whitespace-nowrap`}
            >
              <Link
                className="group-hover:text-blue-600 transition-colors duration-200"
                href={element.value}
              >
                {element.label}
              </Link>
            </div>
          );
        })}
      </div>
      <div
        className="categories flex overflow-scroll justify-center gap-8 px-20 pt-3"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {ribbons.map((ribbon, i) => (
          <div className="flex flex-col items-center gap-2 group cursor-pointer shrink-0" key={i}>
            <Link
              href=""
              className="relative overflow-hidden bg-gray-50 border border-gray-200 rounded-full h-16 w-16 aspect-square shadow-sm transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-md group-hover:-translate-y-0.5"
            >
              <Image
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                src={ribbon.url}
                alt=""
                className={`scale-[${ribbon.zoom}] w-full h-full object-cover`}
              />
            </Link>
            <p className="text-center text-[11px] font-medium text-gray-700 transition-colors group-hover:text-blue-600">
              {ribbon.title}
            </p>
          </div>
        ))}
      </div>
      {/* CAROUSEL */}
      <Suspense
        fallback={
          <div className="w-[80vw] m-auto p-8">
            <SkeletonLoader />
          </div>
        }
      >
        <CarouselSection />
      </Suspense>
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-between w-full border-t-2">
          {/* <h1 className="text-white text-[1.5rem] md:text-[2rem] md:mx-[10vw] w-full my-4 text-center font-semibold">
            Popular Products
          </h1> */}
          {/* <div className="flex flex-col md:flex-row gap-4 justify-end items-center w-full md:mx-[10vw]">
            <SortComponent />
            <SelectComponent />
          </div> */}
        </div>
      </div>
      {/* Popular Products Section */}
      <div className="flex justify-center">
        <h2 className="w-[90vw] mx-[3vw] px-6 mt-8 mb-1 text-[1.5rem] font-semibold text-gray-800">
          Popular Products
        </h2>
      </div>
      <div className="flex justify-center">
        <div className="grid-container mx-[3vw] mb-10 md:px-6 px-6 w-[90vw] mt-8">
          {Array.isArray(products) ? (
            products.map(
              (product: SerializedProduct, i: number): React.ReactNode => (
                <ProductCard key={product.id} product={product} />
              ),
            )
          ) : (
            <div className="col-span-full py-10 text-center text-gray-400">
              Error loading products.
            </div>
          )}
        </div>
      </div>
      {/* Featured Products Section */}
      {!searchParams.category ? (
        <div className="w-full flex justify-center flex-col items-center border-t-2 border-gray-200 py-10">
          <h1 className="text-[2rem] text-center font-semibold text-gray-800">
            Featured Product
          </h1>
          {/* <FeaturedProduct featuredProduct={featuredProduct} randomReview={randomReview} /> */}
        </div>
      ) : (
        <div></div>
      )}
    </main>
  );
};
export default MainPage;

type Props = {};

const CarouselSection = async (props: Props) => {
  // for debug purposes
  // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(1000)
  const count = 5;
  const randomProducts = (
    await prisma.$queryRaw<
      (Omit<Product, "category"> & { category: Category })[]
    >`
  SELECT p.*, c.name AS catName FROM "Product" p 
  JOIN "Category" c ON p."categoryId" = c.id 
  WHERE p.stock > 0 AND p.status = 'ACTIVE'::"ProductStatus"
  ORDER BY RANDOM() 
  LIMIT ${Number(count)}`
  ).map((product) => ({ ...product, price: Number(product.price) }));
  const reversedProducts = [...randomProducts].reverse();
  return (
    <div className="flex w-full text-[1.5rem] md:text-[2rem] md:px-24 font-semibold gap-4 justify-center my-5 px-5">
      <div className="flex-1 min-w-0 ">
        <Slider items={randomProducts} />
      </div>
      <div className="flex-1 lg:block min-w-0 hidden">
        <Slider items={reversedProducts} />
      </div>
    </div>
  );
};
