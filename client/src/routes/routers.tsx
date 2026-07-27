import { Navigate } from 'react-router-dom';
import RequireAuth from '../layouts/RequireAuth';
import OracleUserTable from '../page/admin/add-user/AddUserTable';
import ListCriteriaEvaluationScreen from '../page/admin/list-criteria-evaluation/ListCriteriaEvaluationScreen';
import ListCriteriaHistoryScreen from '../page/admin/list-criteria-history/ListCriteriaHistoryScreen';
import ListEvaluationCalculationHistoryScreen from '../page/admin-evaluation/list-evaluation-calculation-history/ListEvaluationCalculationHistoryScreen';
import ListProSkillPublicHistoryScreen from '../page/admin/list-pro-skill';
import ListUserEvaluation from '../page/admin/list-user-evaluation/ListUserEvaluationScreen';
import ListUserScreen from '../page/admin/list-user/ListUserScreen';

// import SettingEvaluationProScreen from '../page/admin-evaluation/setting-evaluation-pro';
import UserDetailScreen from '../page/admin/user-detail/UserDetailScreen';
import ApprovalHistory from '../page/detail-pro-skill/ApprovalHistory';
import DetailProSkillOrder from '../page/detail-pro-skill/DetailProSkillOrder';
import EditProSkill from '../page/detail-pro-skill/edit/EditProSkill';
import InputProSkillEvaluator from '../page/detail-pro-skill/InputProSkillEvaluator';
import EvaluationDecription from '../page/evaluation/evaluationDecription';
import UserApprovalHistoryScreen from '../page/user/approval-history/UserApprovalHistoryScreen';
import ListApproveProSkillScreen from '../page/evaluator/list-approve-pro-skill/ListApproveProSkillScreen';
import ListUserEvaluationEvaluatorScreen from '../page/evaluator/list-user-evaluation/ListUserEvaluationEvaluatorScreen';
import ListEvaluationScreen from '../page/user/list-evaluation/index';
import EvaluationReference from '../page/user/evaluation-reference';
import NavigationScreen from '../page/navigation/NavigationScreen';
import Login from '../page/login/index';
import Implementation from '../page/admin/review-management/Implementation';
import ListProSkillPublicDepartmentScreen from '../page/evaluator/list-pro-skill-public-department';
import EvaluationComponent8 from '../page/user/evaluation-8-10';
import UserEvaluationScreen from '../page/user/evaluation';
import AddDepartment from '../page/admin/list-department/AddDepartment';
import DepartmentGoal from '../page/user/deparment-goal';
import EvaluatorEvalutionHistoryScreen from '../page/evaluator/approval-history/EvaluatorEvalutionHistoryScreen';
import Page404 from '../page/404';
import DetailProSkillScreen from '../page/detail-pro-skill/DetailProSkillScreen';
import DetailPublicProSkill from '../page/detail-pro-skill/DetailPublicProSkill';
import EvaluationCriteriaDescriptionScreenDetail from '../page/admin/evaluation-criteria-description/detail/EvaluationCriteriaDescriptionScreenDetail';
import EvaluationCriteriaDescriptionScreenEdit from '../page/admin/evaluation-criteria-description/edit/EvaluationCriteriaDescriptionScreenEdit';

