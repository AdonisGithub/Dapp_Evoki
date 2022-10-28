import React, { useState, useRef, useEffect } from "react";
import { Tooltip, Modal, Box } from "@material-ui/core";

import { AiOutlineReload, AiOutlineQuestionCircle, AiOutlineArrowDown } from "react-icons/ai";

import { IoSettingsSharp, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowDownUp } from "react-icons/bs";
import bnbIcon from "../../assets/icons-evoki/bnb-icon.svg";
import evokiIcon from "../../assets/icons-evoki/evoki-logo.png";
import "./swap.scss";
import { useWeb3Context } from "src/hooks";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { getMarketPrice } from "src/helpers";
import { trim } from "src/helpers";
import { getReserve } from "src/helpers";
import { approveEvoki, swap } from "../../store/slices/swap-slice";
import { Tokens } from "src/constants";

const tokens = [
    { key: "bnb", label: "BNB", icon: bnbIcon },
    { key: "evoki", label: "EVOKI", icon: evokiIcon },
];

const generalSetting = [
    { value: 5, label: "Standard (5)" },
    { value: 6, label: "Fast (6)" },
    { value: 7, label: "Instant (7)" },
];

const slipSetting = [
    { value: 0.1, label: "0.1%" },
    { value: 0.5, label: "0.5%" },
    { value: 1, label: "1.0%" },
];

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 420,
    width: "100%",
    color: "#fff ",
    border: "1px solid #4d94e4",
    background: "#010901",
    boxShadow: 24,
    p: 3,
    borderRadius: "16px",
};

const swapStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 650,
    width: "100%",
    color: "#fff ",
    border: "1px solid #4d94e4",
    background: "#010901",
    boxShadow: 24,
    p: 3,
    borderRadius: "16px",
};

