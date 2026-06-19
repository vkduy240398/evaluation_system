import { message } from 'antd';
import { HandleErrorProps } from './type';
import { t } from 'i18next';
import { HttpStatusCode } from 'axios';

export const handlingError = async (error: HandleErrorProps) => {
  if (error.response) {
    if (
      error.response.status === HttpStatusCode.InternalServerError ||
      error.response.status === HttpStatusCode.BadRequest
    )
      message.error(t('MESSAGE.COMMON.IDM_INTERNAL_SERVER_ERROR'));

    if (error.response.status === HttpStatusCode.TooManyRequests)
      message.error({
        content: t('MESSAGE.COMMON.IDM_LOGIN_EXPIRED').replace(
          '{0}',
          Math.ceil(Number(error.response.headers['retry-after']) / 60).toString(),
        ),
      });

    if (error.response.status === HttpStatusCode.RequestTimeout) message.error(t('MESSAGE.COMMON.IDM_TIMEOUT_ERROR'));

    if (error.response.status === HttpStatusCode.Conflict)
      message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));

    if (error.response.status === HttpStatusCode.NotAcceptable)
      message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_APPROVE_PRO_SKILL'));

    if (error.response.status === HttpStatusCode.Gone) message.error(t('MESSAGE.COMMON.IDS_NOT_SET_SUB_DIVISION'));

    if (error.response.status === HttpStatusCode.Unauthorized) {
      if (!window.location.pathname.includes('/login')) {
        window.location.assign('/login');

        return;
      } else {
        return error.response;
      }
    }

    if (error.response.status === HttpStatusCode.MethodNotAllowed) {
      // await message.error(t('MESSAGE.COMMON.IDM_INFO_USER_DELETED'));
      window.location.assign('/login');
    }

    if (error.response.status === HttpStatusCode.Forbidden) {
      await message.error(t('MESSAGE.COMMON.IDM_INFO_USER_CHANGED_ROLE'), 1);
      window.location.assign('/home');
    }

    if (error.response.status === HttpStatusCode.PreconditionFailed) {
      message.error(t('MESSAGE.COMMON.IDM_PERIOD_FIXED'));
    }

    if (error.response.status === HttpStatusCode.NotFound) {
      window.location.assign('/404page');
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    message.error(t('MESSAGE.COMMON.IDM_TIMEOUT_ERROR'));
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
};
