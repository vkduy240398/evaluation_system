// Shared pure utility functions for ModalEditUser and ModalEditUserFromDetail wizard

export const safeCompare = (val1: any, val2: any): boolean => String(val1 ?? '') === String(val2 ?? '');

// 課名 (department) is only mandatory when 等級 (level) actually holds a value on the
// personal-goal track (1–7). A blank level — undefined / null / '' — or the multi-user
// "更新しない" sentinel leaves it optional. Guarded explicitly because Number(null) and
// Number('') both coerce to 0, which would otherwise read as "level 0 → required".
export const isDepartmentRequired = (levelValue: any): boolean => {
  if (levelValue === undefined || levelValue === null || levelValue === '') return false;
  const level = Number(levelValue);
  return !Number.isNaN(level) && level < 8;
};

export const parseUserInfoChange = (text: string): Array<{ field: string; before: string; after: string }> => {
  if (!text?.trim()) return [];
  const rows: Array<{ field: string; before: string; after: string }> = [];
  for (const line of text.split('\n').filter((l) => l.trim())) {
    const colonIdx = line.indexOf(': ');
    if (colonIdx === -1) continue;
    const field = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 2).trim();
    if (value === '変更しない') continue; // field left unchanged for this user — nothing to confirm
    if (value.includes(' → ')) {
      const [before, ...rest] = value.split(' → ');
      rows.push({ field, before: before.trim(), after: rest.join(' → ').trim() });
    } else if (value.includes('が取り消されます')) {
      rows.push({ field, before: value.replace('が取り消されます。', '').trim(), after: '（取り消し）' });
    } else {
      rows.push({ field, before: value, after: '' });
    }
  }
  return rows;
};

// 【ユーザ管理】 line is derived from the fields that actually changed in userInforChange
// (i.e. the rows produced by parseUserInfoChange), not from the evaluation text:
// 部署名 / 課名 both collapse into the single keyword 所属, 等級 and スキル評価 keep their own.
// Order follows the server wording (等級 → 所属 → スキル), e.g. 部署名 + スキル → 「所属、スキルが変わる。」
const USER_MANAGEMENT_KEYWORDS: Array<{ fields: string[]; keyword: string }> = [
  { fields: ['等級'], keyword: '等級' },
  { fields: ['部署名', '課名'], keyword: '所属' },
  { fields: ['スキル評価'], keyword: 'スキル' },
];

export const getUserManagementChangeText = (infoRows: Array<{ field: string }>): string => {
  const changedFields = new Set(infoRows.map((row) => row.field.trim()));
  const keywords = USER_MANAGEMENT_KEYWORDS.filter(({ fields }) =>
    fields.some((field) => changedFields.has(field)),
  ).map(({ keyword }) => keyword);

  // No changed field at all → caller shows the "変更情報がありません。" placeholder
  return keywords.length > 0 ? `${keywords.join('、')}が変わる。` : '';
};

export const parseEvaluationChange = (text: string) => {
  const empty = { userManagement: [] as string[], goalSetting: [] as string[], proposal: [] as string[] };
  if (!text?.trim()) return empty;

  // Split by blank line first: first block = user mgmt + goal setting, rest = proposal
  const sections = text.split(/\n[ \t]*\n/);

  const userManagement: string[] = [];
  const goalSetting: string[] = [];

  for (const line of sections[0].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.includes('【ユーザ管理】') || trimmed.includes('目標設定時の内容：')) {
      const content = trimmed
        .replace(/^・?【ユーザ管理】/, '')
        .replace(/^・?目標設定時の内容：/, '')
        .trim();

      if (content) {
        userManagement.push(content);
      }
    } else if (trimmed !== '・目標設定時の内容：') {
      goalSetting.push(trimmed);
    }
  }

  const proposal = sections
    .slice(1)
    .join('\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l);

  return { userManagement, goalSetting, proposal };
};

export const getUserDisplayName = (fullName: string): string => {
  const idx = fullName.indexOf(': ');
  return idx !== -1 ? fullName.substring(idx + 2) : fullName;
};

const CHANGE_TYPE_FIELD_MAP: Array<{ field: string; labelKey: string }> = [
  { field: '等級', labelKey: 'MODAL_EDIT_USER.IDS_CHANGE_TYPE_LEVEL' },
  { field: '会社', labelKey: 'MODAL_EDIT_USER.IDS_CHANGE_TYPE_COMPANY' },
  { field: '部署名', labelKey: 'MODAL_EDIT_USER.IDS_CHANGE_TYPE_DEPARTMENT' },
  { field: '課名', labelKey: 'MODAL_EDIT_USER.IDS_CHANGE_TYPE_SECTION' },
  { field: 'スキル評価', labelKey: 'MODAL_EDIT_USER.IDS_CHANGE_TYPE_SKILL' },
];

export const getChangeTypeLabel = (userInforChange: string, t: (key: string) => string): string => {
  const noChangeText = '変更しない';

  // Each line is "field: value" — only count a field as changed when its value isn't the "no update" sentinel
  const changedFields = new Set(
    userInforChange
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.endsWith(noChangeText))
      .map((line) => line.substring(0, line.indexOf(':')).trim()),
  );

  return CHANGE_TYPE_FIELD_MAP.filter(({ field }) => changedFields.has(field))
    .map(({ labelKey }) => t(labelKey))
    .join('、');
};
