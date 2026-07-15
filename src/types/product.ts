import { Decimal } from "@/generated/prisma/runtime/client";
import { Prisma } from "../generated/prisma";

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