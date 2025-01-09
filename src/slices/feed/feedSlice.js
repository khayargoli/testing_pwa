import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  loadingReactions: false,
  currentPlaying: {},
  currentVideoAction: {
    currentPlayingProgress: 0,
    seekTo: 0,
  },
  videos: [],
  feedStatus: 0, //info: {0: Main Feed, 1: User Feed, 2: Reacted Feed}
  fetchedVideos: [],
};

const filterDuplicates = (videos) => {
  const uniqueIds = [];
  // INFO: Fix optional functionality
  return videos.filter((v) => {
    if (uniqueIds.includes(v?.videoId)) return;
    uniqueIds.push(v?.videoId);
    return v;
  });
};

export const counterSlice = createSlice({
  name: "feedSlice",
  initialState,
  reducers: {
    setCurrentPlaying: (state, action) => {
      state.currentPlaying = action.payload;
    },
    setCurrentPlayingProgress: (state, action) => {
      state.currentVideoAction.currentPlayingProgress = action.payload;
    },
    setSeekTo: (state, action) => {
      state.currentVideoAction.seekTo = action.payload;
    },
    setLikeStatus: (state, action) => {
      const status = action.payload;

      state.currentPlaying.likes.liked = status;

      if (status) state.currentPlaying.likes.total++;
      else state.currentPlaying.likes.total--;

      const index = state.videos.findIndex(
        (obj) => obj.videoId == state.currentPlaying.videoId
      );
      if (index >= 0) {
        if (status) state.videos[index].likes.total++;
        else state.videos[index].likes.total--;
        state.videos[index].likes.liked = status;
      }
    },
    setReactionCount: (state, { payload }) => {
      const index = state.videos.findIndex(
        (obj) => obj.videoId == payload.videoId
      );
      if (index >= 0) {
        state.currentPlaying.reactions = state.currentPlaying.reactions + 1;
        state.videos[index].reactions = state.videos[index].reactions + 1;
      }
    },
    appendFeedVideos: (state, action) => {
      state.videos = filterDuplicates([...state.videos, ...action.payload]);
    },
    appendFetchedVideos: (state, action) => {
      state.fetchedVideos = filterDuplicates([
        ...state.videos,
        ...action.payload,
      ]);
    },
    setLoadingReactions: (state, action) => {
      state.loadingReactions = action.payload;
    },
    emptyFeed: (state) => {
      state.videos = [];
      state.fetchedVideos = [];
    },
    // INFO: Add feedStatus for myFeed content
    setFeedStatus: (state, action) => {
      state.feedStatus = action.payload;
    },
  },
});
//reaction videos

export const {
  setCurrentPlaying,
  setCurrentPlayingProgress,
  setLikeStatus,
  setSeekTo,
  appendFeedVideos,
  appendFetchedVideos,
  setReactionCount,
  setLoadingReactions,
  emptyFeed,
  setFeedStatus,
} = counterSlice.actions;

export default counterSlice.reducer;
