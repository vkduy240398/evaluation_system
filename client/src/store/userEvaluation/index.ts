import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  AchievementAdditionalType,
  BasicBehaviorSkillType,
  SettingProFormulaType,
  UserEvaluationAchievementType,
  UserEvaluationToProSkillType,
} from '../../types/pages/user-evaluation/UserEvaluationType';

// interface Redux {
//   getState: any;
//   dispatch: Dispatch<any>;
// }
export const userEvaluationData = createAsyncThunk('/user/evaluation', (data: any) => data);
export const userEvaluationAchievement = createAsyncThunk('/user/evaluation/achievement', (data: any) => data);
export const userEvaluationAchievement2 = createAsyncThunk('/user/evaluation/achievement-2', (data: any) => data);
export const userCloneEvaluationAchievement = createAsyncThunk(
  '/user/evaluation/clone/achievement',
  (data: any[]) => data,
);
export const userEvaluationCloneAchievement2 = createAsyncThunk(
  '/user/evaluation/clone/achievement-2',
  (data: any[]) => data,
);

// ** Set value calculator pro skill user, 0.5, 1, 2
export const userEvaluationCalculatorProSkill = createAsyncThunk(
  '/user/evaluation/calculator/pro-skill-user',
  (data: any) => data,
);

// ** Set value calculator basic skill user, 0.5, 1, 2
export const userEvaluationBasicSkill = createAsyncThunk(
  '/user/evaluation/calculator/basic-skill-user',
  (data: any[]) => data,
);

// ** Set value calculator behavior skill user, 0.5, 1, 2
export const userEvaluationBehaviorSkill = createAsyncThunk(
  '/user/evaluation/calculator/behavior-skill-user',
  (data: any[]) => data,
);

// ** Set achievement additional
export const userEvaluationAchievementAdditional = createAsyncThunk(
  '/user/evaluation/achievement-additional',
  (data: any) => data,
);

// Set score =====================================================================
// ** Set value max option score
export const userEvaluationMaxOptionScore = createAsyncThunk(
  '/user/evaluation/calculator/max-option-score',
  (data: number) => data,
);

// ** Set total score pro skill - user
export const userEvaluationSetProSkillScoreUser = createAsyncThunk(
  '/user/evaluation/pro-skill/set-score',
  (data: number | undefined | null) => data,
);

// ** Set total score basic skill - user
export const userEvaluationSetBasicSkillScoreUser = createAsyncThunk(
  '/user/evaluation/basic-skill/set-score',
  (data: number | null | undefined) => data,
);

// ** Set total score behavior skill - user
export const userEvaluationSetBehaviorSkillScoreUser = createAsyncThunk(
  '/user/evaluation/behavior-skill/set-score',
  (data: number | null) => data,
);

// ** Set total score achievement additional - user
export const userEvaluationSetAchievementPersonalScoreUser = createAsyncThunk(
  '/user/evaluation/achievement-personal/set-score',
  (data: any) => data,
);

// ** Set total score achievement additional - user
export const userEvaluationSetAchievementAdditionalScoreUser = createAsyncThunk(
  '/user/evaluation/achievement-additional/set-score',
  (data: any) => data,
);

// ** Set total score basic skill - evaluator 0.5
export const userEvaluationSetProSkillScore05 = createAsyncThunk(
  '/user/evaluation/pro-skill/set-score/evaluator05',
  (data: number | undefined | null) => data,
);

// ** Set total score basic skill - evaluator 0.5
export const userEvaluationSetBasicSkillScore05 = createAsyncThunk(
  '/user/evaluation/basic-skill/set-score/evaluator05',
  (data: number | null | undefined) => data,
);

// ** Set total score behavior skill - evaluator 0.5
export const userEvaluationSetBehaviorSkillScore05 = createAsyncThunk(
  '/user/evaluation/behavior-skill/set-score/evaluator05',
  (data: number | null) => data,
);

// ** Set total score achievement personal - evaluator 0.5
export const userEvaluationSetAchievementPersonalScore05 = createAsyncThunk(
  '/user/evaluation/achievement-personal/set-score/evaluator05',
  (data: any) => data,
);

// ** Set total score achievement additional - evaluator 0.5
export const userEvaluationSetAchievementAdditionalScore05 = createAsyncThunk(
  '/user/evaluation/achievement-additional/set-score/evaluator05',
  (data: any) => data,
);

// ** Set total score basic skill - evaluator 1.0
export const userEvaluationSetProSkillScore1 = createAsyncThunk(
  '/user/evaluation/pro-skill/set-score/evaluator10',
  (data: number | undefined | null) => data,
);

