import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";


export function Header() {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const searchRef = useRef();
    const timeoutRef = useRef();
    const navigate = useNavigate();

    const topic = useSelector(state => state.feed.currentPlaying.topic);

    useEffect(() => {
        if (expanded) searchRef.current.focus();
    }, [searchRef.current, expanded]);


    // redirects with debouncing
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (query) navigate(`/search-results?search=${query}`);
        }, 1500);

        return () => clearTimeout(timeoutRef.current);
    }, [timeoutRef.current, query]);

    const toggeSearchBox = () => setExpanded(!expanded);
    const handleInput = (e) => setQuery(e.target.value);

    return (
        <div className="topic">
            <p id="currentFeedVideoTopic" className="randomize">{topic || "Feed"}</p>
            {/* TODO: REMOVE THE BELOW COMMENT TO ENABLE SEARCH */}
            {/* <input
                onClick={toggeSearchBox}
                onInput={handleInput}
                className={`search search-box ${expanded ? "expanded" : "collapsed"}`}
                type="text"
                id="search"
                placeholder="search on BeeU..."
                ref={searchRef}
            /> */}
        </div>
    );
}