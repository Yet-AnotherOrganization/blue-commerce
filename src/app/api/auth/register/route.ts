import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@/lib/zod";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils"

const postHandler = async (req: Request) => {
    const body = await req.json();

    const validatedFields = RegisterUserSchema.safeParse(body);

    console.log('\N\N DATA: ', body, '\N\N')

    if (!validatedFields.success) {
        throw new APIError('Missing/invalid fields in register user body.', 400, 'ERR_MISSING_INVALID_FIELDS', validatedFields.error.toString());
    }

    const data = validatedFields.data;

    // check for already existing user email

    const userExists = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })

    if (userExists) throw new APIError('A User with this email already exists.', 400, 'ERR_USER_EXISTS');

    // check if passwords match

    if (data.password !== data.confirmPassword) throw new APIError("Passwords don't match", 400, 'ERR_PASS_DONT_MATCH');

    // create the user

    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: data.password,
            phone: data.phone,
            role: 'USER',
            status: 'ENABLED',
            country: data.country,
            defaultDeliveryLocation: data.defaultDeliveryLocation,
            newsletter: data.newsletter,
            cart: {
                create: {}
            }
        }
    })

    return res(201, 'User successfully registered.', user)
}

export const POST = withErrorHandler(postHandler)