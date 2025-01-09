/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSinglePost, showReaction } from "../../api/apiClient"; // Import your API client function here
import {
  loadingFailed,
  loadingSuccess,
  startLoading,
} from "../../slices/page/pageStatusSlice";
import {
  appendReactionsVideos,
  setCurrentPlaying,
  setRedirectToFeedVideo,
  appendNestingArray,
  removeNestingArray,
  clearNestingArray,
} from "../../slices/reactions/reactionSlice";
import { Header } from "./Header";
import { ReactionVideo } from "./ReactionVideo";
import { ReactionFooter } from "./ReactionFooter";
import GuestFooter from "./GuestFooter";
import CONSTANTS from "../../CONTANTS";
import { moveReactionToFirst } from "../../Helpers";
import {
  appendFeedVideos,
  appendFetchedVideos,
  emptyFeed,
} from "../../slices/feed/feedSlice";
import { setUserDetails } from "../../slices/user/userSlice";

const ReactionVideoPlayer = React.memo(({ hideHeader }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const videos = useSelector((state) => state.reactions.videos);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.pageStatus.isLoading);
  const userDetails = useSelector((state) => state.user.userDetails);
  const feedStatus = useSelector((state) => state.feed.feedStatus);
  const currentPlayingReaction = useSelector(
    (state) => state.reactions.currentPlaying
  );
  const nestingArray = useSelector((state) => state.reactions.nestingArray);
  const nestingArrayRef = useRef(nestingArray);

  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get("videoId") || -1;
  const reactionId = searchParams.get("rid") || -1;
  const mainVideoLink = searchParams.get("main") ?? -1;
  let mainVideo =
    useSelector((state) =>
      state?.feed?.videos?.find((v) => v.videoId == videoId)
    ) || undefined;
  const [mainVideoFetched, setMainVideoFetched] = useState(undefined);
  const [lastVideoFetched, setLastVideoFetched] = useState(undefined);
  const [lastReaction, setLastReaction] = useState(false);

  useEffect(() => {
    nestingArrayRef.current = nestingArray;
  }, [nestingArray]);

  // useEffect(() => {
  //   const getPost = async () => {
  //     if (mainVideo == undefined) {
  //       const resp = await getSinglePost(videoId);
  //       if (resp.data?.data) {
  //         console.log('SingleVideo', resp.data.data);
  //         setMainVideoFetched(resp.data.data);
  //       }
  //     }
  //   };
  //   getPost();
  // }, [videoId, mainVideo]);

  //feed data
  const feedVideos = useSelector((state) => state.feed.videos);
  //--

  const { API_URL } = CONSTANTS;

  const redirectToFeedFromMain = async () => {
    // if (mainVideoFetched != undefined && mainVideo == undefined) {
    //   console.log('bbbbbbbbbbbbbbbbbbbbbbb');
    //   console.log('redirecting from profile to feed', mainVideoFetched);
    //   dispatch(setRedirectToFeedVideo(mainVideoFetched));
    //   const filterOutMainVideo = feedVideos.filter(
    //     v => v?.videoId != mainVideoFetched?.id
    //   );
    //   const newFeedVideos = [mainVideoFetched, ...filterOutMainVideo];
    //   dispatch(appendFeedVideos(newFeedVideos));
    //   dispatch(appendFetchedVideos(newFeedVideos));
    //   console.log('mainVideoFetched', mainVideoFetched);
    //   // navigate(`/feed-reactions?videoId=${mainVideoFetched?.reaction_to}`);
    // } else {
    //   console.log('aaaaaaaaaaaaaaaaaaaa');
    //   dispatch(setRedirectToFeedVideo(mainVideo));
    //   const filterOutMainVideo = feedVideos.filter(
    //     v => v?.videoId != mainVideo?.videoId
    //   );
    //   const newFeedVideos = [mainVideo, ...filterOutMainVideo];
    //   dispatch(appendFeedVideos(newFeedVideos));
    //   dispatch(appendFetchedVideos(newFeedVideos));
    //   // navigate(`/feed/from/${nestingArray[0]}`);
    // }
    // console.log(feedVideos);
    // INFO: fix asynchronous state update
    const navigationLink = `/feed/from/${nestingArray[0]}`;
    let filterOutMainVideo;
    if (feedStatus === 2) {
      filterOutMainVideo = userDetails?.reaction_posts
        .filter((v) => v?.id == mainVideoFetched?.id)
        .at(0);
      const remainingFeed = userDetails?.reaction_posts.filter(
        (v) => v?.id != nestingArray[0]
      );
      const newPosts = [filterOutMainVideo, ...remainingFeed];
      dispatch(setUserDetails({ ...userDetails, reaction_posts: newPosts }));
      dispatch(clearNestingArray());
    }
    if (feedStatus === 1) {
      filterOutMainVideo = userDetails?.posts
        .filter((v) => v?.id == mainVideoFetched?.id)
        .at(0);
      const remainingFeed = userDetails?.posts.filter(
        (v) => v?.id != nestingArray[0]
      );
      const newPosts = [filterOutMainVideo, ...remainingFeed];
      dispatch(setUserDetails({ ...userDetails, posts: newPosts }));
      dispatch(clearNestingArray());
    }
    if (feedStatus === 0) {
      filterOutMainVideo = feedVideos
        .filter((v) => v?.videoId == mainVideoFetched?.id)
        .at(0);
      dispatch(setRedirectToFeedVideo(filterOutMainVideo));
      const remainingFeed = feedVideos.filter(
        (v) => v?.videoId != nestingArray[0]
      );
      const newFeedVideos = [filterOutMainVideo, ...remainingFeed];
      dispatch(emptyFeed());
      dispatch(appendFeedVideos(newFeedVideos));
      dispatch(appendFetchedVideos(newFeedVideos));
      dispatch(clearNestingArray());
    }

    navigate(navigationLink);
    // navigate(-nestingArray.length);
  };
  //const feed slice variavlbe reactionvideo,
  useEffect(() => {
    async function init() {
      try {
        dispatch(startLoading());
        setLastVideoFetched(() => undefined);
        // if (!nestingArray.includes(videoId)) {
        //   dispatch(appendNestingArray(videoId));
        // }

        let response = await showReaction(videoId);

        if (response.data.data.length > 0) {
          const reactionsData = response.data.data;
          if (reactionId && reactionId !== -1 && reactionsData.length > 1) {
            const ridEl = reactionsData.find(
              (r) => parseInt(r.videoId) === parseInt(reactionId)
            );
            const reorderedReactions = moveReactionToFirst(
              reactionsData,
              ridEl
            );
            console.log(
              "moved to firest",
              reorderedReactions,
              reactionId,
              ridEl
            );
            dispatch(appendReactionsVideos(reorderedReactions));
          } else {
            dispatch(appendReactionsVideos(reactionsData));
          }

          // console.log(nestingArray);

          const nestingArrayTemp = nestingArrayRef.current;

          if (nestingArray[0]) {
            const resp = await getSinglePost(nestingArray[0]);
            console.log("resp-------------->", resp);
            if (resp.data?.data) {
              // console.log('MainVideo', resp.data.data);
              setMainVideoFetched(resp.data.data);
              dispatch(
                setUserDetails({
                  ...userDetails,
                  reaction_posts: [resp.data.data],
                })
              );
            }
          }

          // console.log(nestingArray.length);
          if (nestingArray.length > 1) {
            const res = await getSinglePost(videoId);
            if (res.data?.data) {
              // console.log('LastVideo', res.data.data);
              setLastVideoFetched(res.data.data);
            }
          } else setLastVideoFetched(undefined);
        } else {
          toast.info("No Reactions Available!");
          navigate("/feed");
        }

        dispatch(loadingSuccess());
      } catch (error) {
        dispatch(loadingFailed(error.message));
      }
    }
    init();
  }, [videoId]);

  return (
    <div key={searchParams.get("videoId")}>
      {/* {hideHeader || <Header />} */}
      <div className="reaction">
        {mainVideoFetched != undefined && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => redirectToFeedFromMain()}
            className={`main`}
          >
            {mainVideoFetched?.poster ? (
              <img src={API_URL + mainVideoFetched?.poster} alt="Main Clip" />
            ) : (
              <video
                playsInline
                key={`${API_URL}/${mainVideoFetched?.post_url}`}
                autoPlay
                muted
                loop
              >
                <source
                  className={
                    mainVideoFetched != undefined ? `main-fetched` : "main-root"
                  }
                  src={`${API_URL}/${mainVideoFetched?.post_url}`}
                  type="video/mp4"
                />
              </video>
            )}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translate(-50%, 0%)",
              }}
            >
              main
            </div>
          </div>
        )}

        {lastVideoFetched !== undefined && (
          <div
            onClick={() => {
              dispatch(removeNestingArray());
              navigate(
                `/feed-reactions?videoId=${nestingArray.at(
                  -2
                )}&rid=${nestingArray.at(-1)}`
              );
            }}
            className="last"
            style={{ cursor: "pointer" }}
          >
            {lastVideoFetched?.poster != null ? (
              <img src={lastVideoFetched?.poster} alt="Last Rection" />
            ) : (
              <video playsInline autoPlay muted loop>
                <source
                  src={API_URL + "/" + lastVideoFetched?.post_url}
                  type="video/mp4"
                />
              </video>
            )}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translate(-50%, 0%)",
              }}
            >
              last
            </div>
          </div>
        )}
        {/* a former reaction to the main topic, this clip (big feedvideocontainer) below was a reaction to */}
      </div>
      <div className="feedvideocontainer">
        {videos.map((video, i) => {
          return (
            video?.url && (
              <ReactionVideo
                key={video.videoId}
                data={video}
                controls={true}
                isMuted={i === 0}
              />
            )
          );
        })}

        {isLoading && (
          <div className="absolute loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {userDetails ? <ReactionFooter /> : <GuestFooter />}
    </div>
  );
});

export { ReactionVideoPlayer };
