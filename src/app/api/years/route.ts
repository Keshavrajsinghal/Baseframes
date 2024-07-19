import { NEXT_PUBLIC_URL } from "@/app/config";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { untrustedData } = body;
    const name = untrustedData.inputText;
    
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {   
                    // action: 'tx',
                    label: 'Enter your desired duration',
                    // target: `${NEXT_PUBLIC_URL}/api/tx?basename=${encodeURIComponent(name)}`
                },
            ],
            image: {
                src: `${NEXT_PUBLIC_URL}/complete/baseblock.jpg`,
            },
            input: {
                text: 'Mint your own basename'
              },

        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}