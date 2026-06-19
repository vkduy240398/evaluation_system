import { NavigateFunction } from 'react-router-dom';
import evaluationCriteriApiService from '../../../../../common/api/evaluationCritea';
import { DataValuesCriteriaEvaluation } from '../../detail/InterfacesProps';
import { FormInstance } from 'antd';
import { urlCompanyCode } from '../../../../../common/util';

export const handlePopupConfirm = async (
  types: {
    type: string;
    content: string;
    textButton: string;
    open: boolean;
  },
  dataSources: DataValuesCriteriaEvaluation,
  navigate: NavigateFunction,
  form: FormInstance<any>,
  state: any,
  callBackCancel: (bool: boolean) => Promise<void>,
  callBackErrorCancel: (bool: boolean) => void,
  callBackPrivate: (data: any) => Promise<void>,
  errorsCallback: (bool: boolean) => void,
  callBackPublic: (data: any) => Promise<void>,
  isChangeContent: boolean,
  isChangeNote: boolean,
  contents: string,
  notes: string,
) => {
  if (types.type === 'cancel') {
    if (dataSources.data.status === 1) {
      await evaluationCriteriApiService.cancelVersion(
        `/api/v1/f6/management-evaluation/criteria-evaluation/cancel-version/${state.id}`,
        dataSources.data,
        callBackCancel,
        callBackErrorCancel,
      );
    } else {
      navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/detail/${state.id}`, {
        state: {
          id: state.id,
        },
      });
    }
  } else if (types.type === 'private') {
    form
      .validateFields()
      .then(() => {
        dataSources.data.reason = form.getFieldValue('reason');
        dataSources.data.contentEvaluationCriteria = form.getFieldValue('contend');
        dataSources.data.contentNotes = form.getFieldValue('note');
        evaluationCriteriApiService.savePrivateVersion(
          `/api/v1/f6/management-evaluation/${state.id}/save-private-version-criteria-evaluation`,
          dataSources.data,
          callBackPrivate,
          errorsCallback,
        );
      })
      .catch(() => {});
  } else {
    form
      .validateFields()
      .then(async () => {
        dataSources.data.reason = form.getFieldValue('reason');
        dataSources.data.contentEvaluationCriteria = isChangeContent ? contents : form.getFieldValue('contend');
        dataSources.data.contentNotes = isChangeNote ? notes : form.getFieldValue('note');
        await evaluationCriteriApiService.savePublicVersion(
          `/api/v1/f6/management-evaluation/${state.id}/save-public-version-criteria-evaluation`,
          dataSources.data,
          callBackPublic,
          errorsCallback,
        );
      })
      .catch(() => {});
  }
};
