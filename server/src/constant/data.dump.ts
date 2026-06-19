/* eslint-disable no-await-in-loop */
import { Company } from 'src/entity/Company';
import { Department } from 'src/entity/Department';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { Role } from 'src/entity/Role';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { SettingFormula810 } from 'src/entity/SettingFormula810';
import { SettingLevel } from 'src/entity/SettingLevel';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { User } from 'src/entity/User';
import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
import { VersionNotification } from 'src/entity/VersionNotification';
import { VersionSetting } from 'src/entity/VersionSetting';
import { Roles } from 'src/enum/Roles';
import { RoleName } from './RoleName';

export const dumpData = async () => {
  const roles = [
    { name: RoleName[Roles.F1], id: Roles.F1 },
    { name: RoleName[Roles.F2], id: Roles.F2 },
    { name: RoleName[Roles.F3], id: Roles.F3 },
    { name: RoleName[Roles.F4], id: Roles.F4 },
    { name: RoleName[Roles.F5], id: Roles.F5 },
    { name: RoleName[Roles.F6], id: Roles.F6 },
    { name: RoleName[Roles.F7], id: Roles.F7 },
    { name: RoleName[Roles.F8], id: Roles.F8 },
  ];
  await Role.bulkCreate(roles, { ignoreDuplicates: true });
  await Department.findOrCreate({
    defaults: {
      code: '16738',
      name: 'ﾍﾞﾄﾅﾑ開発課',
      class: 0,
      type: 0,
      active: 1,
    },
    where: { code: '16738' },
  });

  await Company.findOrCreate({
    defaults: { name: '株式会社ゲオホールディングス' },
    where: { name: '株式会社ゲオホールディングス' },
  });

  await User.findOrCreate({
    defaults: {
      fullName: 'ベトナム システム',
      email: 'vietnam.system@geonet.co.jp',
      departmentId: 1,
      companyId: 1,
      level: 1,
      employeeNumber: 2004045,
      active: 1,
    },
    where: { email: 'vietnam.system@geonet.co.jp' },
  }).then(([data, _isCreate]) => {
    data.setRoles([1, 2, 3, 4, 5, 6, 7, 8]);
  });

//   const versionBasic = {
//     type: 1,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const data = await VersionBasicBehavior.create(versionBasic);
//   const aryListBasics = [
//     {
//       versionId: data.id,
//       title: '社会責任\n倫理',
//       content:
//         '社会人として自覚および社会的責任を持ち、日常業務に関する法的または倫理的な問題についても常に問題意識を持って取り組んでいる。',
//       difficulty: 1,
//     },
//     {
//       versionId: data.id,
//       title: '業務計画',
//       content:
//         '社内・部署内で定められたスケジュールと自身のスケジュールに矛盾がなく、業務のロスとなるムダの発見と除去を行い、業務を推進している。',
//       difficulty: 1,
//     },
//     {
//       versionId: data.id,
//       title: 'リスク管理\n問題意識',
//       content:
//         '業務上知り得た機密について漏洩や盗用が発生しないよう意識しており、自身が関連する職務や分野の時事問題について関心を持ち問題意識を持って取り組んでいる。',
//       difficulty: 1,
//     },
//     {
//       versionId: data.id,
//       title: '安全指針\n健康管理',
//       content:
//         '会社や所属部署における業務遂行上の安全に係る規程やルールを正確に把握し、遵守している。また、自身の健康状態を把握し上司へ適切に報告・連絡・相談を行っている。',
//       difficulty: 1,
//     },
//     {
//       versionId: data.id,
//       title: '業務遂行',
//       content:
//         '業務遂行上の疑問点や不明点などについて、関係者への適時確認を行い適切に業務を遂行している。また、他部署の役割を理解し、助言や質問を求められた際には快く対応している。',
//       difficulty: 1,
//     },
//     {
//       versionId: data.id,
//       title: '交渉・折衝',
//       content:
//         '説明事項を簡潔に漏れなく伝えることができ、事実と意見を区別し、適切な態度と言葉遣いで折衝や打ち合わせを行うことができている。',
//       difficulty: 1,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBasics, { ignoreDuplicates: true });

//   const versionBehaviorSkillLvl1 = {
//     type: 2,
//     level: 1,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl1 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl1,
//   );
//   const aryListBehaviorSkillLvl1s = [
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動している',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '報告・連絡・相談',
//       content: '担当業務の全体の流れを理解し、報連相を率先して行っている',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '工夫',
//       content: '担当業務の課題や業務処理等に関して創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '変革行動',
//       content:
//         '先輩社員から示された担当業務に関して業務改善を検討し、相談ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl1.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 4,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl1s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl2 = {
//     type: 2,
//     level: 2,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl2 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl2,
//   );
//   const aryListBehaviorSkillLvl2s = [
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動している',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '報告・連絡・相談',
//       content: '担当業務の全体の流れを理解し、報連相を率先して行っている',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '工夫',
//       content: '担当業務の課題や業務処理等に関して創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '変革行動',
//       content:
//         '上司から示された担当業務に関して業務改善を検討し、上司に相談ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl2.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 4,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl2s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl3 = {
//     type: 2,
//     level: 3,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl3 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl3,
//   );
//   const aryListBehaviorSkillLvl3s = [
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動している',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '報告・連絡・相談',
//       content: '担当業務の全体の流れを理解し、報連相を率先して行っている',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '工夫',
//       content: '担当業務の課題や業務処理等に関して創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に関する業務改善・変革のための施策を立案・実行できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl3.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 4,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl3s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl4 = {
//     type: 2,
//     level: 4,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl4 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl4,
//   );
//   const aryListBehaviorSkillLvl4s = [
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動している',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '報告・連絡・相談',
//       content: '担当業務の全体の流れを理解し、報連相を率先して行っている',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '統率・指導',
//       content: '担当職務に関して効果的な推進等、後輩指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題提起に対して、企画・立案（計画）を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '変革行動',
//       content:
//         '自自身の担当職務に関する業務改善・変革のための施策を立案・実行でき、後輩への指導ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、課内の模範となる行動ができているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl4.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl4s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl5 = {
//     type: 2,
//     level: 5,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl5 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl5,
//   );
//   const aryListBehaviorSkillLvl5s = [
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員への周知徹底を率先して行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '報告・連絡・相談',
//       content:
//         '課員の手本となる報連相を行動で示し、報連相を促す指導を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '決断・判断',
//       content:
//         'グループ方針に沿いながら、担当業務に関する問題の解決方向を判断することができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '統率・指導',
//       content: '担当職務に関して効果的な推進等、後輩指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題提起に対して、企画・立案（計画）を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に関する業務改善・変革のための施策を立案・実行でき、後輩への指導ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内の情報や知識に関心を持ち、部門の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、課内の模範となる行動ができているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl5.id,
//       title: '勤務態度',
//       content:
//         '遅刻や欠勤などがなく、社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 2,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl5s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl6 = {
//     type: 2,
//     level: 6,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl6 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl6,
//   );
//   const aryListBehaviorSkillLvl6s = [
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員への周知徹底を率先して行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '報告・連絡・相談',
//       content:
//         '課員の手本となる報連相を行動で示し、報連相を促す指導を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '決断・判断',
//       content:
//         '課の部門方針に沿いながら、グループ全体に関する問題の解決方向を的確に判断することができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '統率・指導',
//       content:
//         '部下やプロジェクト・チームの構成員を掌握し、職場の活性化、業務の効果的推進などに関して、チームの管理統率ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題に対して、効果的かつ実効性のある解決策や対応策の企画・立案（計画）を行えているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に限らず、部下やプロジェクト・チームの構成員の業務に関して、業務改善・変革のための施策を立案・実行でき、指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内の情報や知識に関心を持ち、部門の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '5Sの徹底',
//       content:
//         '自らが率先して徹底するとともに、課員に対して指導、指揮、命令、監督することができているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorSkillLvl6.id,
//       title: '勤務態度',
//       content:
//         '遅刻や欠勤などがなく、社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 2,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl6s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorSkillLvl7 = {
//     type: 2,
//     level: 7,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorSkillLvl7 = await VersionBasicBehavior.create(
//     versionBehaviorSkillLvl7,
//   );
//   const aryListBehaviorSkillLvl7s = [
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員へ指導、課員業務への落としこみまで行えているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '報告・連絡・相談',
//       content:
//         '自身も全方位的に率先して報連相を行うと共に、課員に対し指導、指揮、命令、監督を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '決断・判断',
//       content:
//         '部門方針に沿いながら、課全体に関する問題の解決方向を的確に決断することができる能力を有しているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '統率・指導',
//       content:
//         '課、プロジェクトチームに所属する従業員を掌握し、評価、指導、指揮、命令、監督することにより、部下の執務意欲の向上や業務の効率的推進などの指導管理ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '企画',
//       content:
//         '所管部門及び担当部門に関する現状と見通しを踏まえて、問題の所在を的確に把握し、効果的かつ現実性のある企画立案を行っているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '変革行動',
//       content:
//         '課全般に関する業務改善・変革のための施策を立案・実行でき、課員に対して指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内外の情報や知識に関心を持ち、統括組織の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '5Sの徹底',
//       content:
//         '自らが率先して徹底するとともに、課員に対して指導、指揮、命令、監督することができているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorSkillLvl7.id,
//       title: '勤務態度',
//       content:
//         '遅刻や欠勤などがなく、社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 2,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorSkillLvl7s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl1 = {
//     type: 3,
//     level: 1,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl1 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl1,
//   );
//   const aryListBehaviorNoSkillLvl1s = [
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動している',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '報告・連絡・相談',
//       content: '担当業務の全体の流れを理解し、報連相を率先して行っている',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '知識',
//       content: '担当業務に関する初歩的な知識を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '業務遂行',
//       content:
//         '担当業務遂行にあたり、先輩社員が認める標準的なスピードで、かつ他者に大きな迷惑をかけるようなミスをすることなく実施することができる',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '工夫',
//       content: '担当業務の課題や業務処理等に関して創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '変革行動',
//       content:
//         '先輩社員から示された担当業務に関して業務改善を検討し、相談ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl1.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 4,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl1s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl2 = {
//     type: 3,
//     level: 2,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl2 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl2,
//   );
//   const aryListBehaviorNoSkillLvl2s = [
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '報告・連絡・相談',
//       content:
//         '担当業務の全体の流れを理解し、周囲との密な報連相を率先して行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '知識',
//       content: '担当業務に関する基礎的な知識を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '決断・判断',
//       content:
//         '業務に関する指示・命令やミーティングの内容を正確に理解できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '業務遂行',
//       content:
//         '業務遂行にあたり、上長が認める標準的なスピードで、かつ他者に迷惑をかけるようなミスをすることなく実施することができているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '工夫',
//       content: '担当業務の課題や業務処理等に関して創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '変革行動',
//       content:
//         '上司から示された担当業務に関して業務改善を検討し、上司に相談ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、社会人として最低限の行動を徹底しているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl2.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl2s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl3 = {
//     type: 3,
//     level: 3,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl3 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl3,
//   );
//   const aryListBehaviorNoSkillLvl3s = [
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '報告・連絡・相談',
//       content:
//         '担当業務の全体の流れを理解し、周囲との密な報連相を率先して行っているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '知識',
//       content: '担当業務に関する一般的知識を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '決断・判断',
//       content: '日常業務に関して発生する問題について、自主的に判断できているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '業務遂行',
//       content:
//         '担当業務遂行にあたり、上長が認める標準的なスピードで、かつミスなく実施することができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '表現',
//       content:
//         '伝達しようとする情報・意図を文書又は口頭で的確、簡潔に表現できているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '工夫',
//       content:
//         '上司から個別的に示された担当業務の問題に対して、効果的な解決策の立案や創意工夫をしているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に関する業務改善・変革のための施策を立案・実行できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '向上心・自己啓発',
//       content:
//         '現状に満足することなく、常に前向きに組織や自分自身のレベルアップに努めているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、自身の行動を徹底しているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl3.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 2,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl3s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl4 = {
//     type: 3,
//     level: 4,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl4 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl4,
//   );
//   const aryListBehaviorNoSkillLvl4s = [
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、自身の仕事においてどのような実践が必要であるかを常に考え行動しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '報告・連絡・相談',
//       content:
//         '課員の手本となる報連相を行動で示し、報連相を促す指導を行っているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '知識',
//       content: '担当職務に関する高度な専門的知識を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '決断・判断',
//       content:
//         '業務に関する問題について、グループ方針等に基づいて応用的に判断できているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '統率・指導',
//       content: '担当職務に関して効果的な推進等、後輩指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '渉外・折衝',
//       content:
//         '上司の指示の下、担当業務について関係者と話し合い解決できる能力を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題提起に対して、企画・立案（計画）を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に関する業務改善・変革のための施策を立案・実行でき、後輩への指導ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内の情報や知識に関心を持ち、部門の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、課内の模範となる行動ができているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl4.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl4s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl5 = {
//     type: 3,
//     level: 5,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl5 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl5,
//   );
//   const aryListBehaviorNoSkillLvl5s = [
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員への周知徹底を率先して行っているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '報告・連絡・相談',
//       content:
//         '課員の手本となる報連相を行動で示し、報連相を促す指導を行っているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '知識',
//       content: '担当職務に関する高度な専門的知識を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '決断・判断',
//       content:
//         'グループ方針に沿いながら、担当業務に関する問題の解決方向を判断することができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '統率・指導',
//       content: '担当職務に関して効果的な推進等、後輩指導ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '渉外・折衝',
//       content:
//         '上司の指示の下、課全体に関する業務について関係者と話し合い解決できる能力を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題提起に対して、企画・立案（計画）を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に関する業務改善・変革のための施策を立案・実行でき、後輩への指導ができているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内の情報や知識に関心を持ち、部門の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '5Sの徹底',
//       content: '5Sの意味を理解し、課内の模範となる行動ができているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl5.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl5s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl6 = {
//     type: 3,
//     level: 6,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl6 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl6,
//   );
//   const aryListBehaviorNoSkillLvl6s = [
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員への周知徹底を率先して行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '報告・連絡・相談',
//       content:
//         '課員の手本となる報連相を行動で示し、報連相を促す指導を行っているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '知識',
//       content:
//         '所管業務（課内）と担当業務に関する高度な専門的な知識を有しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '決断・判断',
//       content:
//         '課の部門方針に沿いながら、グループ全体に関する問題の解決方向を的確に判断することができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '統率・指導',
//       content:
//         '部下やプロジェクト・チームの構成員を掌握し、職場の活性化、業務の効果的推進などに関して、チームの管理統率ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '渉外・折衝',
//       content:
//         '課全般に関する業務について関係者と折衝において、説得力のある交渉や解決ができる能力を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '企画',
//       content:
//         '担当職務の中で考えうる問題に対して、効果的かつ実効性のある解決策や対応策の企画・立案（計画）を行えているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '変革行動',
//       content:
//         '自身の担当職務に限らず、部下やプロジェクト・チームの構成員の業務に関して、業務改善・変革のための施策を立案・実行でき、指導ができているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内の情報や知識に関心を持ち、部門の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '5Sの徹底',
//       content:
//         '自らが率先して徹底するとともに、課員に対して指導、指揮、命令、監督することができているか',
//       difficulty: 2,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '勤怠',
//       content: '遅刻、欠勤もなく、社会人として最低限の行動を徹底しているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl6.id,
//       title: '勤務態度',
//       content: '社内での生活、業務上の態度を意識し行動できているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl6s, {
//     ignoreDuplicates: true,
//   });

//   const versionBehaviorNoSkillLvl7 = {
//     type: 3,
//     level: 7,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataBahaviorNoSkillLvl7 = await VersionBasicBehavior.create(
//     versionBehaviorNoSkillLvl7,
//   );
//   const aryListBehaviorNoSkillLvl7s = [
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '経営ビジョン・方針理解',
//       content:
//         '経営ビジョン・方針について理解を深め、職場や課員へ指導、課員業務への落としこみまで行えているか',
//       difficulty: 3,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '報告・連絡・相談',
//       content:
//         '自身も全方位的に率先して報連相を行うと共に、課員に対し指導、指揮、命令、監督を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '知識',
//       content:
//         '所管業務（課内）に関する高度な専門知識と経営管理手法などに関する基礎的な知識及び担当業務に関する高度な専門的な知識を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '決断・判断',
//       content:
//         '部門方針に沿いながら、課全体に関する問題の解決方向を的確に決断することができる能力を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '統率・指導',
//       content:
//         '課、プロジェクトチームに所属する従業員を掌握し、評価、指導、指揮、命令、監督することにより、部下の執務意欲の向上や業務の効率的推進などの指導管理ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '渉外・折衝',
//       content:
//         '課全般に関する業務について関係者と折衝し、納得性の高い解決ができる能力を有しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '企画',
//       content:
//         '所管部門及び担当部門に関する現状と見通しを踏まえて、問題の所在を的確に把握し、効果的かつ現実性のある企画立案を行っているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '変革行動',
//       content:
//         '課全般に関する業務改善・変革のための施策を立案・実行でき、課員に対して指導ができているか',
//       difficulty: 5,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '向上心・自己啓発',
//       content:
//         '常に社内外の情報や知識に関心を持ち、統括組織の範囲を超えた情報を収集して業務に活用しているか',
//       difficulty: 4,
//     },
//     {
//       versionId: dataBahaviorNoSkillLvl7.id,
//       title: '5Sの徹底',
//       content:
//         '自らが率先して徹底するとともに、課員に対して指導、指揮、命令、監督することができているか',
//       difficulty: 3,
//     },
//   ];
//   await ListBasicBehavior.bulkCreate(aryListBehaviorNoSkillLvl7s, {
//     ignoreDuplicates: true,
//   });

//   const versionGuide17 = {
//     type: 1,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     contentEvaluationCriteria:
//       '​■スキル評価基準（基本）<br>　3 業務遂行上の標準レベルである<br>　2 稀に不備や不足が見られるため、多少改善を要する<br>　1 不備や不足が散見されるため、改善を要する<br><br>■スキル評価基準（専門スキル）<br>　5 極めて優秀であり、他者に教育や指導をできるレベルである<br>　4 優秀であり、他者の見本となるレベルである<br>　3 業務遂行上の標準レベルである<br>　2 稀に不備や不足が見られるため、多少改善を要する<br>　1 不備や不足が散見されるため、改善を要する<br><br>■行動・情意評価基準<br>　5 極めて優秀<br>　4 優秀<br>　3 標準<br>　2 やや劣る<br>　1 劣る<br><br>■追加目標・成果の加算ポイント<br>　S＝＋5点（貢献度が非常に高い）<br>　A＝＋3点（貢献度が高い）<br>　B＝＋1点（やや高い貢献度）<br>　C＝加算なし（通常の貢献）<br>　D＝－1点（物足りない）',
//     contentNotes:
//       'スキル評価は、各評価項目あたり25点（【難易度】５×【評価】５）満点を基準とする<br>難易度の高いレベルを選択し、高評価であれば高得点となる<br>難易度が低いレベルを選択する場合は、評価項目数に応じ得点割合を調整する<br>難易度が低くても一定数の評価項目数があれば、100点満点ベース換算となっていく<br><br>（条件）<br>難易度５の場合は、100満点ベース<br>難易度4の場合は、80点ベースとなるが、評価項目数によりベースを高める（6項目以上：100点ベース／4項目以上：90点ベース／2項目以上：85点ベース／1項目：維持）<br>難易度3の場合は、60点ベースとなるが、評価項目数によりベースを高める（8項目以上：100点ベース／6項目以上：90点ベース／4項目以上：80点ベース／2項目以上：70点ベース／1項目：維持）<br>難易度2の場合は、40点ベースとなるが、評価項目数によりベースを高める（10項目以上：100点ベース／8項目以上：80点ベース／6項目以上：70点ベース／4項目以上：60点ベース／2項目以上：50点ベース／1項目：維持）<br>難易度1の場合は、20点ベースとなるが、評価項目数によりベースを高める（12項目以上：100点ベース／10項目以上：90点ベース／8項目以上：70点ベース／6項目以上：60点ベース／4項目以上：40点ベース／2項目以上：30点ベース／1項目：維持）',
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   await VersionGuideEvaluation.create(versionGuide17);

//   const versionGuide17Ns = {
//     type: 3,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     contentEvaluationCriteria: `<google-sheets-html-origin>
//     <style type="text/css">
//         <!--td {border: 1px solid #cccccc;}br {mso-data-placement:same-cell;}
//         -->
//     </style>
//     <table xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:none" data-sheets-root="1">
//         <colgroup>
//             <col width="101">
//             <col width="170">
//             <col width="170">
//             <col width="170">
//             <col width="170">
//             <col width="170">
//             <col width="170">
//         </colgroup>
//         <tbody>
//             <tr style="height:21px;">
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;"><br></td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;5\n極めて優秀&quot;}">5<br>極めて優秀</td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;4\n優秀&quot;}">4<br>優秀</td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;3\n標準&quot;}">3<br>標準</td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;2\nやや劣る&quot;}">2<br>やや劣る</td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;1\n劣る&quot;}">1<br>劣る</td>
//                 <td style="border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;0\n著しく劣る&quot;}">0<br>著しく劣る</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営ビジョン・\n 方針理解&quot;}">経営ビジョン・<br> 方針理解</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解し、他の模範として、職場内で高い評価を得ていた&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解し、他の模範として、職場内で高い評価を得ていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓をよく熟知しており、他の模範的行動を取っていた&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓をよく熟知しており、他の模範的行動を取っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓にもとづいた行動をとっていた&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓にもとづいた行動をとっていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解および遵守できないことがあった&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解および遵守できないことがあった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解および遵守できていなかった&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓を理解および遵守できていなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;経営理念、企業理念、仕事の4指針、行動の5指針、十訓への違反があった&quot;}">経営理念、企業理念、仕事の4指針、行動の5指針、十訓への違反があった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;報告・連絡・相談&quot;}">報告・連絡・相談</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;積極的に行い周囲へも働きかけていた&quot;}">積極的に行い周囲へも働きかけていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;積極的かつ適切に行っていた&quot;}">積極的かつ適切に行っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;必要なことを適切に行っていた&quot;}">必要なことを適切に行っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;必要なことは行っていたが適切でないことが多かった&quot;}">必要なことは行っていたが適切でないことが多かった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自力ではほとんど行っていなかった&quot;}">自力ではほとんど行っていなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;全く行っていなかった&quot;}">全く行っていなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;知識&quot;}">知識</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;知識、技術、テクニックは一流であり、他のメンバーの模範的な存在である&quot;}">知識、技術、テクニックは一流であり、他のメンバーの模範的な存在である</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自分の担当する業務以外についても理解しており、他のメンバーを指導している&quot;}">自分の担当する業務以外についても理解しており、他のメンバーを指導している</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;担当業務は熟知しており、業務に支障をきたすことは全くない&quot;}">担当業務は熟知しており、業務に支障をきたすことは全くない</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;一応身についてはいるが、それを実務の中で具体的に生かすまでには至ってない&quot;}">一応身についてはいるが、それを実務の中で具体的に生かすまでには至ってない</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;他のアドバイスや指導を受けるレベルにある&quot;}">他のアドバイスや指導を受けるレベルにある</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;知識がなく、指導も受け入れなかった&quot;}">知識がなく、指導も受け入れなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;業務遂行&quot;}">業務遂行</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;困難な仕事についても全く申しぶんなく期待する以上の結果を出していた&quot;}">困難な仕事についても全く申しぶんなく期待する以上の結果を出していた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;やや困難な仕事についても、ミスもなく正確で信頼できるものであった&quot;}">やや困難な仕事についても、ミスもなく正確で信頼できるものであった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;ミスもなく、ほぼ上司の期待にそうレベルであった&quot;}">ミスもなく、ほぼ上司の期待にそうレベルであった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;ときどきミスを起したり、たまに業務に支障をきたしたりしていた&quot;}">ときどきミスを起したり、たまに業務に支障をきたしたりしていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;しばしばミスやトラブルがあり、業務に支障をきたし不満な出来であった&quot;}">しばしばミスやトラブルがあり、業務に支障をきたし不満な出来であった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;許容できないトラブルを発生させた&quot;}">許容できないトラブルを発生させた</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;表現&quot;}">表現</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;相手に対して意図を十分に理解納得させながら自分のペースで仕事を進めていた&quot;}">相手に対して意図を十分に理解納得させながら自分のペースで仕事を進めていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;相手に分かりやすいようにうまく表現しており、相手を理解納得させていた&quot;}">相手に分かりやすいようにうまく表現しており、相手を理解納得させていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;相手に理解できるように表現しており、業務に支障をきたすことはなかった&quot;}">相手に理解できるように表現しており、業務に支障をきたすことはなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;努力はしているが、相手に対して意図を十分に伝えられず誤解を招くことがあった&quot;}">努力はしているが、相手に対して意図を十分に伝えられず誤解を招くことがあった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;たまに意味不明の言動があり、相手を困惑させたり不機嫌にさせることがあった&quot;}">たまに意味不明の言動があり、相手を困惑させたり不機嫌にさせることがあった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;表現ができない状況&quot;}">表現ができない状況</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;工夫&quot;}">工夫</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;いつも全社的な観点から改善や提案を行っており、他から一目置かれていた&quot;}">いつも全社的な観点から改善や提案を行っており、他から一目置かれていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;仕事を効果的に行うための工夫や改善を織り込みながら仕事を進めていた&quot;}">仕事を効果的に行うための工夫や改善を織り込みながら仕事を進めていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;現状に満足することなく、日常の仕事の中で自分なりに工夫改善を行っていた&quot;}">現状に満足することなく、日常の仕事の中で自分なりに工夫改善を行っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;同じことの繰り返しで、仕事がマンネリ化しているが、それが普通だと思っていた&quot;}">同じことの繰り返しで、仕事がマンネリ化しているが、それが普通だと思っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;今の仕事に変化を求めず、他から指摘を受けると反抗的な態度を取っていた&quot;}">今の仕事に変化を求めず、他から指摘を受けると反抗的な態度を取っていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;工夫もせず、他の者の工夫を否定ばかりしていた&quot;}">工夫もせず、他の者の工夫を否定ばかりしていた</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;変革行動&quot;}">変革行動</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;仕事の目的や内容をいち早くつかみ、的確な改善提案をし、上司を感心させていた&quot;}">仕事の目的や内容をいち早くつかみ、的確な改善提案をし、上司を感心させていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;仕事の内容を良く理解し、改善提案することで上司を満足させていた&quot;}">仕事の内容を良く理解し、改善提案することで上司を満足させていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自分の仕事の役割や内容は一応理解しており、改善提案を行うこともあった&quot;}">自分の仕事の役割や内容は一応理解しており、改善提案を行うこともあった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;改善提案をすることもあるが、仕事の内容を理解しておらず、的外れであった&quot;}">改善提案をすることもあるが、仕事の内容を理解しておらず、的外れであった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;業務改善ではなく、仕事への不満をよく口にしていた&quot;}">業務改善ではなく、仕事への不満をよく口にしていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;全く感じられなかった&quot;}">全く感じられなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;向上心・\n 自己啓発&quot;}">向上心・<br> 自己啓発</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;何事にも主体的に取り組み、他にも良い影響を与えていた&quot;}">何事にも主体的に取り組み、他にも良い影響を与えていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;常に高い意欲を持って、積極的に行動していた&quot;}">常に高い意欲を持って、積極的に行動していた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;常に積極的な行動を心がけていた&quot;}">常に積極的な行動を心がけていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;積極姿勢に欠けることがあった&quot;}">積極姿勢に欠けることがあった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;常に受身な姿勢でしか行動できていなかった&quot;}">常に受身な姿勢でしか行動できていなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;積極性が感じられなく、改善もみられなかった&quot;}">積極性が感じられなく、改善もみられなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;5Sの徹底&quot;}">5Sの徹底</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;他の模範となる努力を続けていた&quot;}">他の模範となる努力を続けていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;高い自己管理力を持ち、信頼されていた&quot;}">高い自己管理力を持ち、信頼されていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;一通り問題はなかった&quot;}">一通り問題はなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理に不安が感じられた&quot;}">自己管理に不安が感じられた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理が不十分であった&quot;}">自己管理が不十分であった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;再三指導したが改善されなかった&quot;}">再三指導したが改善されなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;勤怠&quot;}">勤怠</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;他の模範となる努力を続けていた&quot;}">他の模範となる努力を続けていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;高い自己管理力を持ち、信頼されていた&quot;}">高い自己管理力を持ち、信頼されていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;一通り問題はなかった&quot;}">一通り問題はなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理に不安が感じられた&quot;}">自己管理に不安が感じられた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理が不十分であった&quot;}">自己管理が不十分であった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;再三指導したが改善されなかった&quot;}">再三指導したが改善されなかった</td>
//             </tr>
//             <tr style="height:21px;">
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;text-align:center;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;勤務態度&quot;}">勤務態度</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;他の模範となる努力を続けていた&quot;}">他の模範となる努力を続けていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;高い自己管理力を持ち、信頼されていた&quot;}">高い自己管理力を持ち、信頼されていた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;一通り問題はなかった&quot;}">一通り問題はなかった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理に不安が感じられた&quot;}">自己管理に不安が感じられた</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;自己管理が不十分であった&quot;}">自己管理が不十分であった</td>
//                 <td style="border-right:1px solid #000000;border-bottom:1px solid #000000;overflow:hidden;padding:2px 3px 2px 3px;vertical-align:middle;wrap-strategy:4;white-space:normal;word-wrap:break-word;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;再三指導したが改善されなかった&quot;}">再三指導したが改善されなかった</td>
//             </tr>
//         </tbody>
//     </table>
// </google-sheets-html-origin>`,
//     contentNotes: ``,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   await VersionGuideEvaluation.create(versionGuide17Ns);

