import React, { useEffect, startTransition, useReducer, useState } from 'react';
import { statusEvaluationType } from '../../../../common/status';
import { NotificationPlacement } from 'antd/es/notification/interface';
import {
  EvaluationAdditionalAchievementNew,
  EvaluatorInfo,
  SettingAchievementAdditional,
} from '../interfaces/response.interface';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import EvaluationAchievementNewColumn from './EvaluationAchievementNewColumn';
import { Button, Form, Table, Typography } from 'antd';
import { t } from 'i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  evaluationListAchievementAdditionals,
  evaluationTotalPointAchievementEvaluator05,
  evaluationTotalPointAchievementEvaluator1,
  evaluationTotalPointAchievementEvaluator2,
  evaluationTotalPointAchievementUser,
} from '../../../../store/total';
import { useSelector } from 'react-redux';
import { handleDataForm } from '../services/EvaluationAchievement';
import { get2WithoutRound } from './valildateInputField';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { FormInstance } from 'antd/lib';
type Action =
  | { type: 'ADD'; payload: EvaluationAdditionalAchievementNew; oldData: EvaluationAdditionalAchievementNew[] }
  | { type: 'DELETE'; index: number; payload: EvaluationAdditionalAchievementNew[] }
  | { type: 'INITIAL_VALUE'; payload: EvaluationAdditionalAchievementNew[] };
const reducerHandle = (
  state: EvaluationAdditionalAchievementNew[],
  action: Action,
): EvaluationAdditionalAchievementNew[] => {
  switch (action.type) {
    case 'INITIAL_VALUE':
      return action.payload;
    case 'ADD':
      return [...action.oldData, action.payload];
    case 'DELETE':
      return action.payload.filter((_v, i) => i !== action.index);
    default:
      return state;
  }
};
interface Props {
  isF5?: boolean;
  level: number;
  isNoSkill?: boolean;
  statusEvaluation: statusEvaluationType;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  form: FormInstance;
  role: string;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  isDisable: boolean;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;

  // achievementAdditionalGoals: EvaluationAdditionalAchievementNew[];
  // dispatchAddPersonal: React.Dispatch<Action>;
  pointAchievementAdditionals: SettingAchievementAdditional[];
  isLoading: boolean;
  location: any;
}
type KeyObject = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';
type keyPoint = 'S' | 'A' | 'B' | 'C';

