'use server'
import { prisma } from "../lib/prisma";
import { compare } from 'bcryptjs';

export async function loginAction(formData: FormData) {

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;


    // find the user on the db
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    // if there is no user then just return an error
    // TODO create i18n messages
    if (!user || !user.password) return { error: "Kullanıcı bulunamadı." }

    // need to compare hashes
    const isPassValid = await compare(password, user.password);

    // no match => wrong pass/email
    if (!isPassValid) return { error: 'Girdiğiniz e-posta veya şifre yanlış.' }

    // if passes match then trigger NextAuth

    try {

    }
    catch (err: any) {
        return { error: err.message }
    }

}