
import React from 'react';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../CONTANTS';
import  BeeuLogo  from '../../assets/images/beeu-logo-minimal.png';

const baseURL = CONSTANTS.API_URL;

export default function Channel({ id, username, user_pic }) {
    const profilePicUrl = user_pic ? `${baseURL}/assets/${user_pic}` : BeeuLogo; // Adjust the default avatar path if needed

    return (
        <div className="channel">
            <Link 
                to={`/profile-public?user=${id}`}
                className="avatar"
                style={{ backgroundImage: `url(${profilePicUrl})` }}
            />
            <span>@{username}</span>
        </div>
    );
}