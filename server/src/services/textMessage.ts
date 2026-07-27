export class TextMessage {
  public static readonly textDeleteDepartment = 'が取り消されます。';
  public static readonly textNoChangeUserEvaluation =
    //'選択したオプションは、当ユーザの情報と一致しないため、適用できません。ユーザー詳細画面で情報を編集してください。';
    '変更情報がありません。';

  public static readonly textTitleLevel = '等級';
  public static readonly textTitleDepDiv = '所属';
  public static readonly textTitleSkill = 'スキル';
  public static readonly textItemChanged = '・【ユーザ管理】{item}が変わる。\n';

  public static readonly textOnlyResetBehavior17 =
    '・【ユーザ管理】等級が変わる。' +
    '\n' +
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が変わらない。' +
    '\n' +
    '③行動・情意が自動的に更新される。' +
    '\n' +
    '④専門スキル（ある場合）、個人目標が保持される。目標状態によって編集できる。' +
    '\n';

  public static readonly textOnlyResetBehavior810 =
    '・【ユーザ管理】等級が変わる。' +
    '\n' +
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が変わらない。' +
    '\n' +
    '③行動・情意が自動的に更新される。' +
    '\n' +
    '④専門スキル（ある場合）、個人目標、部門目標が保持される。目標状態によって編集できる。' +
    '\n';

  public static readonly textOnlyChangeLevelInRange17 =
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が未作成に戻る。' +
    '\n' +
    '③行動・情意が自動的に更新される。' +
    '\n' +
    '④専門スキル（ある場合）、個人目標が保持されて編集できる。' +
    '\n';

  public static readonly textOnlyChangeLevelInRange810 =
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が未作成に戻る。' +
    '\n' +
    '③部門目標が保持されて編集できる。' +
    '\n' +
    '④行動・情意、基本スキル（ある場合）が自動的に更新される。' +
    '\n' +
    '⑤専門スキル（ある場合）、個人目標が保持されて編集できる。' +
    '\n';

  public static readonly textOnlyChangeLevel1_7Bidirectional8_10 =
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が未作成に戻る。' +
    '\n' +
    '③評価者がクリアされる。' +
    '\n' +
    '④個人目標（ある場合）が保持されて編集できる。' +
    '\n';

  public static readonly textChangeDepDiv =
    '・目標設定時の内容：' +
    '\n' +
    '①所属が変わる。' +
    '\n' +
    '②目標状態が未作成に戻る。' +
    '\n' +
    '③評価者、目標内容がクリアされる。' +
    '\n' +
    '④専門スキルが新部署・課（ある場合）に合わせて変更される。' +
    '\n';

  public static readonly textChangeHaveSkillToNotSkill =
    '・目標状態が未作成に戻る。' +
    '\n' +
    '・基本スキル、専門スキルが削除される。' +
    '\n' +
    '・個人目標、部門目標（ある場合）が保持され編集できる。' +
    '\n';

  public static readonly textChangeNotSkillToHaveSkill =
    '・目標状態が未作成に戻る。' +
    '\n' +
    '・基本スキル、専門スキルが表示される。' +
    '\n' +
    '・個人目標、部門目標（ある場合）が保持され編集できる。' +
    '\n';
  /**end */

  /**Ngoài thời gian đặt mục tiêu & Trước khi fix */
  public static readonly textOptional2_OnlyChangeLevel17_BeforeFix =
    '・【ユーザ管理】等級が変わる。' +
    '\n' +
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が変わらない。' +
    '\n' +
    '③行動・情意が自動的に更新される。' +
    '\n' +
    '④基本スキル、専門スキル（ある場合）、個人目標が変わらない。' +
    '\n';

  public static readonly textOptional2_OnlyChangeLevel810_BeforeFix =
    '・【ユーザ管理】等級が変わる。' +
    '\n' +
    '・目標設定時の内容：' +
    '\n' +
    '①等級が変わる。' +
    '\n' +
    '②目標状態が変わらない。' +
    '\n' +
    '③行動・情意が自動的に更新される。' +
    '\n' +
    '④基本スキル、専門スキル（ある場合）、個人目標、部門目標が変わらない。' +
    '\n';

  public static readonly textOptional1_ChangeAnyThing_BeforeFix =
    '各情報が変わらない。' +
    '\n' +
    '\n' +
    '・変更を期初の目標に反映したい場合は【評価／目標期間設定・状況管理】≻【評価目標実施詳細】画面で設定してください。' +
    '\n' +
    '■ケース1：期初の目標レコードの設定を編集する' +
    '\n' +
    '【評価目標実施詳細】' +
    '\n' +
    '・等級・所属・スキルあり/なしを変更する。目標期間が必須ではない。' +
    '\n' +
    '【ユーザ管理】' +
    '\n' +
    '・各情報が変わらない' +
    '\n' +
    '【目標設定画面】' +
    '\n' +
    '・期初の目標レコード：' +
    '\n' +
    '∟等級・所属・スキルあり/なしが合わせて変わる。' +
    '\n' +
    '∟個人目標、部門目標（ある場合）が保持され編集できる。' +
    '\n' +
    '\n' +
    '■ケース2：複数の目標レコードを作成する' +
    '\n' +
    '【評価目標実施詳細】' +
    '\n' +
    '・期初の目標レコードに加えて、目標レコードを追加して、目標設定を行って被評価者にやってもらう。' +
    '\n' +
    '【ユーザ管理】' +
    '\n' +
    '・各情報が変わらない。' +
    '\n' +
    '【目標設定画面】' +
    '\n' +
    '・追加したレコード情報は【評価目標実施詳細】で設定通りになる。' +
    '\n';
  /**end */

  /**
   * Trong thời gian đặt mục tiêu & Sau khi fix +Ngoài thời gian đặt mục tiêu & Sau khi fix
   */
  /**
   * Admin chọn Option 2 nhưng user này có level thay đổi qua ranh giới 1–7 ↔ 8–10.
   * Server (update_user.sql) sẽ KHÔNG cập nhật evaluation_tbl cho user này;
   * chỉ có user_tbl.level được cập nhật.
   * Message này hiển thị ở Step 3 confirm để admin biết evaluation record
   * của user này được giữ nguyên một cách có chủ đích.
   */
  public static readonly textOption2CrossBoundaryLevel =
    '・【ユーザ管理】等級が変わる。' +
    '\n' +
    '・目標設定時の内容：' +
    '\n' +
    '①等級グループが変わるため（1～7 ↔ 8～10）、このオプションは目標設定に適用できません。' +
    '\n' +
    '②目標レコードは変更されません（等級のみ更新）。' +
    '\n' +
    '③目標内容を変更したい場合は「今期目標を作り直す」を使用してください。' +
    '\n';

  public static readonly textOptional1_ChangeAnyThing_AfterFix =
    '・目標設定時の内容：①等級、②目標状態、③行動・情意、基本スキル（ある場合）、④専門スキル（ある場合）、⑤部門目標（ある場合）、個人目標が変わらない。' +
    '\n' +
    '\n' +
    '変更を期初の目標に反映したい場合、例外設定を行う。' +
    '\n' +
    '・期初の目標レコード：等級・所属・スキルあり/なしを変更できない。' +
    '\n' +
    '・等級・所属・スキルあり/なし変更後の目標レコードを追加して、目標設定を行って被評価者にやってもらう。';
  '\n';
}
//+ ''+ '\n'