// ** Set total score basic skill - evaluator 1.0
export const userEvaluationSetBasicSkillScore1 = createAsyncThunk(
  '/user/evaluation/basic-skill/set-score/evaluator10',
  (data: number | null | undefined) => data,
);

// ** Set total score behavior skill - evaluator 1.0
export const userEvaluationSetBehaviorSkillScore1 = createAsyncThunk(
  '/user/evaluation/behavior-skill/set-score/evaluator10',
  (data: number | null) => data,
);

// ** Set total score achievement personal - evaluator 1.0
export const userEvaluationSetAchievementPersonalScore1 = createAsyncThunk(
  '/user/evaluation/achievement-personal/set-score/evaluator10',
  (data: any) => data,
);

// ** Set total score achievement additional - evaluator 1.0
export const userEvaluationSetAchievementAdditionalScore1 = createAsyncThunk(
  '/user/evaluation/achievement-additional/set-score/evaluator10',
  (data: any) => data,
);

// ** Set total score basic skill - evaluator 2.0
export const userEvaluationSetProSkillScore2 = createAsyncThunk(
  '/user/evaluation/pro-skill/set-score/evaluator20',
  (data: number | undefined | null) => data,
);

// ** Set total score basic skill - evaluator 2.0
export const userEvaluationSetBasicSkillScore2 = createAsyncThunk(
  '/user/evaluation/basic-skill/set-score/evaluator20',
  (data: number | null | undefined) => data,
);

// ** Set total score behavior skill - evaluator 2.0
export const userEvaluationSetBehaviorSkillScore2 = createAsyncThunk(
  '/user/evaluation/behavior-skill/set-score/evaluator20',
  (data: number | null) => data,
);

// ** Set total score achievement personal - evaluator 2.0
export const userEvaluationSetAchievementPersonalScore2 = createAsyncThunk(
  '/user/evaluation/achievement-personal/set-score/evaluator20',
  (data: any) => data,
);

// ** Set total score achievement additional - evaluator 2.0
export const userEvaluationSetAchievementAdditionalScore2 = createAsyncThunk(
  '/user/evaluation/achievement-additional/set-score/evaluator20',
  (data: any) => data,
);

// ** Set Pro formulas
export const userEvaluationSetSettingProFormula = createAsyncThunk(
  '/user/evaluation/setting-pro-formula/public',
  (data: any) => data,
);

// ** Set focus achievement personal
export const setFocusAchievementPersonalError = createAsyncThunk(
  '/user/evaluation/achievement-personal/focus-error',
  (data: boolean) => data,
);

// ** Set focus level
export const setFocusLevelError = createAsyncThunk(
  '/admin-evaluation/evaluation-calculator-detail/level/focus-error',
  (data: any[]) => data,
);

// ** Reload Component
export const reloadComponent = createAsyncThunk('/user/evaluation/reload-component', (data: boolean) => data);

// ** Basic - Behavior - Pro Point Options
export const setBasicSkillPointOptions = createAsyncThunk(
  '/user/evaluation/set-basic-skill-point-options',
  (data: OptionType[]) => data,
);
export const setBehaviorSkillPointOptions = createAsyncThunk(
  '/user/evaluation/set-behavior-skill-point-options',
  (data: OptionType[]) => data,
);
export const setProSkillPointOptions = createAsyncThunk(
  '/user/evaluation/set-pro-skill-point-options',
  (data: OptionType[]) => data,
);
export const setAdditionalOptions = createAsyncThunk(
  '/user/evaluation/set-addition-option-point',
  (data: OptionType[]) => data,
);
export const setDeleteOption = createAsyncThunk('/user/evaluation/set-delete-option', (data: DeleteOption) => data);

export const setAchievementSub = createAsyncThunk('/user/evaluation/achievement-sub', (data: any) => data);
export const setAchievementSub2 = createAsyncThunk('/user/evaluation/achievement-sub-2', (data: any) => data);

