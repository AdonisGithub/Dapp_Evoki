import  { useEffect, useState } from "react";
import "./calculator.scss";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
import { IReduxState } from "../../store/slices/state.interface";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";

function Calculator() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const marketPrice = useSelector<IReduxState, number>(state => {
        return state.app.marketPrice;
    });
    const currentAPY = useSelector<IReduxState, number>(state => {
        return state.app.currentApy;
    });
    const evokiBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.evoki;
    });

    const trimmedCurrentAPY = trim(currentAPY * 100, 1);
    const trimmedEvokiBalance = trim(Number(evokiBalance), 5);
    const trimeMarketPrice = trim(marketPrice, 2);

    const [evokiAmount, setEvokiAmount] = useState(trimmedEvokiBalance);
    const [rewardYield, setRewardYield] = useState(trimmedCurrentAPY);
    const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
    const [futureMarketPrice, setFutureMarketPrice] = useState(trimeMarketPrice);
    const [days, setDays] = useState(30);

    const launchtime : number = 1646092800000;
    const dateFromLaunch = Math.round((Date.now() - launchtime) / (8.64 * Math.pow(10,7)));

    const [rewardsEstimation, setRewardsEstimation] = useState("0");
    const [potentialReturn, setPotentialReturn] = useState("0");

    const calcInitialInvestment = () => {
        const evoki = Number(evokiAmount) || 0;
        const price = parseFloat(priceAtPurchase) || 0;
        const amount = evoki * price;
        return trim(amount, 2);
    };

    const calcCurrentWealth = () => {
        const evoki = Number(evokiAmount) || 0;
        const price = parseFloat(trimeMarketPrice);
        const amount = evoki * price;
        return trim(amount, 2);
    };

    const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

    useEffect(() => {
        const newInitialInvestment = calcInitialInvestment();
        setInitialInvestment(newInitialInvestment);
    }, [evokiAmount, priceAtPurchase]);

    const calcNewBalance = () => {
        
        let value : number ;
        let value1 = Math.pow(3831.25, 1 / (365 * 96)) - 1 || 0;
        let value2 = Math.pow(2.0945, 1 / (365 * 96)) - 1 || 0;
        let balance = Number(evokiAmount);
        for (let i = 0; i < days * 96; i++) {
            value = value1;
            if( i > (365-dateFromLaunch) * 96) value = value2;
            balance += balance * value;
        }
        return balance;
    };

    useEffect(() => {
        const newBalance = calcNewBalance();
        setRewardsEstimation(trim(newBalance, 5));
        const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
        setPotentialReturn(trim(newPotentialReturn, 5));
    }, [days, rewardYield, futureMarketPrice, evokiAmount]);

    return (
        <div className="calculator-view">
            <Zoom in={true}>
                <div className="calculator-card">
                    <Grid className="calculator-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="calculator-card-header">
                                <p className="calculator-card-header-title">Calculator</p>
                                <p className="calculator-card-header-subtitle">Estimate your returns</p>
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="calculator-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-apy">
                                            <p className="calculator-card-metrics-title">EVOKI Price</p>
                                            <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-tvl">
                                            <p className="calculator-card-metrics-title">Current APY</p>
                                            <p className="calculator-card-metrics-value">
                                                {isAppLoading ? <Skeleton width="100px" /> : <>{new Intl.NumberFormat("en-US").format(Number(trimmedCurrentAPY))}%</>}
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-index">
                                            <p className="calculator-card-metrics-title">Your EVOKI Balance</p>
                                            <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : <>{trimmedEvokiBalance} EVOKI</>}</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="calculator-card-area">
                            <div>
                                <div className="calculator-card-action-area">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">EVOKI Amount</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={evokiAmount}
                                                    onChange={e => setEvokiAmount(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setEvokiAmount(trimmedEvokiBalance)} className="stake-card-action-input-btn">
                                                                <p>Max</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">APY (%)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={trimmedCurrentAPY}
                                                   
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setRewardYield(trimmedCurrentAPY)} className="stake-card-action-input-btn">
                                                                <p>Current</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">EVOKI price at purchase ($)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={priceAtPurchase}
                                                    onChange={e => setPriceAtPurchase(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setPriceAtPurchase(trimeMarketPrice)} className="stake-card-action-input-btn">
                                                                <p>Current</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">Future EVOKI market price ($)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={futureMarketPrice}
                                                    onChange={e => setFutureMarketPrice(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setFutureMarketPrice(trimeMarketPrice)} className="stake-card-action-input-btn">
                                                                <p>Current</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="calculator-days-slider-wrap">
                                    <Grid container spacing={3}>
                                        <Grid container item xs={12} sm={6}>
                                            <Grid item xs={3}>
                                                <span className="calculator-days-slider-wrap-title">{`${days} day${days > 1 ? "s" : ""}`}</span>
                                            </Grid>
                                            <Grid item xs={9}>                                                
                                                <span className="calculator-year-apy-text"> First Year : 0.02355% Per EPOCH</span>
                                            </Grid>
                                            <Slider className="calculator-days-slider" min={1} max={365-dateFromLaunch} value={days} onChange={(e, newValue: any) => setDays(newValue)} />                
                                        </Grid>
                                        <Grid container item xs={12} sm={6}>
                                            <p className="calculator-year-apy-text" style={{width: "100%"}}>Second Year : 0.00211% Per EPOCH</p>
                                            <Slider className="calculator-days-slider" min={366-dateFromLaunch} max={730-dateFromLaunch} value={days} onChange={(e, newValue: any) => setDays(newValue)} />
                                        </Grid>                
                                    </Grid>
                                </div>
                                <div className="calculator-user-data">
                                    <div className="data-row">
                                        <p className="data-row-name">Your initial investment</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Current wealth</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth()}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">EVOKI rewards estimation</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation} EVOKI</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential return</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Calculator;
