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