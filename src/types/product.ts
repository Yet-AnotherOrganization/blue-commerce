import { Category, Product } from "../generated/prisma";

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

// export type ProductWithCategory = Product & {
//     category: Pick<Category, "name">;
// };


export type SerializedProduct = Omit<Product, 'price'> & {
    price: number
}

export type CartItemWithProduct = {
    id: string,
    cartId: string,
    product: ProductType
    updatedAt: string,
    quantity: number
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