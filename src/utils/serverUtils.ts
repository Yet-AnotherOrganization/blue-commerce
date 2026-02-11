import { NextResponse } from "next/server";

export const res = (status: number, message: String, data?: any): NextResponse => {

    return NextResponse.json({ message, data: data || undefined }, { status })

}