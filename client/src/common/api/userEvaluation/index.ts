import { conditionsEvaluation } from '../../../model/Conditions';
import { departmentCommon } from '../../../types/api/commonType';
import {
  EvaluationSkillCheckProps,
  GetAchievementPublicType,
  GetBasicBehaviorSkillPublicType,
  UpdateEvaluationByIdType,
  UserEvaluationGetListProSkill,
  UserEvaluationProps,
} from '../../../types/api/userEvaluationType';
import HttpAxios from '../../http';
import { decrypt, encrypt } from '../../util';
const evaluationHaveSkillCheck = (props: EvaluationSkillCheckProps) => {
  const { evaluationId, isEvaluatorUser, isF5, errorCallback } = props;
  const url = isF5
    ? `/api/v1/f5/management-evaluation-history/evaluation-skill/${evaluationId}`
    : isEvaluatorUser
    ? `/api/v1/f1/user/evaluation-skill/${evaluationId}`
    : `/api/v1/f2/evaluator/evaluation-skill/${evaluationId}`;

  return HttpAxios.Get(url).then((res) => {
    if (res && res.status) return res.data.flagSkill;
    else errorCallback && errorCallback(res?.data);

    return null;
  });
};
const getUserEvaluationDetail = async ({
  evaluationId,
  isEvaluatorUser,
  isF5,
  callback,
  errorCallback,
}: UserEvaluationProps) => {
  const url = isF5
    ? `/api/v1/f5/management-evaluation-history/evaluation/${evaluationId}`
    : isEvaluatorUser
    ? `/api/v1/f1/user/evaluation/${evaluationId}`
    : `/api/v1/f2/evaluator/evaluation/${evaluationId}`;

  return await HttpAxios.Get(url, { params: { isEvaluatorUser } }).then((res) => {
    if (res && res.status === 200) {
      if (res.data) {
        const decode = decrypt(res.data);
        if (decode) {
          const data = JSON.parse(decode);
          callback(data);
        }
      } else errorCallback && errorCallback(res?.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getEvaluationList = async (
  conditions: conditionsEvaluation,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f1/user/evaluation`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};
const listBasicBehavior = async (
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
  type: number,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f1/user/evaluation/${type}/list-basic-behavior`)
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const getListProSkillPublic = async ({
  callback,
  errorCallback,
  isEvaluatorUser,
  isF5,
  evaluationId,
}: UserEvaluationGetListProSkill) => {
  const url = isF5
    ? `/api/v1/f5/management-evaluation-history/evaluation/list-pro-skill/public`
    : isEvaluatorUser
    ? '/api/v1/f1/user/evaluation/list-pro-skill/public'
    : '/api/v1/f2/evaluator/evaluation/list-pro-skill/public';

  return await HttpAxios.Get(url, {
    params: { evaluationId: evaluationId },
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};

const getListProSkill = async (callBack: (dataSource: any) => void, setLoading: (bool: boolean) => void) => {
  setLoading(true);
  await HttpAxios.Get('/api/v1/f1/user/evaluation-criteria/list-pro-skill').then((res) => {
    if (res && res.status === 200) {
      callBack && callBack(res.data);
      setLoading(false);
    } else setLoading(false);
  });
};

const updateEvaluationById = async ({
  evaluationId,
  isSubmit,
  listProSkillData,
  achievementDatas,
  evaluationBasicSkills,
  evaluationBehaviorSkills,
  achievementAdditionals,
  achievementAdditionalTotalPointUser,
  behaviorTotalPointUser,
  achievementPersonalTotalPointUser,
  basicTotalPointUser,
  proTotalPointUser,

  basicTotalPointEvaluator05,
  proTotalPointEvaluator05,
  behaviorTotalPointEvaluator05,
  achievementAdditionalTotalPointEvaluator05,
  achievementPersonalTotalPointEvaluator05,

  basicTotalPointEvaluator1,
  proTotalPointEvaluator1,
  behaviorTotalPointEvaluator1,
  achievementAdditionalTotalPointEvaluator1,
  achievementPersonalTotalPointEvaluator1,

  // ** 2.0
  basicTotalPointEvaluator2,
  proTotalPointEvaluator2,
  behaviorTotalPointEvaluator2,
  achievementAdditionalTotalPointEvaluator2,
  achievementPersonalTotalPointEvaluator2,
  commentUser,
  comment05Public,
  comment05Private,
  comment1Public,
  comment1Private,
  comment2Public,
  comment2Private,

  isEvaluatorUser,
  updateTime,
  totalData,
  achievementSubs,
  callback,
  errorCallback,
}: UpdateEvaluationByIdType) => {
  const url = isEvaluatorUser
    ? `/api/v1/f1/user/evaluation/${evaluationId}`
    : `/api/v1/f2/evaluator/evaluation/${evaluationId}`;

  const data = {
    listProSkillData,
    achievementDatas,
    evaluationBasicSkills,
    evaluationBehaviorSkills,
    achievementAdditionals,
    achievementAdditionalTotalPointUser,
    behaviorTotalPointUser,
    achievementPersonalTotalPointUser,
    basicTotalPointUser,
    proTotalPointUser,

    // ** 0.5
    basicTotalPointEvaluator05,
    proTotalPointEvaluator05,
    behaviorTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator05,
    achievementPersonalTotalPointEvaluator05,

    // ** 1.0
    basicTotalPointEvaluator1,
    proTotalPointEvaluator1,
    behaviorTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator1,
    achievementPersonalTotalPointEvaluator1,

    // ** 2.0
    basicTotalPointEvaluator2,
    proTotalPointEvaluator2,
    behaviorTotalPointEvaluator2,
    achievementAdditionalTotalPointEvaluator2,
    achievementPersonalTotalPointEvaluator2,

    commentUser,
    comment05Public,
    comment05Private,
    comment1Public,
    comment1Private,
    comment2Public,
    comment2Private,
    isEvaluatorUser,
    updateTime,
    isSubmit,
    achievementSubs,
    ...totalData,
  };

  // console.log(12005, data.achievementDatas, data.achievementSubs);
  const stringData = JSON.stringify(data);
  const encode = encrypt(stringData, true);

  return await HttpAxios.Put(url, { data: encode }).then((res) => {
    if (res && res.status === 200) callback && callback(res.data, isSubmit);
    else errorCallback && errorCallback();
  });
};

const getAchievementPublic = async ({
  callback,
  achievementType,
  isEvaluatorUser,
  isF5,
  errorCallback,
}: GetAchievementPublicType) => {
  const url = isF5
    ? '/api/v1/f5/management-evaluation-history/evaluation/achievement/public'
    : isEvaluatorUser
    ? '/api/v1/f1/user/evaluation/achievement/public'
    : '/api/v1/f2/evaluator/evaluation/achievement/public';

  return await HttpAxios.Get(url, { params: { achievementType } }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else {
      errorCallback && errorCallback(res?.data);
    }
  });
};

const getAchievementSubPublic = async ({
  callback,
  achievementType,
  isEvaluatorUser,
  isF5,
  errorCallback,
}: GetAchievementPublicType) => {
  const url = isF5
    ? '/api/v1/f5/management-evaluation-history/evaluation/achievement-sub/public'
    : isEvaluatorUser
    ? '/api/v1/f1/user/evaluation/achievement-sub/public'
    : '/api/v1/f2/evaluator/evaluation/achievement-sub/public';

  return await HttpAxios.Get(url, { params: { achievementType } }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else {
      errorCallback && errorCallback(res?.data);
    }
  });
};
const getAllDepartment = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department').then((res) => {
    if (res && res?.status) {
      //
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getAllDepartmentEvaluation = async (params: any, { callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-evaluation', { params: params }).then((res) => {
    if (res && res?.status) {
      //
      const arrays = res?.data.map((v: any) => {
        v.name;
        v.value = `${v.name}: ${v.type}`;
        v.type;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
        children: [],
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getAllDepartmentEvaluationDefault = async (params: any, { callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/get-all-department-evaluation-default', {
    params: params,
  }).then((res) => {
    if (res && res?.status) {
      //
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getDepartmentGoal = async (
  idEvaluation: string | null,
  role: string | null,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);
  let api = '';
  switch (role) {
    case '1':
      api = `/api/v1/f1/user/department-goal`;
      break;
    case '2':
      api = `/api/v1/f2/evaluator/department-goal`;
      break;
    case '5':
      api = `/api/v1/f5/management-evaluation-history/department-goal`;
      break;
    default:
      api = '';
  }
  await HttpAxios.Get(api, {
    params: { idEvaluation: idEvaluation },
  }).then((res) => {
    if (res && res.status === 200) {
      for (let i = 0; i < res.data.data.evaluationAchievementPersonals.length; i++) {
        res.data.data.evaluationAchievementPersonals[i].evaluationAchievementPersonalSubs =
          res.data.evaluationAchievementPersonalSubs.filter(
            (e: any) => e.achievementPersonalId === res.data.data.evaluationAchievementPersonals[i].key,
          );
      }
      callBack && callBack(res.data.data);
      setLoading(false);
    } else setLoading(false);
  });
};

//

const getBasicBehaviorSkillPublic = async ({
  isEvaluatorUser,
  basicBehaviorType,
  isF5,
  level,
  callback,
  errorCallback,
  isReview,
}: GetBasicBehaviorSkillPublicType) => {
  const url = isReview
    ? '/api/v1/common/evaluation/basic-behavior-skill/public'
    : isF5
    ? '/api/v1/f5/management-evaluation-history/evaluation/basic-behavior-skill/public'
    : isEvaluatorUser
    ? '/api/v1/f1/user/evaluation/basic-behavior-skill/public'
    : '/api/v1/f2/evaluator/evaluation/basic-behavior-skill/public';

  return await HttpAxios.Get(url, {
    params: { basicBehaviorType, level },
  }).then((res) => {
    if (res && res.status === 200) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};

//

const getAchievementAddPublic = async ({
  callback,
  achievementType,
  errorCallback,
  isEvaluatorUser,
  isF5,
  type,
}: GetAchievementPublicType) => {
  const url = isF5
    ? '/api/v1/f5/management-evaluation-history/evaluation/achievement-additional/public'
    : isEvaluatorUser
    ? '/api/v1/f1/user/evaluation/achievement-additional/public'
    : '/api/v1/f2/evaluator/evaluation/achievement-additional/public';

  return await HttpAxios.Get(url, {
    params: { achievementType, type },
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else {
      errorCallback && errorCallback(res?.data);
    }
  });
};

const downloadEvaluationForPdf = async (props: {
  id: number;
  isEvaluatorUser: boolean;
  orientation: 'l' | 'p';
  format: 'a4' | 'a3';
  callback: (data: { buffer: string; fileName: string }) => void;
}) => {
  const { id, isEvaluatorUser, orientation, format, callback } = props;

  return await HttpAxios.Post('/api/v1/common/report/pdf/evaluation', {
    id: [id],
    isEvaluatorUser,
    orientation,
    format,
  }).then((res) => {
    if (res) {
      const data = res.data as { buffer: string; fileName: string };
      callback && callback(data);
    }
  });
};

const goalsPastEvaluation = async (
  condition: { year: number; periodIndex: number; type: number; evaluationPeriodId: number },
  callBack: (
    data: {
      title: string;
      id: number;
      achievementValue: string;
      method: string;
      weight: number;
      difficulty: number;
      evaluationAchievementPersonalSub: {
        evaluationDecision: string;
        degree: string;
        point: string;
        achievementId: number;
      }[];
    }[],
  ) => void,
  errorCallBack: (isLoading: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f1/user/goals/past', {
    params: { ...condition },
  })
    .then((response) => {
      if (response && response.status === 200) {
        callBack(response.data);
        errorCallBack(false);
      }
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};

const userEvaluationApiService = {
  getUserEvaluationDetail,
  getEvaluationList,
  getListProSkillPublic,
  listBasicBehavior,
  getListProSkill,
  updateEvaluationById,
  getAllDepartment,
  getAchievementPublic,
  getDepartmentGoal,
  getBasicBehaviorSkillPublic,
  getAchievementAddPublic,
  downloadEvaluationForPdf,
  evaluationHaveSkillCheck,
  getAchievementSubPublic,
  getAllDepartmentEvaluation,
  getAllDepartmentEvaluationDefault,
  goalsPastEvaluation,
};
export default userEvaluationApiService;