// import SettingEvaluatorScreen from '../page/admin/set-evaluation/SettingEvaluatorScreen';
import AdminApprovalHistoryScreen from '../page/admin-evaluation/approval-history/AdminApprovalHistoryScreen';
import DetailCalculationScreen17 from '../page/admin-evaluation/detail-evaluation-calculation/DetailCalculationScreen17';
import PeriodEvaluationDetailScreen from '../page/admin/period-evaluation/period-evaluation-detail/PeriodEvaluationDetailScreen';
import IndexProSkillComponents from '../page/detail-pro-skill/Index';
import DetailEvaluationItemScreen from '../page/admin/criterion-management/DetailEvaluationItemScreen';
import DetailEvaluationFixed from '../page/admin/detail-evaluation-fixed';
import NavigateDivision from '../page/admin/list-department/navigate';
import ListEvaluationItem from '../page/admin/criterion-management/Index';
import { Roles } from '../constant/Roles';
import DetailCalculationScreen17ns from '../page/admin-evaluation/detail-evaluation-calculation/DetailCalculationScreen17ns';
import ManualScreen from '../page/manual/ManualScreen';
import ListVersionNotificationScreen from '../page/admin-evaluation/list-version-notification/ListVersionNotificationScreen';
import DetailNotification from '../page/admin-evaluation/detail-notification/DetailNotification';
import NotificationScreen from '../page/notification/NotificationScreen';
import MailManagementScreen from '../page/admin/mail-management/MailManagementScreen';
import EditMailTemplateScreen from '../page/admin/mail-management/mail-manage-tab/EditMailTemplateScreen';
import ExportProSkillExcelF3 from '../page/admin/export-pro-skill/exportProSkillF3';
import ExportProSkillExcelF4 from '../page/admin/export-pro-skill/exportProSkillF4';
import ExportProSkillExcelF6 from '../page/admin/export-pro-skill/exportProSkillF6';
import ExportHistoryEvalution from '../page/admin/export-history-evaluation';
import ExportHistoryEvalutionEvaluator from '../page/export-history-evaluation';
import EvaluationCaculatorDetail8_10 from '../page/admin/evaluation-calculator-detail8-10/EvaluationCaculatorDetail8_10';
import EvaluationCaculatorDetail8_10ns from '../page/admin/evaluation-calculator-detail8-10/EvaluationCaculatorDetail8_10NS';
import UserScreenEvaluation810 from '../page/user/evaluation-8-10';
import SettingTemplate from '../page/admin-evaluation/setting-evaluation-pro/SettingTemplate';
import SettingEvaluationHistoryReference from '../page/admin/setting-evaluation-history-reference/settingEvaluationHistoryReference';
import FeedbackScreen from '../page/feedback/FeedbackScreen';
import ListFeedbackScreen from '../page/admin/list-feedback/ListFeedbackScreen';
import DetailFeedback from '../page/admin/detail-feedback/DetailFeedback';
import path from 'path';
import DownloadFileFromExcel from '../page/admin/list-feedback/DownloadFileFromExcel';
import FeedbackDetailScreen from '../page/feedback/FeedbackDetailScreen';
import AddEditUserEvaluationReference from '../page/admin/setting-evaluation-history-reference/component/addEditUserEvaluationReference';
import ReferenceReviewScreen from '../page/reference-review/ReferenceReviewScreen';
import ReviewEvaluationDetail from '../page/review-evaluation/detail';
import ReviewEvaluationDetail810 from '../page/review-evaluation/detail/index810';
import DetailCalculationScreenCommon from '../page/admin-evaluation/detail-evaluation-calculation/DetailCalculationScreenCommon';
import FeedbackHistory from '../page/feedback/components/FeedbackHistory';
import DetailFeedbackPage from '../page/admin/detail-feedback/DetailFeedBackPage';
import DetailProSkillExpertise from '../page/pro-skill-expertise/detailProSkillExpertise';
import ProSkillExpertise from '../page/pro-skill-expertise/proSkillExpertise';
import UserList from '../page/admin/user-management/user-list/UserList';
import UserDetail from '../page/admin/user-management/user-detail/userDetail';
import UserEdit from '../page/admin/user-management/user-edit/UserEdit';
import EvaluationPeriodList from '../page/admin-evaluation/evaluationn-period-management/evaluation-period-list/EvaluationPeriodList';
import EvaluationPeriodDetail from '../page/admin-evaluation/evaluationn-period-management/evaluation-period-detail/EvaluationPeriodDetail';

export interface RouterProps {
  [x: string]: any;
  path: string;
  component: React.ReactNode;
  icon?: React.ReactElement<any, any>;
  label?: string;
  routers?: RouterProps[];
}

