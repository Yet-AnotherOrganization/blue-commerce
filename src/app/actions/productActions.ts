'use server'

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
        return {
            success: false, message: "No image uploaded."
        }
    }

    // convert to buffer

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "products",
                resource_type: 'auto'
            },
            (error, result) => {
                if(error) reject(error);
                else resolve(result)
            }
        ).end(buffer);
    })

    console.log("image uploaded: ", uploadResult);

    revalidatePath('/products');
}