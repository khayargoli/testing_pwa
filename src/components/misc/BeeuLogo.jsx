import { Link } from "react-router-dom";
import beeuLogo from "/src/assets/images/beeu-logo.png";

export function BeeuLogo({ to = "/", text="" }) {
    return (
        <Link to={to}>
            <img src={beeuLogo} className="logo" alt="BeeU Logo" />
            {text}
        </Link>
    );
}
