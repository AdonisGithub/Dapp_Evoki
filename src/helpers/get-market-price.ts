import { ethers } from "ethers";
import { LpReserveContract } from "src/abi";
import { getAddresses, Networks } from "src/constants"

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairAddress = addresses.PAIR_ADDRESS;
    const pairContract = new ethers.Contract(pairAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();

    if(reserves[0] == 0 || reserves[1] == 0) return 0;
    var bnbReserve = reserves[0];
    var evokiReserve = reserves[1];
    const token0 = await pairContract.token0();
    if(token0 == addresses.EVOKI_ADDRESS){
        evokiReserve = reserves[0];
        bnbReserve = reserves[1];
    }

    const marketPrice = bnbReserve  / evokiReserve / 10**(18 - 8);
    return marketPrice;
}
