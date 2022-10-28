import { ethers } from "ethers";
import { LpReserveContract } from "src/abi";
import { getAddresses, Networks } from "src/constants"

export async function getReserve(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairAddress = addresses.PAIR_ADDRESS;
    const pairContract = new ethers.Contract(pairAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    return reserves;
}