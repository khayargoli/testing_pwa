import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPlaying,
  setCurrentPlayingProgress,
} from "../../slices/feed/feedSlice";
import { store } from "../../store/store";
import CONSTANTS from "../../CONTANTS";

export function Video({ data, isPlaying }) {
  const [playing, setPlaying] = useState(isPlaying || false);
  const seekTo = useSelector((s) => s.feed.currentVideoAction.seekTo);

  const dispatch = useDispatch();
  const videoRef = useRef();

  const playVideo = async () => {
    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch (err) {
      console.warn("playVideo err :: ", err);
    }
  };

  const pauseVideo = async () => {
    try {
      await videoRef.current.pause();
      setPlaying(false);
    } catch (err) {
      console.warn("pauseVideo err :: ", err);
    }
  };

  const onVideoPress = async () => {
    if (playing) await pauseVideo();
    else await playVideo();
  };

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      videoRef.current.currentTime = 0; // always starts from beginning
      await playVideo();

      const state = store.getState().feed;
      const index = state.videos.findIndex(
        (obj) => obj.videoId == data?.videoId
      );
      if (index >= 0) {
        dispatch(setCurrentPlaying(state.videos[index]));
      } else {
        dispatch(setCurrentPlaying(data));
      }
    } else pauseVideo();
  }, observerOptions);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      observer.observe(videoElement);

      // Add event listener for timeupdate
      const handleTimeUpdate = () => {
        const current = videoElement.currentTime;
        const duration = videoElement.duration;
        const percentage = (current / duration) * 100;
        dispatch(setCurrentPlayingProgress(percentage));
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        observer.disconnect();
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [videoRef.current]);

  useEffect(() => {
    if (seekTo != 0) {
      const videoDuration = videoRef.current.duration;
      const newTime = (seekTo / 100) * videoDuration;
      if (!isFinite(newTime)) return;
      videoRef.current.currentTime = newTime;
      setCurrentPlayingProgress(newTime);
    }
  }, [seekTo]);

  // const assetsBaseUrl = import.meta.env.VITE_SERVER_ASSET_BASE_URL;

  return (
    <video
      loop
      playsInline
      autoPlay={playing}
      className="beeu-video"
      // src={assetsBaseUrl+"/"+data.url}
      src={`${CONSTANTS.API_URL}/${data.url}`}
      ref={videoRef}
      onClick={onVideoPress}
    />
  );
}