// ** F1
const userRouter: RouterProps = {
  path: 'company/:companyCode/user/',
  component: <RequireAuth roleList={[Roles.F1]} />,
  routers: [
    { path: 'list-evaluation', component: <ListEvaluationScreen /> },
    { path: 'evaluation/:id', component: <UserEvaluationScreen evalationType="isEvaluationUser" /> },
    { path: 'department-goal/', component: <DepartmentGoal /> },
    { path: 'evaluation-description/:id', component: <EvaluationDecription access="button" /> },
    { path: 'evaluation-description', component: <EvaluationDecription access="menu" /> },
    { path: 'evaluation/:id/approval-history', component: <UserApprovalHistoryScreen /> },
    { path: 'evaluation-8-10/:id', component: <UserScreenEvaluation810 role="user" /> },
    { path: 'evaluation-reference-basic', component: <EvaluationReference type="basic" /> },
    { path: 'evaluation-reference-behavior', component: <EvaluationReference type="behavior" /> },
    { path: 'evaluation-reference-pro', component: <EvaluationReference type="pro" /> },
  ],
};

// ** F2
const evaluatorRouter: RouterProps = {
  path: 'company/:companyCode/evaluator/',
  component: <RequireAuth roleList={[Roles.F2]} />,
  routers: [
    { path: 'list-user-evaluation', component: <ListUserEvaluationEvaluatorScreen /> },
    { path: 'evaluation/:id', component: <UserEvaluationScreen evalationType="isEvaluationEvaluator" /> },
    { path: 'evaluation-8-10/:id', component: <EvaluationComponent8 role="evaluator" /> },
    { path: 'evaluation/:id/approval-history', component: <EvaluatorEvalutionHistoryScreen /> },

    // { path: 'department-goal/:id', component: <DepartmentGoal /> },
    { path: 'evaluation-description/:id', component: <EvaluationDecription access="button" /> },
    { path: 'list-pro-skill-public-department', component: <ListProSkillPublicDepartmentScreen /> },
    {
      path: 'detail-pro-skill-public',
      component: <DetailProSkillScreen isReadOnly={true} rolePath="f2/evaluator" />,
    },
    { path: 'pro-skill/history/:id', component: <ApprovalHistory role="f2" /> },
    { path: 'department-goal/', component: <DepartmentGoal /> },
    { path: 'export-history-evaluation-evaluator/', component: <ExportHistoryEvalutionEvaluator /> },
    { path: 'development-professional-expertise/', component: <ProSkillExpertise /> },
    { path: 'development-professional-expertise/detail', component: <DetailProSkillExpertise /> },
  ],
};

// ** F3
const proSettingRouter: RouterProps = {
  path: 'company/:companyCode/pro-setting/',
  component: <RequireAuth roleList={[Roles.F3]} />,
  routers: [
    { path: 'list-pro-skill', component: <ListProSkillPublicHistoryScreen /> },
    { path: 'list-pro-skill-public-department', component: <ListProSkillPublicDepartmentScreen /> },
    { path: 'pro-skill/history/:id', component: <ApprovalHistory role="f3" /> },

    // { path: 'detail-pro-skill/edit', component: <EditProSkill /> },
    { path: 'create', component: <EditProSkill /> },
    { path: 'detail-pro-skill/:id', component: <IndexProSkillComponents /> },
    {
      path: 'detail-pro-skill-public',
      component: <DetailProSkillScreen isReadOnly={true} rolePath="f3/pro-setting" />,
    },
    { path: 'export-pro-skill', component: <ExportProSkillExcelF3 role="f3" /> },
  ],
};

// ** F4
const proApproveRouter: RouterProps = {
  path: 'company/:companyCode/pro-skill-approval/',
  component: <RequireAuth roleList={[Roles.F4]} />,
  routers: [
    { path: 'list-approve-pro-skill', component: <ListApproveProSkillScreen /> },
    { path: 'list-approve-pro-skill-public', component: <ListProSkillPublicDepartmentScreen /> },
    { path: 'detail-pro-skill-approve/:skillId/:id', component: <InputProSkillEvaluator /> },
    { path: 'pro-skill/history/:id', component: <ApprovalHistory role="f4" /> },
    {
      path: 'detail-pro-skill-public',
      component: <DetailProSkillScreen isReadOnly={true} rolePath="f4/pro-skill-approval" />,
    },
    { path: 'detail-pro-skill-public/skill/:id', component: <DetailPublicProSkill /> },
    { path: 'export-pro-skill', component: <ExportProSkillExcelF4 role="f4" /> },
  ],
};

