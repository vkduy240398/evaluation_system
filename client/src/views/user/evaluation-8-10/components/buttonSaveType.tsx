/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { t } from 'i18next';
import { EvaluationPersonalAchievement } from '../interfaces/response.interface';

interface Props {
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  dataSource: EvaluationPersonalAchievement[];
  status: number;
  role: string;
  isLoading: boolean;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  scroll?: any;
}
const ButtonSaveType: React.FC<any> = (props: Props) => {
  const { role, status, handleSaveDraft, handleSubmit, isLoading, isEvaluationDate, isGoalDate } = props;

  const store = useSelector((state: RootState) => state.calculateTotal);

  return (
    <>
      {role && role !== 'admin' && !store.isDisable && (
        <>
          {((role === 'user' && [0, 1, 2].includes(status) && isGoalDate) ||
            (role === 'user' && [51, 52].includes(status) && isEvaluationDate) ||
            (role === 'user' && status == 50 && isEvaluationDate) ||
            (role === 'evaluator' && store.hasMode3 && isEvaluationDate)) && (
            <Row>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                onClick={handleSaveDraft}
                loading={isLoading}
                disabled={store.isDisable || isLoading}
                style={{ marginRight: 10, marginBottom: '5' }}
              >
                {t('IDS_BUTTON_SAVE_DRAFT')}
              </Button>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                onClick={() => handleSubmit()}
                loading={isLoading}
                disabled={store.isDisable || isLoading}
                style={{ marginBottom: '5' }}
              >
                {t('IDS_BUTTON_SUBMIT')}
              </Button>
            </Row>
          )}
        </>
      )}
    </>
  );
};
export default ButtonSaveType;
