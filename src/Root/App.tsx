import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import ViewBase from "../components/ViewBase";
// import { Account, Dashboard, NotFound, Calculator, Swap, Analytics } from "../views";
import { Account, Dashboard, NotFound, Swap } from "../views";

import "./style.scss";
import useTokens from "../hooks/tokens";

function App() {
    const dispatch = useDispatch();

    const { provider, chainID, connected } = useWeb3Context();
    const address = useAddress();

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

    const { tokens } = useTokens();

    async function loadDetails(whichDetails: string) {
        let loadProvider = provider;

        if (whichDetails === "app") {
            loadApp(loadProvider);
        }

        if (whichDetails === "account" && address && connected) {
            loadAccount(loadProvider);
            if (isAppLoaded) return;

            loadApp(loadProvider);
        }
    }

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        },
        [connected],
    );

    const loadAccount = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected],
    );

    useEffect(() => {
        loadDetails("app");
        loadDetails("account");
    }, [connected]);

     if (isAppLoading) return <Loading />;

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/dashboard">
                    <Dashboard />
                </Route>

                <Route exact path="/">
                    <Redirect to="/dashboard" />
                </Route>
{/* 
                <Route path="/calculator">
                    <Calculator />
                </Route> */}

                <Route path="/account">
                    <Account />
                </Route>

                <Route path="/swap">
                    <Swap/>
                </Route>

                {/* <Route path="/analytics">
                    <Analytics/>
                </Route> */}

                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
