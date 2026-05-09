'use server'
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ProductSchema, UpdateProductSchema } from "@/lib/zod";
import { adminAction } from "@/utils/serverUtils";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

export type ActionResponse =
    | { success: true; message: string; }
    | { success: false; message: string; error?: string; errors?: Record<string, string[]> };



export async function softDeleteProduct(id: string) {
    return adminAction(async () => {
        await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as archived." }
    })
}

export async function hardDeleteProduct(id: string) {
    return adminAction(async () => {
        await prisma.product.delete({ where: { id }})
        revalidatePath('/admin')
        return { success: true, message: "Successfully deleted the product." }
    })
}

export async function activateProduct(id: string) {
    return adminAction(async () => {

        await prisma.product.update({ where: { id }, data: { status: "ACTIVE" } })
        revalidatePath('/admin')
        return { success: true, message: "Successfully marked product as active." }
    })
}

export async function createProduct(formData: FormData) {
    return adminAction(async () => {

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
    return adminAction(async () => {


        const rawData = Object.fromEntries(formData);
        const validatedFields = UpdateProductSchema.safeParse(rawData);

        if (validatedFields.success) {
            const rawKeys = Object.keys(rawData);
            const validKeys = Object.keys(validatedFields.data);

            const ignoredFields = rawKeys.filter(key => !validKeys.includes(key));

            if (ignoredFields.length > 0) {
                console.warn("The following fields were ignored by Zod (likely renamed or missing in Schema):", ignoredFields);
                return {
                    success: false,
                    message: `Server couldn't update these fields: ${ignoredFields.toString()}`,
                }
            }
        }

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