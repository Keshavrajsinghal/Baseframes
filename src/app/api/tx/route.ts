import { abi } from "@/app/contracts/RegistrarControllerAbi";
import { FrameRequest, FrameTransactionResponse, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseEther } from "viem";
import { baseSepolia } from "viem/chains";

function secondsInYears(years: number): bigint {
    const secondsPerYear = 365.25 * 24 * 60 * 60; // .25 accounting for leap years
    return BigInt(Math.round(years * secondsPerYear));
  }

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
    let accountAddress: string | undefined = '';
    const body: FrameRequest = await req.json();
    const { untrustedData } = body;
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    const searchParams = req.nextUrl.searchParams;
    const basename = searchParams.get('basename');
    const years = parseInt(untrustedData.inputText);


    if (!isValid) {
        return new NextResponse('Message not valid', { status: 500 });
      }
    else {
        accountAddress = message.interactor.verified_accounts[0];
    }
    console.log('account address', accountAddress);
    console.log('basename', basename);
    console.log('years', years);

    const registerRequest = {
            name: basename, // The name being registered.
            owner: '0x74431A069d721FEe532fc6330fB0280A80AeEaF9', // The address of the owner for the name.
            duration: secondsInYears(years), // The duration of the registration in seconds.
            resolver: '0x8d2D30cdE6c46BC81824d0732cE8395c58da3939', // The address of the resolver to set for this name.
            data: [], //  Multicallable data bytes for setting records in the associated resolver upon reigstration.
            reverseRecord: true, // Bool to decide whether to set this name as the "primary" name for the `owner`.
          
    }
    
    const data = encodeFunctionData({
        abi: abi,
        functionName: 'register',
        args: [registerRequest]
    })

    const txData: FrameTransactionResponse = {
        chainId: `eip155:${baseSepolia.id}`,
        method: 'eth_sendTransaction',
        params: {
            abi: [],
            data,
            to: '0x16ee2051a0613e5c52127755ee3110cf4cd1ca10',
            value: parseEther('0.002').toString(),
        },
    };
    return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}