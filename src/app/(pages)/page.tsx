import ProductCard from "../../components/ProductCard";
import "../../components/css/index.css";
import { getProducts } from "../../utils/utils";
import { hotbarElements, ProductParams, ReviewParams, ribbons } from "../../constants/constants";
import React from "react";
import SelectComponent from "../../components/SelectComponent";
import SortComponent from "../../components/SortComponent";
import FeaturedProduct from "../../components/FeaturedProduct";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Slider from "../../components/Carousel";
import { prisma } from "../../lib/prisma";
import { Product } from "../../generated/prisma";
import { ProductWithCategory } from "../../types/product";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: string; category: string };
}) => {

  const products: Product[] = await prisma.product.findMany({
    where: {
      stock: { gt: 0 }
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const count = 5;

  const randomProducts = await prisma.$queryRaw<ProductWithCategory[]>`
  SELECT p.*, c.name AS catName FROM "Product" p 
  JOIN "Category" c ON p."categoryId" = c.id 
  WHERE p.stock > 0 
  ORDER BY RANDOM() 
  LIMIT ${Number(count)}`

  const reversedProducts = randomProducts.reverse();

  console.log("random prods: ", randomProducts)



  return (
    <main className="w-[100vw]">


      <div className="flex bg-white justify-center overflow-x-scroll md:overflow-hidden font-semibold text-[0.8rem] lg:text-[0.75rem] text-gray-500 py-1 items-center border-b border-t">
        {hotbarElements.map((element, i) => {
          return (
            <div key={element.label} className={`${i !== 0 ? 'border-l-4' : ''} border-gray-300 p-2 px-6  group `}>
              <a className="group-hover:text-red-300 transition-all" href={element.value}>
                {element.label}
              </a>
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
          ribbons.map((ribbon) => (
            <div className="flex flex-col items-center">
              <a href="" className="overflow-hidden border border-gray-300 rounded-md h-[7vh] w-[7vh] aspect-square">
                <img src={ribbon.url} alt="" className={`scale-[${ribbon.zoom}] w-full h-full`} />
              </a>
              <p className="text-center text-[10px]">{ribbon.title}</p>

            </div>
          ))
        }
      </div>

      {/* CAROUSEL */}
      <div className="flex w-[100vw] text-[1.5rem] md:text-[2rem] md:px-20 font-semibold gap-4 justify-center my-5 ">
        <div className="flex-1 min-w-0">
          <Slider items={randomProducts} />
        </div>
        <div className="flex-1 lg:block min-w-0 hidden">
          <Slider items={reversedProducts} />
        </div>
      </div>





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