// ** F5
const adminEvaluationRouterF5: RouterProps = {
  path: 'company/:companyCode/admin-evaluation/',
  component: <RequireAuth roleList={[Roles.F5]} />,
  routers: [
    // { path: 'evaluation-period-list', component: <EvaluationPeriodList /> },
    { path: 'list-user-evaluation', component: <ListUserEvaluation /> },
    { path: 'evaluation-8-10/:id', component: <EvaluationComponent8 role="admin" /> },
    { path: 'evaluation/:id', component: <UserEvaluationScreen evalationType="isEvaluationEvaluator" isF5 /> },
    { path: 'evaluation/:id/approval-history', component: <AdminApprovalHistoryScreen /> },
    { path: 'department-goal', component: <DepartmentGoal /> },
    { path: 'evaluation-description/:id', component: <EvaluationDecription access="button" /> },
    { path: 'export-history-evaluation', component: <ExportHistoryEvalution /> },
    { path: 'list-period-evaluation', component: <Implementation /> },
    { path: 'period-evaluation-detail', component: <PeriodEvaluationDetailScreen /> },
    { path: 'period-evaluation-detail-v2', component: <EvaluationPeriodDetail /> },
    { path: 'detail-evaluation-fixed', component: <DetailEvaluationFixed /> },
    { path: 'list-feedback', component: <FeedbackHistory key="admin" role="admin" /> },
    { path: 'list-feedback/detail/:id', component: <DetailFeedbackPage role={'admin'} /> },
    { path: '*', component: <Navigate to="/404page" /> },
  ],
};

// ** F6
const adminEvaluationRouterF6: RouterProps = {
  path: 'company/:companyCode/admin-evaluation/',
  component: <RequireAuth roleList={[Roles.F6]} />,
  routers: [
    // F6
    { path: 'list-evaluation-item', component: <ListEvaluationItem /> },
    { path: 'detail-evaluation-item/:id', component: <DetailEvaluationItemScreen /> },
    { path: 'list-criteria-history', component: <ListCriteriaHistoryScreen /> },
    { path: 'detail-pro-skill/:id', component: <DetailProSkillOrder /> },
    { path: 'pro-skill/history/:id', component: <ApprovalHistory role="f6" /> },
    { path: 'list-evaluation-calculation-history', component: <ListEvaluationCalculationHistoryScreen /> },
    { path: 'evaluation-calculator-detail-8-10', component: <EvaluationCaculatorDetail8_10 /> },
    { path: 'evaluation-calculator-detail-8-10-ns', component: <EvaluationCaculatorDetail8_10ns /> },
    { path: 'evaluation-calculator-detail', component: <DetailCalculationScreen17 /> },
    { path: 'evaluation-calculator-detail-ns', component: <DetailCalculationScreen17ns /> },
    { path: 'evaluation-calculator-detail-common', component: <DetailCalculationScreenCommon /> },
    { path: 'list-criteria-evaluation', component: <ListCriteriaEvaluationScreen /> },
    { path: 'criteria-evaluation/detail/:id', component: <EvaluationCriteriaDescriptionScreenDetail /> },
    { path: 'criteria-evaluation/edit', component: <EvaluationCriteriaDescriptionScreenEdit /> },

    // { path: 'setting-evaluation-pro', component: <DivisionListScreenOld /> },
    { path: 'setting-evaluation-pro', component: <SettingTemplate /> },

    // { path: 'detail-setting-evaluation-pro/:divisionId', component: <SettingEvaluationProScreen /> },
    { path: 'list-version-notification', component: <ListVersionNotificationScreen /> },
    { path: 'notification-detail', component: <DetailNotification /> },

    { path: '*', component: <Navigate to="/404page" /> },
    { path: 'export-pro-skill', component: <ExportProSkillExcelF6 role="f6" /> },
    { path: 'setting-evaluation-history-reference', component: <SettingEvaluationHistoryReference /> },
    { path: 'add-user-evaluation-history-reference', component: <AddEditUserEvaluationReference type={'add'} /> },
    { path: 'edit-user-evaluation-history-reference', component: <AddEditUserEvaluationReference type={'edit'} /> },
  ],
};

