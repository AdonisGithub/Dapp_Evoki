import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { EvokiContract } from "src/abi";
import { getAddresses, Networks } from "src/constants"

export const getApprovedAmount = async (address: string, networkID: Networks, provider: JsonRpcProvider| StaticJsonRpcProvider) => {
    const addresses = getAddresses(networkID);
    const evokiContract = new ethers.Contract(addresses.EVOKI_ADDRESS, EvokiContract, provider);
    let allowance = 0;
    allowance = evokiContract.allowance(address, addresses.ROUTER_ADDRESS);
    return allowance;
}