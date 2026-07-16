import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  EvaluationAdditionalAchievement,
  EvaluationAdditionalAchievementNew,
  EvaluationInfo,
  EvaluationPersonalAchievement,
  EvaluationPersonalAchievementOfUser,
  SettingAchievementAdditional,
} from '../../views/user/evaluation-8-10/interfaces/response.interface';
import { BasicBehaviorSkillType } from '../../types/pages/user-evaluation/UserEvaluationType';

export const checkWeight = createAsyncThunk(
  '/evaluation/personal/checkWeight',
  (dataList: EvaluationPersonalAchievement[]) => {
    let userSum = 0;
    dataList.forEach((data: EvaluationPersonalAchievement) => {
      userSum += Number(data.weight);
    });

    return userSum === 100;
  },
);

export const checkWeightNew = createAsyncThunk(
  '/evaluation/personal/checkWeightNew',
  (dataList: EvaluationPersonalAchievementOfUser[]) => {
    let userSum = 0;
    dataList.forEach((data: EvaluationPersonalAchievementOfUser) => {
      userSum += Number(data.weight);
    });

    return userSum === 100;
  },
);

export const calculateUserTotal = createAsyncThunk(
  '/evaluation/personal/totalUser',
  (dataList: EvaluationPersonalAchievement[]) => {
    let userSum = 0;
    if (dataList.filter((e) => e.coefficientUser !== undefined && e.coefficientUser !== null).length > 0)
      dataList.forEach((data: EvaluationPersonalAchievement) => {
        if (data.weight && data.difficultyUser && data.coefficientUser)
          userSum += (Number(data.weight) / 100) * data.difficultyUser * data.coefficientUser;
      });
    else return null;

    return userSum;
  },
);
export const calculateEvaluator1Total = createAsyncThunk(
  '/evaluation/personal/totalEvaluator1',
  (dataList: EvaluationPersonalAchievement[]) => {
    let sum: number | null = null;
    dataList.forEach((data: EvaluationPersonalAchievement) => {
      if (data.weight && data.difficultyEvaluator1 && data.coefficientEvaluator1)
        sum = Number(sum) + (Number(data.weight) / 100) * data.difficultyEvaluator1 * data.coefficientEvaluator1;
    });

    return sum;
  },
);
export const calculateEvaluator2Total = createAsyncThunk(
  '/evaluation/personal/totalEvaluator2',
  (dataList: EvaluationPersonalAchievement[]) => {
    let sum: number | null = null;
    dataList.forEach((data: EvaluationPersonalAchievement) => {
      if (data.weight && data.difficultyEvaluator2 && data.coefficientEvaluator2)
        sum = Number(sum) + (Number(data.weight) / 100) * data.difficultyEvaluator2 * data.coefficientEvaluator2;
    });

    return sum;
  },
);
export const calculateEvaluator05Total = createAsyncThunk(
  '/evaluation/personal/totalEvaluator05',
  (dataList: EvaluationPersonalAchievement[]) => {
    let sum: number | null = null;
    dataList.forEach((data: EvaluationPersonalAchievement) => {
      if (data.weight && data.difficultyEvaluator05 && data.coefficientEvaluator05)
        sum = Number(sum) + (Number(data.weight) / 100) * data.difficultyEvaluator05 * data.coefficientEvaluator05;
    });

    return sum;
  },
);

