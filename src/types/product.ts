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

// 2. Telefon için Tip Tanımı
interface ElectronicsSpecs {
    type: 'electronics'; // Ayırt edici etiket
    ram: string;      // "8GB"
    storage: string;  // "256GB"
    screenSize: number;
    battery: number;
}

// 3. Kitap için Tip Tanımı
interface BookSpecs {
    type: 'book';
    author: string;
    pages: number;
    isbn: string;
}



// 4. Hepsini kapsayan BİRLEŞİK TİP
export type ProductSpecs = ClothingSpecs | ElectronicsSpecs | BookSpecs;