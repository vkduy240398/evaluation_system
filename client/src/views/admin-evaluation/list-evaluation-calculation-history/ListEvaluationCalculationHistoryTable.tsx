import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

import {
  ConditionListEvaluationCalculationHistory,
  ListEvaluationCalculationHistory,
} from '../../../model/evaluation-calculation/ListEvaluationCalculationHistoryModel';
import { t } from 'i18next';
import { getListEvaluationCalculationHistoryColumn } from './ListEvaluationCalculationHistoryColumn';
import { VersionSettingType } from '../../../constant/VersionSettingType';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  dataSource: ListEvaluationCalculationHistory | undefined;
  setDataSource: (data: any) => void;
  condition: ConditionListEvaluationCalculationHistory;
  setCondition: (data: any) => void;
  setLoading: (data: any) => void;
  isLoading: boolean;
}

const ListEvaluationCalculationHistoryTable: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.id}
        scroll={{ x: 768 }}
        dataSource={props.dataSource?.rows}
        columns={getListEvaluationCalculationHistoryColumn({
          type: props.condition.levelType,
          flagSkill: props.condition.level17Type,
        })}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        onRow={(record) => {
          return {
            onClick: (_e) => {
              if (record.type === VersionSettingType.LEVEL_1_7) {
                navigate(
                  urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/evaluation-calculator-detail',
                  {
                    state: { record: record },
                  },
                );
              } else if (record.type === VersionSettingType.LEVEL_1_7_NO_SKILL) {
                navigate(
                  urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/evaluation-calculator-detail-ns',
                  {
                    state: { record: record },
                  },
                );
              } else if (record.type === VersionSettingType.LEVEL_8_10) {
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/evaluation-calculator-detail-8-10',
                  {
                    state: { record: record },
                  },
                );
              } else if (record.type === VersionSettingType.LEVEL_8_10_NO_SKILL) {
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/evaluation-calculator-detail-8-10-ns',
                  {
                    state: { record: record },
                  },
                );
              } else if (record.type === VersionSettingType.LEVEL_ALL) {
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/evaluation-calculator-detail-common',
                  {
                    state: { record: record },
                  },
                );
              }
            }, // click row
          };
        }}
      />
    </div>
  );
};

export default ListEvaluationCalculationHistoryTable;
