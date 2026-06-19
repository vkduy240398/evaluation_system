// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit';

// ** Reducers
import loading from './loading';
import userEvaluation from './userEvaluation';
import calculateTotal from './total';
import exceptionF7 from './exception';
import userFeedbackReducer from './feedback/user-feedback.slice';
import excelStore from './excel';

export const store = configureStore({
  reducer: { loading, userEvaluation, calculateTotal, exceptionF7, userFeedbackReducer, excelStore },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
