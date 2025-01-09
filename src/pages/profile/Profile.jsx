import { useEffect, useState } from "react";
import BackButton from "../../components/misc/BackButton";
import { BeeuLogo } from "../../components/misc/BeeuLogo";
import {
  deleteAccount,
  getLanguages,
  getRegions,
  getUserDeatils,
  updateUserProfile,
} from "../../api/apiClient";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../slices/user/userSlice";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import CONSTANTS from "../../CONTANTS";
import Footer from "../../components/misc/Footer";
import { setRedirectToFeedVideo } from "../../slices/reactions/reactionSlice";
import {
  appendFeedVideos,
  appendFetchedVideos,
  emptyFeed,
  setFeedStatus,
} from "../../slices/feed/feedSlice";
import { setGoBackTo } from "../../slices/page/pageStatusSlice";
import { confirmAlert } from "react-confirm-alert";

const Profile = () => {
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPlaying = useSelector((state) => state.feed.currentPlaying);
  const feedVideos = useSelector((state) => state.feed.videos);
  const prevLink = useSelector((state) => state.pageStatus.goBackTo);
  const {
    SIGNUP: { MAX_USERNAME_LENGTH, MAX_BIO_LENGTH },
  } = CONSTANTS;
  const { API_URL } = CONSTANTS;

  const [languages, setLanguages] = useState([]);
  const [regions, setRegions] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.dp ? `${API_URL}/${user.dp}` : "/backend/uploads/11/avatar/11.png"
  );

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    passwordCheck: "",
    language: user?.language || "",
    region: user?.region || "",
    bio: user?.bio || "",
    keywords: user?.keywords || "",
    terms: false,
    user_pic: user?.dp || null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLanguages().then((res) => {
      const { data } = res.data;
      const final = data.map((l) => ({
        label: l.language_name,
        value: l.id,
        name: "language",
      }));
      setLanguages(final);
    });

    getRegions().then((res) => {
      const { data } = res.data;
      const final = data.map((r) => ({
        label: r.regions_name,
        value: r.id,
        name: "region",
      }));
      setRegions(final);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        setFormData((prevFormData) => ({
          ...prevFormData,
          user_pic: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateUserProfile(user.id, formData)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile updated successfully", {
          icon: <FaCheckCircle style={{ color: "#41C0EB" }} />, // Tick icon with info color
          progressStyle: { backgroundColor: "#F9B400" }, // Custom progress bar color
        });
        fetchUserDetails();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error(`Error updating profile: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUserDetails = () => {
    getUserDeatils()
      .then((response) => {
        console.log("Fetched user details:", response.data);
        dispatch(setUserDetails(response.data.data));
        if (response?.data?.data?.deleted_at)
          toast.error(
            "Your account will be deleted within 24 hours. Please download your data before it is removed. Contact the support team for assistance.",
            {
              autoClose: "1500",
            }
          );
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch updated user details.");
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUserDetails(null));
    toast.success("Logged out successfully!", {
      icon: <FaCheckCircle style={{ color: "#41C0EB" }} />, // Tick icon with info color
      progressStyle: { backgroundColor: "#F9B400" }, // Custom progress bar color
    });
    navigate("/");
  };

  const handleDeleteAccount = () => {
    confirmAlert({
      title: "Confirm Deletion",
      message:
        "Do you really want to delete you account and all you video clips? This action can not be reversed",
      buttons: [
        {
          label: "confirm deletion",
          onClick: () =>
            deleteAccount(user?.id)
              .then((response) => {
                console.log("response---------------->", response);
                handleLogout();
              })
              .catch((error) => {
                console.error("Error deleting clips:", error);
                toast.error("Failed to delete selected videos.");
              }),
        },
        {
          label: "Cancel",
          onClick: () => {
            return;
          },
        },
      ],
    });
  };

  const goBack = () => {
    if (prevLink == "/feed") {
      dispatch(setFeedStatus(0));
      const filterOutMainVideo = feedVideos
        .filter((v) => v?.videoId == currentPlaying?.videoId)
        .at(0);
      dispatch(setRedirectToFeedVideo(filterOutMainVideo));
      const remainingFeed = feedVideos.filter(
        (v) => v?.videoId != currentPlaying?.videoId
      );
      const newFeedVideos = [filterOutMainVideo, ...remainingFeed];
      dispatch(emptyFeed());
      dispatch(appendFeedVideos(newFeedVideos));
      dispatch(appendFetchedVideos(newFeedVideos));
      dispatch(setGoBackTo(""));
      navigate(`/feed/from/${currentPlaying?.videoId}`);
    } else if (prevLink == "/feed-reactions/reaction") {
      dispatch(setGoBackTo(""));
      navigate(-2);
    } else {
      dispatch(setGoBackTo(""));
      navigate(-3);
    }
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

  return (
    <div>
      <div className="about">
        <BackButton handlerFunction={goBack} />
        <BeeuLogo />
        <br />
        <p className="title">Your Profile</p>

        <div className="space30" />
        <form className="profile" onSubmit={handleSubmit}>
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
              style={{ paddingRight: 30 }}
              pattern="^[A-Za-z0-9_\-]{3,14}$"
              placeholder="Your public username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <span
              className="letters-counter"
              id="username-letters-left"
              style={{ right: 10 }}
            >
              {MAX_USERNAME_LENGTH - formData?.username.length ??
                MAX_USERNAME_LENGTH}
            </span>
          </div>
          <div className="label">Only letters, numbers, and hyphens</div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="email"
              style={{ paddingRight: 30 }}
              id="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="password"
            id="password"
            // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            id="password-check"
            // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
            name="passwordCheck"
            placeholder="Confirm new password"
            value={formData.passwordCheck}
            onChange={handleInputChange}
          />
          <div className="label">
            Password must have at least 8 characters, mixed case letters, and
            numbers
          </div>
          <div className="center profile-avatar">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              size={1048576}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar">
              <img
                className="avatar-upload"
                src={avatarUrl}
                alt="Your avatar"
              />
            </label>
            Your avatar
          </div>
          <div className="label" style={{ paddingLeft: 14 }}></div>
          <div
            className="autocomplete-container language"
            style={{ marginBottom: "3%" }}
          >
            <Select
              value={
                languages.find((l) => l.value === formData.language) || null
              }
              id="languages"
              onChange={(selectedOption, actionMeta) =>
                handleSelectChange(selectedOption, actionMeta)
              }
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...autoCompleteStyles,
                }),
              }}
              placeholder="Your main language"
              options={languages}
              name="language"
            />
          </div>
          <div className="autocomplete-container region">
            <Select
              value={regions.find((r) => r.value === formData.region) || null}
              id="regions"
              onChange={(selectedOption, actionMeta) =>
                handleSelectChange(selectedOption, actionMeta)
              }
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...autoCompleteStyles,
                }),
              }}
              placeholder="Your main region"
              options={regions}
              name="region"
            />
          </div>
          <div className="space30" />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              rows={4}
              id="bio"
              name="bio"
              maxLength={120}
              style={{ paddingRight: 30 }}
              placeholder="Tell the other bees something about you"
              value={formData.bio}
              onChange={handleInputChange}
            />
            <span
              className="letters-counter"
              id="bio-letters-left"
              style={{ right: 10, bottom: 20 }}
            >
              {MAX_BIO_LENGTH - formData.bio.length}
            </span>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              rows={3}
              id="keywords"
              maxLength={100}
              name="keywords"
              placeholder="Some keywords that are important to you (comma separated)"
              value={formData.keywords}
              onChange={handleInputChange}
            />
          </div>
          <div className="space30" />
          <div className="label">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={true}
              onChange={handleInputChange}
              disabled
            />
            You hereby accept that{" "}
            <Link to="/terms">you adhere to our terms,</Link> including friendly
            conduct, no violence, no explicit content, no spam, and you accept
            to receive important notices from us occasionally by email.
          </div>
          <div className="space30" />
          <div className="center">
            <button
              type="button"
              id="logout"
              onClick={handleLogout}
              className="button1"
            >
              Log out
            </button>
          </div>
        </form>
        <div className="space30" />
      </div>
      <div className="footer-about">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
