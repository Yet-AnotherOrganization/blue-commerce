import { z } from 'zod';

export const AddItemSchema =
    z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().positive()
    })

export type AddItemDto = z.infer<typeof AddItemSchema>;

export const RemoveItemSchema =
    z.object({
        cartItemId: z.string()
    })

export type RemoveItemDto = z.infer<typeof RemoveItemSchema>

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  seller: z.string().min(1),
  stock: z.coerce.number().int().default(1),
  price: z.coerce.number().positive(),
});

export type ProductDto = z.infer<typeof ProductSchema>