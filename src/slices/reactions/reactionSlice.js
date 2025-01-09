import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  currentPlaying: {},
  currentVideoAction: {
    currentPlayingProgress: 0,
    seekTo: 0,
  },
  videos: [],
  fetchedVideos: [],
  redirectToFeedVideo: {},
  nestingArray: [],
};

export const reactionSlice = createSlice({
  name: 'reactionSlice',
  initialState,
  reducers: {
    setCurrentPlaying: (state, action) => {
      state.currentPlaying = action.payload;
    },
    setRedirectToFeedVideo: (state, action) => {
      state.redirectToFeedVideo = action.payload;
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
        obj => obj.videoId == state.currentPlaying.videoId
      );
      if (index >= 0) {
        if (status) state.videos[index].likes.total++;
        else state.videos[index].likes.total--;
        state.videos[index].likes.liked = status;
      }
    },
    setReactionCountInReactSlice: (state, { payload }) => {
      const index = state.videos.findIndex(
        obj => obj.videoId == payload.videoId
      );
      if (index >= 0) {
        state.currentPlaying.reactions = state.currentPlaying.reactions + 1;
        state.videos[index].reactions = state.videos[index].reactions + 1;
      }
    },
    appendReactionsVideos: (state, action) => {
      state.videos = action.payload;
    },
    appendNestingArray: (state, action) => {
      state.nestingArray.push(action.payload);
    },
    removeNestingArray: state => {
      state.nestingArray.pop();
    },
    clearNestingArray: state => {
      state.nestingArray = [];
    },
  },
});
//reaction videos

export const {
  setCurrentPlaying,
  setRedirectToFeedVideo,
  setCurrentPlayingProgress,
  setLikeStatus,
  setSeekTo,
  appendReactionsVideos,
  setReactionCountInReactSlice,
  appendNestingArray,
  removeNestingArray,
  clearNestingArray,
} = reactionSlice.actions;

export default reactionSlice.reducer;
