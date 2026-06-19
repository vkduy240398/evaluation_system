import { t } from 'i18next';
import { DetailNotificationModel } from '../../../model/version-notification/DetailNotificationModel';

interface ValidateProps {
  form: any;
  dataSource: DetailNotificationModel;
  onValidateForm: any;
  dispatch: any;
  setFocusLevelError: any;
  setIsOpenSavePublicConfirm: any;
}

export const onValidateSavePublic = async (props: ValidateProps) => {
  await props.form
    .validateFields()
    .then(async () => {
      if (!props.dataSource.reason || props.dataSource.reason === '') {
        props.onValidateForm('', `${t('IDS_PLACEHOLDER_HISTORY_EDIT')}：　${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}`);
      } else if (!props.dataSource.content || props.dataSource.content === '') {
        props.onValidateForm('', `${t('IDS_PLACEHOLDER_HISTORY_EDIT')}：　${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}`);
      } else {
        props.setIsOpenSavePublicConfirm(true);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
