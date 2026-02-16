import { z } from 'zod';

export const CartItemSchema = z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive(),
    method: z.enum(['ADD', 'REMOVE'])
})

export type CartItemDto = z.infer<typeof CartItemSchema>