export const calculateAdditionTotal = createAsyncThunk(
  '/evaluation/addition/total',
  (dataList: [EvaluationAdditionalAchievement[], SettingAchievementAdditional[]]) => {
    let additionSum = 0;
    const additionList = dataList[1];
    if (dataList[0].filter((e) => e.pointUser).length > 0)
      dataList[0].forEach((data: EvaluationAdditionalAchievement) => {
        if (data.pointUser) {
          const points = additionList.filter((item: SettingAchievementAdditional) => {
            if (item.rating === data.pointUser) return item;
          });
          additionSum += Number(points[0].point) && Number(points[0].point);
        }
      });
    else return null;

    return Math.round(additionSum * 100) / 100;
  },
);
export const calculateAdditionTotal05 = createAsyncThunk(
  '/evaluation/addition/total05',
  (dataList: [EvaluationAdditionalAchievement[], SettingAchievementAdditional[]]) => {
    let additionSum = 0;
    const additionList = dataList[1];
    if (dataList[0].filter((e) => e.pointEvaluator05).length > 0)
      dataList[0].forEach((data: EvaluationAdditionalAchievement) => {
        if (data.pointEvaluator05) {
          const points = additionList.filter((item: SettingAchievementAdditional) => {
            if (item.rating === data.pointEvaluator05) return item;
          });
          additionSum += Number(points[0].point) && Number(points[0].point);
        }
      });
    else return null;

    return Math.round(additionSum * 100) / 100;
  },
);
export const calculateAdditionTotal1 = createAsyncThunk(
  '/evaluation/addition/total1',
  (dataList: [EvaluationAdditionalAchievement[], SettingAchievementAdditional[]]) => {
    let additionSum = 0;
    const additionList = dataList[1];
    if (dataList[0].filter((e) => e.pointEvaluator1).length > 0)
      dataList[0].forEach((data: EvaluationAdditionalAchievement) => {
        if (data.pointEvaluator1) {
          const points = additionList.filter((item: SettingAchievementAdditional) => {
            if (item.rating === data.pointEvaluator1) return item;
          });
          additionSum += Number(points[0].point) && Number(points[0].point);
        }
      });
    else return null;

    return Math.round(additionSum * 100) / 100;
  },
);
export const calculateAdditionTotal2 = createAsyncThunk(
  '/evaluation/addition/total2',
  (dataList: [EvaluationAdditionalAchievement[], SettingAchievementAdditional[]]) => {
    let additionSum = 0;
    const additionList = dataList[1];
    if (dataList[0].filter((e) => e.pointEvaluator2).length > 0)
      dataList[0].forEach((data: EvaluationAdditionalAchievement) => {
        if (data.pointEvaluator2) {
          const points = additionList.filter((item: SettingAchievementAdditional) => {
            if (item.rating === data.pointEvaluator2) return item;
          });
          additionSum += Number(points[0].point) && Number(points[0].point);
        }
      });
    else return null;

    return Math.round(additionSum * 100) / 100;
  },
);
export const displayAdditionTotal = createAsyncThunk('/evaluation/addition/display', (dataList: EvaluationInfo) => {
  const additionSum =
    dataList.summaryDepartment.achievementAdditionalTotalPointUser !== null
      ? Number(dataList.summaryDepartment.achievementAdditionalTotalPointUser)
      : null;

  return additionSum;
});
export const displayAdditionTotal05 = createAsyncThunk('/evaluation/addition/display05', (dataList: EvaluationInfo) => {
  const additionSum =
    dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator05 !== null
      ? Number(dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator05)
      : null;

  return additionSum;
});
export const displayAdditionTotal1 = createAsyncThunk('/evaluation/addition/display1', (dataList: EvaluationInfo) => {
  const additionSum =
    dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator1 !== null
      ? Number(dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator1)
      : null;

  return additionSum;
});
export const displayAdditionTotal2 = createAsyncThunk('/evaluation/addition/display2', (dataList: EvaluationInfo) => {
  const additionSum =
    dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator2 !== null
      ? Number(dataList.summaryDepartment.achievementAdditionalTotalPointEvaluator2)
      : null;

  return additionSum;
});
export const displayUserTotal = createAsyncThunk('/evaluation/personal/display', (dataList: EvaluationInfo) => {
  const userSum =
    dataList.summaryDepartment.achievementPersonalTotalPointUser !== null
      ? Number(dataList.summaryDepartment.achievementPersonalTotalPointUser)
      : null;

  return userSum;
});
export const display05Total = createAsyncThunk('/evaluation/personal/display05', (dataList: EvaluationInfo) => {
  const userSum =
    dataList.summaryDepartment.achievementPersonalTotalPointEvaluator05 !== null
      ? Number(dataList.summaryDepartment.achievementPersonalTotalPointEvaluator05)
      : null;

  return userSum;
});
export const display1Total = createAsyncThunk('/evaluation/personal/display1', (dataList: EvaluationInfo) => {
  const userSum =
    dataList.summaryDepartment.achievementPersonalTotalPointEvaluator1 !== null
      ? Number(dataList.summaryDepartment.achievementPersonalTotalPointEvaluator1)
      : null;

  return userSum;
});
export const display2Total = createAsyncThunk('/evaluation/personal/display2', (dataList: EvaluationInfo) => {
  const userSum =
    dataList.summaryDepartment.achievementPersonalTotalPointEvaluator2 !== null
      ? Number(dataList.summaryDepartment.achievementPersonalTotalPointEvaluator2)
      : null;

  return userSum;
});

