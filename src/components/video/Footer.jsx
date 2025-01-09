import heartLogo from "/src/assets/images/icon-heart.png";
import heartSetLogo from "/src/assets/images/icon-heart-set.png";
import feedLogo from "/src/assets/images/icon-feed.png";
import addLogo from "/src/assets/images/icon-add.png";
import profileLogo from "/src/assets/images/icon-profile.png";

import css from "/src/seekbar-styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setSeekTo,
  setLikeStatus,
  setFeedStatus,
} from "../../slices/feed/feedSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { setReaction } from "../../slices/recording/recordingSlice";
import bulogosm from "../../assets/images/beeu-logo-minimal.png";
import { likeUnlike, reportPost } from "../../api/apiClient";
import CONSTANTS from "../../CONTANTS";
import { toast } from "react-toastify";
import { setGoBackTo } from "../../slices/page/pageStatusSlice";
import { FaCheckCircle } from "react-icons/fa";
import {
  appendNestingArray,
  clearNestingArray,
} from "../../slices/reactions/reactionSlice";
import GuestFooter from "./GuestFooter";

export function Footer({ isViewingUserVideos = false }) {
  const isSignedIn = useSelector((state) => state.user.userDetails);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const viewUser =
    isViewingUserVideos == CONSTANTS.VIEW_VIDEO.CURRENT
      ? isSignedIn
      : selectedUser;

  const [isLikeMenu, setIsLikeMenu] = useState(false);
  const [isAddMenu, setIsAddMenu] = useState(false);
  const [isSharingMenu, setIsSharingMenu] = useState(false);
  const [isReportMenu, setIsReportMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    createdAt,
    createdBy,
    reactions,
    likes,
    profilePic,
    videoId,
    creatorId,
  } = useSelector((state) => state.feed.currentPlaying);
  const currentPlaying = useSelector((state) => state.feed.currentPlaying);
  const user = useSelector((state) => state.user.userDetails);

  const seekbarRef = useRef(null);

  const shareUrl = `https://www.beeu.fun/feed/from/${videoId}`;

  const currentPlayingVideoTime = useSelector(
    (state) => state.feed.currentVideoAction.currentPlayingProgress
  );

  const dispatch = useDispatch();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleLikeMenu = () => {
    if (user?.deleted_at) {
      toast.error("Not allowed for deleted account", { autoClose: 1500 });
      return;
    }
    if (!isLikeMenu) {
      setIsAddMenu(false);
      setIsReportMenu(false);
      setIsSharingMenu(false);
    }
    setIsLikeMenu(!isLikeMenu);
  };
  const handleAddMenu = () => {
    if (user?.deleted_at) {
      toast.error("Not allowed for deleted Account", { autoClose: 1500 });
      return;
    }
    if (!isLikeMenu) {
      setIsAddMenu(false);
      setIsSharingMenu(false);
      setIsReportMenu(false);
    }
    setIsAddMenu(!isAddMenu);
  };

  const handleLike = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);

    const newLikeStatus = !likes.liked;
    const formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("post_id", videoId);
    formData.append("status", newLikeStatus ? "liked" : "unliked");

    try {
      dispatch(setLikeStatus(newLikeStatus));
      await likeUnlike(formData);
    } catch (error) {
      console.error("Error updating like status:", error);
    } finally {
      setIsProcessing(false);
      setIsLikeMenu(false); // Close menu
    }
  };

  const handleReactToThis = () => {
    dispatch(setGoBackTo(`${location.pathname}/reaction`));
    dispatch(setReaction(true));
    setIsAddMenu(false); // Close menu
    console.log("Reaction set to true");
  };

  const handleShare = () => {
    if (!isSharingMenu) {
      setIsAddMenu(false);
      setIsReportMenu(false);
      setIsLikeMenu(false); // Close menu
    }
    setIsSharingMenu(!isSharingMenu);
  };

  const handleProgressBarClick = (e) => {
    const progressBar = seekbarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = (clickPosition / rect.width) * 100;
    dispatch(setSeekTo(clickPercentage));
  };

  const reportClip = async (reason) => {
    console.log(videoId, reason);
    const loadingToast = toast.loading("reporting clip", {
      autoClose: false,
    });
    try {
      await reportPost(videoId, reason);
      toast.dismiss(loadingToast);
      toast.success("Thank you for reporting. We'll look into it", {
        icon: <FaCheckCircle style={{ color: "#41C0EB" }} />, // Tick icon with info color
        progressStyle: { backgroundColor: "#F9B400" }, // Custom progress bar color
      });
    } catch (e) {
      console.error("Error reporting clip:", e);
      toast.dismiss(loadingToast);
      toast.error("Failed to report clip");
    } finally {
      setIsReportMenu(false);
    }
  };

  // INFO: fix asynchornous issue between feed and reaction page
  const handleReactionClick = async () => {
    try {
      // Assuming dispatch functions return promises
      await dispatch(clearNestingArray());
      await dispatch(appendNestingArray(videoId));

      // Navigate only after dispatches are done
      if ((reactions || 0) > 0) {
        // Navigate programmatically here, replacing <Link to> usage
        navigate(`/feed-reactions?videoId=${videoId}`);
      }
    } catch (error) {
      console.error("Error executing dispatch functions:", error);
    }
  };

  const handleFeedClick = async () => {
    await dispatch(setFeedStatus(0));
    navigate(`/feed?refresh=${new Date().getTime()}`);
  };

  return !isViewingUserVideos ? (
    <>
      {/* NORMAL FEED FOOTER  */}
      <div
        className="bottom"
        style={{
          height: /iPhone/i.test(navigator.userAgent) ? "70px" : "56px",
        }}
      >
        <div id="playingVideoDate" className="date">
          {createdAt}
        </div>

        <div className="channel">
          <span id="feedVideoChannelName">{createdBy}</span>
          <Link
            style={{
              backgroundImage: `url(${
                CONSTANTS.API_URL + "/" + profilePic || bulogosm
              })`,
              backgroundColor: "#fff",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            to={`/profile-public?user=${creatorId}`}
            id="feedVideoChannelProfilePic"
            className="avatar"
          ></Link>
        </div>

        <div
          style={{
            height: /iPhone/i.test(navigator.userAgent) ? "70px" : "70px",
          }}
          className={css.seekbarContainer}
        >
          <div className={css.seekbar} id="seekbar">
            <div
              ref={seekbarRef}
              onClick={handleProgressBarClick}
              className={css.progress}
              id="progress"
              style={{ width: `${currentPlayingVideoTime}%` }}
            >
              {/* <div className={css.progressHandle}></div> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bottom"
        style={{
          height: /iPhone/i.test(navigator.userAgent) ? "70px" : "56px",
        }}
      >
        {isSignedIn ? (
          <>
            <Link
              onClick={handleFeedClick}
              className="feed"
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${feedLogo})`,
              }}
            ></Link>

            <div
              className="like"
              onClick={handleLikeMenu}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${
                  likes?.liked ? heartSetLogo : heartLogo
                })`,
              }}
            />

            <div
              className="add"
              onClick={handleAddMenu}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${addLogo})`,
              }}
            ></div>

            <div>
              {/* //INFO: fix Link element for asynchoronous update  */}
              <Link
                onClick={handleReactionClick}
                style={{
                  marginBottom: /iPhone/i.test(navigator.userAgent) && "3px",
                }}
                id="feed-reactions"
                className="reactions"
              >
                {reactions || 0}
              </Link>
            </div>

            {/*<Link id="feed-reactions" to={`/feed-reactions?videoId=${videoId}`} className="reactions">{reactions || 0}</Link> */}
            <Link
              to={`/profile-user?user=me`}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${profileLogo})`,
              }}
              className="profile"
            ></Link>
          </>
        ) : (
          <>
            <GuestFooter />
          </>
        )}

        <div className={`menu ${isLikeMenu && "expanded"}`} id="like">
          <Link
            to="#"
            className="button2 liking"
            onClick={handleLike}
            style={{
              backgroundImage: `url(${
                likes?.liked ? heartSetLogo : heartLogo
              })`,
            }}
          >
            <div id="likes">{likes?.total}</div>likes
          </Link>

          <Link to="#" className="button2 share" onClick={handleShare}>
            share
          </Link>
          <Link
            to="#"
            className="textlink-small report"
            onClick={() => setIsReportMenu(true)}
          >
            report this clip
          </Link>
        </div>

        <div
          className={`menu ${isAddMenu && "expanded"}`}
          id="add"
          title="reactions to this clip"
        >
          <Link
            id="react-to-this"
            to={`/record?new=false`}
            className="button2"
            onClick={handleReactToThis}
          >
            react to this
          </Link>
          <Link
            to={`/record?new=true`}
            className="button2"
            onClick={() => {
              dispatch(setGoBackTo(location.pathname));
            }}
          >
            record new topic
          </Link>
          <Link to="/about-recording" className="textlink-small">
            about recording
          </Link>
        </div>

        <div
          className={`menu ${isReportMenu && "expanded"}`}
          id="like"
          title="report this clip"
        >
          <span>Report this clip contains</span>
          {/* <Link to="#" onClick={() => toast.info("Its not a valid reason to report a clip. We appreciate your understanding.")} className="button2">
            i don't like it
          </Link> */}
          <Link to="#" onClick={() => reportClip("hate")} className="button2">
            hate
          </Link>
          <Link
            to="#"
            onClick={() => reportClip("violence")}
            className="button2"
          >
            violence
          </Link>
          <Link
            to="#"
            onClick={() => reportClip("genitals")}
            className="button2"
          >
            genitals
          </Link>
          <Link to="#" onClick={() => reportClip("spam")} className="button2">
            spam
          </Link>
          <Link
            to="#"
            onClick={() => reportClip("edited/AI")}
            className="button2"
          >
            edited/AI
          </Link>
          <Link
            to="#"
            onClick={() => setIsReportMenu(false)}
            className="textlink-small"
          >
            Close
          </Link>
        </div>

        <div className={`menu ${isSharingMenu && "expanded"}`} id="share">
          <div className="share-items">
            <a href="#" onClick={copyToClipboard} className="clipboard" />
            <a
              target="_blank"
              href={`https://wa.me/?text=${shareUrl}`}
              className="whatsapp"
            />
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=BeeU`}
              target="_blank"
              className="twitter"
            />
            <a
              href={`https://mastodon.social/share?text=${shareUrl}`}
              target="_blank"
              className="mastodon"
            />
            <a
              href={`https://t.me/share/url?url=${shareUrl}&text=BeeU`}
              target="_blank"
              className="telegram"
            />
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              className="facebook"
            />
          </div>
        </div>

        <div className="menu" id="report">
          <p>Report this clip contains</p>
          <form id="report-form">
            <input
              type="checkbox"
              id="report-hate"
              name="report"
              defaultValue="hate"
            />{" "}
            hate <br />
            <input
              type="checkbox"
              id="report-violence"
              name="report"
              defaultValue="violence"
            />{" "}
            violence <br />
            <input
              type="checkbox"
              id="report-genitals"
              name="report"
              defaultValue="genitals"
            />{" "}
            genitals <br />
            <input
              type="checkbox"
              id="report-spam"
              name="report"
              defaultValue="spam"
            />{" "}
            spam <br />
            <input
              type="checkbox"
              id="report-edited-AI"
              name="report"
              defaultValue="edited / AI"
            />{" "}
            edited / AI <br />
            <p>
              <button id="report-button" className="button1">
                send report
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  ) : (
    <>
      {/* FOOTER WHEN VIEWING USER VIDEOS  */}
      <div style={{ height: "56px" }} className="bottom">
        <div id="playingVideoDate" className="date">
          {currentPlaying.created_at}
        </div>

        <div className="channel">
          <span id="feedVideoChannelName">@{viewUser?.username}</span>
          <Link
            style={{
              backgroundImage: `url(${
                CONSTANTS.API_URL + "/" + viewUser?.dp || bulogosm
              })`,
              backgroundColor: "#fff",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            to={`/profile-public?user=${viewUser?.id}`}
            id="feedVideoChannelProfilePic"
            className="avatar"
          ></Link>
        </div>

        <div
          style={{
            marginBottom: /iPhone/i.test(navigator.userAgent) ? "70px" : "70px",
          }}
          className={css.seekbarContainer}
        >
          <div className={css.seekbar} id="seekbar">
            <div
              ref={seekbarRef}
              onClick={handleProgressBarClick}
              className={css.progress}
              id="progress"
              style={{ width: `${currentPlayingVideoTime}%` }}
            >
              {/* <div className={css.progressHandle}></div> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bottom"
        style={{
          height: /iPhone/i.test(navigator.userAgent) ? "70px" : "56px",
        }}
      >
        {isSignedIn ? (
          <>
            <Link
              to="/feed"
              className="feed"
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${feedLogo})`,
              }}
            ></Link>
            <div
              className="like"
              onClick={handleLikeMenu}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${
                  likes?.liked ? heartSetLogo : heartLogo
                })`,
              }}
            />

            <div
              className="add"
              onClick={handleAddMenu}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "9px",
                backgroundImage: `url(${addLogo})`,
              }}
            ></div>
            <Link
              onClick={() => {
                // console.log('HELLLLLLLLLLLLLLLLLLLLLLLLL');
                dispatch(clearNestingArray());
                dispatch(appendNestingArray(videoId));
              }}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent) && "3px",
              }}
              id="feed-reactions"
              to={
                (reactions || 0) > 0 ? `/feed-reactions?videoId=${videoId}` : ""
              }
              className="reactions"
            >
              {reactions || 0}
            </Link>

            {/*<Link id="feed-reactions" to={`/feed-reactions?videoId=${videoId}`} className="reactions">{reactions || 0}</Link> */}
            <Link
              to={`/profile-user?user=me`}
              style={{
                marginBottom: /iPhone/i.test(navigator.userAgent)
                  ? "9px"
                  : "0px",
                backgroundImage: `url(${profileLogo})`,
              }}
              className="profile"
            ></Link>
          </>
        ) : (
          <>
            <GuestFooter />
          </>
        )}

        <div className={`menu ${isLikeMenu && "expanded"}`} id="like">
          <div
            className="button2 liking"
            onClick={handleLike}
            style={{
              backgroundImage: `url(${
                likes?.liked ? heartSetLogo : heartLogo
              })`,
            }}
          >
            <div id="likes">{likes?.total}</div>likes
          </div>

          <div className="button2 share" onClick={handleShare}>
            share
          </div>
        </div>

        <div
          className={`menu ${isAddMenu && "expanded"}`}
          id="add"
          title="reactions to this clip"
        >
          <Link
            id="react-to-this"
            to={`/record?new=false`}
            className="button2"
            onClick={handleReactToThis}
          >
            react to this
          </Link>
          <Link
            to={`/record?new=true`}
            className="button2"
            onClick={() => {
              dispatch(setGoBackTo(location.pathname));
            }}
          >
            record new topic
          </Link>
          <Link to="/about-recording" className="textlink-small">
            about recording
          </Link>
        </div>

        <div className={`menu ${isSharingMenu && "expanded"}`} id="share">
          <div className="share-items">
            <a href="#" onClick={copyToClipboard} className="clipboard" />
            <a
              target="_blank"
              href={`https://wa.me/?text=${shareUrl}`}
              className="whatsapp"
            />
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=BeeU`}
              target="_blank"
              className="twitter"
            />
            <a
              href={`https://mastodon.social/share?text=${shareUrl}`}
              target="_blank"
              className="mastodon"
            />
            <a
              href={`https://t.me/share/url?url=${shareUrl}&text=BeeU`}
              target="_blank"
              className="telegram"
            />
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              className="facebook"
            />
          </div>
        </div>

        <div className="menu" id="report">
          <p>Report this clip contains</p>
          <form id="report-form">
            <input
              type="checkbox"
              id="report-hate"
              name="report"
              defaultValue="hate"
            />{" "}
            hate <br />
            <input
              type="checkbox"
              id="report-violence"
              name="report"
              defaultValue="violence"
            />{" "}
            violence <br />
            <input
              type="checkbox"
              id="report-genitals"
              name="report"
              defaultValue="genitals"
            />{" "}
            genitals <br />
            <input
              type="checkbox"
              id="report-spam"
              name="report"
              defaultValue="spam"
            />{" "}
            spam <br />
            <input
              type="checkbox"
              id="report-edited-AI"
              name="report"
              defaultValue="edited / AI"
            />{" "}
            edited / AI <br />
            <p>
              <button id="report-button" className="button1">
                send report
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
