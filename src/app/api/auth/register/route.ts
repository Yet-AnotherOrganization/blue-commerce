import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@/lib/zod";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils"
import { NextRequest } from "next/server";
import crypto from 'crypto';
import emailjs from '@emailjs/nodejs';

emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    privateKey: process.env.EMAILJS_PRIVATE_KEY!
});

const postHandler = async (req: NextRequest) => {
    const body = await req.json();

    console.log('\n\n\n REQUEST BODY: \n\n', body, '\n\n\n')
    const validatedFields = RegisterUserSchema.safeParse(body);

    if (!validatedFields.success) {
        const messages = validatedFields.error.issues.map((err) => `${err.path}: ${err.message}`)
        throw new APIError('Missing/invalid fields in register user body.', 400, 'ERR_MISSING_INVALID_FIELDS', messages);
    }

    const data = validatedFields.data;

    // check for already existing user email

    const userExists = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })

    if (userExists) {
        if (userExists.status !== 'PENDING') throw new APIError('A User with this email already exists.', 400, 'ERR_USER_EXISTS');

        await prisma.user.delete({
            where: { id: userExists.id }
        })
    }

    // check if passwords match

    if (data.password !== data.confirmPassword) throw new APIError("Passwords don't match", 400, 'ERR_PASS_DONT_MATCH');

    // create the link

    const randomHash = crypto.randomBytes(20).toString('hex');

    const link = `${req.nextUrl.origin}/register/confirm/${randomHash}`

    //create a pending user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: data.password,
            phone: data.phone,
            role: 'USER',
            status: 'PENDING',
            country: data.country,
            defaultDeliveryLocation: data.defaultDeliveryLocation,
            newsletter: data.newsletter,
            activateAccountCode: randomHash,
        }
    })

    // create cart

    const cart = await prisma.cart.create({
        data: {
            userId: user.id
        }
    })

    const products = await prisma.product.findMany({
        where: { id: { in: data.cart.map(i => i.productId) } }
    });

    const productSet = new Set(products.map(p => p.id));

    // put the items

    for (const item of data.cart) {
        if (!productSet.has(item.productId)) continue;

        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: item.productId,
                quantity: Number(item.quantity) ?? 1
            }
        });
    }


    try {
        // SEND MAIL ATTEMPT

        console.log('EMAILJS TEST: ', process.env.EMAILJS_PRIVATE_KEY)
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            { mail: user.email, activationLink: link }
        );
    }
    catch (emailError) {
        console.log("\n\nEMAIL ERROR: \n\n  ", emailError, '\n\n')
        // ROLLBACK
        await prisma.user.delete({
            where: { id: user.id }
        });

        throw new APIError(
            'User account initialized, but activation email failed to send. Please try again.',
            500,
            'ERR_EMAIL_SEND_FAILED'
        );
    }

    return res(201, 'User successfully created - pending email activation.', user)
}

export const POST = withErrorHandler(postHandler)