export const userEvaluationBehaviorSkill = createAsyncThunk(
  '/user/evaluation/calculator/behavior-skill-user',
  (data: any[]) => {
    return data;
  },
);

// ** Set total score behavior skill - user
export const userEvaluationSetBehaviorSkillScoreUser = createAsyncThunk(
  '/user/evaluation/behavior-skill/set-score',
  (data: number | undefined | null | string) => data,
);

export const userEvaluationSetBehaviorSkillScoreEvaluator05 = createAsyncThunk(
  '/user/evaluation/behavior-skill/evaluator-05',
  (data: number | undefined | null | string) => data,
);

export const userEvaluationSetBehaviorSkillScoreEvaluator1 = createAsyncThunk(
  '/user/evaluation/behavior-skill/evaluator-1',
  (data: number | undefined | null | string) => data,
);

export const userEvaluationSetBehaviorSkillScoreEvaluator2 = createAsyncThunk(
  '/user/evaluation/behavior-skill/evaluator-2',
  (data: number | undefined | null | string) => data,
);

//

export const userEvaluationPersonalGoalsList = createAsyncThunk(
  '/user/evaluation/calculator/personal-goals-list',
  (data: any[]) => {
    return data;
  },
);

export const userTotalPointPersonalGoals = createAsyncThunk(
  '/user/evaluation/calculator/personal-goals-score',
  (data: number | null) => {
    return data;
  },
);
export const evaluatorTotalPointPersonalGoals05 = createAsyncThunk(
  '/user/evaluation/calculator/personal-goals-score-evaluator-05',
  (data: number | null) => {
    return data;
  },
);

export const evaluatorTotalPointPersonalGoals1 = createAsyncThunk(
  '/user/evaluation/calculator/personal-goals-score-evaluator-1',
  (data: number | null) => {
    return data;
  },
);

export const evaluatorTotalPointPersonalGoals2 = createAsyncThunk(
  '/user/evaluation/calculator/personal-goals-score-evaluator-2',
  (data: number | null) => {
    return data;
  },
);
export const evaluationListAchievementAdditionals = createAsyncThunk(
  '/user/evaluation/calculator/achievement-additional',
  (data: EvaluationAdditionalAchievementNew[]) => {
    return data;
  },
);

export const evaluationTotalPointAchievementUser = createAsyncThunk(
  '/user/evaluation/calculator/achievement-score-user',
  (data: number | null) => {
    return data;
  },
);

export const evaluationTotalPointAchievementEvaluator05 = createAsyncThunk(
  '/user/evaluation/calculator/achievement-score-evaluator05',
  (data: number | null) => {
    return data;
  },
);

