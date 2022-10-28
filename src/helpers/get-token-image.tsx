import EvokiImg from "../assets/icons-evoki/favicon.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name == "evoki") {
        return toUrl(EvokiImg);
    }
    throw Error(`Token url doesn't support: ${name}`);
}
