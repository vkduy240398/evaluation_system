/* eslint-disable complexity */
// ** Antd import
import { Skeleton, Table } from 'antd';
import Typography from 'antd/es/typography';
import { Grid } from 'antd';

//  ** Component Imports

// ** Store & Actions Imports

import { useDispatch, useSelector } from 'react-redux';

// ** I18 Imports
import { t } from 'i18next';
import { useEffect } from 'react';

import {
  PointAndSettingLevelType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { AppDispatch, RootState } from '../../../../store';
import { userEvaluationColumn } from '../data/ColumnLevel';
import { setTotalData } from '../../../../store/userEvaluation';
import { hasNonNullOrUndefinedPoint } from '../../../../common/util';
import { statusEvaluationType } from '../../../../common/status';

const { useBreakpoint } = Grid;

type headerType = '専門スキル' | '専門スキル選択' | '評価配分' | '評価結果';
interface Props {
  pointSettingLevel: PointAndSettingLevelType;
  header: headerType;

  // ** Point user

  basicTotalPointUser: number;
  proTotalPointUser: number;
  behaviorTotalPointUser: number;
  achievementPersonalTotalPointUser: number;
  achievementAdditionalTotalPointUser: number;

  // ** Point 0.5

  basicTotalPointEvaluator05: number;
  proTotalPointEvaluator05: number;
  behaviorTotalPointEvaluator05: any;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementPersonalTotalPointEvaluator05: number;

  // ** Point 1.0
  basicTotalPointEvaluator1: number;
  proTotalPointEvaluator1: number;
  behaviorTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementPersonalTotalPointEvaluator1: number;

  // ** Point 2.0
  basicTotalPointEvaluator2: number;
  proTotalPointEvaluator2: number;
  behaviorTotalPointEvaluator2: number;
  achievementAdditionalTotalPointEvaluator2: number;
  achievementPersonalTotalPointEvaluator2: number;

  proSkillList: UserEvaluationToProSkillType[];

  evaluationBasicSkills: UserEvaluationBasicBehaviorType[];

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

  basicProTotalPointUser: number;
  basicProTotalPointEvaluator05: number;
  basicProTotalPointEvaluator1: number;
  basicProTotalPointEvaluator2: number;

  // ** Max point basic pro skill
  maxPointBasicSkill: number;
  maxPointProSkill: number;

  // ** Status
  statusEvaluation: statusEvaluationType;

  // ** Total
  summaryPointUser: number;
  summaryPointEvaluator05: number;
  summaryPointEvaluator1: number;
  summaryPointEvaluator2: number;
  isEvaluatorUser: boolean;

  // ** Is f5
  isF5?: boolean;

  // ** Param export pdf to review
  pdfId?: number;
  fullName?: any;
  financialYear?: any;

  versionSetting: any;

  // end
  isEvaluationDate: boolean;
}

const SettingLevelComponent810 = ({
  pointSettingLevel,
  header,

  behaviorTotalPointUser,
  achievementPersonalTotalPointUser,
  achievementAdditionalTotalPointUser,
  behaviorTotalPointEvaluator05,
  achievementAdditionalTotalPointEvaluator05,
  achievementPersonalTotalPointEvaluator05,

  behaviorTotalPointEvaluator1,
  achievementAdditionalTotalPointEvaluator1,
  achievementPersonalTotalPointEvaluator1,

  behaviorTotalPointEvaluator2,
  achievementAdditionalTotalPointEvaluator2,
  achievementPersonalTotalPointEvaluator2,

  isLoading,
  proSkillList,
  evaluationBasicSkills,

  isEditUserEvaluation,

  // ** evaluator 0.5
  isDisplayEvaluator05,
  isEditEvaluation05,

  // ** evaluator 1.0
  isDisplayEvaluator1,
  isEditEvaluation1,

  // ** evaluator 2.0
  isDisplayEvaluator2,
  isEditEvaluation2,

  basicProTotalPointUser,
  basicProTotalPointEvaluator05,
  basicProTotalPointEvaluator1,
  basicProTotalPointEvaluator2,

  // ** Max point basic pro skill
  maxPointBasicSkill,
  maxPointProSkill,
  statusEvaluation,

  // ** Total
  summaryPointUser,
  summaryPointEvaluator05,
  summaryPointEvaluator1,
  summaryPointEvaluator2,

  versionSetting,
  isF5,
  isEvaluationDate,
}: Props) => {
  // ** Props
  const { skillPercent, behaviorPercent, achievementPercent } = pointSettingLevel;

  // ** State

  const dispatch = useDispatch<AppDispatch>();
  const totalItemProSkill = proSkillList.filter((v) => v.isDisable === false).length;
  const totalItemBasicSkill = evaluationBasicSkills.length;
  const a = maxPointProSkill * totalItemProSkill || 0.5;
  const b = maxPointBasicSkill * totalItemBasicSkill || 0.5;
  const columns = userEvaluationColumn({ maxPointProSkill, maxPointBasicSkill, versionSetting });

  // ** Hook
  const store = useSelector((state: RootState) => state.userEvaluation);
  const screens = useBreakpoint();
  useEffect(() => {
    dispatch(
      setTotalData({
        basicProTotalPointUser:
          convertBasicProTotalPointUser !== null ? Math.floor(convertBasicProTotalPointUser) : null,
        basicProTotalPointEvaluator05:
          convertBasicProTotalPoint05 !== null ? Math.floor(convertBasicProTotalPoint05) : null,
        basicProTotalPointEvaluator1:
          convertBasicProTotalPoint1 !== null ? Math.floor(convertBasicProTotalPoint1) : null,
        basicProTotalPointEvaluator2:
          convertBasicProTotalPoint2 !== null ? Math.floor(convertBasicProTotalPoint2) : null,
      }),
    );
  }, [
    store.proTotalPointUser,
    store.basicTotalPointUser,
    store.proTotalPoint05,
    store.proTotalPoint1,
    store.proTotalPoint2,
    store.basicTotalPoint05,
    store.basicTotalPoint1,
    store.basicTotalPoint2,
    statusEvaluation,
  ]);

  // ** User Sumary
  let convertBasicProTotalPointUser: number | null = null;
  let convertBehaviorTotalPointUser: number | null = null;
  let convertAchievementPersonalTotalPointUser: number | null = null;
  let convertAchievementAdditionalTotalPointUser: number | null = null;
  let totalUser: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBasicProTotalPointUser =
      statusEvaluation < 98 && !isF5
        ? isEditUserEvaluation
          ? (store.proTotalPointUser !== null && store.proTotalPointUser !== undefined) ||
            (store.basicTotalPointUser !== null && store.basicTotalPointUser !== undefined)
            ? (((store.proTotalPointUser || 0) + (store.basicTotalPointUser || 0)) / (a + b)) * 100
            : null
          : basicProTotalPointUser
        : basicProTotalPointUser;

    convertBehaviorTotalPointUser =
      statusEvaluation < 98 && !isF5
        ? isEditUserEvaluation
          ? store.behaviorTotalPointUser !== null && store.behaviorTotalPointUser !== undefined
            ? store.behaviorTotalPointUser
            : null
          : behaviorTotalPointUser
        : behaviorTotalPointUser;
    (convertAchievementPersonalTotalPointUser =
      statusEvaluation < 98 && !isF5
        ? isEditUserEvaluation
          ? store.achievementPersonalTotalPointUser !== null && store.achievementPersonalTotalPointUser !== undefined
            ? store.achievementPersonalTotalPointUser
            : null
          : achievementPersonalTotalPointUser
        : achievementPersonalTotalPointUser),
      (convertAchievementAdditionalTotalPointUser = Math.round(
        Number(
          statusEvaluation < 98 && !isF5
            ? store.achievementAdditionalTotalPointUser !== null &&
              store.achievementAdditionalTotalPointUser !== undefined
              ? store.achievementAdditionalTotalPointUser
              : null
            : achievementAdditionalTotalPointUser,
        ),
      ));

    totalUser =
      statusEvaluation < 98 && !isF5
        ? Math.round(
            (Math.floor(Number(convertBasicProTotalPointUser)) * skillPercent +
              Number(convertBehaviorTotalPointUser) * behaviorPercent +
              Math.round(Number(convertAchievementPersonalTotalPointUser)) * achievementPercent) /
              100 +
              convertAchievementAdditionalTotalPointUser,
          )
        : summaryPointUser;
  }

  // ** Display column evaluator 0.5 to evaluation
  let convertBasicProTotalPoint05: number | null = null;
  let convertBehaviorTotalPoint05: number | null = null;
  let convertAchievementPersonalTotalPoint05: number | null = null;
  let convertAchievementAdditionalTotalPoint05: number | null = null;
  let total05: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBasicProTotalPoint05 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation05
          ? (store.proTotalPoint05 !== null && store.proTotalPoint05 !== undefined) ||
            (store.proTotalPoint05 !== null && store.proTotalPoint05 !== undefined)
            ? (((store.proTotalPoint05 || 0) + (store.basicTotalPoint05 || 0)) / (a + b)) * 100
            : null
          : basicProTotalPointEvaluator05
        : basicProTotalPointEvaluator05;
    convertBehaviorTotalPoint05 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation05
          ? store.behaviorTotalPoint05 !== null && store.behaviorTotalPoint05 !== undefined
            ? store.behaviorTotalPoint05
            : null
          : behaviorTotalPointEvaluator05
        : behaviorTotalPointEvaluator05;
    convertAchievementPersonalTotalPoint05 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation05
          ? store.achievementPersonalTotalPoint05 !== null && store.achievementPersonalTotalPoint05 !== undefined
            ? store.achievementPersonalTotalPoint05
            : null
          : achievementPersonalTotalPointEvaluator05
        : achievementPersonalTotalPointEvaluator05;

    convertAchievementAdditionalTotalPoint05 = Math.round(
      Number(
        statusEvaluation < 98 && !isF5
          ? store.achievementAdditionalTotalPoint05 !== null && store.achievementAdditionalTotalPoint05 !== undefined
            ? store.achievementAdditionalTotalPoint05
            : null
          : achievementAdditionalTotalPointEvaluator05,
      ),
    );

    total05 =
      statusEvaluation < 98 && !isF5
        ? Math.round(
            (Math.floor(Number(convertBasicProTotalPoint05)) * skillPercent +
              Number(convertBehaviorTotalPoint05) * behaviorPercent +
              Math.round(Number(convertAchievementPersonalTotalPoint05)) * achievementPercent) /
              100 +
              convertAchievementAdditionalTotalPoint05,
          )
        : summaryPointEvaluator05;
  }

  // ** Display column evaluator 1.0 to evaluation
  let convertBasicProTotalPoint1: number | null = null;
  let convertBehaviorTotalPoint1: string | number | null = null;
  let convertAchievementPersonalTotalPoint1: number | null = null;
  let convertAchievementAdditionalTotalPoint1: number | null = null;
  let total1: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBasicProTotalPoint1 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation1
          ? (store.proTotalPoint1 !== null && store.proTotalPoint1 !== undefined) ||
            (store.proTotalPoint1 !== null && store.proTotalPoint1 !== undefined)
            ? (((store.proTotalPoint1 || 0) + (store.basicTotalPoint1 || 0)) / (a + b)) * 100
            : null
          : basicProTotalPointEvaluator1
        : basicProTotalPointEvaluator1;
    convertBehaviorTotalPoint1 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation1
          ? store.behaviorTotalPoint1 !== null && store.behaviorTotalPoint1 !== undefined
            ? store.behaviorTotalPoint1
            : null
          : behaviorTotalPointEvaluator1
        : behaviorTotalPointEvaluator1;

    convertAchievementPersonalTotalPoint1 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation1
          ? store.achievementPersonalTotalPoint1 !== null && store.achievementPersonalTotalPoint1 !== undefined
            ? store.achievementPersonalTotalPoint1
            : null
          : achievementPersonalTotalPointEvaluator1
        : achievementPersonalTotalPointEvaluator1;
    convertAchievementAdditionalTotalPoint1 = Math.round(
      Number(
        statusEvaluation < 98 && !isF5
          ? store.achievementAdditionalTotalPoint1 !== null && store.achievementAdditionalTotalPoint1 !== undefined
            ? store.achievementAdditionalTotalPoint1
            : null
          : achievementAdditionalTotalPointEvaluator1,
      ),
    );
    total1 =
      statusEvaluation < 98 && !isF5
        ? Math.round(
            (Math.floor(Number(convertBasicProTotalPoint1)) * skillPercent +
              Number(convertBehaviorTotalPoint1) * behaviorPercent +
              Math.round(Number(convertAchievementPersonalTotalPoint1)) * achievementPercent) /
              100 +
              convertAchievementAdditionalTotalPoint1,
          )
        : summaryPointEvaluator1;
  }

  // ** Display column evaluator 2.0 to evaluation
  let convertBasicProTotalPoint2: number | null = null;
  let convertBehaviorTotalPoint2: string | number | null = null;
  let convertAchievementPersonalTotalPoint2: number | null = null;
  let convertAchievementAdditionalTotalPoint2: number | null = null;
  let total2: number | null = null;

  // Status là đánh giá thì mới hiển thị điểm summary
  if (statusEvaluation >= 50) {
    convertBasicProTotalPoint2 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation2
          ? (store.proTotalPoint2 !== null && store.proTotalPoint2 !== undefined) ||
            (store.proTotalPoint2 !== null && store.proTotalPoint2 !== undefined)
            ? (((store.proTotalPoint2 || 0) + (store.basicTotalPoint2 || 0)) / (a + b)) * 100
            : null
          : basicProTotalPointEvaluator2
        : basicProTotalPointEvaluator2;

    convertBehaviorTotalPoint2 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation2
          ? store.behaviorTotalPoint2 !== null && store.behaviorTotalPoint2 !== undefined
            ? store.behaviorTotalPoint2
            : null
          : behaviorTotalPointEvaluator2
        : behaviorTotalPointEvaluator2;

    convertAchievementPersonalTotalPoint2 =
      statusEvaluation < 98 && !isF5
        ? isEditEvaluation2
          ? store.achievementPersonalTotalPoint2 !== null && store.achievementPersonalTotalPoint2 !== undefined
            ? store.achievementPersonalTotalPoint2
            : null
          : achievementPersonalTotalPointEvaluator2
        : achievementPersonalTotalPointEvaluator2;
    convertAchievementAdditionalTotalPoint2 = Math.round(
      Number(
        statusEvaluation < 98 && !isF5
          ? store.achievementAdditionalTotalPoint2 !== null && store.achievementAdditionalTotalPoint2 !== undefined
            ? store.achievementAdditionalTotalPoint2
            : null
          : achievementAdditionalTotalPointEvaluator2,
      ),
    );
    total2 =
      statusEvaluation < 98 && !isF5
        ? Math.round(
            (Math.floor(Number(convertBasicProTotalPoint2)) * skillPercent +
              Number(convertBehaviorTotalPoint2) * behaviorPercent +
              Math.round(Number(convertAchievementPersonalTotalPoint2)) * achievementPercent) /
              100 +
              convertAchievementAdditionalTotalPoint2,
          )
        : summaryPointEvaluator2;
  }

  // Tổng điểm của user

  const skillTotalPoint = convertBasicProTotalPointUser
    ? Math.floor(convertBasicProTotalPointUser)
    : convertBasicProTotalPointUser;
  const behaviorTotalPoint =
    convertBehaviorTotalPointUser === null || !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointUser')
      ? ''
      : convertBehaviorTotalPointUser;

  const achievementPersonalTotalPoint =
    convertAchievementPersonalTotalPointUser !== null && convertAchievementPersonalTotalPointUser !== undefined
      ? convertAchievementPersonalTotalPointUser
      : '';
  const achievementAdditional = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointUser')
    ? ''
    : convertAchievementAdditionalTotalPointUser;

  // ** Data source
  const dataList: PointAndSettingLevelType[] | any[] = [
    {
      ...pointSettingLevel,
      title: t('IDS_POINT_USER'),
      skillTotalPoint: skillTotalPoint,
      behaviorTotalPoint: behaviorTotalPoint,
      achievementPersonalTotalPoint:
        achievementPersonalTotalPoint !== null &&
        achievementPersonalTotalPoint !== undefined &&
        achievementPersonalTotalPoint !== ''
          ? Math.round(Number(achievementPersonalTotalPoint))
          : null,
      percentPoint:
        totalUser === null ||
        (skillTotalPoint === null &&
          behaviorTotalPoint === '' &&
          achievementPersonalTotalPoint === '' &&
          achievementAdditional === '')
          ? ''
          : Math.min(Math.max(Math.round(totalUser), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-setting-level-evaluator-user',
      achievementAdditional: achievementAdditional,
    },
  ];

  // Tổng điểm của người đánh giá 0.5
  const skillTotalPoint05 =
    convertBasicProTotalPoint05 === null ||
    (!hasNonNullOrUndefinedPoint(store.evaluationBasicSkills, 'pointEvaluator05') &&
      !hasNonNullOrUndefinedPoint(store.evaluationProSkills, 'pointEvaluator05'))
      ? ''
      : Math.floor(convertBasicProTotalPoint05 || 0);
  const behaviorTotalPoint05 =
    convertBehaviorTotalPoint05 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator05')
      ? ''
      : convertBehaviorTotalPoint05;

  const achievementPersonalTotalPoint05 =
    convertAchievementPersonalTotalPoint05 !== null && convertAchievementPersonalTotalPoint05 !== undefined
      ? convertAchievementPersonalTotalPoint05
      : '';
  const achievementAdditional05 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator05')
    ? ''
    : convertAchievementAdditionalTotalPoint05;

  isDisplayEvaluator05 &&
    dataList.push({
      ...pointSettingLevel,
      title: t('IDS_EVALUATION_0_5'),
      skillTotalPoint: skillTotalPoint05,
      behaviorTotalPoint: behaviorTotalPoint05,
      achievementPersonalTotalPoint:
        achievementPersonalTotalPoint05 !== null &&
        achievementPersonalTotalPoint05 !== undefined &&
        achievementPersonalTotalPoint05 !== ''
          ? Math.round(Number(achievementPersonalTotalPoint05))
          : null,
      percentPoint:
        total05 === null ||
        (skillTotalPoint05 === '' &&
          behaviorTotalPoint05 === '' &&
          achievementPersonalTotalPoint05 === '' &&
          achievementAdditional05 === '')
          ? ''
          : Math.min(Math.max(Math.round(total05), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-setting-level-evaluator-0.5',
      achievementAdditional: achievementAdditional05,
    });

  // Tổng điểm của người đánh giá 1
  const skillTotalPoint1 =
    convertBasicProTotalPoint1 === null ||
    (!hasNonNullOrUndefinedPoint(store.evaluationBasicSkills, 'pointEvaluator1') &&
      !hasNonNullOrUndefinedPoint(store.evaluationProSkills, 'pointEvaluator1'))
      ? ''
      : Math.floor(convertBasicProTotalPoint1 || 0);

  const behaviorTotalPoint1 =
    convertBehaviorTotalPoint1 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator1')
      ? ''
      : convertBehaviorTotalPoint1;

  // const achievementPersonalTotalPoint1 =
  //   convertAchievementPersonalTotalPoint1 === null ? '' : Math.round(convertAchievementPersonalTotalPoint1);
  const achievementPersonalTotalPoint1 =
    convertAchievementPersonalTotalPoint1 !== null && convertAchievementPersonalTotalPoint1 !== undefined
      ? convertAchievementPersonalTotalPoint1
      : '';
  const achievementAdditional1 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator1')
    ? ''
    : convertAchievementAdditionalTotalPoint1;
  isDisplayEvaluator1 &&
    dataList.push({
      ...pointSettingLevel,
      title: t('IDS_POINT_EVALUATOR_1'),
      skillTotalPoint: skillTotalPoint1,
      behaviorTotalPoint: behaviorTotalPoint1,
      achievementPersonalTotalPoint:
        achievementPersonalTotalPoint1 !== null &&
        achievementPersonalTotalPoint1 !== undefined &&
        achievementPersonalTotalPoint1 !== ''
          ? Math.round(Number(achievementPersonalTotalPoint1))
          : null,
      percentPoint:
        total1 === null ||
        (skillTotalPoint1 === '' &&
          behaviorTotalPoint1 === '' &&
          achievementPersonalTotalPoint1 === '' &&
          achievementAdditional1 === '')
          ? ''
          : Math.min(Math.max(Math.round(total1), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-setting-level-evaluator-1',
      achievementAdditional: achievementAdditional1,
    });

  // Tổng điểm của người đánh giá 2
  const skillTotalPoint2 =
    convertBasicProTotalPoint2 === null ||
    (!hasNonNullOrUndefinedPoint(store.evaluationBasicSkills, 'pointEvaluator2') &&
      !hasNonNullOrUndefinedPoint(store.evaluationProSkills, 'pointEvaluator2'))
      ? ''
      : Math.floor(convertBasicProTotalPoint2 || 0);

  const behaviorTotalPoint2 =
    convertBehaviorTotalPoint2 === null ||
    !hasNonNullOrUndefinedPoint(store.evaluationBehaviorSkills, 'pointEvaluator2')
      ? ''
      : convertBehaviorTotalPoint2;

  const achievementPersonalTotalPoint2 =
    convertAchievementPersonalTotalPoint2 !== null && convertAchievementPersonalTotalPoint2 !== undefined
      ? convertAchievementPersonalTotalPoint2
      : '';
  const achievementAdditional2 = !hasNonNullOrUndefinedPoint(store.achievementAdditionals, 'pointEvaluator2')
    ? ''
    : convertAchievementAdditionalTotalPoint2;
  isDisplayEvaluator2 &&
    dataList.push({
      ...pointSettingLevel,
      title: t('IDS_POINT_EVALUATOR_2'),
      skillTotalPoint: skillTotalPoint2,
      behaviorTotalPoint: behaviorTotalPoint2,
      achievementPersonalTotalPoint:
        achievementPersonalTotalPoint2 !== null &&
        achievementPersonalTotalPoint2 !== undefined &&
        achievementPersonalTotalPoint2 !== ''
          ? Math.round(Number(achievementPersonalTotalPoint2))
          : null,
      percentPoint:
        total2 === null ||
        (skillTotalPoint2 === '' &&
          behaviorTotalPoint2 === '' &&
          achievementPersonalTotalPoint2 === '' &&
          achievementAdditional2 === '')
          ? ''
          : Math.min(Math.max(Math.round(total2), versionSetting?.minPoint || 0), versionSetting?.maxPoint || 100),
      key: 'point-setting-level-evaluator-2',
      achievementAdditional: achievementAdditional2,
    });

  return (
    <>
      <Typography.Title level={4}>{header}</Typography.Title>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          size="small"
          style={{ wordBreak: 'break-all' }}
          columns={columns}
          dataSource={dataList}
          pagination={false}
          bordered
          scroll={{ x: screens.sm || screens.xs ? 900 : undefined }}
        />
      )}
    </>
  );
};

export default SettingLevelComponent810;
