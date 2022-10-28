import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TimeMenu from "./time-menu";
import ConnectButton from "./connect-button";
import { TRANSITION_DURATION } from "../../constants/style";
import LogoImg from "../../assets/icons-evoki/evoki-logo.png";
import coinImg from "../../assets/image/coin.png";
import Social from "../Drawer/drawer-content/social";
import { HiDotsVertical } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import "./header.scss";
import { Link } from "@material-ui/core";

interface IHeader {
    handleDrawerToggle: () => void;
    drawe?: boolean;
}

const useStyles = makeStyles(theme => ({
    topBar: {
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#010901",
        width: "100%",
        padding: "30px 0",
        zIndex: 10,
        borderBottom: "2px solid #4d94e4",
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function Header({ handleDrawerToggle }: IHeader) {
    const is960 = useMediaQuery("(max-width: 960px)");
    const is600 = useMediaQuery("(max-width: 600px)");
    const classes = useStyles();

    return (
        <div className={classes.topBar}>
            <div className="dapp-topbar">
                {is960 ? (
                    <div
                        style={{ backgroundColor: "#3d90f8", height: "50px", cursor: "pointer", padding: "10px", fontSize: "30px", borderRadius: "5px", color: "white" }}
                        onClick={handleDrawerToggle}
                    >
                        <IoMenu />
                    </div>
                ) : (
                    <Link href="https://evoki.com" target="_blank"> 
                        <div className="dapp-topbar-slider-btn">                                                    
                            EVOKI                                        
                        </div>
                    </Link>  
                )}
                <div className="dapp-topbar-btns-wrap">
                    {!is960 && <Social />}
                    {!is600 && <TimeMenu />}
                    <ConnectButton />
                </div>
            </div>
        </div>
    );
}

export default Header;
