import { NEXT_PUBLIC_URL } from "@/app/config";
import { getNameRegistrationPrice } from "@/app/utility/getNameRegistrationPrice";
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";
import { parseEther } from "viem";
import { normalize } from "viem/ens";


async function getResponse(req: NextRequest): Promise<NextResponse> {
    let accountAddress: string | undefined = '';

    const body: FrameRequest = await req.json();
    let isValid;
    let message;
    let state;
    let basename;
    let price = '0';
    let priceInWei;
    
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
    if (!isValid) {
        return new NextResponse('Message not valid', { status: 500 });
      }
    else {
        accountAddress = message?.interactor.verified_accounts[0]; // To do verify 
    }
    const sanitizeEnsDomainName = (name: string) => {
        return name.replace(/[^a-zA-Z0-9À-ÿ-]/g, '');
      };

    
    try {
        price = await getNameRegistrationPrice(basename, years);
        priceInWei = parseEther(price!.toString());
    } catch (error) {
        console.error('Error getting registration price:', error);
        return NextResponse.json({ error: 'Error calculating price' }, { status: 500 });
    }


    try {
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {   
                    action: 'post',
                    label: `Years ${years} Name ${basename} address ${accountAddress}`,
                    target: `${NEXT_PUBLIC_URL}/api/tx?basename=${encodeURIComponent(typeof(price))}`
                    // target: `${NEXT_PUBLIC_URL}/api/tx`
                },
            ],
            image: {
                src: `${NEXT_PUBLIC_URL}/confirmation/CB.jpeg`,
            },
            input: {
                text: `Years ${years} Name ${basename}`
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