export const evaluationTotalPointAchievementEvaluator1 = createAsyncThunk(
  '/user/evaluation/calculator/achievement-score-evaluator1',
  (data: number | null) => {
    return data;
  },
);
export const evaluationTotalPointAchievementEvaluator2 = createAsyncThunk(
  '/user/evaluation/calculator/achievement-score-evaluator2',
  (data: number | null) => {
    return data;
  },
);

//
export const summaryPointUsers = createAsyncThunk('user/evalution/calculator/summary-user', (data: number | null) => {
  return data;
});

export const summaryPointEvaluator05 = createAsyncThunk(
  'user/evalution/calculator/summary-evaluator-05',
  (data: number | null) => {
    return data;
  },
);

export const summaryPointEvaluator1 = createAsyncThunk(
  'user/evalution/calculator/summary-evaluator-1',
  (data: number | null) => {
    return data;
  },
);

export const summaryPointEvaluator2 = createAsyncThunk(
  'user/evalution/calculator/summary-evaluator-2',
  (data: number | null) => {
    return data;
  },
);

export const setPointAchievementAdditional = createAsyncThunk(
  'evaluation/detail/list-point-achievement-additional',
  (
    data: {
      rating: string;
      point: number;
    }[],
  ) => {
    return data;
  },
);

export const setListPointBehavior = createAsyncThunk(
  'evaluation/detail/list-point-behavior',
  (data: { label: string; value: number }[]) => {
    return data;
  },
);
interface State {
  userSum: number | null;
  additionSum: number | null;
  additionSum05: number | null;
  additionSum1: number | null;
  additionSum2: number | null;
  sumEvaluator1: number | null;
  sumEvaluator2: number | null;
  sumEvaluator05: number | null;
  hasMode1: boolean;
  hasMode2: boolean;
  hasMode3: boolean;

  personalGoals: number | null;
  personalGoals05: number | null;
  personalGoal1: number | null;
  personalGoal2: number | null;

  achievementUser: number | null;
  achievementEvaluator05: number | null;
  achievementEvaluator1: number | null;
  achievementEvaluator2: number | null;

  // allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  isOpenPopUp: boolean;
  isDisable: boolean;
  isEqual100: boolean;
  isEqual100New: boolean;
  defaultActiveKey: string;
  updatedTime: string;
  isEqualDisplay: boolean;
  isEqualDisplayNew: boolean;

  hasEvaluator2: boolean;
  defaultNewActiveKey: string;
  evaluationBehaviorSkills: BasicBehaviorSkillType[];

  behaviorTotalPointUser: number | undefined | null | string;
  behaviorTotalPointEvaluator05: number | undefined | null | string;
  behaviorTotalPointEvaluator1: number | undefined | null | string;
  behaviorTotalPointEvaluator2: number | undefined | null | string;
  evaluationPersonalGoals: EvaluationPersonalAchievement[];

  evaluationAchievementAdditionals: EvaluationAdditionalAchievementNew[];

  summaryPointUser: number | null;
  summaryPointEvaluator05: number | null;
  summaryPointEvaluator1: number | null;
  summaryPointEvaluator2: number | null;

