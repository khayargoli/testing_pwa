
import React from 'react';
import { Clip } from './Clip';

export default function ClipList({ clips }) {
    return (
        <ul className="searchresults-clips" id="searchresultsClips">
            {clips.map((clip, i) => (
                <Clip key={i} {...clip} />
            ))}
        </ul>
    );
}
