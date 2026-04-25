'use server'

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@/generated/prisma/runtime/client";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
    try {
        await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as deleted." }
    }
    catch (err) {
        console.log("error during deleting product: ", err);
        return {
            success: false, message: "Failed to delete product.", err
        }
    }
}

export async function activateProduct(id: string) {
    try {
        await prisma.product.update({ where: { id }, data: { status: "ACTIVE" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as active." }
    }
    catch (err) {
        console.log("error during deleting product: ", err);
        return {
            success: false, message: "Failed to activate product.", err
        }
    }
}

export async function createProduct(formData: FormData) {
    let createdProduct;
    try {

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

        createdProduct = await prisma.product.create({
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
    }
    catch (err) {

        let finalError;

        if (err instanceof Error) {
            finalError = err.message
        }

        // if (err instanceof PrismaClientKnownRequestError) {
        //     if (err.code === 'P2002') {

        //         console.log("METAMOGUS:", err)

        //         const target = (err.meta?.target as string[])?.join(', ') || "fields";

        //         return {
        //             success: false,
        //             message: `Conflict: A product with this ${target} already exists.`,
        //             error: "Unique constraint failed."
        //         }
        //     }

        //     if (err.code === 'P2003') {
        //         return {
        //             success: false,
        //             message: "Foreign key constraint failed. Invalid category or seller ID.",
        //             error: "Relation error."
        //         };
        //     }

        //     return {
        //         success: false,
        //         message: "A database error occurred.",
        //         error: err.message
        //     };
        // }

        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                // 1. Try standard Prisma meta
                let target = err.meta?.target as string[] | undefined;

                // 2. Fallback for Driver Adapters (Postgres/adapter-pg often puts it in 'target')
                if (!target && err.meta?.driverAdapterError) {
                    const adapterError = err.meta.driverAdapterError as any;
                    // Postgres unique violations usually return the constraint name or columns
                    target = adapterError.meta?.target || [adapterError.meta?.constraint];
                }

                // 3. Last resort: Parse the message string if meta is empty
                const fieldName = target ? target.join(', ') : "unknown field";

                return {
                    success: false,
                    message: `A product with this ${fieldName} already exists.`,
                    errors: { [target?.[0] || 'form']: "Must be unique" }
                };
            }
        }

        if (err instanceof PrismaClientValidationError) {
            return {
                success: false,
                message: "Database validation failed. Ensure all required fields are provided.",
                error: "Validation error."
            };
        }

        return {
            success: false,
            message: "Error during product upload.",
            error: finalError
        }
    }
}