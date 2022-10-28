import { SvgIcon, Link } from "@material-ui/core";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://twitter.com/evokiprotocol" target="_blank">
                <FaTwitter size = "30px"/>
            </Link>

            <Link href="https://discord.gg/j9QevRS7nw" target="_blank">
                <FaDiscord size = "30px"/>
            </Link>

            <Link href="https://t.me/evokiprotocol" target="_blank">
                <FaTelegramPlane size = "30px"/>
            </Link>

            <Link href="https://evoki.medium.com/" target="_blank">
                <BsMedium size = "30px"/>
            </Link>
        </div>
    );
}
