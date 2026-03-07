import { NextResponse } from "next/server";
import { getUser, withErrorHandler } from "../../../utils/serverUtils"

const postHandler = async (req:Request,) => {
    
    await getUser();

    const body = await req.json();

    

    return NextResponse.json({success:true, message: 'Item successfully added to favorites', data: 'PLACEHOLDER'})

}


export const POST = withErrorHandler(postHandler)