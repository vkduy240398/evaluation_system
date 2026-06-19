/* eslint-disable complexity */
import { Form, Grid, Radio, Row, Skeleton, Tooltip } from 'antd';
import Card from 'antd/es/card';
import Table, { ColumnsType } from 'antd/es/table';
import Typography from 'antd/es/typography';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { statusEvaluationType } from '../../../common/status';
import { RadioChangeEvent } from 'antd/lib';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

import { t } from 'i18next';
import { useState } from 'react';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import PrintDetailReview17 from '../../../page/evaluation-print-review/evaluation-detail1-7/printDetailReview1-7';
import { hasNonNullOrUndefinedPoint } from '../../../common/util';

type PointAndSettingLevelType = {
  key: number;
  behaviorPercent: number;
  achievementPercent: number;

  // **
  behaviorTotalPoint: number;
  achievementPersonalTotalPoint: number;
  percentPoint: number;
};

interface Props {
  pointSettingLevel: PointAndSettingLevelType;

  // ** Point user
  behaviorTotalPointUser: number;
  achievementPersonalTotalPointUser: number;
  achievementAdditionalTotalPointUser: number;

  // ** Point 0.5
  behaviorTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementPersonalTotalPointEvaluator05: number;

  // ** Point 1.0
  behaviorTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementPersonalTotalPointEvaluator1: number;

  // ** Point 2.0
  behaviorTotalPointEvaluator2: number;
  achievementAdditionalTotalPointEvaluator2: number;
  achievementPersonalTotalPointEvaluator2: number;

  handleDownload: (arg: { orientation: 'l' | 'p'; format: 'a4' | 'a3' }) => void;
  isLoading: boolean;

  // ** User
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

  // ** Status
  statusEvaluation: statusEvaluationType;

  // ** Total
  summaryPointUser: number;
  summaryPointEvaluator05: number;
  summaryPointEvaluator1: number;
  summaryPointEvaluator2: number;
  isEvaluatorUser: boolean;
  isDisplayUserEvaluator: boolean;

  // ** Is f5
  isF5?: boolean;

  // ** Param export pdf to review
  pdfId?: number;
  fullName?: any;
  financialYear?: any;

  versionSetting?: any;
  isReview?: boolean;
  // end
}

const { useBreakpoint } = Grid;

