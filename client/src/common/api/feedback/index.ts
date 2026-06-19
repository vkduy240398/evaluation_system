import { HttpStatusCode } from 'axios';
import { Workbook } from 'exceljs';
import { t } from 'i18next';
import {
  Feedback,
  FeedbackCondition,
  FeedbackListSearchConditions,
  INonRelatedFeedbackSearchForm,
} from '../../../model/Feedback';
import HttpAxios from '../../http/';
import { message } from 'antd';

const listFeedback = async (
  conditions: FeedbackListSearchConditions,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/list-feedback`, {
    params: conditions,
  })
    .then((res: any) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const detailFeedback = async (feedbackId: any, callback: any, errorCallback: any) => {
  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/detail-feedback', {
    params: { feedbackId },
  }).then((res) => {
    if (res && res.status === 200) {
      if (res.data) {
        callback(res.data);
      } else errorCallback && errorCallback(res?.data);
    }
  });
};

const updateFeedback = async (params: any, callback: any, errorCallback: any) => {
  return await HttpAxios.Put(
    window.location.pathname.includes('admin-evaluation/list-feedback')
      ? '/api/v1/f5/management-evaluation-history/update-feedback'
      : '/api/v1/common/feedbacks',
    params,
  ).then(async (res) => {
    if (res && res.status === 200) callback && (await callback(res.data));
    else errorCallback && errorCallback(res?.data);
  });
};
const downloadExcel = (conditions: any, callBack: (dataSource: any) => void, setLoading: (bool: boolean) => void) => {
  setLoading(true);

  return HttpAxios.Get(`/api/v1/f5/management-evaluation-history/list-feedback/excel-download`, {
    params: conditions,
  })
    .then(async (res: any) => {
      if (res && res.status === 200) {
        const buffer = await bufferListFeedback(res?.data);
        callBack && callBack(buffer);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};
const bufferListFeedback = async (
  dataExports: {
    id: number;
    subject: string;
    type: 0 | 1;
    status: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    employeeNumber: number;
    fullName: string;
    level: number;
    departmentName: string;
    divisionName: string;
    sendTime: string;
    link: string;
    description: string;
  }[],
) => {
  const typeObject = {
    0: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT'),
    1: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG'),
  };
  const statusObject = {
    1: t('IDS_STATUS_OPTIONS.IDS_SAVE_DRAFT'),
    2: t('IDS_STATUS_OPTIONS.IDS_SUBMIT'),
    3: t('IDS_STATUS_OPTIONS.IDS_APPROVE'),
    4: t('IDS_STATUS_OPTIONS.IDS_PENDING'),
    5: t('IDS_STATUS_OPTIONS.IDS_CLOSE'),
    6: t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS'),
    7: t('IDS_STATUS_OPTIONS.IDS_DONE'),
  };
  const datas = dataExports.map((v) => ({
    ...v,
    type: typeObject[v.type],
    status: statusObject[v.status],
    userName: `${v.employeeNumber} : ${v.fullName}`,
    action: v.link ? { text: t('IDS_LINK_DOWNLOAD'), hyperlink: v.link } : '',
    departmentName: v.level >= 8 ? v.divisionName : v.departmentName,
  }));

  const workBook = new Workbook();
  const worksheet = workBook.addWorksheet('sheet1', {
    properties: { tabColor: { argb: 'FFC0000' } },
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  // const rowFirst: any = {};
  const columns = [
    { header: t('IDS_SUBJECT'), key: 'subject', width: 20 },
    { header: t('IDS_TYPE_FEEDBACK'), key: 'type', width: 30 },
    { header: t('IDS_STATUS'), key: 'status', width: 30 },
    { header: t('IDS_USER'), key: 'userName', width: 30 },
    { header: t('IDS_DEPARTMENT'), key: 'departmentName', width: 30 },
    { header: t('IDS_TIME_CREATED'), key: 'sendTime', width: 17 },
    { header: t('IDS_ACTION'), key: 'action', width: 15 },
  ];
  worksheet.columns = columns;
  worksheet.addRows(datas);
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }, // Mã màu vàng
    };
    cell.font = {
      bold: true,
    };
  });
  worksheet.properties.showGridLines = false;
  const createOuterBorder = (
    worksheet: any,
    start = { row: 0, col: 0 },
    end = { row: 10, col: 10 },
    borderWidth = 'thin',
  ) => {
    const borderStyle = {
      style: borderWidth,
    };
    for (let i = start.row; i <= end.row; i++) {
      for (let j = start.col; j <= end.col; j++) {
        const leftBorderCell = worksheet.getCell(i, j);
        leftBorderCell.alignment = { wrapText: true };
        leftBorderCell.border = {
          ...leftBorderCell.border,
          left: borderStyle,
          right: borderStyle,
          top: borderStyle,
          bottom: borderStyle,
        };
        if (i > 1 && j === end.col) leftBorderCell.font = { color: { argb: 'FF0000FF' }, underline: true };
      }
    }
  };
  createOuterBorder(worksheet, { row: 1, col: 1 }, { row: worksheet.rowCount, col: worksheet.columnCount });

  //format align center cho dong action
  worksheet.getColumn(7).alignment = {
    wrapText: true,
    horizontal: 'center',
    vertical: 'middle',
  };
  // format dong dau tien => canh giua header
  for (let i = 1; i <= 7; i++) {
    worksheet.getCell(1, i).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
  }

  const buffer = await workBook.xlsx.writeBuffer();

  return buffer;
};

const listUserFeedback = async (
  condition: FeedbackCondition,
  success: (rows: Feedback[], count: number) => void,
  error: () => void,
) => {
  const url =
    condition.role === 'user'
      ? '/api/v1/common/feedbacks'
      : condition.role === 'admin'
      ? '/api/v1/f5/management-evaluation-history/feedbacks'
      : '/api/v1/f9/system-admin/feedbacks';

  return await HttpAxios.Post(url, condition)
    .then((res) => {
      if (res && res.status === HttpStatusCode.Created) {
        success && success(res?.data?.rows, res?.data?.count);
      } else {
        error();
      }
    })
    .catch((_error) => error());
};

const getFeedbacksForExcel = async (
  condition: FeedbackCondition,
  success: (rows: Feedback[], count: number) => void,
  error: () => void,
) => {
  const url =
    condition.role === 'admin'
      ? '/api/v1/f5/management-evaluation-history/feedbacks/excel'
      : '/api/v1/f9/system-admin/feedbacks/excel';

  try {
    const res = await HttpAxios.Post(url, condition);
    if (res?.status === HttpStatusCode.Ok) {
      success(res.data.rows, res.data.count);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const createFeedback = async (feedback: FormData, success: (newFeedback: Feedback) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/common/feedbacks/create', feedback);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const deleteFeedbacks = async (ids: number[], success: () => void, error: () => void) => {
  try {
    const res = await HttpAxios.Delete('/api/v1/common/feedbacks', {
      params: { ids },
    });
    if (res?.status === HttpStatusCode.Ok) {
      success();
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const getUserFeedback = async (id: number, callback: (feedback: Feedback) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Get('/api/v1/common/feedbacks/' + id);
    if (res?.status === HttpStatusCode.Ok) {
      await callback(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const downloadFileFeedback = async (params: any, callback: any, setLoading: any) => {
  return await HttpAxios.Get(
    window.location.pathname.includes('system-admin/list-feedback')
      ? `/api/v1/f9/system-admin/feedbacks/${params.id}/file`
      : `/api/v1/common/feedbacks/${params.id}/file`,
    {
      params: { fileName: params.fileName },
    },
  ).then((res: any) => {
    if (res && res.status === 200) {
      callback && callback(res?.data);
      setLoading(false);
    } else {
      message.error(t('MESSAGE.COMMON.IDM_FILE_NOT_FOUND'));
      setLoading(false);
    }
  });
};

const downloadFileFromExcel = (
  params: { id: string },
  callback: (data: any) => Promise<void>,
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsDownloading(true);
  HttpAxios.Get('/api/v1/common/download-file-from-excel', { params: params }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res?.data);
      setIsDownloading(false);
      setIsSuccess(true);
    } else {
      setIsDownloading(false);
      setIsSuccess(false);
    }
  });
};

const userAddComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/common/add-comment', data);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const userEditComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/common/edit-comment', data);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const systemAdminEditComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/f9/system-admin/edit-comment', data);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const userDeleteComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Put('/api/v1/common/delete-comment', data);
    if (res?.status === HttpStatusCode.Ok) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const systemAdminDeleteComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Put('/api/v1/f9/system-admin/delete-comment', data);
    if (res?.status === HttpStatusCode.Ok) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const systemAdminAddComment = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/f9/system-admin/add-comment', data);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const systemAdminAddCommentAllRelated = async (data: any, success: (result: string) => void, error: () => void) => {
  try {
    const res = await HttpAxios.Post('/api/v1/f9/system-admin/add-comment-all-related', data);
    if (res?.status === HttpStatusCode.Created) {
      success(res.data);
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const getComments = async (feedbackId: number, callback: (data: any) => void, errorCallback: (data: any) => void) => {
  return await HttpAxios.Get('/api/v1/common/get-comments', {
    params: { feedbackId },
  }).then((res) => {
    if (res && res.status === 200) {
      if (res.data) {
        callback(res.data);
      } else errorCallback && errorCallback(res?.data);
    }
  });
};

const getNonRelatedFeedbacks = async (
  originalFeedbackId: number,
  criteria: INonRelatedFeedbackSearchForm & { limit: number; offset: number },
  success: (data: { rows: Feedback[]; count: number }) => void,
  error: any,
) => {
  try {
    const res = await HttpAxios.Post('/api/v1/f9/system-admin/feedbacks/non-related', {
      ...criteria,
      originalFeedbackId,
    });
    if (res?.status === HttpStatusCode.Ok) {
      success(res.data);
    } else {
      error();
    }
  } catch (e) {
    error();
  }
};

const addRelatedFeedback = async (
  originalFeedbackId: number,
  ids: number[],
  success: () => void,
  error: () => void,
) => {
  try {
    const res = await HttpAxios.Put(`/api/v1/f9/system-admin/feedbacks/${originalFeedbackId}/related`, { ids });
    if (res?.status === HttpStatusCode.Ok) {
      success();
    } else {
      error();
    }
  } catch (_) {
    error();
  }
};

const feedbackApiService = {
  listFeedback,
  detailFeedback,
  updateFeedback,
  downloadExcel,
  downloadFileFeedback,
  downloadFileFromExcel,
  listUserFeedback,
  createFeedback,
  deleteFeedbacks,
  getUserFeedback,
  userAddComment,
  userEditComment,
  userDeleteComment,
  systemAdminAddComment,
  systemAdminAddCommentAllRelated,
  systemAdminEditComment,
  systemAdminDeleteComment,
  getComments,
  getNonRelatedFeedbacks,
  addRelatedFeedback,
  getFeedbacksForExcel,
};
export default feedbackApiService;
