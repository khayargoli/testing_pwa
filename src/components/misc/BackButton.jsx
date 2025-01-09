import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = ({ styles, handlerFunction }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (handlerFunction) handlerFunction();
    else navigate(-1); // -1 is used to go back to the previous page
  };

  return (
    <a onClick={handleGoBack} className="back" style={styles}>
      &lt;
    </a>
  );
};

export default GoBackButton;
