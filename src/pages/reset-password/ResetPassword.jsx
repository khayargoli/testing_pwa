import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BeeuLogo } from '../../components/misc/BeeuLogo';

import { useDispatch } from 'react-redux';
import { resetPassword } from '../../api/apiClient';
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

export function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('token')) {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const formik = useFormik({
    initialValues: {
      password: '',
      cpassword: '',
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .min(
          8,
          'Password must have at least 8 characters, mixed case letters, and numbers'
        )
        .required('Password is required'),
      cpassword: yup
        .string()
        .oneOf(
          [yup.ref('password'), null],
          'Passwords and confirm password must be the same'
        )
        .required('Please enter Confirm Password'),
    }),
    onSubmit: async values => {
      setIsLoading(true);
      dispatch(startLoading());
      const formData = new FormData();
      formData.append('password', values.password);
      formData.append('password_confirmation', values.cpassword);
      formData.append('token', searchParams.get('token'));
      formData.append('email', searchParams.get('email'));

      try {
        const response = await resetPassword(formData);
        console.log(response);

        if (response.status === 200) {
          dispatch(loadingSuccess());
          toast.success('Password changed successfully!', {
            icon: <FaCheckCircle style={{ color: '#41C0EB' }} />, // Tick icon with info color
            progressStyle: { backgroundColor: '#F9B400' }, // Custom progress bar color
          });

          navigate('/login');
        }
      } catch (error) {
        if (error.response.status === 498) {
          dispatch(loadingFailed('Link expired. Please request a new one.'));
          toast.error('Link expired. Please request a new one.');
        } else {
          dispatch(loadingFailed('Error Changing Password.'));
          toast.error('Error Changing Password.');
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
        <p className="title">Reset Password</p>
        <p
          style={{
            fontFamily: 'bregular',
            fontSize: '16px',
            lineHeight: '1.2',
          }}
        >
          Please create a new password
        </p>
        <form
          className="profile"
          id="login-form"
          onSubmit={formik.handleSubmit}
        >
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
            placeholder="password"
            disabled={isLoading} // Disable input during loading
          />
          <br />
          {formik.touched.password && formik.errors.password && (
            <span className="text-danger">{formik.errors.password}</span>
          )}
          <input
            type="password"
            value={formik.values.cpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="password-check"
            name="cpassword"
            placeholder="repeat password"
            disabled={isLoading} // Disable input during loading
          />
          <br />
          {formik.touched.cpassword && formik.errors.cpassword ? (
            <span className="text-danger">{formik.errors.cpassword}</span>
          ) : (
            <div className="label">
              Password must have at least 8 characters, mixed case letters and
              numbers
            </div>
          )}

          <div className="center" style={{ marginTop: '36px' }}>
            <button className="button1" type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