//   const versionSetting17 = {
//     type: 1,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     basicMaxDifficulty: 1,
//     behaviorMaxWeight: 5,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataSetting17 = await VersionSetting.create(versionSetting17);
//   const aryPointSetting17s = [
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 3,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 2,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 5,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 4,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 3,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 2,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 3,
//       point: 5,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 3,
//       point: 4,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 3,
//       point: 3,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 3,
//       point: 2,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 3,
//       point: 1,
//     },
//   ];

//   await SettingPointBasicBehaviorPro.bulkCreate(aryPointSetting17s, {
//     ignoreDuplicates: true,
//   });
//   for (let i = 5; i >= 1; i--) {
//     const proFormula = await SettingProFormula.create({
//       versionId: dataSetting17.id,
//       point: i,
//     });
//     let datas = [];
//     if (i === 5) {
//       datas = [
//         {
//           formulaId: proFormula.id,
//           totalItem: 1,
//           coefficient: 1,
//         },
//       ];
//     } else if (i === 4) {
//       datas = [
//         {
//           formulaId: proFormula.id,
//           totalItem: 1,
//           coefficient: 1,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 2,
//           coefficient: 1.0625,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 4,
//           coefficient: 1.125,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 6,
//           coefficient: 1.25,
//         },
//       ];
//     } else if (i === 3) {
//       datas = [
//         {
//           formulaId: proFormula.id,
//           totalItem: 1,
//           coefficient: 1,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 2,
//           coefficient: 1.17,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 4,
//           coefficient: 1.34,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 6,
//           coefficient: 1.5,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 8,
//           coefficient: 1.67,
//         },
//       ];
//     } else if (i === 2) {
//       datas = [
//         {
//           formulaId: proFormula.id,
//           totalItem: 1,
//           coefficient: 1,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 2,
//           coefficient: 1.25,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 4,
//           coefficient: 1.5,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 6,
//           coefficient: 1.75,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 8,
//           coefficient: 2,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 10,
//           coefficient: 2.5,
//         },
//       ];
//     } else if (i === 1) {
//       datas = [
//         {
//           formulaId: proFormula.id,
//           totalItem: 1,
//           coefficient: 1,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 2,
//           coefficient: 1.5,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 4,
//           coefficient: 2,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 6,
//           coefficient: 3,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 8,
//           coefficient: 3.5,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 10,
//           coefficient: 4.5,
//         },
//         {
//           formulaId: proFormula.id,
//           totalItem: 12,
//           coefficient: 5,
//         },
//       ];
//     }
//     await SettingProFormulaSub.bulkCreate(datas, {
//       ignoreDuplicates: true,
//     });
//   }

