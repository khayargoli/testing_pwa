// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BeeuLogo } from "../../components/misc/BeeuLogo";

// import { useDispatch } from "react-redux";
// import { setUserDetails } from "../../slices/user/userSlice";
// import { login, getUserDeatils } from "../../api/apiClient";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { toast } from "react-toastify";

// import Footer from "../../components/misc/Footer";
// import beeuLogo from "/src/assets/images/beeu-logo.png";
// import { loadingFailed, loadingSuccess, startLoading } from "../../slices/page/pageStatusSlice";

// export function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false); // State to manage loading state of button

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       remember: true, // Set the initial value to true for checked state
//     },
//     validationSchema: yup.object({
//       email: yup
//         .string()
//         .email("Please enter a valid email address")
//         .required("Please fill in your email address"),
//       password: yup.string().required("Please enter your password"),
//     }),
//     onSubmit: async (values) => {
//       setIsLoading(true); // Enable loading state on button click
//       dispatch(startLoading());
//       const formData = new FormData();
//       formData.append("email", values.email);
//       formData.append("password", values.password);
//       formData.append("status", 1);

//       try {
//         const response = await login(formData);

//         if (response.data.code === 200) {
//           dispatch(loadingSuccess());
//           await localStorage.setItem("token", response.data.jwt);
//           toast.success("Login successful!");
//           navigate("/feed");
//         } else {
//           dispatch(loadingFailed(response.data.message));
//           toast.error(response.data.message);
//         }
//       } catch (error) {
//         dispatch(loadingFailed("Error during login"));
//         toast.error("Error during login");
//       } finally {
//         setIsLoading(false); // Disable loading state after API call completes
//       }
//     },
//   });

//   return (
//     <>
//       <Link to="/" className="back">
//         &lt;
//       </Link>
//       <div className="about">
//         <BeeuLogo />
//         <br />
//         <p className="title">login</p>
//         <form
//           className="profile"
//           id="login-form"
//           onSubmit={formik.handleSubmit}
//         >
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="email"
//             required
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.email}
//           />
//           {formik.touched.email && formik.errors.email ? (
//             <div className="error text-danger">{formik.errors.email}</div>
//           ) : null}

//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="password"
//             required
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.password}
//           />
//           {formik.touched.password && formik.errors.password ? (
//             <div className="error text-danger">{formik.errors.password}</div>
//           ) : null}

//           <p style={{ textAlign: "right" }}>
//             <Link to="reset-password" className="label">
//               I've lost my password
//             </Link>
//           </p>

//           <div className="center">
//             <button className="button1" type="submit" disabled={isLoading}>
//               {isLoading ? "Please wait..." : "login"}
//             </button>
//           </div>
//           <div className="label" htmlFor="remember">
//             <input
//               type="checkbox"
//               id="remember"
//               name="remember"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               checked={formik.values.remember} // Bind checked state to formik values
//             />{" "}
//             Remember this device?
//           </div>
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeeuLogo } from "../../components/misc/BeeuLogo";

import { useDispatch } from "react-redux";
import { setUserDetails } from "../../slices/user/userSlice";
import { login, getUserDeatils } from "../../api/apiClient";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

import Footer from "../../components/misc/Footer";
import beeuLogo from "/src/assets/images/beeu-logo.png";
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from "../../slices/page/pageStatusSlice";
import { FaCheckCircle } from "react-icons/fa";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    shoutOut();
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Please fill in your email address"),
      password: yup.string().required("Please enter your password"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(startLoading());
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("status", 1);

      try {
        const response = await login(formData);

        if (response.data.code === 200) {
          dispatch(loadingSuccess());
          await localStorage.setItem("token", response.data.jwt);
          toast.success("Login successful!", {
            icon: <FaCheckCircle style={{ color: "#41C0EB" }} />, // Tick icon with info color
            progressStyle: { backgroundColor: "#F9B400" }, // Custom progress bar color
          });

          // Fetch user details after setting the token
          const response_user_Details = await getUserDeatils();
          if (response_user_Details.data?.code === 200) {
            dispatch(setUserDetails(response_user_Details.data.data));
          }

          console.log("userdata------------------->", response_user_Details);

          if (response_user_Details?.data?.data?.deleted_at)
            toast.error(
              "Your account will be deleted within 24 hours. Please download your data before it is removed. Contact the support team for assistance.",
              {
                autoClose: "1500",
              }
            );

          navigate('/feed');
        } else {
          dispatch(loadingFailed(response.data.message));
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(loadingFailed("Error during login"));
        toast.error("Error during login");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Link to="/" className="back">
        &lt;
      </Link>
      <div className="about">
        <BeeuLogo />
        <br />
        <p className="title">login</p>
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

          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error text-danger">{formik.errors.password}</div>
          ) : null}

          <p style={{ textAlign: "right" }}>
            <Link to="/forgot-password" className="label">
              I've lost my password
            </Link>
          </p>

          <div className="center">
            <button className="button1" type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : "login"}
            </button>
          </div>
          <div className="label" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.remember}
            />{" "}
            Remember this device?
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
