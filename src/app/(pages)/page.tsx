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

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: string; category: string };
}) => {
  const products: Product[] = await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      status: "ACTIVE"
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })





  return (
    <main className="w-[100vw]">


      <div className="flex bg-white justify-center overflow-x-scroll md:overflow-hidden font-semibold text-[0.8rem] lg:text-[0.75rem] text-gray-500 py-1 items-center border-b border-t">
        {hotbarElements.map((element, i) => {
          return (
            <div key={element.label} className={`${i !== 0 ? 'border-l-4' : ''} border-gray-300 p-2 px-6  group `}>
              <Link className="group-hover:text-red-300 transition-all" href={element.value}>
                {element.label}
              </Link>
            </div>
          )
        })}
      </div>

      <div
        className="categories flex overflow-scroll justify-center gap-8 px-20 pt-2"
        style={{
          scrollbarWidth: 'none'
        }}
      >
        {
          ribbons.map((ribbon, i) => (
            <div className="flex flex-col items-center" key={i}>
              <Link href="" className="overflow-hidden border border-gray-300 rounded-md h-[7vh] w-[7vh] aspect-square">
                <Image width={70} height={70} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={ribbon.url} alt="" className={`scale-[${ribbon.zoom}] w-full h-full`} />
              </Link>
              <p className="text-center text-[10px]">{ribbon.title}</p>

            </div>
          ))
        }
      </div>

      {/* CAROUSEL */}

      <Suspense fallback={<div className="w-[80vw] m-auto h-[40vh] p-8"><SkeletonLoader /></div>}><CarouselSection /></Suspense>




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
        <div className="grid-container mx-[3vw] mb-10 md:px-6 px-6 w-[90vw] mt-8">
          {Array.isArray(products) ? (products.map((product: Product, i: number): React.ReactNode => (<ProductCard key={product.id} product={product} />))) : (<div>Error loading products.</div>)}
        </div>
      </div>


      {/* Featured Products Section */}
      {!searchParams.category ? (
        <div className="w-[100vw] flex justify-center flex-col border-t-2">
          <h1 className="text-[2rem] text-center font-semibold text-white">
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


type Props = {}

const CarouselSection = async (props: Props) => {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(1000)
  const count = 5;

  const randomProducts = await prisma.$queryRaw<(Omit<Product, 'category'> & { category: Category })[]>`
  SELECT p.*, c.name AS catName FROM "Product" p 
  JOIN "Category" c ON p."categoryId" = c.id 
  WHERE p.stock > 0 AND p.status = 'ACTIVE'::"ProductStatus"
  ORDER BY RANDOM() 
  LIMIT ${Number(count)}`

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
  )
}