//   const settingPersonal17s = [
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 1,
//       point: 0.8,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting17.id,
//       type: 2,
//       point: 0.8,
//     },
//   ];
//   await SettingAchievementPersonal.bulkCreate(settingPersonal17s, {
//     ignoreDuplicates: true,
//   });

//   const settingAdditional17s = [
//     {
//       versionId: dataSetting17.id,
//       rating: 'S',
//       point: 5,
//     },
//     {
//       versionId: dataSetting17.id,
//       rating: 'A',
//       point: 3,
//     },
//     {
//       versionId: dataSetting17.id,
//       rating: 'B',
//       point: 1,
//     },
//     {
//       versionId: dataSetting17.id,
//       rating: 'C',
//       point: 0,
//     },
//     {
//       versionId: dataSetting17.id,
//       rating: 'D',
//       point: -1,
//     },
//   ];
//   await SettingAchievementAdditional.bulkCreate(settingAdditional17s, {
//     ignoreDuplicates: true,
//   });

//   const settingLevel17s = [
//     {
//       versionId: dataSetting17.id,
//       level: 1,
//       skillPercent: 30,
//       behaviorPercent: 40,
//       achievementPercent: 30,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 2,
//       skillPercent: 35,
//       behaviorPercent: 35,
//       achievementPercent: 30,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 3,
//       skillPercent: 35,
//       behaviorPercent: 35,
//       achievementPercent: 30,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 4,
//       skillPercent: 40,
//       behaviorPercent: 30,
//       achievementPercent: 30,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 5,
//       skillPercent: 40,
//       behaviorPercent: 30,
//       achievementPercent: 30,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 6,
//       skillPercent: 45,
//       behaviorPercent: 15,
//       achievementPercent: 40,
//     },
//     {
//       versionId: dataSetting17.id,
//       level: 7,
//       skillPercent: 50,
//       behaviorPercent: 10,
//       achievementPercent: 40,
//     },
//   ];
//   await SettingLevel.bulkCreate(settingLevel17s, {
//     ignoreDuplicates: true,
//   });

