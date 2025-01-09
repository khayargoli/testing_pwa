import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="foot">
      <Link to="#">© BeeU.fun 2024 by thü</Link>
      <Link to="/about"> · about</Link>
      <Link to="/contact"> · contact</Link>
      <Link to="/terms"> · terms</Link>
    </div>
  );
};

export default Footer;
