import { NEXT_PUBLIC_URL } from "@/app/config";
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    let isValid;
    let message;
    let state;
    let basename;
    try {
        const result = await getFrameMessage(body, { neynarApiKey: 'BF56615F-9028-4774-9E8C-2745308382C1' });
        isValid = result.isValid;
        message = result.message;
    } catch (e) {
        return NextResponse.json({ error: e});
    }
    
    const { untrustedData } = body;
    const years = parseInt(untrustedData.inputText);
    
    if (message?.state) {
        state = JSON.parse(decodeURIComponent(message.state?.serialized));
        basename = state.basename;
    }



    try {
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {   
                    action: 'post',
                    label: `Years ${years} Name ${state}`,
                    target: `${NEXT_PUBLIC_URL}/api/tx?basename=${encodeURIComponent(basename)}`
                    // target: `${NEXT_PUBLIC_URL}/api/tx`
                },
            ],
            image: {
                src: `${NEXT_PUBLIC_URL}/confirmation/CB.jpeg`,
            },
            input: {
                text: `Years ${years} Name ${state}`
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