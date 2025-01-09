import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeeuLogo } from '../../components/misc/BeeuLogo';
import GuestFooter from '../../components/video/GuestFooter';
import homeGif from '/src/assets/images/home-gif.gif';
import { VideoPlayer } from '../../components/video/VideoPlayer';

export function Home() {
  const [isSwiping, setIsSwiping] = useState(false);
  const navigate = useNavigate();
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = e => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = e => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current - touchEndY.current > 50) {
      setIsSwiping(true);
      setTimeout(() => {
        navigate('/feed');
      }, 300); // Duration should match the CSS transition duration
    }
  };

  return (
    <div className="home">
      <div className="welcome">
        welcome to
        <BeeuLogo to="about" text="about" />
      </div>

      <div
        className={`halfvideocontainer ${isSwiping ? 'swipe-up' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => navigate('/feed')}
      >
        {/* <div className="cover" style={{ zIndex: '999' }}></div> */}
        {/* <VideoPlayer hideHeader={true} /> */}
        <img
          src={homeGif}
          alt="Home Gif"
          style={{ width: '100%', position: 'absolute', bottom: 0, left: 0 }}
        />
      </div>
      <GuestFooter />
    </div>
  );
}