//   const versionSetting810 = {
//     type: 2,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataSetting810 = await VersionSetting.create(versionSetting810);
//   const settingPersonal810s = [
//     {
//       versionId: dataSetting810.id,
//       type: 1,
//       point: 0.8,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 1,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 1,
//       point: 1,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 1,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 1,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 2,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 2,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 2,
//       point: 1,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 2,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting810.id,
//       type: 2,
//       point: 0.8,
//     },
//   ];
//   await SettingAchievementPersonal.bulkCreate(settingPersonal810s, {
//     ignoreDuplicates: true,
//   });

//   const settingAdditional810s = [
//     {
//       versionId: dataSetting810.id,
//       rating: 'S',
//       point: 0.1,
//     },
//     {
//       versionId: dataSetting810.id,
//       rating: 'A',
//       point: 0.05,
//     },
//     {
//       versionId: dataSetting810.id,
//       rating: 'B',
//       point: 0.01,
//     },
//     {
//       versionId: dataSetting810.id,
//       rating: 'C',
//       point: 0,
//     },
//     {
//       versionId: dataSetting810.id,
//       rating: 'D',
//       point: -0.05,
//     },
//   ];
//   await SettingAchievementAdditional.bulkCreate(settingAdditional810s, {
//     ignoreDuplicates: true,
//   });

