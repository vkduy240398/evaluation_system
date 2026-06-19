import { Table } from 'antd';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Typography from 'antd/es/typography';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import { RootState } from '../../../store';
import { AchievementAdditionalType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import achievementAdditionalColumn from './data/ColumnAchievementAdd';
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
  achievementAdditionals: AchievementAdditionalType[];
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

  // ** F6
  isF5?: boolean;
  status: number;
  isLoading: boolean | undefined;
}
const AchievementAdditionalComponent = (props: Props) => {
  // ** Props
  const {
    achievementAdditionals,
    isEditUserEvaluation,
    isEvaluatorUser,
    isF5,
    achievementAdditionalTotalPointUser,
    achievementAdditionalTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator2,
    isEditEvaluation05,
    isEditEvaluation1,
    isEditEvaluation2,
    status,
  } = props;
  const itemRowTotal: AchievementAdditionalType = {
    key: 'itemRowTotal',
    itemNo: 0,
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
  const [achievementAddSettings, setAchievementAddSetting] = useState<any[]>([]);
  const [ids, setId] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);
  const [evaluationAchievementAddOjb, setEvaluationAchievementAdd] = useState<any>(
    achievementAdditionals.reduce((pre, curr, index) => ({ ...pre, [index]: curr }), {}),
  );

  // ** Hook
  const storeLoading = useSelector((state: RootState) => state.loading);
  const store = useSelector((state: RootState) => state.userEvaluation);

  // ** Effect
  useEffect(() => {
    // const callback = (data: any[]) => {
    //   if (data && data.length > 0) {
    //     const options = data.map((v) => ({ value: v.point, label: v.rating }));
    //     setAchievementAddSetting(options);
    //   }

    //   moveToBottomPage();
    //   setLoading(false);
    // };

    if (achievementAdditionals.length > 0) {
      setDataSource([...achievementAdditionals.map((v) => ({ ...v }))]);
      const idList = achievementAdditionals.map((v) => v.itemNo);
      setId(Math.max(...idList));
      // setEvaluationAchievementAdd(achievementAdditionals);
    }

    // ** Call api
    // setLoading(true);
    // userEvaluationApiService.getAchievementAddPublic({
    //   achievementType: 1,
    //   callback,
    //   isEvaluatorUser,
    //   isF5: isF5,
    // });
  }, [storeLoading.isReloadComponent, achievementAdditionals]);

  // ** Functional
  const addNewRow = () => {
    if (dataSources.length < 50) {
      const id = ids + 1;
      const merges = [
        ...dataSources,
        {
          ...itemRow,
          key: `achievement-additional-component-key${id}`,
          evaluationOrder: isEditUserEvaluation ? 0 : isEditEvaluation05 ? 0.5 : isEditEvaluation1 ? 1 : 2,
        },
      ];
      setDataSource(merges);
      setId(id);
      // setEvaluationAchievementAdd(merges);
      window.scrollTo(0, document.body.scrollHeight);
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '50'));
  };

  const deleteRow = (key: string | number) => {
    const filters = dataSources.filter((f) => f.key !== key);
    setDataSource(filters);
  };

  const columns = achievementAdditionalColumn({
    achievementAddSettings,
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
        isLoading={isLoading || storeLoading.isLoading || storeLoading.isDetailLoading}
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

        // loading={isLoading}
      />

      <Button
        className="button-normal"
        type="primary"
        size="middle"
        onClick={addNewRow}
        style={{ marginTop: 10 }}
        hidden={!isEditUserEvaluation && !isEditEvaluation05 && !isEditEvaluation1 && !isEditEvaluation2}
        loading={storeLoading.isDetailLoading}
      >
        {t('IDS_BUTTON_ADD')}
      </Button>
    </>
  );
};

export default AchievementAdditionalComponent;
