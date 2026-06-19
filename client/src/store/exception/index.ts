import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// ** Display error
export const setErrorExceptionDate = createAsyncThunk('/exception/errorDate', (data: boolean) => data);

export const exceptionF7 = createSlice({
  name: 'loading',
  initialState: {
    isError: false as boolean,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setErrorExceptionDate.fulfilled, (state, action) => {
      state.isError = action.payload;
    });
  },
});

export default exceptionF7.reducer;
