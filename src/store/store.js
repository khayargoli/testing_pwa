import { configureStore } from '@reduxjs/toolkit';
import feedSlice from '../slices/feed/feedSlice';
import userSlice from '../slices/user/userSlice';
import pageStatusSlice from '../slices/page/pageStatusSlice';
import recordingSlice from '../slices/recording/recordingSlice';
import reactionSlice from '../slices/reactions/reactionSlice';


export const store = configureStore({
    reducer: {
        feed: feedSlice,
        user: userSlice,
        pageStatus: pageStatusSlice,
        recording: recordingSlice,
        reactions: reactionSlice
    },
});