// export default Routers;
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserDeatils } from "./api/apiClient";
import { setUserDetails } from "./slices/user/userSlice";
import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import { startLoading } from "./slices/page/pageStatusSlice";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";

function Routers() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // TODO: REMOVE THIS IN PRODUCTION
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }

    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
  }, []);

  const getuser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response_user_Details = await getUserDeatils();
        if (response_user_Details.data?.code === 200) {
          dispatch(setUserDetails(response_user_Details.data.data));
          if (response_user_Details?.data?.data?.deleted_at)
            toast.error(
              "Your account will be deleted within 24 hours. Please download your data before it is removed. Contact the support team for assistance.",
              {
                autoClose: "1500",
              }
            );
        }
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  const [isLandscape, setIsLandscape] = useState(false);

  const checkOrientation = () => {
    if (window.innerHeight < window.innerWidth) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("load", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    // Initial check
    checkOrientation();

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("load", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return (
    <>
      {isMobile && isLandscape ? (
        <div className="orientation-warning">
          <p>
            BeeU can only be used in portrait mode. It is recommended to turn
            off "Auto Rotate".
          </p>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default Routers;
