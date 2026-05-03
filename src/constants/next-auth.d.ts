// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: 'ADMIN' | 'USER'
  }

  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'USER'
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'ADMIN' | 'USER'
  }
}