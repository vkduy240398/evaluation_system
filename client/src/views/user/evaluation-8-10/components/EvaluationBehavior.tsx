import React from 'react';
import { BasicBehaviorSkillType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { statusEvaluationType } from '../../../../common/status';
import { useSelector } from 'react-redux';
import { Form, Grid, Table, Typography } from 'antd';
import { t } from 'i18next';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import BehaviorSkillColumns from './BehaviorSkillColumns';
import { EvaluatorInfo } from '../interfaces/response.interface';
import { RootState } from '../../../../store';

interface Props {
  isF5?: boolean;
  level: number;

  isNoSkill?: boolean;
  statusEvaluation: statusEvaluationType;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  form: any;
  listBehaviors: BasicBehaviorSkillType[];
  setBehavior?: any;
  role: string;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  isDisable: boolean;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  pointListBehaviors: {
    label: string;
    value: number;
  }[];
  isLoading: boolean;
  evaluationData?: any;
  isReview?: boolean;
  typeReview?: number;
  location: any;
}
const EvaluationBehavior = React.memo(
  (props: Props) => {
    const {
      form,
      statusEvaluation,
      listBehaviors,
      setBehavior,
      role,
      isEvaluationDate,
      isGoalDate,
      isDisable,
      listEvalutors,
      allowSeeList,
      maxOrder,
      pointListBehaviors,
      isLoading,
      evaluationData,
      isReview,
      typeReview,
      location,
    } = props;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const storeLoading = useSelector((state: RootState) => state.loading);
    const store = useSelector((state: RootState) => state.calculateTotal);
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
    // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Infos.length > 0){
    //   isDisplay05 = true;
    // }
    // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Infos.length > 0){
    //   isDisplay1 = true;
    // }
    // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Infos.length > 0){
    //   isDisplay2 = true;
    // }

    const columns = BehaviorSkillColumns({
      listBehaviors: listBehaviors,
      form,
      status: statusEvaluation,
      role,
      isEvaluationDate,
      isGoalDate,
      isDisable,
      listEvalutors: listEvalutors,
      allowSeeList,
      maxOrder,
      store,
      setBehavior: setBehavior,
      pointListBehaviors: pointListBehaviors,
      location,
    });

    return (
      <>
        <Typography.Title level={4}>{t('IDS_BEHAVIOR')}</Typography.Title>
        <Form form={form}>
          <TableCustomComponent
            columns={columns}
            dataSources={listBehaviors}
            isLoading={isLoading || storeLoading.isLoading}
            size="small"
            isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
            summary={() =>
              listBehaviors.length > 0 && ((statusEvaluation >= 50 && isEvaluationDate) || statusEvaluation > 50) ? (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="center" className="cell-total">
                      {t('IDS_SUB_TOTAL')}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={
                        (role == 'user' && ((isEvaluationDate && statusEvaluation >= 50) || statusEvaluation > 50)) ||
                        statusEvaluation == 100 ||
                        maxOrder > '0.0' ||
                        (location.evaluatorOrderExcep && location.evaluatorOrderExcep > 0) ||
                        role === 'admin' ||
                        (isReview && typeReview === 4)
                          ? 1
                          : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.behaviorTotalPointUser}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={
                        (role !== 'user' && isDisplay05 && statusEvaluation > 53) ||
                        (statusEvaluation == 100 && comment05Infos[0])
                          ? 1
                          : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {statusEvaluation < 99
                        ? store.behaviorTotalPointEvaluator05
                        : evaluationData.behaviorTotalPointEvaluator05}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={
                        (role !== 'user' && isDisplay1 && statusEvaluation > 56) ||
                        (statusEvaluation == 100 && comment1Infos[0])
                          ? 1
                          : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.behaviorTotalPointEvaluator1}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={
                        (role !== 'user' && isDisplay2 && statusEvaluation > 59) ||
                        (statusEvaluation == 100 && comment2Infos[0])
                          ? 1
                          : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.behaviorTotalPointEvaluator2}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              ) : (
                <div></div>
              )
            }
          />
        </Form>
      </>
    );
  },
  (prev, next) => {
    return prev.isLoading === next.isLoading;
  },
);

export default EvaluationBehavior;
