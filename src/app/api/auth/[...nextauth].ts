import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email giriniz." },
                password: { label: "password", type: "password" }
            },
        }),

    ]
}

export default NextAuth(authOptions)