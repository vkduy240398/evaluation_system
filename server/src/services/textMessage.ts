export class TextMessage {
  public static readonly textDeleteDepartment = 'が取り消されます。';
  public static readonly textNoChangeUserEvaluation =
    //'選択したオプションは、当ユーザの情報と一致しないため、適用できません。ユーザー詳細画面で情報を編集してください。';
    '変更情報がありません。';

  public static readonly textTitleLevel = '等級';
  public static readonly textTitleDepDiv = '所属';
  public static readonly textTitleSkill = 'スキル';
  public static readonly textItemChanged = "・【ユーザ管理】の{item}が変わる。\n";

  public static readonly textOnlyResetBehavior17 =
    '・【ユーザ管理】の等級が変わる。' +
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
    '・【ユーザ管理】の等級が変わる。' +
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
    '・【ユーザ管理】の等級が変わる。' +
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
    '・【ユーザ管理】の等級が変わる。' +
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
    '・目標設定時の内容：①等級、②目標状態、③行動・情意、基本スキル（ある場合）、④専門スキル（ある場合）、⑤部門目標（ある場合）、個人目標が変わらない。' +
    '\n' +
    '\n' +
    '⇒（1）変更を期初の目標に反映したい場合、例外設定のケースとして追加する。' +
    '\n' +
    '・期初の目標レコード：等級・所属・スキルあり/なしを変更する。目標期間が必須ではない。' +
    '\n' +
    ' →目標レコードが１つ' +
    '\n' +
    '\n' +
    '（2）複数の目標レコードを作成する場合、例外設定を行う。' +
    '\n' +
    '・期初の目標レコードに加えて、等級・所属・スキルあり/なし変更後の目標レコードを追加して、目標設定を行って被評価者にやってもらう。' +
    '\n' +
    '→目標レコードが2つ以上' +
    '\n';
  /**end */

  /**
   * Trong thời gian đặt mục tiêu & Sau khi fix +Ngoài thời gian đặt mục tiêu & Sau khi fix
   */
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
