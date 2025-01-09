import { createSlice } from '@reduxjs/toolkit';

const pageStatusSlice = createSlice({
  name: 'pageStatusSlice',
  initialState: {
    isLoading: true,
    isError: false,
    errorMessage: '',
    currentPage: '/',
    goBackTo: '',
  },
  reducers: {
    startLoading: state => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = '';
    },
    loadingSuccess: state => {
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = '';
    },
    loadingFailed: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    setGoBackTo: (state, action) => {
      state.goBackTo = action.payload;
    },
  },
});

export const { startLoading, loadingSuccess, loadingFailed, setGoBackTo } =
  pageStatusSlice.actions;

export default pageStatusSlice.reducer;