const SettingLevelComponentNoSkill = (props: Props) => {
  //  ** Props
  const {
    pointSettingLevel,
    handleDownload,
    isLoading,
    statusEvaluation,
    behaviorTotalPointUser,
    isEditUserEvaluation,
    isDisplayUserEvaluator,
    achievementPersonalTotalPointUser,
    achievementAdditionalTotalPointUser,
    summaryPointUser,

    behaviorTotalPointEvaluator05,
    achievementPersonalTotalPointEvaluator05,
    isEditEvaluation05,
    achievementAdditionalTotalPointEvaluator05,
    summaryPointEvaluator05,
    isDisplayEvaluator05,

    behaviorTotalPointEvaluator1,
    achievementPersonalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator1,
    isEditEvaluation1,
    summaryPointEvaluator1,
    isDisplayEvaluator1,

    behaviorTotalPointEvaluator2,
    achievementPersonalTotalPointEvaluator2,
    achievementAdditionalTotalPointEvaluator2,
    isEditEvaluation2,
    summaryPointEvaluator2,
    isDisplayEvaluator2,

    isF5,
    pdfId,
    isEvaluatorUser,
    fullName,
    financialYear,
    versionSetting,
    isReview,
  } = props;
  const { behaviorPercent, achievementPercent } = pointSettingLevel;

  // ** State
  const [pdfOption, setPdf] = useState<{ orientation: 'p' | 'l'; format: 'a4' | 'a3' }>({
    orientation: 'p',
    format: 'a4',
  });

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  // ** Hook
  const store = useSelector((state: RootState) => state.userEvaluation);
  const screens = useBreakpoint();
  const columns: ColumnsType<PointAndSettingLevelType> = [
    {
      title: ' ',
      dataIndex: 'title',
      width: 75,
      align: 'center' as const,
    },
    {
      title: (
        <>
          {t('IDS_BEHAVIOR_EVALUATION_METER')}
          {/* <Tooltip title={t('IDS_TOOLTIP_BEHAVIOR_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip> */}
        </>
      ),
      dataIndex: 'behaviorTotalPoint',
      width: 270,
      align: 'center' as const,
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'behaviorPercent',
      width: 80,
      onHeaderCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      onCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      align: 'center' as const,
      render: (text: string) => (text ? `${text}%` : ''),
    },
    {
      title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
      dataIndex: 'achievementPersonalTotalPoint',
      width: 270,
      align: 'center' as const,
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'achievementPercent',
      width: 80,
      onHeaderCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      onCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      align: 'center' as const,
      render: (text: string) => (text ? `${text}%` : ''),
    },
    {
      title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
      dataIndex: 'achievementAdditional',
      align: 'center' as const,
      width: 270,
    },
    {
      title: (
        <>
          {t('IDS_TOTAL_POINTS')}
          <Tooltip
            title={
              t('IDS_TOOLTIP_TOTAL_COLUMN_2') +
              ` (${t('IDS_MIN_POINT')}：${Number(versionSetting?.minPoint) || 0}～${t('IDS_MAX_POINT')}：${
                Number(versionSetting?.maxPoint) || 100
              })`
            }
            color="#424242"
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'percentPoint',
      align: 'center' as const,
      width: 110,

      // width: '20%',
    },
  ];

  // ** User Sumary
  let convertBehaviorTotalPointUser: number | null = null;
  let convertAchievementPersonalTotalPointUser: number | null = null;
  let convertAchievementAdditionalTotalPointUser: number | null = null;
  let totalUser: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBehaviorTotalPointUser =
      (!isEditUserEvaluation || store.behaviorTotalPointUser === undefined || store.behaviorTotalPointUser === null
        ? behaviorTotalPointUser
        : store.behaviorTotalPointUser) || 0;

    convertAchievementPersonalTotalPointUser =
      (!isEditUserEvaluation ||
      store.achievementPersonalTotalPointUser === undefined ||
      store.achievementPersonalTotalPointUser === null
        ? achievementPersonalTotalPointUser
        : store.achievementPersonalTotalPointUser) || 0;

    convertAchievementAdditionalTotalPointUser = Math.round(
      (statusEvaluation >= 98 || isF5
        ? achievementAdditionalTotalPointUser
        : store.achievementAdditionalTotalPointUser) || 0,
    );

    totalUser =
      (convertBehaviorTotalPointUser * behaviorPercent +
        convertAchievementPersonalTotalPointUser * achievementPercent) /
        100 +
      convertAchievementAdditionalTotalPointUser;
  }

  // ** Display column evaluator 0.5 to evaluation
  let convertBehaviorTotalPoint05: number | null = null;
  let convertAchievementPersonalTotalPoint05: number | null = null;
  let convertAchievementAdditionalTotalPoint05: number | null = null;
  let total05: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBehaviorTotalPoint05 =
      (!isEditEvaluation05 || store.behaviorTotalPoint05 === undefined || store.behaviorTotalPoint05 === null
        ? behaviorTotalPointEvaluator05
        : store.behaviorTotalPoint05) || 0;

    convertAchievementPersonalTotalPoint05 = Math.round(
      (!isEditEvaluation05 ||
      store.achievementPersonalTotalPoint05 === undefined ||
      store.achievementPersonalTotalPoint05 === null
        ? achievementPersonalTotalPointEvaluator05
        : store.achievementPersonalTotalPoint05) || 0,
    );

    convertAchievementAdditionalTotalPoint05 = Math.round(
      (statusEvaluation >= 98 || isF5
        ? achievementAdditionalTotalPointEvaluator05
        : store.achievementAdditionalTotalPoint05) || 0,
    );

    total05 =
      (convertBehaviorTotalPoint05 * behaviorPercent + convertAchievementPersonalTotalPoint05 * achievementPercent) /
        100 +
      convertAchievementAdditionalTotalPoint05;
  }

  // ** Display column evaluator 1.0 to evaluation
  let convertBehaviorTotalPoint1: number | null = null;
  let convertAchievementPersonalTotalPoint1: number | null = null;
  let convertAchievementAdditionalTotalPoint1: number | null = null;
  let total1: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBehaviorTotalPoint1 =
      (!isEditEvaluation1 || store.behaviorTotalPoint1 === undefined || store.behaviorTotalPoint1 === null
        ? behaviorTotalPointEvaluator1
        : store.behaviorTotalPoint1) || 0;
    convertAchievementPersonalTotalPoint1 = Math.round(
      (!isEditEvaluation1 ||
      store.achievementPersonalTotalPoint1 === undefined ||
      store.achievementPersonalTotalPoint1 === null
        ? achievementPersonalTotalPointEvaluator1
        : store.achievementPersonalTotalPoint1) || 0,
    );

    convertAchievementAdditionalTotalPoint1 = Math.round(
      (statusEvaluation >= 98 || isF5
        ? achievementAdditionalTotalPointEvaluator1
        : store.achievementAdditionalTotalPoint1) || 0,
    );

    total1 =
      (convertBehaviorTotalPoint1 * behaviorPercent + convertAchievementPersonalTotalPoint1 * achievementPercent) /
        100 +
      convertAchievementAdditionalTotalPoint1;
  }

  // ** Display column evaluator 2.0 to evaluation
  let convertBehaviorTotalPoint2: number | null = null;
  let convertAchievementPersonalTotalPoint2: number | null = null;
  let convertAchievementAdditionalTotalPoint2: number | null = null;
  let total2: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBehaviorTotalPoint2 =
      (!isEditEvaluation2 || store.behaviorTotalPoint2 === undefined || store.behaviorTotalPoint2 === null
        ? behaviorTotalPointEvaluator2
        : store.behaviorTotalPoint2) || 0;

    convertAchievementPersonalTotalPoint2 = Math.round(
      (!isEditEvaluation2 ||
      store.achievementPersonalTotalPoint2 === undefined ||
      store.achievementPersonalTotalPoint2 === null
        ? achievementPersonalTotalPointEvaluator2
        : store.achievementPersonalTotalPoint2) || 0,
    );

    convertAchievementAdditionalTotalPoint2 = Math.round(
      (statusEvaluation >= 98 || isF5
        ? achievementAdditionalTotalPointEvaluator2
        : store.achievementAdditionalTotalPoint2) || 0,
    );

    total2 = isEditEvaluation2
      ? (convertBehaviorTotalPoint2 * behaviorPercent + convertAchievementPersonalTotalPoint2 * achievementPercent) /
          100 +
        convertAchievementAdditionalTotalPoint2
      : summaryPointEvaluator2;
  }

  // Tổng điểm của user
  const behaviorTotalPoint =
    convertBehaviorTotalPointUser === null || !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointUser')
      ? ''
      : convertBehaviorTotalPointUser;
  const achievementPersonalTotalPoint =
    convertAchievementPersonalTotalPointUser === null ||
    !hasNonNullOrUndefinedPoint(store.achievementDatas, 'pointUser')
      ? ''
      : Math.round(convertAchievementPersonalTotalPointUser);
  const achievementAdditional = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointUser')
    ? ''
    : convertAchievementAdditionalTotalPointUser;

  const dataSources = [
    {
      ...pointSettingLevel,
      title: t('IDS_POINT_USER'),
      behaviorTotalPoint: behaviorTotalPoint,
      achievementPersonalTotalPoint: achievementPersonalTotalPoint,
      percentPoint:
        totalUser === null ||
        (behaviorTotalPoint === '' && achievementPersonalTotalPoint === '' && achievementAdditional === '')
          ? ''
          : Math.min(Math.max(Math.round(totalUser), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-total-setting-level-evaluator-user',
      achievementAdditional: achievementAdditional,
    },
  ];

  // Tổng điểm của người đánh giá 0.5
  const behaviorTotalPoint05 =
    convertBehaviorTotalPoint05 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator05')
      ? ''
      : convertBehaviorTotalPoint05;

  const achievementPersonalTotalPoint05 =
    convertAchievementPersonalTotalPoint05 === null ||
    !hasNonNullOrUndefinedPoint(store.achievementDatas, 'pointEvaluator05')
      ? ''
      : Math.round(convertAchievementPersonalTotalPoint05);
  const achievementAdditional05 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator05')
    ? ''
    : convertAchievementAdditionalTotalPoint05;
  isDisplayEvaluator05 &&
    dataSources.push({
      ...pointSettingLevel,
      title: t('IDS_EVALUATION_0_5'),
      behaviorTotalPoint: behaviorTotalPoint05,
      achievementPersonalTotalPoint: achievementPersonalTotalPoint05,
      percentPoint:
        total05 === null ||
        (behaviorTotalPoint05 === '' && achievementPersonalTotalPoint05 === '' && achievementAdditional05 === '')
          ? ''
          : Math.min(Math.max(Math.round(total05), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-total-setting-level-evaluator-0.5',
      achievementAdditional: achievementAdditional05,
    });

  // Tổng điểm của người đánh giá 1
  const behaviorTotalPoint1 =
    convertBehaviorTotalPoint1 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator1')
      ? ''
      : convertBehaviorTotalPoint1;
  const achievementPersonalTotalPoint1 =
    convertAchievementPersonalTotalPoint1 === null ||
    !hasNonNullOrUndefinedPoint(store.achievementDatas, 'pointEvaluator1')
      ? ''
      : Math.round(convertAchievementPersonalTotalPoint1);
  const achievementAdditional1 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator1')
    ? ''
    : convertAchievementAdditionalTotalPoint1;

  isDisplayEvaluator1 &&
    dataSources.push({
      ...pointSettingLevel,
      title: t('IDS_POINT_EVALUATOR_1'),
      behaviorTotalPoint: behaviorTotalPoint1,
      achievementPersonalTotalPoint: achievementPersonalTotalPoint1,
      percentPoint:
        total1 === null ||
        (behaviorTotalPoint1 === '' && achievementPersonalTotalPoint1 === '' && achievementAdditional1 === '')
          ? ''
          : Math.min(Math.max(Math.round(total1), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-total-setting-level-evaluator-1',
      achievementAdditional: achievementAdditional1,
    });

  // Tổng điểm của người đánh giá 2
  const behaviorTotalPoint2 =
    convertBehaviorTotalPoint2 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator2')
      ? ''
      : convertBehaviorTotalPoint2;
  const achievementPersonalTotalPoint2 =
    convertAchievementPersonalTotalPoint2 === null ||
    !hasNonNullOrUndefinedPoint(store.achievementDatas, 'pointEvaluator2')
      ? ''
      : Math.round(convertAchievementPersonalTotalPoint2);
  const achievementAdditional2 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator2')
    ? ''
    : convertAchievementAdditionalTotalPoint2;
  isDisplayEvaluator2 &&
    dataSources.push({
      ...pointSettingLevel,
      title: t('IDS_POINT_EVALUATOR_2'),
      behaviorTotalPoint: behaviorTotalPoint2,
      achievementPersonalTotalPoint: achievementPersonalTotalPoint2,
      percentPoint:
        total2 === null ||
        (behaviorTotalPoint2 === '' && achievementPersonalTotalPoint2 === '' && achievementAdditional2 === '')
          ? ''
          : Math.min(Math.max(Math.round(total2), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-total-setting-level-evaluator-2',
      achievementAdditional: achievementAdditional2,
    });

  const handleChangeRadio = (e: RadioChangeEvent) => {
    const { name, value } = e.target;

    if (name) setPdf((dataState) => ({ ...dataState, [name]: value }));
  };

  const renderModal = () => {
    return (
      <Form labelAlign="left" labelCol={{ span: 1 }}>
        {/* Form labelCol={{ span: 1 }} labelAlign="left" colon={false} */}
        <Form.Item label={t('IDS_PAGE_ORIENTATION')} colon={false} style={{ padding: 5 }}>
          <Radio.Group name="orientation" onChange={handleChangeRadio} defaultValue="p" style={{ paddingLeft: 20 }}>
            <Radio value={'p'}>{t('IDS_PORTRAIT')}</Radio>
            <Radio value={'l'}>{t('IDS_LANDSCAPE')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('IDS_PAPER_SIZE')} colon={false} style={{ padding: 5 }}>
          <Radio.Group name="format" onChange={handleChangeRadio} defaultValue="a4" style={{ paddingLeft: 20 }}>
            <Radio value={'a4'}>{t('A4')}</Radio>
            <Radio value={'a3'}>{t('A3')}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <Card style={{ marginBottom: 10 }}>
        <Typography.Title level={4}>
          {isDisplayUserEvaluator ? t('IDS_EVALUATION_RESULT') : t('IDS_EVALUATION_DISTRIBUTION')}
        </Typography.Title>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            size="small"
            style={{ wordBreak: 'break-all' }}
            columns={columns}
            dataSource={dataSources as any[]}
            pagination={false}
            bordered
            scroll={{ x: screens.xs ? 1000 : undefined }}
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        )}
      </Card>

      <Row justify={'end'} style={{ marginBottom: 10 }}>
        {/* <Button
          className="button-normal"
          type="primary"
          size="middle"
          loading={isLoading}
          disabled={isF5 ? !(statusEvaluation > 0) : statusEvaluation !== 100}
          onClick={handleToggleModal}
        >
          {t('IDS_BUTTON_OUTPUT_PDF')}
          <DownloadOutlined style={{ fontSize: 18 }} />
        </Button> */}
        {!isReview && (
          <PrintDetailReview17
            isEvaluatorUser={isEvaluatorUser}
            pdfId={pdfId}
            isF5={isF5}
            statusEvaluation={statusEvaluation}
            fullName={fullName}
            financialYear={financialYear}
          />
        )}

        <ModalCustomComponent
          isOpen={isOpenModal}
          okText={t('IDS_OUTPUT').toString()}
          header={t('IDS_BUTTON_OUTPUT_PDF')}
          content={renderModal()}
          fnHandleOk={() => {
            handleDownload(pdfOption);
            setPdf({ orientation: 'p', format: 'a4' });
            setOpenModal(!isOpenModal);
          }}
          fnHandleCancel={() => {
            setPdf({ orientation: 'p', format: 'a4' });
            setOpenModal(!isOpenModal);
          }}
        />
      </Row>
    </>
  );
};

export default SettingLevelComponentNoSkill;
