import { ethers } from 'ethers';
import { USERNAME_REGISTRAR_CONTROLLER_ADDRESS } from '../config';
import RegistrarControllerABI from '../abi/RegistrarControllerABI';
import { normalize } from 'viem/ens';


const sanitizeEnsDomainName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9À-ÿ-]/g, '');
  };

function secondsInYears(years: number): bigint {
    const secondsPerYear = 365.25 * 24 * 60 * 60; // .25 accounting for leap years
    return BigInt(Math.round(years * secondsPerYear));
    }

function normalizedEnsDomainName(name: string) {
    try {
        return normalize(name);
      } catch (error) {
        return normalize(sanitizeEnsDomainName(name));
    }
}


export async function getNameRegistrationPrice(name: string, years: number) {

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY);
    const contract = new ethers.Contract(USERNAME_REGISTRAR_CONTROLLER_ADDRESS, RegistrarControllerABI, provider);

    const normalizedName = normalizedEnsDomainName(name);
    try {
        const price = await contract.registerPrice(normalizedName, secondsInYears(years));
        return ethers.formatEther(price); 
    } catch (e) {
        console.error('Error fetching price');
    }

}
