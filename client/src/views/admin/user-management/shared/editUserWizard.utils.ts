// Shared pure utility functions for ModalEditUser and ModalEditUserFromDetail wizard

export const safeCompare = (val1: any, val2: any): boolean => String(val1 ?? '') === String(val2 ?? '');

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
    if (trimmed.includes('【ユーザ管理】')) {
      const content = trimmed.replace(/^・?【ユーザ管理】/, '').trim();
      if (content) userManagement.push(content);
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
