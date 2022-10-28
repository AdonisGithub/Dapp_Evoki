import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { EvokiContract, Erc20Contract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { getMainnetURI } from "../../hooks/web3/helpers";
import { RootState } from "../store";
import Web3 from "web3"

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        evoki: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    
    const addresses = getAddresses(networkID);
    const evokiContract = new ethers.Contract(addresses.EVOKI_ADDRESS, EvokiContract, provider);
    const evokiBalance = await evokiContract.balanceOf(address);
    return {
        balances: {
            evoki: ethers.utils.formatUnits(evokiBalance, 5),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        evoki: string;
        allowance: string;
        bnb : string;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    
    let evokiBalance, allowance = 0; 
    const addresses = getAddresses(networkID);
    const uri = getMainnetURI();
    const web3 = new Web3(new Web3.providers.HttpProvider(uri));
    const bnbBalance = await web3.eth.getBalance(address);
    if (addresses.EVOKI_ADDRESS) {
        const evokiContract = new ethers.Contract(addresses.EVOKI_ADDRESS, EvokiContract, provider);
        evokiBalance = await evokiContract.balanceOf(address);
        allowance = await evokiContract.allowance(address, addresses. ROUTER_ADDRESS);

    }
    return {
        balances: {
            evoki: ethers.utils.formatUnits(evokiBalance, 18),
            allowance: ethers.utils.formatUnits(allowance,18),
            bnb : ethers.utils.formatUnits(bnbBalance,18)
        }
    };
});



export interface IUserTokenDetails {
    balance: number;
    isBnb?: boolean;
}



export interface IAccountSlice {
    balances: {
        evoki: string;
        allowance:string;
        bnb : string;
    };
    loading: boolean;
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { evoki: "0", allowance:"0", bnb:"0" },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
