import { NEXT_PUBLIC_URL } from "@/app/config";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { untrustedData } = body;
    const name = untrustedData.inputText;
    
    return new NextResponse(
        getFrameHtmlResponse({
            
            image: {
                src: `${NEXT_PUBLIC_URL}/complete/baseblock.jpg`,
            }
        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}