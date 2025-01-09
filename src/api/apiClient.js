import axios from "axios";
import CONSTANTS from "../CONTANTS";

const apiClient = axios.create({
  baseURL: `${CONSTANTS.API_URL}/api`,
  // baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  // timeout: 90000,
  // other configurations here
});

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    // Do something here with request error
    return Promise.reject(error);
  }
);

// Define methods for different API calls

// Login
export const login = (formData) => apiClient.post(`/login`, formData);

// Forgot password
export const forgotPassword = (formData) =>
  apiClient.post(`/forgot-password`, formData);

// Reset password
export const resetPassword = (formData) =>
  apiClient.post(`/reset-password`, formData);

// verifcation
export const verifcation = (formData) =>
  apiClient.post(`/sendOtpVerification`, formData);

//Register
export const getLanguages = () => apiClient.get(`/language`);
export const getRegions = () => apiClient.get(`/region`);
export const getRegistered = (formData) =>
  apiClient.post(`/register`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

//feed
export const getFeed = () => apiClient.get(`/posts`);

export const getSinglePost = (postId) =>
  apiClient.get(`/single-post/${postId}`);

//save video

export const saveVideo = (formData, config = {}) =>
  apiClient.post(`/posts/store`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });

//like unlike

export const likeUnlike = (formData) => apiClient.post(`/likes`, formData);

// follow unfollow

export const followUnfollow = (formData) =>
  apiClient.post(`/follows`, formData);

// userdetails

export const getUserDeatils = () => apiClient.get("user");
// otherUser
export const OtherUser = (id) => {
  return apiClient.get(`/user/${id}`);
};
// reaction to video
export const videoReactions = (formData, config = {}) =>
  apiClient.post(`/reaction/store`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
// implementation of showReaction in apiClient
export const showReaction = (postId) => {
  return apiClient.get(`/reactions/${postId}`);
};

// Update profile

export const updateUserProfile = (userId, formData) => {
  console.log(userId, "000");
  return apiClient.post(`/user/profile/update/${userId}`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

// Search data
export const search = (query) => {
  return apiClient.get(`/search`, {
    params: {
      q: query,
    },
  });
};

/* follwing*/

export const Follwing = (id) => {
  return apiClient.get(`/following/${id}`);
};

/* follwers */
export const userFollowers = (id) => {
  return apiClient.get(`/followed/${id}`);
};

/* delete post */

export const deletePost = (postIds) => {
  return apiClient.post(
    "/posts/delete",
    { post_id: postIds },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteAccount = (userId) => {
  return apiClient.delete(`/user/delete/${userId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

// /* download posts */
// export const downloadPost = ({ postId, userId }) => {
//   return apiClient.get(`/posts/download/${postId}/${userId}`, {
//     headers: {
//       Accept: "application/json",
//     },
//   });
// };

/* report post */
export const reportPost = (postId, reason) => {
  return apiClient.post(
    "report",
    { post_id: postId, reason: reason },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

/*archive */
export const archivePost = (data) => {
  return apiClient.post("/posts/show/status", data);
};

/*show archive video */
export const showArchivePost = () => {
  return apiClient.get("/posts/archive/", {});
};

// contact form
export const sendContactFormData = (data) => {
  return apiClient.post("/contact", data);
};

// findout main Post
export const findMainPost = (postId) => {
  return apiClient.get(`/reactions/mainPost/${postId}`);
};
