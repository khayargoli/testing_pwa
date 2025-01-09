
import React from 'react';
import Channel from './Channel';
import { Link } from 'react-router-dom';

export default function ChannelsList({ channels }) {
    return ( 
        <div className="searchresults" id="searchresults">
           
            {channels.map((channel) => (
                <Channel key={channel.username} {...channel} />
            ))}
        </div>
    );
}
