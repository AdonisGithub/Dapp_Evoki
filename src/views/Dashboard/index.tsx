import { useSelector } from "react-redux";
import { Grid, useMediaQuery, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { useCountdown } from "../../helpers";

function Dashboard() {
    const is1280 = useMediaQuery("(max-width: 1280px)");
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const rebaseTime = useCountdown();
    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <div>
                        <div className="dashboard-content-wrapper">
                            <div className="dashbord-card-group">
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Token Price</div>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 7)}`}</p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">MarketCap</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="160px" />
                                            ) : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                            }).format(app.marketCap)
                                        )} 
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Pool Value</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="250px" />
                                            ) : (
                                            new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0,
                                            }).format(app.bnbLiquidityValue)
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="dashbord-card-group">
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Current APY</div>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.currentApy, 2)}%`}</p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Dividend Distribution</div>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.totalReflectionEvokiValue, 2)}`}</p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Next Rebase</div>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> :`00:${rebaseTime[2]}:${rebaseTime[3]}`}</p>
                                </div>
                            </div>
                            <div className="dashbord-card-group">
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Growth Fund</div>
                                    <div className="card-value">
                                        { 
                                            isAppLoading ? <Skeleton width="250px" /> :
                                            new Intl.NumberFormat().format(Number(`${trim(app.totalSupply, 2)}`))                                                    
                                        }
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Circulating Supply</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="160px" />
                                            ) : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                            }).format(app.marketCap)
                                        )} 
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Total Supply</div>
                                    <div className="card-value">
                                        { 
                                            isAppLoading ? <Skeleton width="250px" /> :
                                            new Intl.NumberFormat().format(Number(`${trim(app.totalSupply, 2)}`))                                                    
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
