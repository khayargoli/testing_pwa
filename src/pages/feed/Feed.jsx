import { useEffect, useState } from "react";
import { VideoPlayer } from "../../components/video/VideoPlayer";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoading } from "../../slices/page/pageStatusSlice";
import { emptyFeed, setCurrentPlaying } from "../../slices/feed/feedSlice";
import { getRandomInt } from "../../Helpers";
export function Feed() {
  const [componentKey, setComponentKey] = useState(0);

  const { id } = useParams();

  const reloadComponent = () => {
    setComponentKey((prevKey) => prevKey + 1); // Change the key to force re-render
  };

  const params = new URLSearchParams(window.location.search);
  const reload = params.get("refresh") || undefined;
  const location = useLocation();
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.feed.videos);
  const feedStatus = useSelector((state) => state.feed.feedStatus);

  useEffect(() => {
    if (reload !== undefined) {
      dispatch(startLoading());
      dispatch(setCurrentPlaying({}));
      dispatch(emptyFeed());
      setTimeout(() => {
        reloadComponent();
        setCurrentPlaying(videos[getRandomInt(0, videos.length - 1)]);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, reload]);

  return (
    <div>
      <VideoPlayer key={componentKey} feedStatus={feedStatus} videoId={id} />
    </div>
  );
}
