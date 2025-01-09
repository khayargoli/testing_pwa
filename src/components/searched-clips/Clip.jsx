import { Link } from "react-router-dom";

export function Clip({ topic, backgroundImage }) {
    return (
        <Link to="#">
            <li style={{ backgroundImage: `url(${backgroundImage})` }}>
                <p>{topic}</p>
            </li>
        </Link>
    );
}