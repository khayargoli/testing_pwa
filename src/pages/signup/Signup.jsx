import React, { useState, useEffect } from "react";
import { BeeuLogo } from "../../components/misc/BeeuLogo";
import { getLanguages, getRegions, getRegistered } from "../../api/apiClient";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Footer from "../../components/misc/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from "../../slices/page/pageStatusSlice";
import GoBackButton from "../../components/misc/BackButton";
import CONSTANTS from "../../CONTANTS";
import { FaCheckCircle } from "react-icons/fa";

export function Signup() {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [regions, setRegions] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitPressed, setSubmitPressed] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.pageStatus.loading); // Redux loading state

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1914 + 1 }, (v, i) => ({
    label: 1914 + i,
    value: 1914 + i,
    name: "birthyear",
  }));

  useEffect(() => {
    getLanguages().then((res) => {
      const { data } = res.data;
      const final = data.map((l) => ({
        label: l.language_name,
        value: l.language_name,
        id: l.id,
        name: "language",
      }));
      setLanguages(final);
    });
    getRegions().then((res) => {
      const { data } = res.data;
      const final = data.map((l) => ({
        label: l.regions_name,
        value: l.regions_name,
        id: l.id,
        name: "region",
      }));
      setRegions(final);
    });
  }, []);

  // Formik Utility functions
  const getExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase();
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const {
    SIGNUP: { MAX_USERNAME_LENGTH, MAX_BIO_LENGTH },
  } = CONSTANTS;

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
      avatar: null,
      birthyear: "",
      language: "",
      region: "",
      about: "",
      keywords: "",
      terms: false,
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(
          MAX_USERNAME_LENGTH,
          `Username must be at most ${MAX_USERNAME_LENGTH} characters long`
        )
        .required("Please enter your name"),
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Please fill in your email address"),
      password: yup
        .string()
        .min(
          8,
          "Password must have at least 8 characters, mixed case letters, and numbers"
        )
        .required("Password is required"),
      cpassword: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Passwords and confirm password must be the same"
        )
        .required("Please enter Confirm Password"),
      birthyear: yup.string().required("Please select Date of birth"),
      language: yup.string().required("Please select Language"),
      region: yup.string().required("Please select Region"),
      about: yup
        .string()
        .max(MAX_BIO_LENGTH, `Bio cannot be greater than ${MAX_BIO_LENGTH}`)
        .required("Please enter bio"),
      keywords: yup.string().required("Please enter Keywords"),
      terms: yup.boolean().oneOf([true], "Please accept the terms"),
      avatar: yup
        .mixed()
        .test({
          message: "Invalid Image (Only jpg, png allowed)",
          test: (file, context) => {
            const isValid = ["png", "jpg", "jpeg"].includes(
              getExtension(file?.name)
            );
            if (!isValid) context?.createError();
            return isValid;
          },
        })
        .test({
          message: `File too big, can't exceed ${
            MAX_FILE_SIZE / (1024 * 1024)
          } MB`,
          test: (file) => {
            const isValid = file?.size < MAX_FILE_SIZE;
            return isValid;
          },
        })
        .required("Please fill in avatar"),
    }),
    onSubmit: async (values) => {
      dispatch(startLoading()); // Dispatch action to start global loading

      const formData = new FormData();
      const keys = Object.keys(values).map((k) =>
        k === "birthyear" ? "year" : k
      );

      const v = Object.values(values);
      keys.forEach((k, idx) => {
        if (k === "avatar") {
          formData.append("user_pic", values.avatar, values.avatar.name); // Append the avatar file
        } else {
          formData.append(
            k,
            k === "language" || k === "region"
              ? getIdFromName(k === "language" ? languages : regions, v[idx])
              : v[idx]
          );
        }
      });

      try {
        const response = await getRegistered(formData).then(
          (data) => data.data
        );

        if (response.code === 200) {
          dispatch(loadingSuccess()); // Dispatch action to indicate successful loading
          toast.success("Signup successful!", {
            icon: <FaCheckCircle style={{ color: "#41C0EB" }} />, // Tick icon with info color
            progressStyle: { backgroundColor: "#F9B400" }, // Custom progress bar color
          });
          navigate("/verify", { state: response });
        } else {
          const errors = Object.keys(response.data)
            .reduce((acc, key) => {
              return acc.concat(`${response.data[key][0]}`); // Combine key-value pair with comma
            }, [])
            .join(", ");
          dispatch(loadingFailed(errors)); // Dispatch action to indicate loading failed
          toast.error(errors);
        }
      } catch (error) {
        dispatch(loadingFailed("Network error. Please try again."));
      }
    },
  });

  const getIdFromName = (arr, name) => {
    const id = arr.find((el) => el.label === name)?.id;
    return id;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("avatar", file);

    const blobUrl = URL.createObjectURL(file);
    setAvatarPreview(blobUrl);
    formik.setFieldValue("avatar", file);
  };

  const autoCompleteStyles = {
    border: "none",
    width: "100%",
    padding: "0 auto",
    margin: "4px 0",
    maxHeight: "40px",
    fontFamily: "bregular",
    fontSize: "20px",
    borderRadius: "26px",
  };

  const scrollToFirstError = () => {
    if (Object.keys(formik.errors).length > 0) {
      toast.error(Object.values(formik.errors)[0]);
      document.getElementsByName(Object.keys(formik.errors)[0])[0].focus();
    }
  };

  return (
    <>
      <GoBackButton />
      <div className="about">
        <BeeuLogo />
        <br />
        <p className="title">signup as bee</p>
        <form className="profile" onSubmit={formik.handleSubmit}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              id="username"
              name="username"
              style={{ paddingRight: "30px" }}
              pattern="^[A-Za-z0-9_\-]{3,60}$"
              placeholder="your public username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={MAX_USERNAME_LENGTH}
              disabled={loading} // Disable input during loading
            />
            <span
              className="letters-counter"
              id="username-letters-left"
              style={{ right: "10px" }}
            >
              {MAX_USERNAME_LENGTH - formik.values.username.length ??
                MAX_USERNAME_LENGTH}
            </span>{" "}
          </div>
          {formik.touched.username && formik.errors.username ? (
            <span className="text-danger">{formik.errors.username}</span>
          ) : (
            <div className="label">only letters numbers and lines</div>
          )}
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading} // Disable input during loading
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-danger">{formik.errors.email}</span>
          )}
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
            placeholder="password"
            disabled={loading} // Disable input during loading
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
            disabled={loading} // Disable input during loading
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
          <div className="center profile-avatar">
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              accept="image/*"
              size={1048576}
              disabled={loading} // Disable input during loading
            />
            <label htmlFor="avatar">
              {avatarPreview == null ? (
                <img className="avatar-upload" />
              ) : (
                <img
                  src={avatarPreview}
                  className="avatar-preview"
                  alt="Avatar Preview"
                />
              )}
            </label>
            Your avatar
          </div>
          {formik.touched.avatar && formik.errors.avatar && (
            <span className="text-danger">{formik.errors.avatar}</span>
          )}

          <div className="autocomplete-container birthyear">
            <Select
              value={
                formik.values.birthyear !== "" && {
                  label: formik.values.birthyear,
                  value: formik.values.birthyear,
                }
              }
              id="birthyear"
              onChange={(selectedOption) =>
                formik.setFieldValue("birthyear", selectedOption.value)
              }
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...autoCompleteStyles,
                }),
              }}
              placeholder="Year of birth"
              options={years}
              isDisabled={loading} // Disable select during loading
            />
            <div className="label">
              Attention: Your birth year can not be changed later. False
              information can lead to legal consequences and the deletion of
              your account.
            </div>
          </div>
          {formik.touched.birthyear && formik.errors.birthyear && (
            <span className="text-danger">{formik.errors.birthyear}</span>
          )}
          <div
            className="autocomplete-container language"
            style={{ marginBottom: "3%" }}
          >
            <Select
              value={
                formik.values.language !== "" && {
                  label: formik.values.language,
                  value: formik.values.language,
                  name: "language",
                }
              }
              id="languages"
              onChange={(selectedOption) =>
                formik.setFieldValue("language", selectedOption.value)
              }
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...autoCompleteStyles,
                }),
              }}
              placeholder="Your main language"
              options={languages}
              isDisabled={loading} // Disable select during loading
            />
          </div>
          {formik.touched.language && formik.errors.language && (
            <span className="text-danger">{formik.errors.language}</span>
          )}
          <div className="autocomplete-container region">
            <Select
              value={
                formik.values.region !== "" && {
                  label: formik.values.region,
                  value: formik.values.region,
                }
              }
              id="regions"
              onChange={(selectedOption) =>
                formik.setFieldValue("region", selectedOption.value)
              }
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...autoCompleteStyles,
                }),
              }}
              placeholder="Your main region"
              options={regions}
              isDisabled={loading} // Disable select during loading
            />
          </div>
          {formik.touched.region && formik.errors.region && (
            <span className="text-danger">{formik.errors.region}</span>
          )}
          <div className="space30" />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              value={formik.values.about}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              id="about"
              name="about"
              maxLength={MAX_BIO_LENGTH}
              style={{ paddingRight: "30px" }}
              placeholder="tell the other bees something about you"
              disabled={loading}
            />
            <span
              className="letters-counter"
              id="bio-letters-left"
              style={{ right: "10px", bottom: "10px" }}
            >
              {MAX_BIO_LENGTH - formik.values.about.length}
            </span>
          </div>
          {formik.touched.about && formik.errors.about && (
            <span className="text-danger">{formik.errors.about}</span>
          )}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              value={formik.values.keywords}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              id="keywords"
              maxLength={100}
              name="keywords"
              placeholder="some keywords that are important to you (comma separated)"
              disabled={loading} // Disable textarea during loading
            />
          </div>
          {formik.touched.keywords && formik.errors.keywords && (
            <span className="text-danger">{formik.errors.keywords}</span>
          )}
          <div className="space30" />
          <div className="label" htmlFor="terms">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              onChange={formik.handleChange}
              disabled={loading} // Disable checkbox during loading
            />
            You accept hereby that you adhere to friendly conduct, no violence,
            no genitals, no spam, no edited videos or you will be blocked. You
            also accept to receive important notice from us occasionally by
            email.
          </div>
          {formik.errors.terms && (
            <span className="text-danger">{formik.errors.terms}</span>
          )}
          <div className="label" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              onChange={formik.handleChange}
              disabled={loading} // Disable checkbox during loading
            />
            Stay logged in on this device
          </div>
          <div className="space30" />
          <div className="center">
            <button
              type="submit"
              className="button1"
              onClick={scrollToFirstError}
              disabled={formik.isSubmitting || loading} // Disable button during loading
            >
              {formik.isSubmitting || loading
                ? "Please wait..."
                : "save your profile"}
            </button>
          </div>
        </form>
      </div>
      <div className="space30" />
      <Footer />
    </>
  );
}
