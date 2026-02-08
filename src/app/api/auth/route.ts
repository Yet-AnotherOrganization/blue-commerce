import NextAuth, { AuthOptions, Awaitable, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { User } from "../../../generated/prisma";
import { compare, compareSync } from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

export type SimpleUser = Pick<User, "id" | "name" | "email" | "role" | "avatar">;

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email giriniz." },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req): Promise<SimpleUser | null> {
                if (!credentials?.password || !credentials.email) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (!user || !user.password) return null

                // need to compare hashes
                const isPassValid = await compare(credentials?.password, user.password);

                // no match => wrong pass/email
                if (!isPassValid) return null

                const simpleUser: SimpleUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }

                return simpleUser
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }): Promise<JWT> {

            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }): Promise<Session> {

            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }

            return session;
        }
    }
}


export default NextAuth(authOptions)