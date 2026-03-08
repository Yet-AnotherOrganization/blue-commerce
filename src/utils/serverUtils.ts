import { getServerSession, Session, User } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../lib/prisma";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { Cart } from "../generated/prisma";
import APIError from "../types/api";

export const res = <T>(
    status: number,
    message?: string,
    data?: T,
    errCode?: string,
): NextResponse | Response => {
    if (status !== 204) return NextResponse.json(
        { message, ...(data !== undefined && { data }) },
        { status }
    );
    else return new Response(null, { status: 204 })
};



// API fonksiyonunun tipini tanımlıyoruz
type ApiHandler = (req: Request, context: any) => Promise<NextResponse | any>;

export const withErrorHandler = (handler: ApiHandler) => {
    return async (req: Request, context: any) => {
        try {
            return await handler(req, context);
        } catch (err: any) {
            console.error("Global Error Handler:", err);


            if (err instanceof APIError) {
                return res(err.statusCode, err.message, err.errorCode, err.details);
            }


            if (err.name === "ZodError") {
                return res(400, "Validation error, check details.", "VALIDATION_ERROR", err.errors);
            }

            // 3. Genel sistem hataları
            const message = err instanceof Error ? err.message : "Internal server error";
            const status = err instanceof Error ? 400 : 500;

            return res(status, message, "UNKNOWN_ERROR");
        }
    };
};



export const getUser = async (): Promise<User> => {

    const session = await getServerSession(authOptions)

    if (!session) throw new APIError('Please log in again', 401, 'SESSION_EXPIRED')


    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id
        }
    })

    if (!user) throw new APIError('Please log in again', 401, 'SESSION_EXPIRED')

    return user
}

export const findCartByUserId = async (uid: string): Promise<Cart> => {

    const cart = await prisma.cart.findUnique({
        where: {
            userId: uid
        }
    });

    if (!cart) throw new APIError('The cart you specified was not found', 404, 'CART_NOT_FOUND')

    return cart;


}
