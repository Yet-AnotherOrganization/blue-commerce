import { getServerSession, Session, User } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../lib/prisma";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { Cart } from "../generated/prisma";

export const res = <T>(
    status: number,
    message: string,
    data?: T
): NextResponse => {
    return NextResponse.json(
        { message, ...(data !== undefined && { data }) },
        { status }
    );
};

export const getUser = async (): Promise<User> => {

    const session = await getServerSession(authOptions)

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id
        }
    })

    if (!user) throw new Error('Please log in again.')

    return user
}

export const findCartByUserId = async (uid: string): Promise<Cart> => {

    const cart = await prisma.cart.findUnique({
        where: {
            userId: uid
        }
    });

    if (!cart) throw new Error("The resource you searched for couldn't be found")

    return cart;


}