//   const settingFormula810s = [
//     {
//       versionId: dataSetting810.id,
//       point: 1.2,
//       result: 'S',
//     },
//     {
//       versionId: dataSetting810.id,
//       point: 1.1,
//       result: 'A',
//     },
//     {
//       versionId: dataSetting810.id,
//       point: 1,
//       result: 'B',
//     },
//     {
//       versionId: dataSetting810.id,
//       point: 0.9,
//       result: 'C',
//     },
//     {
//       versionId: dataSetting810.id,
//       point: -99999.99,
//       result: 'D',
//     },
//   ];
//   await SettingFormula810.bulkCreate(settingFormula810s, {
//     ignoreDuplicates: true,
//   });

//   const versionSetting17Ns = {
//     type: 3,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     behaviorMaxWeight: 5,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   const dataSetting17Ns = await VersionSetting.create(versionSetting17Ns);
//   const aryPointSetting17Ns = [
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 5,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 4,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 3,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 2,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 1,
//     },
//   ];

//   await SettingPointBasicBehaviorPro.bulkCreate(aryPointSetting17Ns, {
//     ignoreDuplicates: true,
//   });

//   const settingPersonal17Ns = [
//     {
//       versionId: dataSetting17Ns.id,
//       type: 1,
//       point: 0.8,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 1,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 1,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 1,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 1,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 1.2,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 1.1,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 1,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 0.9,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       type: 2,
//       point: 0.8,
//     },
//   ];
//   await SettingAchievementPersonal.bulkCreate(settingPersonal17Ns, {
//     ignoreDuplicates: true,
//   });

