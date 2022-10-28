import React, { useState } from "react";
import "./view-base.scss";
import Header from "../Header";
import { Hidden, makeStyles, useMediaQuery } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import MobileDrawer from "../Drawer/mobile-drawer";
import Drawer from "../Drawer";
import { cubesImage } from "src/constants/img";
import Messages from "../Messages";

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        position: "fixed",
        top: 0,
        left: 0,
        maxWidth: "250px",
        marginLeft: "20px",
        width: "100%",
        borderRight: "2px solid #4d94e4",
        // borderLeft: "2px solid #0b6a0e",
    },
    content: {
        paddingTop: "123px",
        paddingLeft: "270px",
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        width: "100%",
        height: "100vh",
        overflow: "auto",
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        paddingLeft: 0,
    },
}));

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isSmallerScreen = useMediaQuery("(max-width: 960px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className="view-base-root">
            <Header handleDrawerToggle={handleDrawerToggle} />
            <div className={classes.drawer}>
                <Hidden mdUp>
                    <MobileDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                </Hidden>
                <Hidden smDown>
                    <Drawer />
                </Hidden>
            </div>
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
                {!isSmallerScreen && (
                    <div className="cubes-top">
                        <p>{cubesImage}</p>
                    </div>
                )}
                {!isSmallScreen && (
                    <div className="cubes-bottom">
                        <p>{cubesImage}</p>
                    </div>
                )}
                <div className="content-wrapper">{children}</div>
            </div>
        </div>
    );
}

export default ViewBase;