export const setTotalData = createAsyncThunk('/user/evaluation/set-total-data', (data: any) => data);
export type calculatorPointBasicSkillUserType = {};
type OptionType = { value: number; label: any };
type DeleteOption = {
  record: AchievementAdditionalType;
  setEvaluationAchievementAdd: any;
};
const initialState = {
  userEvaluationSave: {},
  achievementDatas: undefined as UserEvaluationAchievementType[] | undefined,

  // ** Calculator pro skill user, 0.5, 1, 2
  evaluationProSkills: [] as UserEvaluationToProSkillType[],

  // ** Calculator basic skill user, 0.5, 1, 2
  evaluationBasicSkills: [] as BasicBehaviorSkillType[],

  // ** Calculator behavior skill user, 0.5, 1, 2
  evaluationBehaviorSkills: [] as BasicBehaviorSkillType[],

  // ** Max option score
  maxOptionScore: 5,

  // ** Achievement additional
  achievementAdditionals: [] as AchievementAdditionalType[],

  // ** Set score - user
  proTotalPointUser: undefined as number | undefined | null,
  basicTotalPointUser: undefined as number | undefined | null,
  achievementAdditionalTotalPointUser: undefined as number | undefined,
  behaviorTotalPointUser: undefined as number | undefined | null,
  achievementPersonalTotalPointUser: undefined as number | undefined,

  // ** Set score - evaluator 0.5
  proTotalPoint05: undefined as number | undefined | null,
  basicTotalPoint05: undefined as number | undefined | null,
  achievementAdditionalTotalPoint05: undefined as number | undefined,
  behaviorTotalPoint05: undefined as number | undefined | null,
  achievementPersonalTotalPoint05: undefined as number | undefined,

  // ** Set score - evaluator 1.0
  proTotalPoint1: undefined as number | undefined | null,
  basicTotalPoint1: undefined as number | undefined | null,
  achievementAdditionalTotalPoint1: undefined as number | undefined,
  behaviorTotalPoint1: undefined as number | undefined | null,
  achievementPersonalTotalPoint1: undefined as number | undefined,

  // ** Set score - evaluator 2.0
  proTotalPoint2: undefined as number | undefined | null,
  basicTotalPoint2: undefined as any,
  achievementAdditionalTotalPoint2: undefined as number | undefined,
  behaviorTotalPoint2: undefined as number | undefined | null,
  achievementPersonalTotalPoint2: undefined as number | undefined,

  // ** Pro formulas
  settingProFormulas: [] as SettingProFormulaType[],

  isReloadComponent: false,

  // ** Set focus achievement personal
  isFocusAchievementPersonalError: false,

  // ** Basic - Behavior - Pro Point Options
  basicSkillPointOptions: [] as OptionType[],
  behaviorSkillPointOptions: [] as OptionType[],
  proSkillPointOptions: [] as OptionType[],
  additionPoinOptions: [] as any,
  totalData: {} as any,

  // ** [F6] Setting 1-7 : tab level
  isFocusLevelError: [] as any[],

  //
  mailTitle: ``,
  mailContent: ``,

  achievementSubs: {} as any,
  deleteOptions: {} as any,
};
export const userEvaluation = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMailTitle: (state, action) => {
      state.mailTitle = action.payload;
    },
    setMailContent: (state, action) => {
      state.mailContent = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(userEvaluationData.fulfilled, (state, action) => {
      state.userEvaluationSave = action.payload;
    });

    builder.addCase(userEvaluationAchievement.fulfilled, (state, action) => {
      state.achievementDatas = action.payload;
    });
    builder.addCase(userEvaluationAchievement2.fulfilled, (state, action) => {
      state.achievementDatas = [...(state.achievementDatas ? state.achievementDatas : []), action.payload];
    });
    builder.addCase(userCloneEvaluationAchievement.fulfilled, (state, action) => {
      state.achievementDatas = [...action.payload];
    });
    builder.addCase(userEvaluationCloneAchievement2.fulfilled, (state, action) => {
      state.achievementDatas = [...(state.achievementDatas ? state.achievementDatas : []), ...action.payload];
    });
    builder.addCase(userEvaluationCalculatorProSkill.fulfilled, (state, action) => {
      state.evaluationProSkills = action.payload;
    });
    builder.addCase(userEvaluationBasicSkill.fulfilled, (state, action) => {
      state.evaluationBasicSkills = action.payload;
    });
    builder.addCase(userEvaluationBehaviorSkill.fulfilled, (state, action) => {
      state.evaluationBehaviorSkills = action.payload;
    });
    builder.addCase(userEvaluationMaxOptionScore.fulfilled, (state, action) => {
      state.maxOptionScore = action.payload;
    });
    builder.addCase(userEvaluationAchievementAdditional.fulfilled, (state, action) => {
      state.achievementAdditionals = action.payload;
    });
    builder.addCase(userEvaluationSetSettingProFormula.fulfilled, (state, action) => {
      state.settingProFormulas = action.payload;
    });

    // ** set point user
    builder.addCase(userEvaluationSetAchievementAdditionalScoreUser.fulfilled, (state, action) => {
      state.achievementAdditionalTotalPointUser = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScoreUser.fulfilled, (state, action) => {
      state.behaviorTotalPointUser = action.payload;
    });
    builder.addCase(userEvaluationSetAchievementPersonalScoreUser.fulfilled, (state, action) => {
      state.achievementPersonalTotalPointUser = action.payload;
    });
    builder.addCase(userEvaluationSetProSkillScoreUser.fulfilled, (state, action) => {
      state.proTotalPointUser = action.payload;
    });
    builder.addCase(userEvaluationSetBasicSkillScoreUser.fulfilled, (state, action) => {
      state.basicTotalPointUser = action.payload;
    });

    // ** set point evaluator 0.5
    builder.addCase(userEvaluationSetAchievementAdditionalScore05.fulfilled, (state, action) => {
      state.achievementAdditionalTotalPoint05 = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScore05.fulfilled, (state, action) => {
      state.behaviorTotalPoint05 = action.payload;
    });
    builder.addCase(userEvaluationSetAchievementPersonalScore05.fulfilled, (state, action) => {
      state.achievementPersonalTotalPoint05 = action.payload;
    });
    builder.addCase(userEvaluationSetProSkillScore05.fulfilled, (state, action) => {
      state.proTotalPoint05 = action.payload;
    });
    builder.addCase(userEvaluationSetBasicSkillScore05.fulfilled, (state, action) => {
      state.basicTotalPoint05 = action.payload;
    });

    // ** set point evaluator 1.0
    builder.addCase(userEvaluationSetAchievementAdditionalScore1.fulfilled, (state, action) => {
      state.achievementAdditionalTotalPoint1 = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScore1.fulfilled, (state, action) => {
      state.behaviorTotalPoint1 = action.payload;
    });
    builder.addCase(userEvaluationSetAchievementPersonalScore1.fulfilled, (state, action) => {
      state.achievementPersonalTotalPoint1 = action.payload;
    });
    builder.addCase(userEvaluationSetProSkillScore1.fulfilled, (state, action) => {
      state.proTotalPoint1 = action.payload;
    });
    builder.addCase(userEvaluationSetBasicSkillScore1.fulfilled, (state, action) => {
      state.basicTotalPoint1 = action.payload;
    });

    // ** set point evaluator 2.0
    builder.addCase(userEvaluationSetAchievementAdditionalScore2.fulfilled, (state, action) => {
      state.achievementAdditionalTotalPoint2 = action.payload;
    });
    builder.addCase(userEvaluationSetBehaviorSkillScore2.fulfilled, (state, action) => {
      state.behaviorTotalPoint2 = action.payload;
    });
    builder.addCase(userEvaluationSetAchievementPersonalScore2.fulfilled, (state, action) => {
      state.achievementPersonalTotalPoint2 = action.payload;
    });
    builder.addCase(userEvaluationSetProSkillScore2.fulfilled, (state, action) => {
      state.proTotalPoint2 = action.payload;
    });
    builder.addCase(userEvaluationSetBasicSkillScore2.fulfilled, (state, action) => {
      state.basicTotalPoint2 = action.payload;
    });

    builder.addCase(reloadComponent.fulfilled, (state, action) => {
      state.isReloadComponent = action.payload;
    });

    builder.addCase(setFocusAchievementPersonalError.fulfilled, (state, action) => {
      state.isFocusAchievementPersonalError = action.payload;
    });

    builder.addCase(setFocusLevelError.fulfilled, (state, action) => {
      state.isFocusLevelError = action.payload;
    });

    // ** Basic - Behavior - Pro Point Options
    builder.addCase(setBasicSkillPointOptions.fulfilled, (state, action) => {
      state.basicSkillPointOptions = action.payload;
    });
    builder.addCase(setBehaviorSkillPointOptions.fulfilled, (state, action) => {
      state.behaviorSkillPointOptions = action.payload;
    });
    builder.addCase(setProSkillPointOptions.fulfilled, (state, action) => {
      state.proSkillPointOptions = action.payload;
    });

    builder.addCase(setTotalData.fulfilled, (state, action) => {
      state.totalData = action.payload;
    });

    builder.addCase(setAchievementSub.fulfilled, (state, action) => {
      state.achievementSubs = { ...state.achievementSubs, ...action.payload };
    });

    builder.addCase(setAchievementSub2.fulfilled, (state, action) => {
      state.achievementSubs = action.payload;
    });
    builder.addCase(setAdditionalOptions.fulfilled, (state, action) => {
      state.additionPoinOptions = action.payload;
    });

    // delete Option
    builder.addCase(setDeleteOption.fulfilled, (state, action) => {
      state.deleteOptions = action.payload;
    });
  },
});
export const { setMailTitle, setMailContent, reset } = userEvaluation.actions;

export default userEvaluation.reducer;