//   const settingAdditional17Ns = [
//     {
//       versionId: dataSetting17Ns.id,
//       rating: 'S',
//       point: 5,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       rating: 'A',
//       point: 3,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       rating: 'B',
//       point: 1,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       rating: 'C',
//       point: 0,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       rating: 'D',
//       point: -1,
//     },
//   ];
//   await SettingAchievementAdditional.bulkCreate(settingAdditional17Ns, {
//     ignoreDuplicates: true,
//   });

//   const settingLevel17Ns = [
//     {
//       versionId: dataSetting17Ns.id,
//       level: 1,
//       behaviorPercent: 30,
//       achievementPercent: 70,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 2,
//       behaviorPercent: 30,
//       achievementPercent: 70,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 3,
//       behaviorPercent: 30,
//       achievementPercent: 70,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 4,
//       behaviorPercent: 30,
//       achievementPercent: 70,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 5,
//       behaviorPercent: 40,
//       achievementPercent: 60,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 6,
//       behaviorPercent: 50,
//       achievementPercent: 50,
//     },
//     {
//       versionId: dataSetting17Ns.id,
//       level: 7,
//       behaviorPercent: 60,
//       achievementPercent: 40,
//     },
//   ];
//   await SettingLevel.bulkCreate(settingLevel17Ns, {
//     ignoreDuplicates: true,
//   });

