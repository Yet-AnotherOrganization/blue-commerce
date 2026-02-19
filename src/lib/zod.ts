import { z } from 'zod';

export const CartItemSchema = z.discriminatedUnion("method", [
    z.object({
        method: z.literal('ADD'),
        productId: z.string().cuid(),
        quantity: z.number().int().positive()
    }),

    z.object({
        method: z.literal('DEC'),
        productId: z.string().cuid(),
    })
]);

export type CartItemDto = z.infer<typeof CartItemSchema>;