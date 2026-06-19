"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailNotificateCronjobFailed = exports.mailNotificateGoalSetting = exports.mailNotificateEvaluation = exports.publicProSkillTemplate = exports.publicBehaviorTemplate = exports.publicBasicSkillTemplate = exports.rejectProSkillVersionTemplate = exports.approveProSkillVersionToOtherTemplate = exports.approveProSkillVersionToAdminTemplate = exports.requestingProSkillApprovalTemplate = exports.adminPublicEvaluationTemplate = exports.evaluatorRejectingTemplate = exports.submitGoalAndEvaluationTemplate = exports.evaluatorApproveGoalSettingTemplate = exports.sendMailChangeExceptionalCase = exports.sendMailStartExceptionalCase = exports.updateEvaluationTimeTemplate2 = exports.updateEvaluationTimeTemplate1 = exports.updateEvaluationTimeTemplate = exports.updateGoalSettingTimeTemplate2 = exports.updateGoalSettingTimeTemplate1 = exports.updateGoalSettingTimeTemplate = exports.startEvaluationPeriodTemplate2 = exports.startEvaluationPeriodTemplate1 = exports.startEvaluationPeriodTemplate = exports.startGoalSettingPeriodTemplate2 = exports.startGoalSettingPeriodTemplate1 = exports.startGoalSettingPeriodTemplate = void 0;
const startGoalSettingPeriodTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    ・部門目標設定：{{dateCreationGoalDepartmentStart}} ～ {{dateCreationGoalDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startGoalSettingPeriodTemplate = startGoalSettingPeriodTemplate;
const startGoalSettingPeriodTemplate1 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    <br>    
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startGoalSettingPeriodTemplate1 = startGoalSettingPeriodTemplate1;
const startGoalSettingPeriodTemplate2 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間をお知らせします。<br>
    ・部門目標設定：{{dateCreationGoalDepartmentStart}} ～ {{dateCreationGoalDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startGoalSettingPeriodTemplate2 = startGoalSettingPeriodTemplate2;
const startEvaluationPeriodTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間をお知らせします。<br>
    ・個人評価：{{dateEvaluationStart}} ～ {{dateEvaluationEnd}}<br>
    ・部門評価：{{dateEvaluationDepartmentStart}} ～ {{dateEvaluationDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startEvaluationPeriodTemplate = startEvaluationPeriodTemplate;
const startEvaluationPeriodTemplate1 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間をお知らせします。<br>
    ・個人評価：{{dateEvaluationStart}} ～ {{dateEvaluationEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startEvaluationPeriodTemplate1 = startEvaluationPeriodTemplate1;
const startEvaluationPeriodTemplate2 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間をお知らせします。<br>
    ・部門評価：{{dateEvaluationDepartmentStart}} ～ {{dateEvaluationDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.startEvaluationPeriodTemplate2 = startEvaluationPeriodTemplate2;
const updateGoalSettingTimeTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間の変更をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    ・部門目標設定：{{dateCreationGoalDepartmentStart}} ～ {{dateCreationGoalDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateGoalSettingTimeTemplate = updateGoalSettingTimeTemplate;
const updateGoalSettingTimeTemplate1 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間の変更をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateGoalSettingTimeTemplate1 = updateGoalSettingTimeTemplate1;
const updateGoalSettingTimeTemplate2 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間の変更をお知らせします。<br>
    ・部門目標設定：{{dateCreationGoalDepartmentStart}} ～ {{dateCreationGoalDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateGoalSettingTimeTemplate2 = updateGoalSettingTimeTemplate2;
const updateEvaluationTimeTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間の変更をお知らせします。<br>
    ・個人評価：{{dateEvaluationStart}} ～ {{dateEvaluationEnd}}<br>
    ・部門評価：{{dateEvaluationDepartmentStart}} ～ {{dateEvaluationDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateEvaluationTimeTemplate = updateEvaluationTimeTemplate;
const updateEvaluationTimeTemplate1 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間の変更をお知らせします。<br>
    ・個人評価：{{dateEvaluationStart}} ～ {{dateEvaluationEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateEvaluationTimeTemplate1 = updateEvaluationTimeTemplate1;
const updateEvaluationTimeTemplate2 = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 評価の実施期間の変更をお知らせします。<br>
    ・部門評価：{{dateEvaluationDepartmentStart}} ～ {{dateEvaluationDepartmentEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして評価をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.updateEvaluationTimeTemplate2 = updateEvaluationTimeTemplate2;
const sendMailStartExceptionalCase = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.sendMailStartExceptionalCase = sendMailStartExceptionalCase;
const sendMailChangeExceptionalCase = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】目標設定実施期間変更のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}} 目標設定の実施期間の変更をお知らせします。<br>
    ・個人目標設定：{{dateCreationGoalStart}} ～ {{dateCreationGoalEnd}}<br>
    <br>
    上記期間に評価システムにアクセスして目標設定をおこなってください。<br>
    URL：{{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.sendMailChangeExceptionalCase = sendMailChangeExceptionalCase;
const evaluatorApproveGoalSettingTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】[{{userName}}] 目標承認のお願い`;
    content.body = `{{evaluatorName}}様<br>
    お疲れ様です。<br>
    <br>
    {{departmentName}} {{userName}}様が{{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}}の目標を提出しました。<br>
    下記URLにアクセスして確認してから承認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.evaluatorApproveGoalSettingTemplate = evaluatorApproveGoalSettingTemplate;
const submitGoalAndEvaluationTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】[{{userName}}] 評価実施のお願い`;
    content.body = `{{evaluatorName}}様<br>
    お疲れ様です。<br>
    <br>
    {{departmentName}} {{userName}}様が{{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}}の評価結果を提出しました。<br>
    下記URLにアクセスして確認してから承認・評価をおこなってください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.submitGoalAndEvaluationTemplate = submitGoalAndEvaluationTemplate;
const evaluatorRejectingTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】[{{userName}}] {{period}}差戻のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{departmentName}} {{rejecter}}様が [{{rejectee}}] {{year}}年{{periodIndex}} {{periodStart}} ～ {{periodEnd}}の{{period}}を差戻しました。<br>
    下記URLにアクセスして確認してから対応してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.evaluatorRejectingTemplate = evaluatorRejectingTemplate;
const adminPublicEvaluationTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{year}}年{{periodIndex}}】評価結果公開のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{year}}年{{periodIndex}}評価結果が公開されました。<br>
    下記URLにアクセスして確認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.adminPublicEvaluationTemplate = adminPublicEvaluationTemplate;
const requestingProSkillApprovalTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{skillName}}】専門スキル (バージョン{{version}}) 承認のお願い`;
    content.body = `お疲れ様です。<br>
    <br>
    {{creatorName}}様が [{{skillName}}] 専門スキル (バージョン{{version}})を作成しました。<br>
    下記URLにアクセスして確認してから承認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.requestingProSkillApprovalTemplate = requestingProSkillApprovalTemplate;
const approveProSkillVersionToAdminTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{skillName}}】専門スキル (バージョン{{version}}) 公開のお願い`;
    content.body = `お疲れ様です。<br>
    <br>
    [{{skillName}}] 専門スキル (バージョン{{version}})が承認されました。<br>
    下記URLにアクセスして確認してから公開してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.approveProSkillVersionToAdminTemplate = approveProSkillVersionToAdminTemplate;
const approveProSkillVersionToOtherTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{skillName}}】専門スキル (バージョン{{version}}) 承認のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    [{{skillName}}] 専門スキル (バージョン{{version}})が承認されました。<br>
    下記URLにアクセスして確認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.approveProSkillVersionToOtherTemplate = approveProSkillVersionToOtherTemplate;
const rejectProSkillVersionTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【{{skillName}}】専門スキル (バージョン{{version}}) 差戻のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    [{{skillName}}] 専門スキル (バージョン{{version}})が差し戻されました。<br>
    下記URLにアクセスして確認して対応してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.rejectProSkillVersionTemplate = rejectProSkillVersionTemplate;
const publicBasicSkillTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【人事評価】基本スキル (バージョン{{version}}) 公開のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    人事評価_基本スキル (バージョン{{version}})が新規に公開されました。<br>
    下記URLにアクセスして確認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.publicBasicSkillTemplate = publicBasicSkillTemplate;
const publicBehaviorTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【人事評価】【{{level}}等級】行動・情意評価 (バージョン{{version}}) 公開のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    {{level}}等級の行動・情意評価 (バージョン{{version}})が新規に公開されました。<br>
    下記URLにアクセスして確認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.publicBehaviorTemplate = publicBehaviorTemplate;
const publicProSkillTemplate = () => {
    const content = { title: '', body: '' };
    content.title = `【人事評価】専門スキル (バージョン{{version}}) 公開のお知らせ`;
    content.body = `お疲れ様です。<br>
    <br>
    人事評価_専門スキル (バージョン{{version}})が新規に公開されました。<br>
    下記URLにアクセスして確認してください。<br>
    {{url}}<br>
    <br>
    どうぞよろしくお願いいたします。<br>
    `;
    return content;
};
exports.publicProSkillTemplate = publicProSkillTemplate;
const mailNotificateEvaluation = () => {
    const content = { title: '', body: '' };
    content.title = `ご案内）GNW{{year}}{{period}}人事評価実施`;
    content.body = `お疲れ様です。<br>
  <br />
  GNW算定会議事務局です。<br>
  <br />
  {{year}}{{period}}人事評価実施について下記ご案内させて頂きます。<br>
  <br />
  ＝＝＝＝＝＝＝＝＝＝<br>
  【行うこと】<br>
  ①評価前面談にて、{{year}}{{period}}人事評価「スキル評価」「成果評価」の達成度の擦り合わせ<br>
  ②{{year}}{{period}}人事評価（「自己評価」／「1次評価」／「2次評価」）を＜評価システム＞にて実施<br>
  <br />
  【対象者】<br>
  社員全員（出向者含む）<br>
  ・{{periodDate}}に在籍しており、目標設定を行っている方<br>
  【対象外】<br>
  ・{{periodMonth}}末時点で退職予定の方、または休職中の方<br>
  ＝＝＝＝＝＝＝＝＝＝<br>
  【評価の流れ】<br>
  ①評価前面談の実施<br>
  ・期初に設定した{{year}}{{period}}人事評価（目標）について、【1次評価者】は【被評価者】と評価前面談を実施してください<br>
  ・期初に設定している各評価項目および目標の達成度について擦り合わせを行って下さい<br>
  <br />
  ②{{year}}{{period}}上期人事評価を実施<br>
  ・【評価期間中】に＜評価システム＞にて下記の流れで評価を進めてください<br>
  1.【被評価者】は＜評価システム＞上の被評価者にて{{year}}{{period}}評価を行って提出<br>
  2.【1次評価者】は＜評価システム＞上の評価者にて1次評価を行い、2次評価者へ提出<br>
  3.【2次評価者】は＜評価システム＞上の評価者にて2次評価を行い、承認する<br>
  <br />
  ・評価システムのログイン情報は以下となります。<br>
  1．URL：{{loginURL}}<br>
  2．ユーザ名、パスワードはPCにログインするユーザ名とパスワードと同様<br>
 <br />
  【スケジュール】<br>
  ①評価前面談：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
  ②個人自己評価：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
  ③1次評価：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
  ④2次評価：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
  <br />
  不明点等ありましたら、事務局（gnw-legal@geonet.co.jp）までお問い合わせください。<br>
  個人への問い合せはお控えください。<br>
  <br />
  以上、よろしくお願いいたします。<br>
  `;
    return content;
};
exports.mailNotificateEvaluation = mailNotificateEvaluation;
const mailNotificateGoalSetting = () => {
    const content = { title: ``, body: `` };
    content.title = `ご案内）GNW{{year}}{{period}}目標設定`;
    content.body = `お疲れ様です。<br>
  <br />
GNW算定会議事務局です。<br>
<br />
{{year}}{{period}}目標設定について下記ご案内させて頂きます。<br>
<br />
＝＝＝＝＝＝＝＝＝＝<br>
【行うこと】<br>
①評価前面談にて、{{year}}{{period}}人事評価「専門スキル」の評価項目決定<br>
②{{year}}{{period}}の「成果評価」の目標設定<br>
③＜評価システム＞への入力<br>
<br />
【対象者】<br>
社員全員（出向者含む）<br>
・{{firstPeriodDate}}に在籍している方<br>
<br />
【対象外】<br>
・{{periodMonth}}末時点で退職予定の方、または休職中の方<br>
＝＝＝＝＝＝＝＝＝＝<br>
【目標設定の流れ】<br>
①面談の実施<br>
・【1次評価者】は【被評価者】と面談を実施してください<br>
・評価システム＞専門スキル評価項目にて評価項目を確認してください<br>
<br />
②{{year}}{{period}}目標設定<br>
・【スケジュール】を確認のうえ下記の流れで評価システムにて実施してください<br>
1. 各部次長は【部門目標】を＜評価システム＞にて作成登録し、本部長および社長の承認を受けてください<br>
2. 各社員は公開された【部門目標】を確認して、個人目標を＜評価システム＞にて作成登録し上長の承認を得てください<br>
<br />
・評価システムのログイン情報は以下となります。<br>
1．URL：{{loginURL}}<br>
2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br>
<br />
【スケジュール】<br>
①面談実施：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
②部門目標作成：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
③個人目標作成：<span style="color:#ff0000;font-size:11pt;"><strong>YYYY/MM/DD ~ YYYY/MM/DD</strong></span><br>
<br />
不明点等ありましたら、事務局（gnw-legal@geonet.co.jp）までお問い合わせください。<br>
個人への問い合せはお控えください。<br>
<br />
以上、よろしくお願いいたします。<br>
  `;
    return content;
};
exports.mailNotificateGoalSetting = mailNotificateGoalSetting;
const mailNotificateCronjobFailed = () => {
    const content = { title: ``, body: `` };
    content.title = `[Evaluation System][Failed] Send mail error`;
    content.body = `Dear Support team,<br>
  <br>I would like to inform you that send mail has failed.
  <br>-------------------------------------------------------------
  <br>Title : {title}
  <br>To : {emailTo}
  <br>Content : 
  <br>{contentMail} 
  <br>-------------------------------------------------------------
  <br>Error : {error}
  <br>-------------------------------------------------------------
  <br>Best regards.`;
    return content;
};
exports.mailNotificateCronjobFailed = mailNotificateCronjobFailed;
//# sourceMappingURL=mailTemplates.js.map