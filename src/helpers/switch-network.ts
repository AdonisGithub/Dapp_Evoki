
// const switchRequest = () => {
//     return window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0x38" }],
//     });
// };

// const addChainRequest = () => {
//     return window.ethereum.request({
//         method: "wallet_addEthereumChain",
//         params: [
//             {
//                 chainId: "0xa86a",
//                 chainName: "Binance Smart Chain Mainnet",
//                 rpcUrls: ["https://bsc-dataseed1.binance.org"],
//                 blockExplorerUrls: ["https://bscscan.com"],
//                 nativeCurrency: {
//                     name: "BNB",
//                     symbol: "BNB",
//                     decimals: 18,
//                 },
//             },
//         ],
//     });
// };


// testnet
const switchRequest = () => {
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x60" }],
    });
};

const addChainRequest = () => {
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: "0x60",
                chainName: "Binance Smart Chain Testnet",
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                blockExplorerUrls: ["https://testnet.bscscan.com"],
                nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18,
                },
            },
        ],
    });
};

export const swithNetwork = async () => {
    if (window.ethereum) {
        try {
            await switchRequest();
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest();
                    await switchRequest();
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
