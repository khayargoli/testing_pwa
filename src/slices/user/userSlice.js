import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedUser: {},
    userDetails:null
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setFollowStatus: (state, action) => {
            const status = action.payload;
            state.selectedUser.isFollowing = status;
            
            if(status)  state.selectedUser.followers++;
            else state.selectedUser.followers--;
        },
        setUserDetails:(state,action) =>{
            state.userDetails = action.payload;
        }
    },
});


export const {
    setSelectedUser,
    setFollowStatus,
    setUserDetails,
} = userSlice.actions;

export default userSlice.reducer;