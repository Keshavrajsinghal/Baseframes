import { NEXT_PUBLIC_URL } from "@/app/config";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { untrustedData } = body;
    const name = untrustedData.inputText;
    try {

    
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {   
                    action: 'tx',
                    label: 'Enter your desired duration',
                    target: `${NEXT_PUBLIC_URL}/api/tx?basename=${encodeURIComponent(name)}`
                    // target: `${NEXT_PUBLIC_URL}/api/tx`
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
catch (e) {
    console.log('error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

}
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}