  pointAchievementAdditionals:
    | {
        rating: string;
        point: number;
      }[]
    | [];
  pointListBehaviors:
    | {
        label: string;
        value: number;
      }[]
    | [];
}
const initialState = {
  // userSum: 0,
  // additionSum: 0,
  // sumEvaluator1: 0,
  // sumEvaluator2: 0,
  // sumEvaluator05: 0,
  hasMode1: false,
  hasMode2: false,
  hasMode3: false,

  personalGoals: null,
  personalGoals05: null,
  personalGoal1: null,
  personalGoal2: null,
  // allowSeeList: [],
  maxOrder: '',
  isOpenPopUp: false,
  isDisable: false,
  isEqual100: true,
  isEqual100New: true,
  defaultActiveKey: '1',
  updatedTime: '',
  isEqualDisplay: true,
  isEqualDisplayNew: true,
  hasEvaluator2: true,
  defaultNewActiveKey: '1',
  evaluationBehaviorSkills: [] as BasicBehaviorSkillType[],

  behaviorTotalPointUser: undefined as number | undefined | null,
  behaviorTotalPointEvaluator05: undefined as number | undefined | null,
  behaviorTotalPointEvaluator1: undefined as number | undefined | null,
  behaviorTotalPointEvaluator2: undefined as number | undefined | null,

  evaluationPersonalGoals: [] as EvaluationPersonalAchievement[],
  evaluationAchievementAdditionals: [] as EvaluationAdditionalAchievementNew[],

  summaryPointUser: null,
  summaryPointEvaluator05: null,
  summaryPointEvaluator1: null,
  summaryPointEvaluator2: null,

  achievementUser: null,
  achievementEvaluator05: null,
  achievementEvaluator1: null,
  achievementEvaluator2: null,

  pointAchievementAdditionals: [],
  pointListBehaviors: [],
} as State;
export const calculateTotal = createSlice({
  name: 'calculate',
  initialState,
  reducers: {
    setMode1: (state, action) => {
      state.hasMode1 = action.payload;
    },
    setMode2: (state, action) => {
      state.hasMode2 = action.payload;
    },
    setMode3: (state, action) => {
      state.hasMode3 = action.payload;
    },
    setMaxOrder: (state, action) => {
      state.maxOrder = action.payload;
    },
    setOpenPopUp: (state, action) => {
      state.isOpenPopUp = action.payload;
    },
    setDisabled: (state, action) => {
      state.isDisable = action.payload;
    },
    setHasEvaluator2: (state, action) => {
      state.hasEvaluator2 = action.payload;
    },
    setDefaultActiveKey: (state, action) => {
      state.defaultActiveKey = action.payload;
    },
    setUpdatedTime: (state, action) => {
      state.updatedTime = action.payload;
    },
    checkWeight2: (state, action) => {
      state.isEqualDisplay = action.payload;
    },
    checkWeightNew2: (state, action) => {
      state.isEqualDisplayNew = action.payload;
    },
    setKeyNewTabs: (state, action) => {
      state.defaultNewActiveKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calculateUserTotal.fulfilled, (state, action) => {
      state.userSum = action.payload;
    });
    builder.addCase(displayUserTotal.fulfilled, (state, action) => {
      state.userSum = action.payload;
    });
    builder.addCase(calculateAdditionTotal.fulfilled, (state, action) => {
      state.additionSum = action.payload;
    });
    builder.addCase(displayAdditionTotal.fulfilled, (state, action) => {
      state.additionSum = action.payload;
    });
    builder.addCase(calculateAdditionTotal05.fulfilled, (state, action) => {
      state.additionSum05 = action.payload;
    });
    builder.addCase(displayAdditionTotal05.fulfilled, (state, action) => {
      state.additionSum05 = action.payload;
    });
    builder.addCase(calculateAdditionTotal1.fulfilled, (state, action) => {
      state.additionSum1 = action.payload;
    });
    builder.addCase(displayAdditionTotal1.fulfilled, (state, action) => {
      state.additionSum1 = action.payload;
    });
    builder.addCase(calculateAdditionTotal2.fulfilled, (state, action) => {
      state.additionSum2 = action.payload;
    });
    builder.addCase(displayAdditionTotal2.fulfilled, (state, action) => {
      state.additionSum2 = action.payload;
    });
    builder.addCase(calculateEvaluator1Total.fulfilled, (state, action) => {
      state.sumEvaluator1 = action.payload;
    });
    builder.addCase(display1Total.fulfilled, (state, action) => {
      state.sumEvaluator1 = action.payload;
    });
    builder.addCase(calculateEvaluator2Total.fulfilled, (state, action) => {
      state.sumEvaluator2 = action.payload;
    });
    builder.addCase(display2Total.fulfilled, (state, action) => {
      state.sumEvaluator2 = action.payload;
    });
    builder.addCase(calculateEvaluator05Total.fulfilled, (state, action) => {
      state.sumEvaluator05 = action.payload;
    });
    builder.addCase(display05Total.fulfilled, (state, action) => {
      state.sumEvaluator05 = action.payload;
    });
    builder.addCase(checkWeight.fulfilled, (state, action) => {
      state.isEqual100 = action.payload;
    });
    builder.addCase(checkWeightNew.fulfilled, (state, action) => {
      state.isEqual100New = action.payload;
    });
    builder.addCase(userEvaluationBehaviorSkill.fulfilled, (state, action) => {
      state.evaluationBehaviorSkills = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScoreUser.fulfilled, (state, action) => {
      state.behaviorTotalPointUser = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScoreEvaluator05.fulfilled, (state, action) => {
      state.behaviorTotalPointEvaluator05 = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScoreEvaluator1.fulfilled, (state, action) => {
      state.behaviorTotalPointEvaluator1 = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScoreEvaluator2.fulfilled, (state, action) => {
      state.behaviorTotalPointEvaluator2 = action.payload;
    });
    builder.addCase(userEvaluationPersonalGoalsList.fulfilled, (state, action) => {
      state.evaluationPersonalGoals = action.payload;
    });
    builder.addCase(userTotalPointPersonalGoals.fulfilled, (state, action) => {
      state.personalGoals = action.payload;
    });
    builder.addCase(evaluatorTotalPointPersonalGoals05.fulfilled, (state, action) => {
      state.personalGoals05 = action.payload;
    });
    builder.addCase(evaluatorTotalPointPersonalGoals1.fulfilled, (state, action) => {
      state.personalGoal1 = action.payload;
    });
    builder.addCase(evaluatorTotalPointPersonalGoals2.fulfilled, (state, action) => {
      state.personalGoal2 = action.payload;
    });
    builder.addCase(evaluationListAchievementAdditionals.fulfilled, (state, action) => {
      state.evaluationAchievementAdditionals = action.payload;
    });
    builder.addCase(evaluationTotalPointAchievementUser.fulfilled, (state, action) => {
      state.achievementUser = action.payload;
    });
    builder.addCase(evaluationTotalPointAchievementEvaluator05.fulfilled, (state, action) => {
      state.achievementEvaluator05 = action.payload;
    });
    builder.addCase(evaluationTotalPointAchievementEvaluator1.fulfilled, (state, action) => {
      state.achievementEvaluator1 = action.payload;
    });
    builder.addCase(evaluationTotalPointAchievementEvaluator2.fulfilled, (state, action) => {
      state.achievementEvaluator2 = action.payload;
    });
    builder.addCase(summaryPointUsers.fulfilled, (state, action) => {
      state.summaryPointUser = action.payload;
    });
    builder.addCase(summaryPointEvaluator05.fulfilled, (state, action) => {
      state.summaryPointEvaluator05 = action.payload;
    });
    builder.addCase(summaryPointEvaluator1.fulfilled, (state, action) => {
      state.summaryPointEvaluator1 = action.payload;
    });
    builder.addCase(summaryPointEvaluator2.fulfilled, (state, action) => {
      state.summaryPointEvaluator2 = action.payload;
    });
    builder.addCase(setPointAchievementAdditional.fulfilled, (state, action) => {
      state.pointAchievementAdditionals = action.payload;
    });
    builder.addCase(setListPointBehavior.fulfilled, (state, action)=> {
      state.pointListBehaviors = action.payload;
    });
  },
});

export const {
  setMode1,
  setMode2,
  setMode3,
  setMaxOrder,
  setOpenPopUp,
  setDisabled,
  setHasEvaluator2,
  setDefaultActiveKey,
  setUpdatedTime,
  checkWeight2,
  checkWeightNew2,
  setKeyNewTabs,
} = calculateTotal.actions;

export default calculateTotal.reducer;
