import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";
import { DRAWER_WIDTH } from "../../constants/style";

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        backgroundColor: "#00000080",
        backdropFilter: "blur(10px)",
        width: DRAWER_WIDTH,
        borderRight: 0,
        zIndex: 9,
    },
}));

interface INavDrawer {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

function NavDrawer({ mobileOpen, handleDrawerToggle }: INavDrawer) {
    const classes = useStyles();

    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onClick={handleDrawerToggle}
            classes={{
                paper: classes.drawerPaper,
            }}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <DrawerContent />
        </Drawer>
    );
}

export default NavDrawer;
