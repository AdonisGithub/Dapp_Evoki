import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import {  EvokiContract, LpReserveContract, Erc20Contract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import { getLastRebasedTime } from "../../helpers"

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {

        const bnbPrice = getTokenPrice("BNB");
        const addresses = getAddresses(networkID);
        
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const lastRebasedTime = await getLastRebasedTime(networkID, provider);
        const evokiContract = new ethers.Contract(addresses.EVOKI_ADDRESS, EvokiContract, provider);
        const pairContract = new ethers.Contract( addresses.PAIR_ADDRESS, LpReserveContract, provider);
        const marketPrice = (await getMarketPrice(networkID, provider)) * bnbPrice;
        const totalSupply = (await evokiContract.totalSupply()) / Math.pow(10, 8);
        const circulatingSupply = (await evokiContract.getCirculatingSupply()) / Math.pow(10, 8);
        const marketCap = totalSupply * marketPrice;
        const reserves = await pairContract.getReserves();
        const poolBNBAmount = reserves[0] / Math.pow(10,18)
        const bnbLiquidityValue = poolBNBAmount * bnbPrice * 2;
        const totalReflectionEvokiValue = (await evokiContract.totalReflectionAmount()) / Math.pow(10, 8) * marketPrice;
        const growthFundsEvokiValue = (await evokiContract.balanceOf(addresses.GROWTHFUNDS_ADDRESS) / Math.pow(10, 8)) * marketPrice ;
        const growthFundsBNBAmount = await provider.getBalance(addresses.GROWTHFUNDS_ADDRESS);
        const growthFundsBNBValue = Number(ethers.utils.formatEther(growthFundsBNBAmount)) * bnbPrice;
        const growthFundsValue = growthFundsBNBValue + growthFundsEvokiValue;
        const backedLiquidity = "100%";

        const lastReflectionDuration = await evokiContract.lastReflectionDuration();
        const lastReflectionEvokiAmount = await evokiContract.lastReflectonAmount() / Math.pow(10, 8);
        const currentApy = (2.8201375488001963684723085598888 + lastReflectionEvokiAmount * 365 * 24* 60 * 60 / Number(lastReflectionDuration) / totalSupply)*100;
        console.log("bnb price", bnbPrice);
        console.log("token Price", marketPrice);
        console.log("lastReflectionEvokiAmount", lastReflectionEvokiAmount);
        console.log("lastReflectionDuration", Number(lastReflectionDuration));
        console.log("totalSupply", totalSupply);
        console.log("circulatingSupply", circulatingSupply);

        return {          
            totalSupply,
            circulatingSupply,
            marketCap,
            currentBlock,
            marketPrice,
            bnbPrice,
            currentBlockTime,
            lastRebasedTime,
            backedLiquidity,
            bnbLiquidityValue,
            totalReflectionEvokiValue,
            growthFundsValue,
            currentApy,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    networkID: number;
    totalSupply: number;
    circulatingSupply: number;
    marketCap: number;
    currentBlock: number;
    currentBlockTime: number;
    lastRebasedTime: number;
    totalReflectionEvokiValue: number;
    growthFundsValue: number;
    bnbLiquidityValue: number;
    backedLiquidity: string;
    bnbPrice: number;
    marketPrice: number;
    currentApy: number

}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
