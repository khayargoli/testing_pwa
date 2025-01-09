import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  appendFeedVideos,
  appendFetchedVideos,
  emptyFeed,
  setCurrentPlaying,
  setLoadingReactions,
} from "../../slices/feed/feedSlice";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Video } from "./Video";
import { sleep } from "../../utils/utils"; // Assuming you have a sleep utility function
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from "../../slices/page/pageStatusSlice";
import { getFeed } from "../../api/apiClient"; // Import your API client function here
import { useLocation } from "react-router-dom";
import GuestFooter from "./GuestFooter";
import CONSTANTS from "../../CONTANTS";
import { getRandomInt } from "../../Helpers";

// eslint-disable-next-line react/display-name
const VideoPlayer = ({ hideHeader, setFirstFeedVideo }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isViewingUserVideos = searchParams.get("view-video") || undefined;
  const fromReactions = searchParams.get("from") || undefined;

  let videos = useSelector((state) => state.feed.videos);
  const redirectedFromReactions = useSelector(
    (state) => state.reactions.redirectToFeedVideo
  );
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.pageStatus.isLoading);
  const userDetails = useSelector((state) => state.user.userDetails);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const videosIfViewing =
    isViewingUserVideos == CONSTANTS.VIEW_VIDEO.CURRENT
      ? userDetails?.posts
      : selectedUser?.posts;

  useEffect(() => {
    if (location.pathname.includes("/feed-reactions")) {
      dispatch(setLoadingReactions(true));
    } else {
      dispatch(setLoadingReactions(false));
    }
  }, [location, dispatch]);

  const [reload, setReload] = useState(0);

  // TODO: FIX THIS ISSUE OLD (BACK FROM REACTIONS LOGIC)
  // useEffect(() => {
  //   if(redirectedFromReactions && videos[0]?.videoId !== redirectedFromReactions?.videoId) {
  //     console.log("cp", redirectedFromReactions)
  //     const newFilteredVideos = videos.filter(v => v.videoId !== redirectedFromReactions?.videoId)
  //     videos = [redirectedFromReactions, ...newFilteredVideos]
  //   }
  // }, [videos, redirectedFromReactions])

  // useEffect(() => {
  //   if(setFirstFeedVideo && videos.length) {
  //     setFirstFeedVideo(CONSTANTS.API_URL+"/"+videos[0]?.url)
  //   }
  // }, [setFirstFeedVideo])

  //const feed slice variavlbe reactionvideo,

  // useEffect(() => {
  //   if (fromReactions && fromReactions !== undefined) {
  //     console.log('refirected Videos', videos);
  //     const newVideos = videos.filter(v => v.videoId != fromReactions);
  //     const topVideo = videos.filter(v => v.videoId == fromReactions);
  //     videos = [topVideo, ...newVideos];
  //     dispatch(appendFetchedVideos(videos));
  //     dispatch(appendFeedVideos(videos));
  //   }
  // }, [fromReactions]);

  async function init() {
    try {
      dispatch(startLoading());
      let feed = userDetails?.posts;
      const feedCreatorId = feed.map((item) => item?.creatorId);
      console.log("feedCreatorId-------------->", feedCreatorId);
      if (
        fromReactions &&
        fromReactions !== undefined &&
        videos[0]?.videoId !== Number(fromReactions)
      ) {
        const newVideos = feed.filter((v) => v.videoId != fromReactions);
        const topVideo = feed.filter((v) => v.videoId == fromReactions).at(0);
        feed =
          topVideo !== undefined ? [topVideo, ...newVideos] : [...newVideos];
        dispatch(emptyFeed());
      }
      dispatch(appendFetchedVideos(feed));
      dispatch(appendFeedVideos(feed));
      dispatch(loadingSuccess());
    } catch (error) {
      dispatch(loadingFailed(error.message));
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div data-reload={reload}>
      {hideHeader || <Header />}

      <div
        className="feedvideocontainer"
        style={hideHeader && { marginTop: "-50%" }}
      >
        {isViewingUserVideos
          ? [...new Set(videosIfViewing)]?.map(
              (video, i) =>
                video?.post_url && (
                  <Video
                    key={video.id}
                    data={{ videoId: video.id, url: video.post_url, ...video }}
                    // controls={true}
                  />
                )
            )
          : [...new Set(videos)].map(
              // new Set() is for removing duplicate items
              (video, i) => {
                if (video?.url) {
                  if (
                    fromReactions !== undefined &&
                    redirectedFromReactions?.videoId
                  ) {
                    if (i === 0) {
                      return (
                        <Video
                          key={i}
                          data={redirectedFromReactions}
                          // controls={true}
                          isMuted={i === 0}
                        />
                      );
                    } else {
                      return (
                        <Video
                          key={i}
                          data={video}
                          // controls={true}
                          isMuted={i === 0}
                        />
                      );
                    }
                  } else {
                    return (
                      <Video
                        key={i}
                        data={video}
                        // controls={true}
                        isMuted={i === 0}
                      />
                    );
                  }
                }
              }
            )}

        {isLoading && (
          <div className="absolute loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {location.pathname !== "/" &&
        (userDetails ? (
          <Footer isViewingUserVideos={isViewingUserVideos} />
        ) : (
          <GuestFooter />
        ))}
    </div>
  );
};

export { VideoPlayer };