//   const versionGuide810 = {
//     type: 2,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     contentEvaluationCriteria: `<strong style="font-weight:normal;" id="docs-internal-guid-363a01d9-7fff-4063-26a6-9f22ef893f00">
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■期中発生した追加目標および事項（考慮項目）の加算ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">S=部署評価係数⇒＋0.1ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">A=部署評価係数⇒＋0.05ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">B=部署評価係数⇒+0.01ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">C=部署評価係数⇒0ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">D=部署評価係数⇒-0.05ポイント</span></p><br>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■個人評価</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.2以上】＝個人評価【S】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.1以上】＝個人評価【A】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.0以上】＝個人評価【B】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【0.9以上】＝個人評価【C】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【0.8以上】＝個人評価【D】</span></p>
// </strong>`,
//     contentNotes: `<strong style="font-weight:normal;" id="docs-internal-guid-363a01d9-7fff-4063-26a6-9f22ef893f00">
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">参考とする基準）<br></span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■売上／粗利／営利などの達成率の評価基準</span></p>
//     <div dir="ltr" style="margin-left:0pt;" align="left">
//         <table style="border:none;border-collapse:collapse;">
//             <colgroup>
//                 <col width="195">
//                 <col width="66">
//             </colgroup>
//             <tbody>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">評価判断指標</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">係数</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:1.5pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">108％以上</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.2</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">103％以上～108％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:3.75pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">98%以上～103％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0.75pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">90％以上～98％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.9</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">90％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.8</span></p>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">注）売上／粗利／営利以外の達成率については達成率のレンジ（指標）は調整可能</span></p><br>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■障害発生率などの抑制を目標とする評価基準</span></p>
//     <div dir="ltr" style="margin-left:0pt;" align="left">
//         <table style="border:none;border-collapse:collapse;">
//             <colgroup>
//                 <col width="193">
//                 <col width="72">
//             </colgroup>
//             <tbody>
//                 <tr style="height:6.2962646484375pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">評価指標</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">係数</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0%～1%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.2</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:10.7962646484375pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1%～1.5%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.5%～3％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">3%～5%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.9</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">5%超過</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.8</span></p>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     </div><br>
// </strong><br class="Apple-interchange-newline">`,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   await VersionGuideEvaluation.create(versionGuide810);

