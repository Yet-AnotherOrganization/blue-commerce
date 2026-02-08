import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { User } from "../../../generated/prisma";
import { compare, compareSync } from 'bcryptjs';


export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email giriniz." },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials?.password || credentials.email) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (!user || !user.password) return null

                // need to compare hashes
                const isPassValid = compareSync(credentials?.password, user.password);

                // no match => wrong pass/email
                if (!isPassValid) return null

                return user
            }
        }),

    ]
}

export default NextAuth(authOptions)