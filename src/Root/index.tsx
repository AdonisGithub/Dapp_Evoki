import { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";
// import { MoralisProvider } from "react-moralis"; 

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

     if (loading) return <Loading />;

    // const app = () => (
    //     <MoralisProvider serverUrl="https://9auzovtqtfmu.usemoralis.com:2053/server" appId="TqOWZ39b4Vzd94lSmHW6MX815gooWqzVq3aE0vRJ">
    //         <HashRouter>
    //             <App />
    //         </HashRouter>
    //     </MoralisProvider>
    // );
    const app = () => (
            <HashRouter>
                <App />
            </HashRouter>
    );

    return app();
}

export default Root;
