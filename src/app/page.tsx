import { getFrameMetadata } from "@coinbase/onchainkit/core";
import Image from "next/image";
import base from "@/public/home/base.jpg"
import { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "./config";


const frameMetaData = getFrameMetadata({
  buttons: [
    {   
        action: 'tx',
        label: 'Enter your desired basename',
        target: `${NEXT_PUBLIC_URL}/api/mint`,
        postUrl: `${NEXT_PUBLIC_URL}/api/mint`
    }
],
  image: {
    src: `${NEXT_PUBLIC_URL}/home/base.jpg`
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/mint`
})

export const metadata: Metadata = {
  title: 'Baseframe',
  description: 'Baseframes',
  openGraph: {
    title: 'Baseframe',
    description: 'Unlock your onchain identity on Base',
    images: [`${NEXT_PUBLIC_URL}/home/base.jpg`]
  },
  other: {
    ...frameMetaData,
  }
}

export default function Home() {

  return (
    <>
    <h1>Basenames</h1>
    </>
  );
}
