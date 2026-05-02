'use server'

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@/generated/prisma/runtime/client";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ProductSchema, UpdateProductSchema } from "@/lib/zod";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

export type ActionResponse =
    | { success: true; message: string; data?: any }
    | { success: false; message: string; error?: string; errors?: Record<string, string[]> };

export async function actionCatchAsync(fn: () => Promise<ActionResponse>): Promise<ActionResponse> {
    try {
        return await fn();
    }
    catch (err) {
        let finalError;

        if (err instanceof Error) {
            finalError = err.message
        }

        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {

                return {
                    success: false,
                    message: `A product with this name already exists.`,
                    error: "Unique constraint failed."
                }
            }

            if (err.code === 'P2003') {
                return {
                    success: false,
                    message: "Foreign key constraint failed. Invalid category or seller ID.",
                    error: "Relation error."
                };
            }

            return {
                success: false,
                message: "A database error occurred.",
                error: err.message
            };
        }

        if (err instanceof PrismaClientValidationError) {
            return {
                success: false,
                message: "Database validation failed. Ensure all required fields are provided.",
                error: "Validation error."
            };
        }

        console.log("Unidentifiable Error: ", err);

        return {
            success: false,
            message: "An unidentifiable database error has occurred.",
        };
    }

}

export async function deleteProduct(id: string) {
    return actionCatchAsync(async () => {
        await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as deleted." }
    })
}

export async function activateProduct(id: string) {
    return actionCatchAsync(async () => {
        await prisma.product.update({ where: { id }, data: { status: "ACTIVE" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as active." }
    })
}

export async function createProduct(formData: FormData) {
    return actionCatchAsync(async () => {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = ProductSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Invalid fields.",
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        const data = validatedFields.data;

        const file = formData.get('image') as File;

        if (!file || file.size === 0) return { success: false, message: "No image uploaded." }

        if (file.size > 1024 * 1024 * 4) return { success: false, message: "File size exceeds 4MB limit." }

        // convert to buffer

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // upload to cloudinary
        const uploadResult: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result)
                }
            ).end(buffer);
        })

        if (!uploadResult) return { success: false, message: 'Failure during image upload.' };

        await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                categoryId: data.category,
                imageUrl: uploadResult.secure_url,
                stock: data.stock,
                sellerId: data.seller,
                price: data.price
            }
        })

        revalidatePath('/admin/product');
        return {
            success: true,
            message: "The product successfully been created.",
        }
    })
}

export async function editProductAdmin(id: string, formData: FormData) {
    return actionCatchAsync(async () => {
        const rawData = Object.fromEntries(formData);
        const validatedFields = UpdateProductSchema.safeParse(rawData);
        const validData = validatedFields.data;
        if (validData) {
            const invalidFields = Object.entries(rawData).map((k) => {
                const key = k[0] as keyof typeof validData;
                const value = k[1];

                const exists = !!validData[key]

                return exists ? value : null;
            }
            );

            console.log("invalids: ", invalidFields)
        }
        console.log("raw:", validatedFields.data)

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Invalid fields.",
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        const data = validatedFields.data;

        const updated = await prisma.product.update({
            where: {
                id
            },
            data: {
                categoryId: data.category,
                status: data.status,
                description: data.description,
                sellerId: data.seller,
                stock: data.stock,
                name: data.name
            }
        })

        // console.log(updated)

        revalidatePath('/admin/product');
        return {
            success: true,
            message: "The product has been successfully updated.",
        }
    })
}