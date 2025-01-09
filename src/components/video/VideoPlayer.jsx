import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  appendFeedVideos,
  appendFetchedVideos,
  emptyFeed,
  setLoadingReactions,
} from "../../slices/feed/feedSlice";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Video } from "./Video";
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from "../../slices/page/pageStatusSlice";
import { getFeed } from "../../api/apiClient"; // Import your API client function here
import { useLocation, useNavigate } from "react-router-dom";
import GuestFooter from "./GuestFooter";
import CONSTANTS from "../../CONTANTS";

// eslint-disable-next-line react/display-name
const VideoPlayer = ({ hideHeader, feedStatus, videoId = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isViewingUserVideos = searchParams.get("view-video") || null;
  const fromReactions = videoId;

  const videos = useSelector((state) => state.feed.videos);
  const redirectedFromReactions = useSelector(
    (state) => state.reactions.redirectToFeedVideo
  );
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.pageStatus.isLoading);
  const userDetails = useSelector((state) => state.user.userDetails);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  let videosIfViewing;
  if (feedStatus === 2) {
    videosIfViewing = userDetails?.reaction_posts;
  } else if (feedStatus === 0) {
    videosIfViewing = selectedUser?.posts;
  } else if (CONSTANTS.VIEW_VIDEO.CURRENT || feedStatus === 1) {
    videosIfViewing = userDetails?.posts;
  }

  useEffect(() => {
    if (location.pathname.includes("/feed-reactions")) {
      dispatch(setLoadingReactions(true));
    } else {
      dispatch(setLoadingReactions(false));
    }
  }, [location, dispatch]);

  const [reload] = useState(0);

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

  useEffect(() => {
    const init = async () => {
      try {
        if (!feedStatus && !isViewingUserVideos) {
          dispatch(startLoading());

          let response = await getFeed();
          let feed = response.data.data;
          feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          let topVideo = null;
          if (fromReactions && fromReactions !== undefined) {
            const newVideos = feed.filter((v) => v.videoId != fromReactions);
            topVideo = feed.filter((v) => v.videoId == fromReactions).at(0);
            feed = topVideo ? [topVideo, ...newVideos] : [...newVideos];
            dispatch(emptyFeed());
          }
          dispatch(appendFetchedVideos(feed));
          dispatch(appendFeedVideos(feed));
          dispatch(loadingSuccess());
          if (!topVideo) navigate("/feed");
        }
      } catch (error) {
        dispatch(loadingFailed(error.message));
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, feedStatus, fromReactions]);

  return (
    <div data-reload={reload}>
      {hideHeader || <Header />}

      <div
        className="feedvideocontainer"
        style={hideHeader && { marginTop: "-50%" }}
      >
        {isViewingUserVideos
          ? [...new Set(videosIfViewing)]?.map(
              (video) =>
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
                          // isMuted={i === 0}
                        />
                      );
                    } else {
                      return (
                        <Video
                          key={i}
                          data={video}
                          // controls={true}
                          // isMuted={i === 0}
                        />
                      );
                    }
                  } else {
                    return (
                      <Video
                        key={i}
                        data={video}
                        // controls={true}
                        // isMuted={i === 0}
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
