import { NEXT_PUBLIC_URL } from "@/app/config";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {   
                    action: 'post',
                    label: 'Enter your desired basename',
                    target: `${NEXT_PUBLIC_URL}/api/years`,
                }
            ],
            image: {
                src: `${NEXT_PUBLIC_URL}/complete/baseblock.jpg`,
            },
            input: {
                text: 'Mint your own basename'
              },
              postUrl: `${NEXT_PUBLIC_URL}/api/years`
        
        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}
export const dynamic = 'force-dynamic';