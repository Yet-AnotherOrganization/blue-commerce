'use server'

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

        const createdProduct = await prisma.product.create({
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
    }
    catch (err) {
        console.log("ERROR: ", err);
        return {
            success: false,
            message: "Error during product upload.",
            error: err
        }
    }

    redirect('/admin/product')
}