// ** F7
const adminEvaluationRouterF7: RouterProps = {
  path: 'company/:companyCode/admin-evaluation/',
  component: <RequireAuth roleList={[Roles.F7]} />,
  routers: [
    // { path: 'exception-period-evaluation', component: <ExceptionPeriodEvaluationScreen /> },
    { path: 'mail-management', component: <MailManagementScreen /> },
    { path: 'mail-management/edit', component: <EditMailTemplateScreen /> },

    // { path: 'detail-history-mail', component: <DetailMailHistory /> },
    { path: '*', component: <Navigate to="/404page" /> },
  ],
};

// ** F8
const adminUserRouter: RouterProps = {
  path: 'company/:companyCode/admin-user/',
  component: <RequireAuth roleList={[Roles.F8]} />,
  routers: [
    { path: 'user-list', component: <UserList /> },
    { path: 'user-list/detail/:id', component: <UserDetail /> },
    { path: 'user-list/edit/:id', component: <UserEdit /> },
    { path: 'add-user', component: <OracleUserTable /> },
    { path: 'list-division', component: <NavigateDivision type={1} /> },
    { path: 'list-sub-department', component: <NavigateDivision type={0} /> },
    { path: 'add-department', component: <AddDepartment /> },
  ],
};

// ** F9
const systemAdminRouter: RouterProps = {
  path: 'company/:companyCode/system-admin/',
  component: <RequireAuth roleList={[Roles.F9]} />,
  routers: [
    { path: 'list-feedback', component: <FeedbackHistory key="systemAdmin" role="systemAdmin" /> },
    { path: 'list-feedback/detail/:id', component: <DetailFeedbackPage role={'systemAdmin'} /> },
  ],
};

// ** F5 and F7
// const exportHistoryEvalution: RouterProps = {
//   path: 'admin-evaluation',
//   component: <RequireAuth roleList={[Roles.F5, Roles.F7]} />,
//   routers: [{ path: 'export-history-evaluation', component: <ExportHistoryEvalution /> }],
// };

// ** Login
const loginRouters: RouterProps[] = [
  {
    path: 'login',
    component: <Login />,
  },
];

// ** Puslic router for f1 -> f8
const defaultRouters: RouterProps = {
  component: <RequireAuth isPublic />,
  routers: [
    {
      path: '/',
      component: <Navigate to="/home" />,
    },
    { path: '/home', component: <NavigationScreen /> },
    { path: '/company/:companyCode/notification', component: <NotificationScreen /> },
    { path: '/company/:companyCode/manual', component: <ManualScreen /> },
    { path: '/company/:companyCode/feedback', component: <FeedbackScreen /> },
    { path: '/company/:companyCode/feedback/detail/:id', component: <DetailFeedbackPage role={'user'} /> } /**user */,
    { path: '/company/:companyCode/reference-review/detail/:idEvaluation', component: <ReviewEvaluationDetail /> },
    {
      path: '/company/:companyCode/reference-review/detail810/:idEvaluation',
      component: <ReviewEvaluationDetail810 />,
    },
    { path: '/404page', component: <Page404 /> },
    { path: '*', component: <Navigate to="/404page" /> },
    { path: '/company/:companyCode/reference-review', component: <ReferenceReviewScreen /> },
    {
      path: '/company/:companyCode/reference-review/evaluation/:id/approval-history/',
      component: <AdminApprovalHistoryScreen />,
    },
  ],
  path: '',
};

//** Download feedback từ file excel */
const dowloadFeedbackRouters: RouterProps[] = [
  {
    path: '/company/:companyCode/download-feedback/:id',
    component: <DownloadFileFromExcel />,
  },
];

const routers: RouterProps[] = [
  userRouter,
  evaluatorRouter,
  proSettingRouter,
  proApproveRouter,
  adminEvaluationRouterF5,
  adminEvaluationRouterF6,
  adminEvaluationRouterF7,
  adminUserRouter,
  ...loginRouters,
  defaultRouters,
  ...dowloadFeedbackRouters,
  systemAdminRouter,
];
export {
  userRouter,
  evaluatorRouter,
  proSettingRouter,
  proApproveRouter,
  adminEvaluationRouterF5,
  adminEvaluationRouterF6,
  adminEvaluationRouterF7,
  adminUserRouter,
  loginRouters,
  defaultRouters,
  routers,
  dowloadFeedbackRouters,
  systemAdminRouter,
};
