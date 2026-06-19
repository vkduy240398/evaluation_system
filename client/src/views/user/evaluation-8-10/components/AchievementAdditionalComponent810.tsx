import { FormInstance, Grid, Table } from 'antd';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Typography from 'antd/es/typography';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AchievementAdditionalType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { RootState } from '../../../../store';
import achievementAdditionalColumn810 from '../data/ColumnAchievementAdd810';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
const itemRow: AchievementAdditionalType = {
  key: '',
  itemNo: 0,
  pointUser: '',
  titleAdditional: '',
  achievementStatus: '',
  reasonComment: '',
  pointEvaluator05: null,
  pointEvaluator1: null,
  pointEvaluator2: null,
  evaluationOrder: 0,
};

interface Props {
  achievementAdditionals: any[];
  isDisplayUserEvaluator: boolean;
  isEditUserEvaluation: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  // ** is user created
  isEvaluatorUser: boolean;

  // ** Achievement Additional
  achievementAdditionalTotalPointUser: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator2: number;
  form: FormInstance<any>;
  // ** F6
  isF5?: boolean;
  status?: number;
}
const AchievementAdditionalComponent810 = (props: Props) => {
  // ** Props
  const {
    achievementAdditionals,
    isEditUserEvaluation,
    achievementAdditionalTotalPointUser,
    achievementAdditionalTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator2,
    isEditEvaluation05,
    isEditEvaluation1,
    isEditEvaluation2,
    form,
  } = props;

  const itemRowTotal: AchievementAdditionalType = {
    key: 'itemRowTotal',
    itemNo: -1,
    pointUser: achievementAdditionalTotalPointUser,
    titleAdditional: t('IDS_SUB_TOTAL'),
    achievementStatus: '',
    reasonComment: null,
    pointEvaluator05: achievementAdditionalTotalPointEvaluator05,
    pointEvaluator1: achievementAdditionalTotalPointEvaluator1,
    pointEvaluator2: achievementAdditionalTotalPointEvaluator2,
    evaluationOrder: 0,
  };

  // ** State

  const [dataSources, setDataSource] = useState<AchievementAdditionalType[]>([]);
  const [ids, setId] = useState<number>(1);
  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [evaluationAchievementAddOjb, setEvaluationAchievementAdd] = useState<any>(
    achievementAdditionals.reduce((pre, curr, index) => ({ ...pre, [index]: curr }), {}),
  );
  // ** Hook
  const storeLoading = useSelector((state: RootState) => state.loading);
  const store = useSelector((state: RootState) => state.userEvaluation);
  // ** Effect
  useEffect(() => {
    if (achievementAdditionals.length > 0) {
      setDataSource([...achievementAdditionals.map((v) => ({ ...v }))]);
      const idList = achievementAdditionals.map((v) => v.itemNo);
      setId(Math.max(...idList));
    }
  }, [storeLoading.isReloadComponent, achievementAdditionals]);
  // ** Functional
  const addNewRow = () => {
    if (dataSources.length < 10) {
      const id = ids + 1;
      const merges = [
        ...dataSources,
        {
          ...itemRow,
          key: id,
          evaluationOrder: isEditUserEvaluation ? 0 : isEditEvaluation05 ? 0.5 : isEditEvaluation1 ? 1 : 2,
          type: 2,
          itemNo: id,
        },
      ];
      setDataSource(merges);
      setId(id);
      form.setFieldValue(`titleAdditional-key-${id}`, '');
      form.setFieldValue(`achievementStatus-key${id}`, undefined);
      form.setFieldValue(`reasonComment-key-${id}`, '');
      form.setFieldValue(`pointUser-key${id}`, undefined);
      form.setFieldValue(`pointEvaluator05-key${id}`, undefined);
      form.setFieldValue(`pointEvaluator1-key${id}`, undefined);
      form.setFieldValue(`pointEvaluator2-key${id}`, undefined);
      window.scrollTo(0, document.body.scrollHeight);
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
  };

  const deleteRow = (key: string | number) => {
    const filters = dataSources.filter((f) => f.key !== key);
    setDataSource(filters);
  };

  const columns = achievementAdditionalColumn810({
    deleteRow,
    setIsOpenPopUpConfirm,

    evaluationAchievementAddOjb,
    setEvaluationAchievementAdd,
    ...props,
  });

  const handleDeleteAdditional = () => {
    const { record, setEvaluationAchievementAdd } = store.deleteOptions;
    let findIndex: string | null = null;
    Object.keys(evaluationAchievementAddOjb).some((key) => {
      const element: any = evaluationAchievementAddOjb[key];
      if (element && element.key === record.key) return (findIndex = key);
    });

    if (findIndex) {
      delete evaluationAchievementAddOjb[findIndex];
      const converObj: any = Object.values(evaluationAchievementAddOjb).reduce(
        (pre: any, curr, index) => ({ ...pre, [index]: curr }),
        {},
      );
      setEvaluationAchievementAdd({ ...converObj });
    }
    deleteRow(record.key);
    setIsOpenPopUpConfirm(false);
  };

  return (
    <>
      {/* Header Tab */}
      <Typography.Title level={4}>{t('IDS_ADDITIONAL_GOALS')}</Typography.Title>
      {/* Table */}
      <TableCustomComponent
        dataSources={dataSources.length > 0 ? [...dataSources, itemRowTotal] : []}
        columns={columns}
        size="small"
        isLoading={storeLoading.isDetailLoading}
        isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
      />
      <ModalCustomComponent
        isOpen={isOpenPopUpConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_ADDITIONAL')}
        fnHandleOk={() => {
          handleDeleteAdditional();
        }}
        fnHandleCancel={() => setIsOpenPopUpConfirm(false)}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
      />

      <Button
        className="button-normal"
        type="primary"
        size="middle"
        onClick={addNewRow}
        style={{ marginTop: 10 }}
        loading={storeLoading.isDetailLoading}
        hidden={!isEditUserEvaluation && !isEditEvaluation05 && !isEditEvaluation1 && !isEditEvaluation2}
      >
        {t('IDS_BUTTON_ADD')}
      </Button>
    </>
  );
};

export default AchievementAdditionalComponent810;
