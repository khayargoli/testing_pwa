import React, { useState } from 'react';
import { BeeuLogo } from '../../components/misc/BeeuLogo';
import GoBackButton from '../../components/misc/BackButton';
import Footer from '../../components/misc/Footer';
import { verifcation } from '../../api/apiClient';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const Verification = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const location = useLocation();
  const { state } = location;

  const handleSubmit = e => {
    e.preventDefault();
    const otp = code.join('');
    if (otp.length === 4) {
      setLoading(true); // Set loading state to true during API call

      const formData = new FormData();
      formData.append('code', otp);
      formData.append('user_id', parseInt(state.data));

      verifcation(formData)
        .then(response => {
          if (response.data.status === 'Ok') {
            toast.success('Registration Successful. Redirecting...', {
              icon: <FaCheckCircle style={{ color: '#41C0EB' }} />, // Tick icon with info color
              progressStyle: { backgroundColor: '#F9B400' }, // Custom progress bar color
            });
            setTimeout(
              () => navigate('/', { state: { verificationSuccess: true } }),
              2000
            );
          } else if (response.data.status === 'Error') {
            const { message } = response.data;
            toast.error(`Error: ${message}`);
          } else {
            const { message } = response.data;
            toast.info(message);
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            toast.error(`Error: ${message}`);
          } else {
            toast.error('An error occurred. Please try again.');
          }
        })
        .finally(() => {
          setLoading(false); // Set loading state back to false after API call
        });
    } else {
      toast.warn('Please enter a 4-digit code.');
    }
  };

  return (
    <>
      <GoBackButton />
      <div className="about">
        <BeeuLogo to="/" />
        <br />
        <p className="title">Check your email</p>
        <form className="code" id="email-check-form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex' }}>
            {code.map((digit, index) => (
              <input
                style={{ width: '100%' }}
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleInputChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <div className="label">
            You got an email with a confirmation number (also check your spam
            folder if you do not see it in your inbox).
          </div>
          <div className="center">
            <button type="submit" className="button1" disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
      <div className="space30" />
      <Footer />
    </>
  );
};

export default Verification;
