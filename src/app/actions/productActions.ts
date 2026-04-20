'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
    try {
        await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } })
        revalidatePath('/admin')
    }
    catch (err) {
        console.log("error during deleting product: ", err);
        return {
            success: false, message: "Failed to delete product.", err
        }
    }
}