import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setLoadingRedux = createAsyncThunk('/loading/isLoadingButton', (isLoading: boolean) => isLoading);

// ** Reload Component
export const reloadComponent = createAsyncThunk('/loading/reload-component', (data: boolean) => data);

export const setDetailLoading = createAsyncThunk('/loading/loading-detail', (data: boolean) => data);
export const loading = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false as boolean,
    isReloadComponent: false as boolean,
    isDetailLoading: false as boolean,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setLoadingRedux.fulfilled, (state, action) => {
      state.isLoading = action.payload;
    });

    builder.addCase(reloadComponent.fulfilled, (state, action) => {
      state.isReloadComponent = action.payload;
    });
    builder.addCase(setDetailLoading.fulfilled, (state, action) => {
      state.isDetailLoading = action.payload;
    });
  },
});

export default loading.reducer;
