import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Zoom } from "@material-ui/core";
import earnImg from "../../assets/icons-evoki/earn.png";
import loseImg from "../../assets/icons-evoki/lose.png";
import meticBG from "../../assets/icons-evoki/metrc-bg.png";
import meticPin from "../../assets/icons-evoki/metrc-pin.png";
// import Moralis from "moralis";
import "./analytics.scss";
import { getAddresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
// import { useMoralisQuery } from "react-moralis";
import { formatDate, formatTxHash, sleep, trim } from "src/helpers";

type TxHistory = {
    id: string;
    txHash: string;
    block_number: number;
    date: string;
    amount: number;
    price: number;
    bnbPrice: number;
    from: string;
    to: string;
    type:string;
}

const Analytics = () => {

    // const { address, chainID } = useWeb3Context();

    // const fetchBuyTx = new Moralis.Query("eventlogs");
    // fetchBuyTx.equalTo("to", address.toLocaleLowerCase());

    // const fetchSellTx = new Moralis.Query("eventlogs");
    // fetchSellTx.equalTo("from", address.toLocaleLowerCase());


    // const fetchTx = Moralis.Query.or(fetchBuyTx, fetchSellTx);

   

    // const { data, isLoading, error } = useMoralisQuery("eventlogs", query => fetchTx);
    // const [txHistory, setTxHistory] = useState<Array<TxHistory> | null>(null);
    // const [evokiPriceHistory, setEvokiPriceHistory] = useState<Array<number>>([]);
    // const [bnbPriceHistory, setBnbPriceHistory] = useState<Array<number>>([]);

    // const addresses = getAddresses(chainID);

    // const [invest, setInvest] = useState(0);
    // const [earn, setEarn] = useState(0); 

    // useEffect(() => {
        
    //     const txLength = data.length; 
    //     if(txLength == evokiPriceHistory.length && txLength == bnbPriceHistory.length) {
    //         let invest = 0, earn = 0;
    //         for(let i=0; i<txLength; i++){
    //             if(data[i].get("to") === address.toLocaleLowerCase()) {
    //                 invest += evokiPriceHistory[i] * Number(data[i].get("value")) / Math.pow(10, 5);
    //             } else {
    //                 earn += evokiPriceHistory[i] * Number(data[i].get("value")) / Math.pow(10, 5);
    //             }
    //         }
    //         setInvest(invest);
    //         setEarn(earn);
    //     }
    // },[evokiPriceHistory,bnbPriceHistory]);

    
    // useEffect(() => {
    //     let txHistory: TxHistory[] = [];
    //     if (!isLoading) {
    //         const getTokenPrice = async () => {
    //             let evokiPriceHistory = await Promise.all(data.map(async (tx, i) => {
    //                 const options = {
    //                     address: addresses.EVOKI_ADDRESS.toLowerCase(),
    //                     chain: "bsc" as const,
    //                     exchange: "PancakeSwapv2",
    //                     to_block: tx.get("block_number")
    //                 };
    //                 return (await Moralis.Web3API.token.getTokenPrice(options)).usdPrice;
    //             }));
    //             setEvokiPriceHistory(evokiPriceHistory);
    //         }

    //         const getBnbPrice = async () => {
    //             let bnbPriceHistory = await Promise.all(data.map(async (tx, i) => {
    //                 const options = {
    //                     address: addresses.WBNB_ADDRESS.toLowerCase(),
    //                     chain: "bsc" as const,
    //                     to_block: tx.get("block_number")
    //                 }
    //                 return (await Moralis.Web3API.token.getTokenPrice(options)).usdPrice;
    //             }));
    //             setBnbPriceHistory(bnbPriceHistory);
    //         }

    //         getTokenPrice();
    //         getBnbPrice();

    //         for (let i = 0; i <= data.length; i++) {
    //             if (data[i] !== undefined) {
    //                 txHistory.push({
    //                     id: data[i].get("objectId"),
    //                     txHash: (data[i].get("transaction_hash")),
    //                     block_number: data[i].get("block_number"),
    //                     date: String(data[i].get("block_timestamp")),
    //                     amount: Number(data[i].get("value")) / Math.pow(10, 5),
    //                     price: 0,
    //                     bnbPrice: 0,
    //                     from: data[i].get("from"),
    //                     to: data[i].get("to"),
    //                     type: (data[i].get("to") === address.toLocaleLowerCase()) ? "BUY" : "SELL"
    //                 });
    //             }
    //         }
    //         setTxHistory(txHistory);
    //     }

    // }, [data]);

    // return (
    //     <div className="analytics-view">
    //         <div className="analytics-infos-wrap">
    //             <Zoom in={true}>
    //                 <div>
    //                     <div className="analytics-content-wrapper">
    //                         <div className="analytics-card-content">
    //                             <div className="analytics-card">
    //                                 <h2>How much you have invested so far?</h2>
    //                                 <div>
    //                                     <img src={earnImg} style={{ width: "60px", marginLeft: "10px" }} alt="earnImg" />
    //                                 </div>
    //                                 <h1>Total Investment</h1>
    //                                 <div className="analytics-card-value">${trim(invest,3)}</div>
    //                             </div>
    //                             <div className="analytics-card">
    //                                 <div>
    //                                     <p>Risk Meter</p>
    //                                     <div className="metrc-view">
    //                                         <img src={meticBG} alt="" />
    //                                         <img src={meticPin} alt="" className="metrc-pin" />
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <div className="analytics-card">
    //                                 <h2>How much you have withdrawn so far?</h2>                                    
    //                                 <div>
    //                                     <img src={loseImg} style={{ width: "60px", marginLeft: "10px" }} alt="loseImg" />
    //                                 </div>
    //                                 <h1>Total Earned</h1>
    //                                 <div className="analytics-card-value">${trim(earn,3)}</div>
    //                             </div>
    //                         </div>
    //                         <div className="analytics-card table-view">
    //                             <div className="table-button">Recent Trading History</div>
    //                             <div className="table-content">
    //                                 <Table aria-label="simple table" style={{ minHeight: "250px" }}>
    //                                     <TableHead>
    //                                         <TableRow>
    //                                             <TableCell align="center">Transaction Hash</TableCell>
    //                                             <TableCell align="center">Block Number</TableCell>
    //                                             <TableCell align="center">Method</TableCell>
    //                                             <TableCell align="center">Date</TableCell>
    //                                             <TableCell align="center">Amount</TableCell>
    //                                             <TableCell align="center">$ EVOKI</TableCell>
    //                                             <TableCell align="center">$ BNB</TableCell>
    //                                         </TableRow>
    //                                     </TableHead>
    //                                     <TableBody >{
    //                                         txHistory?.map((tx, i) => (
    //                                             <TableRow key={i}>
    //                                                 <TableCell component="th" scope="row" align="center" style={{ cursor: "pointer" }} onClick={() => window.open(`https://bscscan.com/tx/${tx.txHash}`)}>
    //                                                     {formatTxHash(tx.txHash)}
    //                                                 </TableCell >
    //                                                 <TableCell align="center">{tx.block_number}</TableCell>
    //                                                 <TableCell align="center">{tx.type}</TableCell>
    //                                                 <TableCell align="center">{formatDate(tx.date)}</TableCell>
    //                                                 <TableCell align="center">{tx.amount}</TableCell>
    //                                                 <TableCell align="center">{trim(evokiPriceHistory[i],3)}</TableCell>
    //                                                 <TableCell align="center">{trim(bnbPriceHistory[i],3)}</TableCell>
    //                                             </TableRow>
    //                                         ))}
    //                                     </TableBody>
    //                                 </Table>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </Zoom>
    //         </div>
    //     </div>
    // );
};

export default Analytics;