const SwapPage = () => {

    const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context(); 

    const evokiBalance = useSelector<IReduxState, string>( state => {
        return state.account.balances.evoki;
    });
    const dispatch = useDispatch();

    const allowance = useSelector<IReduxState, string>(state => {
        return state.account.balances.allowance;
    });

    const bnbBalance = useSelector<IReduxState, string>( state => {
        return state.account.balances.bnb;
    });

    
    const [state, setState] = useState<any>({ from: "", to: "" });
    const [hovered, setHovered] = useState(false);
    const [to, setTo] = useState({ key: "evoki", label: "EVOKI", icon: evokiIcon });
    const [from, setFrom] = useState({ key: "bnb", label: "BNB", icon: bnbIcon });
    const [settingModal, setSettingModal] = useState(false);
    const [general, setGeneral] = useState(generalSetting[0].value);
    const [swapModal, setSwap] = useState(false);
    const [slip, setSlip] = useState(slipSetting[0].value);
    const [priceImpact, setPriceImpact] = useState("0");
    const [reserves,setReserve] = useState<any>();
    const [isApproved,setIsApproved] = useState(false);
    const [slipError, setSlipError] = useState("");

    useEffect(() => {
        async function getChainData() {
            let reserve = await getReserve(chainID,provider);
            setReserve(reserve);
        }
        getChainData();
    },[]);

    useEffect(() => {
        if(Number(allowance) >= Number(state.from))
            setIsApproved(true);
        else setIsApproved(false);
    },[allowance,state.from])

    const getOutput = (amount_in:number, token: string) : number => {
        let amount_out = 0;
        
        if(token === "evoki") {
            amount_out =  amount_in * (reserves[0] / Math.pow(10,18)) / (reserves[1]/Math.pow(10,5) + Number(amount_in));
        } else if(token === "bnb" ) {
            amount_out =  amount_in * (reserves[1] / Math.pow(10,5)) / (reserves[0]/Math.pow(10,18) + Number(amount_in));
        } 
        return amount_out;
    }

    const getPriceImpact = (amount_in:number, token: string) : number => {
        let price_impact = 0;
        if(token === "evoki") {
             price_impact = amount_in  / (reserves[1] / Math.pow(10,5) + Number(amount_in) );
        } else if(token === "bnb") {
            price_impact = amount_in  / (reserves[0] / Math.pow(10,18) + Number(amount_in) );
        }
        return price_impact;
    }

    
    const handleChange = async (e: any) => {
        if (!isNaN(e.target.value)) {
            if (e.target.name === "from"){
                if(from.key === "evoki") {
                    let price_impact = getPriceImpact(e.target.value, "evoki");
                    let amount_out = getOutput(e.target.value,"evoki");
                    setPriceImpact(trim(price_impact * 100,5));
                    setState({ from: e.target.value, to: trim(amount_out,5)});
                } else {
                    let price_impact = getPriceImpact(e.target.value, "bnb");
                    setPriceImpact(trim(price_impact * 100,5));
                    let amount_out = getOutput(e.target.value,"bnb");
                    setState({ from: e.target.value, to: trim(amount_out,5) });
                }
            } 
            else if (e.target.name === "to"){
                if(to.key === "bnb" ) {               
                    let amount_out = getOutput(e.target.value,"bnb");
                    let price_impact = getPriceImpact(amount_out, "evoki");
                    setPriceImpact(trim(price_impact * 100,5));                                       
                    setState({ to: e.target.value, from: trim(amount_out,5) });
                } else {                                        
                    let amount_out = getOutput(e.target.value,"evoki");
                    let price_impact = getPriceImpact(amount_out, "bnb");
                    setPriceImpact(trim(price_impact * 100,5));                                       
                    setState({ to: e.target.value, from: trim(amount_out,5) });
                }
            } 
        } 
    };

    const handleMaxClick = () => {
        if(from.key === "evoki") {
            let price_impact = getPriceImpact(Number(evokiBalance), "evoki");        
            setPriceImpact(trim(price_impact * 100,5));
            let amount_out = getOutput(Number(evokiBalance),"evoki");
            setState({from:evokiBalance, to:trim((amount_out),5)});
        } else if (from.key === "bnb")  {
            let price_impact = getPriceImpact(Number(bnbBalance), "bnb");                    
            setPriceImpact(trim(price_impact * 100,5));
            let amount_out = getOutput(Number(bnbBalance),"bnb");
            if(Number(bnbBalance)>=0.005)
                setState({from:(Number(bnbBalance)-0.005), to: trim((amount_out),5)});
            else
                setState({from:0, to: trim((amount_out),5)});
        }
    };

    const handleChangeClick = () => {

        setFrom(prev => (prev.key === "bnb" ? tokens.filter(item => item.key === "evoki")[0] : tokens.filter(item => item.key === "bnb")[0]));
        setTo(prev => (prev.key === "bnb" ? tokens.filter(item => item.key === "evoki")[0] : tokens.filter(item => item.key === "bnb")[0]));

        setState((prev: any) => ({ from: prev.to, to: prev.from }));
    };

    const handleDropdown = (state: string, key: string) => {
        if (state === "from" && from.key !== key) {
            setState((prev: any) => ({ from: prev.to, to: prev.from }));
        } else if (state === "to" && to.key !== key) {
            setState((prev: any) => ({ from: prev.to, to: prev.from }));
        }
        if (state === "from") {
            setFrom(tokens.filter(item => item.key === key)[0]);
            setTo(tokens.filter(item => item.key !== key)[0]);
            
        } else if (state === "to") {
            setFrom(tokens.filter(item => item.key !== key)[0]);
            setTo(tokens.filter(item => item.key === key)[0]);            
        }
    };

    const handleSetttingClose = () => {
        if(slip == 0)
            setSlip(0);
        setSettingModal(false);
    };

    const handleSwapClose = () => {
        setSwap(false);
    };

    const handleSwap = () => {
        if(!connected) {
            connect();
            return;
        }
        if (!state.from || state.to === "0" || state.from === "0") return;
        if (slip >= 50) {
            window.confirm("set valid slippage");
             return;
        }
        if ((from.key === "bnb" && Number(state.from) > Number(bnbBalance)) || (from.key === "evoki" && Number(state.from) > Number(evokiBalance))) return;
        if (from.key==="evoki"&&!isApproved) handleApprove();
        else handleSwapConfirm();
    };

    const handleApprove = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(approveEvoki({address,networkID:chainID,provider,amount:state.from,evokiBalance,token:Tokens.EVOKI}));
        return;
    }

    const handleSwapConfirm = async () => {
        if (await checkWrongNetwork()) return;
        if(from.key === "evoki"){
            dispatch(swap({address, networkID:chainID,provider,amount:state.from,evokiBalance,token:Tokens.EVOKI}));
        } else if (from.key === "bnb"){
            dispatch(swap({address, networkID:chainID,provider,amount:state.from,evokiBalance,token:Tokens.BNB}));
        }
       // setSwap(false);
    };

    const handleSlipChange = (e: any) => {
        if (!isNaN(e.target.value)) {
            setSlip(e.target.value);
            if(Number(e.target.value) >= 50) {
                setSlipError("Enter a valid slippage percentage");
            } else if (Number(e.target.value) > 5) {
                setSlipError("Your transaction may be frontrun");                
            } else {
                setSlipError("")
            }
        }
    }

    return (
        <div className="swap-card-wrapper">
            <div className="swap-card-content">
                <div className="swap-content">
                    <div className="swap-header">
                        <div className="main-header">
                            <h2>S w a p</h2>
                            <div className="header-toolbox">
                                <AiOutlineReload size={25} />
                                <IoSettingsSharp size={25} onClick={() => setSettingModal(true)} />
                            </div>
                        </div>
                        <div className="sub-header">Fast, Secure, KYC-Free.</div>
                    </div>
                    <div>
                        <div className="input-box">
                            <p>
                                From:
                                <span>{(from.key ==="evoki")?`Balance: ${evokiBalance}`:`Balance: ${trim(Number(bnbBalance),6)}`}</span>
                            </p>
                            <div className="input-section">
                                <input type="text" placeholder="0.00" name="from" value={state.from} onChange={handleChange} autoComplete="off"/>
                                <span onClick={handleMaxClick}>Max</span>
                                <Dropdown data={from} onClick={(key: any) => handleDropdown("from", key)} />
                            </div>
                        </div>
                        <div className="exchange-button" onClick={handleChangeClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                            {hovered ? <BsArrowDownUp size={16} color="#fff" /> : <AiOutlineArrowDown color="#3598f2" size={20} />}
                        </div>
                        <div className="input-box">
                            <p>
                                To:
                                <span>{(to.key ==="evoki")?`Balance: ${evokiBalance}`:`Balance: ${trim(Number(bnbBalance),6)}`}</span>
                            </p>
                            <div className="input-section">
                                <input type="text" name="to" placeholder="0.00" value={state.to} onChange={handleChange} autoComplete="off"/>
                                <Dropdown data={to} onClick={(key: any) => handleDropdown("to", key)} />
                            </div>
                        </div>
                        <div className="setting-status">
                            <p>Slippage Tolerance</p>
                            <span>{trim(slip,3)}%</span>
                        </div>
                                                 
                        <div className="swap-button" onClick={handleSwap}>
                            {!connected?"Connect Wallet": (!state.from || state.to === "0" || state.from === "0")?"Insufficient Amount":((from.key === "bnb" && Number(state.from) > Number(bnbBalance)) || (from.key === "evoki" && Number(state.from) > Number(evokiBalance)) )? "Insufficient Balance": (from.key==="evoki" && !isApproved)  ? "Approve" : "Swap"}
                        </div>
                    
                        <div className="swap-details">
                            <p>
                                <span>
                                    Minimum received
                                    <Tooltip title="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." placement="top-end">
                                        <span>
                                            <AiOutlineQuestionCircle size={16} />
                                        </span>
                                    </Tooltip>
                                </span>
                                <span>{trim(Number(state.to) * (1- slip/100),5)} {to.label}</span>
                            </p>
                            <p>
                                <span>
                                    Price Impact
                                    <Tooltip title="The difference between the market price and estimated price due to trade size." placement="top-end">
                                        <span>
                                            <AiOutlineQuestionCircle size={16} />
                                        </span>
                                    </Tooltip>
                                </span>
                                <span>{priceImpact}%</span>
                            </p>
                            <p>
                                <span>
                                    Liquidity Provider Fee
                                    <Tooltip title="For each trade a 0.25% fee is paid - 0.17% to LP token holders - 0.08% to the Treasury" placement="top-end">
                                        <span>
                                            <AiOutlineQuestionCircle size={16} />
                                        </span>
                                    </Tooltip>
                                </span>
                                <span>0% - No Fee</span>
                            </p>
                            <p>
                                <span>
                                    Route
                                    <Tooltip title="Routing through these tokens resulted in the best price for your trade." placement="top-end">
                                        <span>
                                            <AiOutlineQuestionCircle size={16} />
                                        </span>
                                    </Tooltip>
                                </span>
                                <span>{"EVOKI < -- > BNB"}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={settingModal} className="swap-modal" onClose={handleSetttingClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className="close-button">
                        <IoClose color="#fff" size={20} onClick={handleSetttingClose} />
                    </div>
                    <h1 className="modal-title">Setting</h1>
                    <h3 className="modal-subtitle">General</h3>
                    <p className="modal-text">
                        {"Default Transaction Speed (GWEI)"}
                        <Tooltip title="Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees" placement="top-start">
                            <span>
                                <AiOutlineQuestionCircle size={20} />
                            </span>
                        </Tooltip>
                    </p>
                    <div className="general-group">
                        {generalSetting.map((item, key) => (
                            <p key={key} className={item.value === general ? "_active" : ""} onClick={() => setGeneral(item.value)}>
                                {item.label}
                            </p>
                        ))}
                    </div>
                    <h3 className="modal-subtitle">{"SWAPS & LIQUIDITY"}</h3>
                    <p className="modal-text">
                        {"Slippage Tolerance"}
                        <Tooltip
                            title="Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution."
                            placement="top-start"
                        >
                            <span>
                                <AiOutlineQuestionCircle size={20} />
                            </span>
                        </Tooltip>
                    </p>
                    <div className="general-group">
                        {slipSetting.map((item, key) => (
                            <p key={key} className={item.value === slip ? "_active" : ""} onClick={() => setSlip(item.value)}>
                                {item.label}
                            </p>
                        ))}
                        <input type="text" placeholder={String(slip)} value={slip} onChange={handleSlipChange} className="slip-input"/>%
                    </div>
                    {slipError && <p className={(Number(slip) > 5) ? Number(slip) > 50 ? "slip-warning" : "slip-error" : ""}>{slipError}</p>}
                </Box>
            </Modal>
            <Modal open={swapModal} onClose={handleSwapClose} className="swap-modal" aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={swapStyle}>
                    <div className="close-button">
                        <IoClose color="#fff" size={20} onClick={handleSwapClose} />
                    </div>
                    <h1 className="modal-title">Confirm Swap</h1>
                    <div className="swap-token-status">
                        <div className="token-icon">
                            <img src={from.key === "bnb" ? bnbIcon : evokiIcon} alt="" />
                            <span>{state.from}</span>
                        </div>
                        <p>{from.label}</p>
                    </div>
                    <AiOutlineArrowDown color="#3598f2" size={20} />
                    <div className="swap-token-status">
                        <div className="token-icon">
                            <img src={to.key === "bnb" ? bnbIcon : evokiIcon} />
                            <span>{state.to}</span>
                        </div>
                        <p>{to.label}</p>
                    </div>
                    <div className="swap-details">
                        <p>
                            <span>
                                Minimum received
                                <Tooltip title="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." placement="top-end">
                                    <span>
                                        <AiOutlineQuestionCircle size={16} />
                                    </span>
                                </Tooltip>
                            </span>
                            <span>{trim(Number(state.to) * (1- slip/100),5)} {to.label}</span>
                        </p>
                        <p>
                            <span>
                                Price Impact
                                <Tooltip title="The difference between the market price and estimated price due to trade size." placement="top-end">
                                    <span>
                                        <AiOutlineQuestionCircle size={16} />
                                    </span>
                                </Tooltip>
                            </span>
                            <span>{priceImpact}%</span>
                        </p>
                        <p>
                            <span>
                                Route
                                <Tooltip title="Routing through these tokens resulted in the best price for your trade." placement="top-end">
                                    <span>
                                        <AiOutlineQuestionCircle size={16} />
                                    </span>
                                </Tooltip>
                            </span>
                            <span>{"EVOKI < -- > BNB"}</span>
                        </p>
                    </div>
                    <div className="swap-button" style={{ marginTop: "20px" }} onClick={handleSwapConfirm}>
                        S W A P 
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const Dropdown = ({ data, onClick }: any) => {
    const ref = useRef<any>(null);
    const [active, setActive] = useState(false);
    useEffect(() => {
        window.addEventListener("mousedown", handleOutClick);
        return () => {
            window.removeEventListener("mousedown", handleOutClick);
        };
    }, []);

    const handleOutClick = (e: any) => {
        if (ref.current && ref.current.contains(e.target)) {
            return;
        }
        setActive(false);
    };

    const handleClick = (key: string) => {
        onClick(key);
        setActive(false);
    };

    const handleDropdown = () => {
        setActive(prev => !prev);
    };

    return (
        <div className="dropdown-wrapper" ref={ref}>
            <div className="dropdown-selection" onClick={handleDropdown}>
                <div>
                    <img src={data.icon} alt="" />
                </div>
                <p>{data.label}</p>
                <IoIosArrowDown />
            </div>
            {active && (
                <div className="dropdown-content">
                    {tokens.map((item, key) => (
                        <div key={key} className="dropdown-list" onClick={() => handleClick(item.key)}>
                            <img src={item.icon} alt="" />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SwapPage;