//   const versionGuide810NS = {
//     type: 4,
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     contentEvaluationCriteria: `<strong style="font-weight:normal;" id="docs-internal-guid-363a01d9-7fff-4063-26a6-9f22ef893f00">
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■期中発生した追加目標および事項（考慮項目）の加算ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">S=部署評価係数⇒＋0.1ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">A=部署評価係数⇒＋0.05ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">B=部署評価係数⇒+0.01ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">C=部署評価係数⇒0ポイント</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">D=部署評価係数⇒-0.05ポイント</span></p><br>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■個人評価</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.2以上】＝個人評価【S】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.1以上】＝個人評価【A】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【1.0以上】＝個人評価【B】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【0.9以上】＝個人評価【C】</span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">部署評価【0.8以上】＝個人評価【D】</span></p>
// </strong>`,
//     contentNotes: `<strong style="font-weight:normal;" id="docs-internal-guid-363a01d9-7fff-4063-26a6-9f22ef893f00">
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">参考とする基準）<br></span></p>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■売上／粗利／営利などの達成率の評価基準</span></p>
//     <div dir="ltr" style="margin-left:0pt;" align="left">
//         <table style="border:none;border-collapse:collapse;">
//             <colgroup>
//                 <col width="195">
//                 <col width="66">
//             </colgroup>
//             <tbody>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">評価判断指標</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">係数</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:1.5pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">108％以上</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.2</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">103％以上～108％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:3.75pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">98%以上～103％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0.75pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">90％以上～98％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.9</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">90％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.8</span></p>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">注）売上／粗利／営利以外の達成率については達成率のレンジ（指標）は調整可能</span></p><br>
//     <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">■障害発生率などの抑制を目標とする評価基準</span></p>
//     <div dir="ltr" style="margin-left:0pt;" align="left">
//         <table style="border:none;border-collapse:collapse;">
//             <colgroup>
//                 <col width="193">
//                 <col width="72">
//             </colgroup>
//             <tbody>
//                 <tr style="height:6.2962646484375pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">評価指標</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">係数</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:0pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0%～1%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.2</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:10.7962646484375pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1%～1.5%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1.5%～3％未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">3%～5%未満</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.9</span></p>
//                     </td>
//                 </tr>
//                 <tr style="height:17.25pt">
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">5%超過</span></p>
//                     </td>
//                     <td style="border-left:solid #000000 0.50000025pt;border-right:solid #000000 0.50000025pt;border-bottom:solid #000000 0.50000025pt;border-top:solid #000000 0.50000025pt;vertical-align:bottom;padding:2pt 2pt 2pt 2pt;overflow:hidden;overflow-wrap:break-word;">
//                         <p dir="ltr" style="line-height:1.38;text-align: center;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">0.8</span></p>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     </div><br>
// </strong><br class="Apple-interchange-newline">`,
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   await VersionGuideEvaluation.create(versionGuide810NS);

//   const periods = [];
//   let periodIdx = 1;
//   let year = 2020;
//   let periodS = '';
//   let periodE = '';
//   for (let i = 0; i < 200; i++) {
//     if (periodIdx === 1) {
//       periodS = `${year}/4`;
//       periodE = `${year}/9`;
//     } else {
//       periodS = `${year}/10`;
//       periodE = `${year + 1}/3`;
//     }
//     periods.push({
//       year: year,
//       periodIndex: periodIdx,
//       periodStart: periodS,
//       periodEnd: periodE,
//     });
//     periodIdx++;
//     if (periodIdx > 2) {
//       year++;
//       periodIdx = 1;
//     }
//   }
//   await EvaluationPeriod.bulkCreate(periods, { ignoreDuplicates: true });

//   const versionNotification = {
//     version: 1,
//     subVersion: 0,
//     status: 4,
//     creationUser: 1,
//     content: 'Content Notification',
//     publicDate: '2023/11/6 13:07',
//     lastUpdatedTime: '2023/11/14 12:12',
//   };
//   await VersionNotification.create(versionNotification);
};