const EvaluationAchievementPersonal = React.memo((props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.calculateTotal);
  const storeLoading = useSelector((state: RootState) => state.loading);
  const {
    // achievementAdditionalGoals,
    // dispatchAddPersonal,
    allowSeeList,
    form,
    isDisable,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    maxOrder,
    role,
    statusEvaluation,
    pointAchievementAdditionals,
    isLoading,
    location,
  } = props;
  const [achievementAdditionalGoals, dispatchAddPersonal] = useReducer(
    reducerHandle,
    store.evaluationAchievementAdditionals || [],
  );
  const [isOpen, setIsOpen] = useState<{ data: EvaluationAdditionalAchievementNew[]; index: number; isOpen: boolean }>({
    isOpen: false,
    index: -1,
    data: [],
  });
  const openPopupConfirmDelete = (data: any[], index: number) => {
    setIsOpen((state) => ({ ...state, data, index, isOpen: true }));
  };
  const handleConfirmDelete = () => {
    setIsOpen((state) => ({ ...state, isOpen: false }));

    // =====================================================
    const filterPersonalForms =
      form.getFieldsValue(['achivement_personal']) &&
      form.getFieldsValue(['achivement_personal']).achivement_personal !== undefined &&
      form.getFieldsValue(['achivement_personal']).achivement_personal.filter((v: any) => v !== undefined);
    dispatchAddPersonal({
      type: 'DELETE',
      index: isOpen.index,
      payload: filterPersonalForms,
    });
    dispatch(
      evaluationListAchievementAdditionals(filterPersonalForms.filter((_v: any, i: number) => i !== isOpen.index)),
    );
  };
  const columns: any = EvaluationAchievementNewColumn({
    setDataSource: dispatchAddPersonal,
    dataSources: achievementAdditionalGoals,
    dispatch,
    role,
    allowSeeList,
    isDisable,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    maxOrder,
    store,
    status: statusEvaluation,
    form,
    pointAchievementAdditionals,
    openPopupConfirmDelete,
    location,
  });
  const pointList = pointAchievementAdditionals.reduce((acc, { rating, point }) => {
    acc[rating.toString()] = point; // Convert point to a number

    return acc;
  }, {} as Record<string, number>);

  const handleTotal = (key: KeyObject) => {
    if (achievementAdditionalGoals.filter((e: any) => e?.[key] !== null && e?.[key] !== undefined).length <= 0)
      return null;

    const totalScore = achievementAdditionalGoals
      .filter((v) => v[key])
      .reduce((acc: any, curr: any) => {
        const char: keyPoint = curr[key];

        return acc + (Object.keys(pointList).length > 0 ? Number(pointList[char].toString()) : 0);
      }, 0);

    return totalScore || achievementAdditionalGoals.length > 0 ? get2WithoutRound(totalScore) : null;
  };
  const comment05Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '0.5';
  });
  const comment1Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '1.0';
  });
  const comment2Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '2.0';
  });
  let isDisplay05: number | boolean = role === 'admin' && comment05Infos.length;
  let isDisplay1: number | boolean = role === 'admin' && comment1Infos.length;
  let isDisplay2: number | boolean = role === 'admin' && comment2Infos.length;
  allowSeeList.forEach((item: EvaluatorInfo) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });

  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Infos[0]) {
    isDisplay05 = true;
  }
  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Infos[0]) {
    isDisplay1 = true;
  }
  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Infos[0]) {
    isDisplay2 = true;
  }

  useEffect(() => {
    form.setFieldsValue({
      achivement_personal: achievementAdditionalGoals.map((item) => ({
        titleAdditional: item.titleAdditional,
        achievementStatus: item.achievementStatus,
        reasonComment: item.reasonComment,
        pointUser: item.pointUser,
        pointEvaluator05: item.pointEvaluator05,
        pointEvaluator1: item.pointEvaluator1,
        pointEvaluator2: item.pointEvaluator2,
        evaluationOrder: item.evaluationOrder,
      })),
    });
    if (statusEvaluation < 100 && isEvaluationDate) {
      dispatch(evaluationTotalPointAchievementUser(handleTotal('pointUser')));
      dispatch(evaluationTotalPointAchievementEvaluator05(handleTotal('pointEvaluator05')));
      dispatch(evaluationTotalPointAchievementEvaluator1(handleTotal('pointEvaluator1')));
      dispatch(evaluationTotalPointAchievementEvaluator2(handleTotal('pointEvaluator2')));
    }
  }, [achievementAdditionalGoals]);

  return (
    <>
      <Typography.Title level={4}>{t('IDS_ADDITIONAL_GOALS')}</Typography.Title>
      <Form form={form}>
        <TableCustomComponent
          columns={columns}
          size="small"
          dataSources={achievementAdditionalGoals}
          isLoading={storeLoading.isDetailLoading}
          summary={() =>
            achievementAdditionalGoals.length > 0 ? (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ padding: 0 }}>
                  <Table.Summary.Cell index={0} colSpan={3} align="center" className="cell-total">
                    {t('IDS_SUB_TOTAL')}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={1} align="center" className="cell-total">
                    {store.achievementUser !== null && store.achievementUser !== undefined
                      ? Number(store.achievementUser)
                      : null}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay05 && statusEvaluation > 53) ||
                      (statusEvaluation == 100 && comment05Infos[0])
                        ? 1
                        : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {handleTotal('pointEvaluator05')}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay1 && statusEvaluation > 56) ||
                      (statusEvaluation == 100 && comment1Infos[0])
                        ? 1
                        : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {handleTotal('pointEvaluator1')}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay2 && statusEvaluation > 59) ||
                      (statusEvaluation == 100 && comment2Infos[0])
                        ? 1
                        : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {handleTotal('pointEvaluator2')}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            ) : (
              <></>
            )
          }
        />
        <Button
          className="button-normal"
          type="primary"
          size="middle"
          style={{ marginTop: 10 }}
          hidden={
            !(
              (role === 'user' && [50, 51, 52].includes(statusEvaluation) && isEvaluationDate && !store.isDisable) ||
              (role === 'evaluator' &&
                (([54, 55].includes(statusEvaluation) && store.maxOrder === '0.5' && isEvaluationDate) ||
                  ([57, 58].includes(statusEvaluation) && store.maxOrder === '1.0' && isEvaluationDate) ||
                  ([60, 61].includes(statusEvaluation) && store.maxOrder === '2.0' && isEvaluationDate)))
            )
          }
          onClick={async () => {
            await handleDataForm({
              dataSources: achievementAdditionalGoals,
              dispatch,
              form,
              dispatchAddPersonal,
              startTransition,
              store,
              evaluationId: 0,
            });
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('IDS_BUTTON_ADD')}
        </Button>
      </Form>
      <ModalCustomComponent
        isOpen={isOpen?.isOpen}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_ADDITIONAL')}
        fnHandleOk={handleConfirmDelete}
        fnHandleCancel={() => setIsOpen((state) => ({ ...state, isOpen: false }))}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}

        // loading={isLoading}
      />
    </>
  );
});

export default EvaluationAchievementPersonal;
