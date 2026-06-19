import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
export const startExport = createAsyncThunk('/export/start', () => true);
export const updateExportProgress = createAsyncThunk('/export/update', (progress: number) => progress);
export const updateExportMessage = createAsyncThunk('/export/update-message', (text: string) => text);
export const finishExport = createAsyncThunk('/export/finish', () => true);
export const resetExport = createAsyncThunk('/export/reset', () => true);
export const errorExport = createAsyncThunk('/export/error', () => true);

export const excelStore = createSlice({
  name: 'export',
  initialState: {
    isShowNotification: false,
    isExporting: false,
    progress: 0,
    messageText: '',
    isShowProgressBar: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(startExport.fulfilled, (state) => {
      state.isExporting = true;
      state.isShowNotification = true;
      state.progress = 0;
      state.messageText = t('IDS_EXCEL.IDS_WAITING_DATA'); // ✅ mặc định khi bắt đầu
      state.isShowProgressBar = false;
    });

    builder.addCase(updateExportProgress.fulfilled, (state, action) => {
      state.progress = action.payload;
      state.isShowProgressBar = true;
    });

    builder.addCase(updateExportMessage.fulfilled, (state, action) => {
      state.messageText = t('IDS_EXCEL.IDS_FILE_TOTAL').replace('{number}', action.payload || '');
      state.isShowProgressBar = true;
    });

    builder.addCase(finishExport.fulfilled, (state) => {
      state.progress = 100;
      state.isExporting = false;
      state.isShowProgressBar = false;
      state.messageText = t('IDS_EXCEL.IDS_SUCCESS_EXCEL');
    });

    builder.addCase(resetExport.fulfilled, (state) => {
      state.progress = 0;
      state.isExporting = false;
      state.isShowNotification = false;
      state.messageText = '';
      state.isShowProgressBar = false;
    });

    builder.addCase(errorExport.fulfilled, (state) => {
      state.progress = -1;
      state.isExporting = false;
      state.isShowProgressBar = false;
      state.messageText = t('IDS_EXCEL.IDS_ERROR_EXCEL');
      state.isShowNotification = true;
    });
  },
});

export default excelStore.reducer;
