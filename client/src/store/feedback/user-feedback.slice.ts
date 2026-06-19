import { Feedback } from '../../model/Feedback';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserFeedbackState {
  data: Feedback[];
  isTableLoading: boolean;
}

const initialState: UserFeedbackState = {
  data: [],
  isTableLoading: false,
};

export const fetchFeedbacks = createAsyncThunk('userFeedback/fetchFeedbacks', async () => {
  // TODO: Fetch API
  return new Promise<Feedback[]>((resolve) => {
    setTimeout(() => {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks') ?? '[]', (key, value) =>
        key === 'createdTime' ? new Date(value) : value,
      ) as Feedback[];
      feedbacks.sort((f1, f2) => f2.sendTime.localeCompare(f1.sendTime));
      resolve(feedbacks);
    }, 500);
  });
});

export const userFeedbackSlice = createSlice({
  name: 'userFeedback',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Feedback[]>) => {
      state.data = action.payload;
    },
    setTableLoading: (state, action: PayloadAction<boolean>) => {
      state.isTableLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isTableLoading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isTableLoading = false;
      })
      .addCase(fetchFeedbacks.rejected, (state) => {
        state.isTableLoading = false;
      });
  },
});

export const { setData, setTableLoading } = userFeedbackSlice.actions;

export default userFeedbackSlice.reducer;
