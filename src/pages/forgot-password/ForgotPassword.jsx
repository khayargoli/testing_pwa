import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeeuLogo } from '../../components/misc/BeeuLogo';

import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../api/apiClient';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import Footer from '../../components/misc/Footer';
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from '../../slices/page/pageStatusSlice';
import { FaCheckCircle } from 'react-icons/fa';
import GoBackButton from '../../components/misc/BackButton';

export function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email('Please enter a valid email address')
        .required('Please fill in your email address'),
    }),
    onSubmit: async values => {
      setIsLoading(true);
      dispatch(startLoading());
      const formData = new FormData();
      formData.append('email', values.email);

      try {
        const response = await forgotPassword(formData);
        console.log(response);

        if (response.status === 200) {
          dispatch(loadingSuccess());
          toast.success('Password change link sent to email!', {
            icon: <FaCheckCircle style={{ color: '#41C0EB' }} />, // Tick icon with info color
            progressStyle: { backgroundColor: '#F9B400' }, // Custom progress bar color
          });

          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        if (error.code === 'ERR_BAD_REQUEST') {
          dispatch(loadingFailed('No user exists with this email.'));
          toast.error('No user exists with this email.');
        } else {
          dispatch(loadingFailed('Error sending change password link.'));
          toast.error('Error sending change password link.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <GoBackButton />
      <div className="about">
        <BeeuLogo />
        <br />
        <p className="title">Forgot Password</p>
        <p
          style={{
            fontFamily: 'bregular',
            fontSize: '16px',
            lineHeight: '1.2',
          }}
        >
          Please provide the email so that we can send you the link to change
          password
        </p>
        <form
          className="profile"
          id="login-form"
          onSubmit={formik.handleSubmit}
        >
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error text-danger">{formik.errors.email}</div>
          ) : null}

          <div className="center" style={{ marginTop: '36px' }}>
            <button className="button1" type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
