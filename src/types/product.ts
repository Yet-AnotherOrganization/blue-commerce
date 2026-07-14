import { Decimal } from "@/generated/prisma/runtime/client";
import { Category, Favorite, Prisma, Product } from "../generated/prisma";

export type ProductType = {
    id: string,
    name: string,
    description: string,
    price: number,
    imageUrl: string,
    createdAt: string,
    updatedAt: string,
    categoryId: string,
    stock: number,
    sellerId: string
}

export type Serialized<T> =
    T extends Decimal ? number :
    T extends Date ? string :
    T extends Array<infer U> ? Array<Serialized<U>> :
    T extends object ? { [K in keyof T]: Serialized<T[K]> } :
    T

export const productArgs = {
    withReviews: Prisma.validator<Prisma.ProductDefaultArgs>()({
        include: { reviews: true },
    }),
    withSeller: Prisma.validator<Prisma.ProductDefaultArgs>()({
        include: { seller: true },
    }),
    withReviewsAndSeller: Prisma.validator<Prisma.ProductDefaultArgs>()({
        include: { reviews: true, seller: true },
    }),
    full: Prisma.validator<Prisma.ProductDefaultArgs>()({
        include: {
            reviews: { include: { owner: true } },
            seller: true,
            category: true,
        },
    }),
}


export type ProductWithReviews =
    Serialized<Prisma.ProductGetPayload<typeof productArgs.withReviews>>

export type ProductWithSeller =
    Serialized<Prisma.ProductGetPayload<typeof productArgs.withSeller>>

export type ProductFull =
    Serialized<Prisma.ProductGetPayload<typeof productArgs.full>>

export type CartItemWithProduct = {
    id: string,
    cartId?: string,
    product: ProductType
    updatedAt?: string,
    quantity: number
}

export type GuestCartItem = {
    productId: string;
    quantity: number;
}

interface ClothingSpecs {
    type: 'clothing'; // Ayırt edici etiket
    size: 'XS' | 'S' | 'M' | 'L' | 'XL';
    color: string;
    material: string;
}

interface ElectronicsSpecs {
    type: 'electronics'; // Ayırt edici etiket
    ram: string;      // "8GB"
    storage: string;  // "256GB"
    screenSize: number;
    battery: number;
}

interface BookSpecs {
    type: 'book';
    author: string;
    pages: number;
    isbn: string;
}



export type ProductSpecs = ClothingSpecs | ElectronicsSpecs | BookSpecs;