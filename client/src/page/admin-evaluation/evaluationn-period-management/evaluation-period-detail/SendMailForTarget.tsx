import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Button,
  Input,
  Tag,
  Space,
  message,
  Spin,
  Typography,
  DatePicker,
  Tooltip,
  Select,
  Cascader,
} from 'antd';
import {
  SendOutlined,
  ClockCircleOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckOutlined,
  DeleteOutlined,
  PlusOutlined,
  DashOutlined,
  MoreOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import TokenBlot from '../../../admin/mail-management/mail-manage-tab/quill/TokenBlot';
import TokenDrop, { TOKEN_MODULE_NAME } from '../../../admin/mail-management/mail-manage-tab/quill/TokenDrop';
import insertToken from '../../../admin/mail-management/mail-manage-tab/quill/insertToken';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'react-quill/dist/quill.snow.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '../../../admin/mail-management/mail-manage-tab/quill/token.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './SendMailForTarget.css';
import httpAxios from '../../../../common/http';
import { useAuth } from '../../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import parse from 'html-react-parser';
import { TOKENS as MAIL_TOKENS } from '../../../admin/mail-management/mail-manage-tab/mailTokens';
import { t } from 'i18next';

// ── Quill registration (idempotent) ──────────────────────────────
const Size = Quill.import('attributors/style/size') as any;
Size.whitelist = ['0.75em', '1em', '1.5em', '2.5em'];
try {
  Quill.register(Size, true);
} catch {
  /* noop */
}
try {
  Quill.register('modules/magicUrl', MagicUrl);
} catch {
  /* noop */
}
try {
  Quill.register(TokenBlot);
} catch {
  /* noop */
}
try {
  Quill.register(`modules/${TOKEN_MODULE_NAME}`, TokenDrop);
} catch {
  /* noop */
}

const EDITOR_CONFIG = {
  formats: [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'align',
    'script',
    'link',
    TokenBlot.blotName,
  ],
  modules: {
    magicUrl: true,
    toolbar: [
      [{ size: ['0.75em', false, '1.5em', '2.5em'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
    ],
    [TOKEN_MODULE_NAME]: true,
  },
  theme: 'snow',
};

// ── Constants ─────────────────────────────────────────────────────
const TOKEN_RE = /\{\{(\w+)\}\}/gi;
const ICON_COLOR = '#00796B';
const STRIP_BG = '#F8FAFC';
const STRIP_BORDER = '#E8ECF0';
const PROTECTED_EMAIL = 'gnw-legal@geonet.co.jp';
const FONT_SIZE = 14;

const tokensToHtml = (text: string, bySlug: Record<string, any>): string =>
  text.replace(TOKEN_RE, (_m, slug) => {
    const tk = bySlug[slug];
    if (!tk) return _m;
    return `<span class="token" contenteditable="false" data-title="{{${slug}}}" data-slug="${slug}" data-id="${tk.id}">{{${slug}}}</span>`;
  });

const htmlToTokens = (html: string): string => {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  dom.querySelectorAll('.token').forEach((el) => {
    el.replaceWith(`{{${(el as HTMLElement).dataset.slug ?? ''}}}`);
  });
  return dom.body.innerHTML
    .replaceAll('</p><p><br></p><p>', '<br><br>')
    .replace(/<\/p><p>/g, '<br>')
    .replace(/<\/?p>/g, '');
};

// Backend EmailType → TemplateMailId mapping (actual IDs from server):
//   EmailType.EXCEPTION_GOAL_SETTING_PERIOD=5  → TemplateMailId.EXCEPTION_GOAL_SETTING=6
//   EmailType.EXCEPTION_EVALUATION_PERIOD=6    → TemplateMailId.EXCEPTION_EVALUATION_SETTING=13
//   EmailType.USER_GOAL_SETTING_PERIOD=7       → TemplateMailId.COMMON_GOAL_SETTING=5
//   EmailType.USER_EVALUATION_PERIOD=8         → TemplateMailId.COMMON_EVALUATION_SETTING=12
const LEVEL_TEMPLATE_MAP: Record<number, { mailTypeKey: string; templateId: number }> = {
  5: { mailTypeKey: 'goal', templateId: 6 },
  6: { mailTypeKey: 'evaluation', templateId: 13 },
  7: { mailTypeKey: 'goal', templateId: 5 },
  8: { mailTypeKey: 'evaluation', templateId: 12 },
};

interface TokenDef {
  label: string;
  slug: string;
  id: number;
  note: string;
}

const ALL_TOKEN_REGISTRY: Record<string, { label: string; id: number; note: string }> = {
  evaluationYear: { label: '評価年度', id: 1, note: 'キーワード：{{evaluationYear}}\nフォーマット：YYYY\n例）2024' },
  evaluationPeriod: {
    label: '上期 or 下期',
    id: 2,
    note: 'キーワード：{{evaluationPeriod}}\nフォーマット：上期または下期\n例）上期',
  },
  evaluateeName: { label: '被評価者の氏名', id: 3, note: 'キーワード：{{evaluateeName}}\n例）山田 太郎' },
  evaluationType: {
    label: '目標 or 評価',
    id: 4,
    note: 'キーワード：{{evaluationType}}\nフォーマット：目標または評価\n例）目標',
  },
  departmentName: { label: '所属部署', id: 5, note: 'キーワード：{{departmentName}}\n例）コーポレート部' },
  rejecter: { label: '差戻元の氏名', id: 6, note: 'キーワード：{{rejecter}}\n例）山田 太郎' },
  rejectee: { label: '差戻先', id: 7, note: 'キーワード：{{rejectee}}\n例）山田 太郎' },
  periodStartMonth: {
    label: '評価期間の開始月',
    id: 8,
    note: 'キーワード：{{periodStartMonth}}\nフォーマット：YYYY/M\n例）2024/4',
  },
  periodEndMonth: {
    label: '評価期間の終了月',
    id: 9,
    note: 'キーワード：{{periodEndMonth}}\nフォーマット：YYYY/M\n例）2024/9',
  },
  loginUrl: { label: 'ログイン画面URL', id: 10, note: 'キーワード：{{loginUrl}}\n例）https://10.0.0.0/login' },
  detailUrl: { label: '該当詳細画面URL', id: 11, note: 'キーワード：{{detailUrl}}\n例）https://10.0.0.0/evaluation/' },
  evaluatorName: { label: '評価者の氏名', id: 20, note: 'キーワード：{{evaluatorName}}\n例）山田 太郎' },
  proskillName: {
    label: '専門スキルのテンプレート名',
    id: 21,
    note: 'キーワード：{{proskillName}}\n例）情報システム部共通',
  },
  versionProskill: { label: '専門スキルのバージョン', id: 22, note: 'キーワード：{{versionProskill}}\n例）1.0' },
  proskillCreatorName: {
    label: '専門スキル設定者の氏名',
    id: 23,
    note: 'キーワード：{{proskillCreatorName}}\n例）山田 太郎',
  },
  periodFirstDate: {
    label: '評価期間の1日',
    id: 24,
    note: 'キーワード：{{periodFirstDate}}\n上期：YYYY年4月1日\n下期：YYYY年10月1日\n例）2024年4月1日',
  },
  periodMonth: {
    label: '今期の終了月',
    id: 25,
    note: 'キーワード：{{periodMonth}}\n上期：YYYY年9月\n下期：YYYY年3月\n例）2024年9月',
  },
  periodSecondDate: {
    label: '評価期間の2日',
    id: 26,
    note: 'キーワード：{{periodSecondDate}}\n上期：YYYY年10月2日\n下期：YYYY年4月2日\n例）2024年10月2日',
  },
  secondPeriodMonth: {
    label: '前期の終了月',
    id: 27,
    note: 'キーワード：{{secondPeriodMonth}}\n上期：YYYY年3月\n下期：YYYY年9月\n例）2024年3月',
  },
  goalCreateStartDate: {
    label: '目標設定開始日',
    id: 28,
    note: 'キーワード：{{goalCreateStartDate}}\nフォーマット：YYYY/M/D\n例）2024/4/1',
  },
  goalCreateEndDate: {
    label: '目標設定終了日',
    id: 29,
    note: 'キーワード：{{goalCreateEndDate}}\nフォーマット：YYYY/M/D\n例）2024/4/15',
  },
  evaluationStartDate: {
    label: '評価開始日',
    id: 30,
    note: 'キーワード：{{evaluationStartDate}}\nフォーマット：YYYY/M/D\n例）2024/4/1',
  },
  evaluationEndDate: {
    label: '評価終了日',
    id: 31,
    note: 'キーワード：{{evaluationEndDate}}\nフォーマット：YYYY/M/D\n例）2024/4/15',
  },
  toUser: { label: '被評価者へ', id: 36, note: 'キーワード：{{toUser}}\nフォーマット：{{toUser}}さん\n例）長谷川さん' },
  ccEvaluator: {
    label: '評価者へ',
    id: 37,
    note: 'キーワード：{{ccEvaluator}}\nフォーマット：{{ccEvaluator}}さん\n例）後藤さん、桑原さん',
  },
  companyName: { label: '会社名', id: 39, note: 'キーワード：{{companyName}}\n例）GEO Holdings' },
  userName: { label: '被評価者', id: 43, note: 'キーワード：{{userName}}\n例）手嶋 兼次' },
  divisionName: { label: '部署', id: 44, note: 'キーワード：{{divisionName}}\n例）グローバルシステム管理部' },
  level: { label: '等級', id: 45, note: 'キーワード：{{level}}\n例）2' },
};

// ── StripRow ──────────────────────────────────────────────────────
const StripRow: React.FC<{
  label: string;
  action?: React.ReactNode;
  noBorder?: boolean;
  alignItems?: 'center' | 'flex-start';
  children: React.ReactNode;
}> = ({ label, action, noBorder, alignItems = 'center', children }) => (
  <div
    style={{
      display: 'flex',
      alignItems,
      gap: 0,
      borderBottom: noBorder ? 'none' : `1px solid ${STRIP_BORDER}`,
      minHeight: 44,
    }}
  >
    <div
      style={{
        width: 56,
        flexShrink: 0,
        display: 'flex',
        alignItems: alignItems === 'center' ? 'center' : 'flex-start',
        paddingTop: alignItems === 'flex-start' ? 12 : 0,
        paddingLeft: 14,
        fontSize: FONT_SIZE,
        fontWeight: 700,
        color: '#374151',
        letterSpacing: '0.02em',
        borderRight: `1px solid ${STRIP_BORDER}`,
        alignSelf: 'stretch',
        background: '#EEF1F5',
      }}
    >
      {label}
    </div>
    <div style={{ flex: 1, minWidth: 0, padding: '5px' }}>{children}</div>
    {action && (
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          paddingRight: 14,
          gap: 6,
          alignSelf: 'stretch',
          borderLeft: `1px solid ${STRIP_BORDER}`,
          paddingLeft: 12,
        }}
      >
        {action}
      </div>
    )}
  </div>
);

// ── Props ─────────────────────────────────────────────────────────
interface SendMailForTargetProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  isScheduled?: boolean;
  levelType?: 5 | 6 | 7 | 8;
  routeYear?: string | number;
  routePeriodIndex?: string | number;
  periodId?: number;
  userEmail?: string;
  evaluatorEmails?: {
    evaluator05Email?: string;
    evaluator10Email?: string;
    evaluator20Email?: string;
  };
}

// ── Component ─────────────────────────────────────────────────────
const SendMailForTarget: React.FC<SendMailForTargetProps> = ({
  isModalOpen,
  setIsModalOpen,
  isScheduled = false,
  levelType = 7,
  routeYear,
  routePeriodIndex,
  periodId,
  userEmail,
  evaluatorEmails,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(null);
  const [dateError, setDateError] = useState(false);
  const [toEmail, setToEmail] = useState<string>('');
  const [ccEmails, setCCEmails] = useState<string[]>([]);

  // 宛先一覧 modal state
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [tempCCEmails, setTempCCEmails] = useState<string[]>([]);
  const [ccEmailsToAdd, setCCEmailsToAdd] = useState<string[]>([]);
  const [usersEmailList, setUsersEmailList] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingEmailList, setIsLoadingEmailList] = useState(false);

  const [viewSubject, setViewSubject] = useState('');
  const [viewBody, setViewBody] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const quillRef = useRef<any>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const subjectInputRef = useRef<any>(null);
  const [activeField, setActiveField] = useState<'subject' | 'body'>('body');

  const periodLabel = String(routePeriodIndex) === '1' ? '上期' : '下期';
  const { templateId: defaultTemplateId } = LEVEL_TEMPLATE_MAP[levelType] ?? LEVEL_TEMPLATE_MAP[7];
  // 変数バー: templateId の listTemplate に基づいてフィルタ (EditMailTemplateScreen と同じロジック)
  const tokens = useMemo(
    () =>
      MAIL_TOKENS.filter((t) => t.listTemplate.includes(defaultTemplateId)).map((t) => ({
        label: t.title,
        slug: t.slug,
        id: t.id,
        note: t.note,
      })),
    [defaultTemplateId],
  );

  const tokensById = useMemo(() => {
    const m: Record<string, any> = {};
    Object.entries(ALL_TOKEN_REGISTRY).forEach(([slug, tk]) => {
      m[slug] = { ...tk, slug };
    });
    return m;
  }, []);

  // Initialize TO/CC when modal opens
  useEffect(() => {
    if (!isModalOpen) return;
    setToEmail(userEmail || '');
    const cc: string[] = [PROTECTED_EMAIL];
    if (evaluatorEmails?.evaluator20Email) cc.push(evaluatorEmails.evaluator20Email);
    if (evaluatorEmails?.evaluator10Email) cc.push(evaluatorEmails.evaluator10Email);
    if (evaluatorEmails?.evaluator05Email) cc.push(evaluatorEmails.evaluator05Email);
    setCCEmails(cc);
  }, [isModalOpen, userEmail, evaluatorEmails]);

  const resolveSubject = useCallback(
    (raw: string) =>
      raw
        .replace(/\{\{evaluationYear\}\}/gi, String(routeYear ?? ''))
        .replace(/\{\{evaluationPeriod\}\}/gi, periodLabel),
    [routeYear, periodLabel],
  );

  // Tokens that the server replaces at send time — keep as-is on the frontend
  const SERVER_SIDE_TOKENS = new Set(['toUser', 'ccEvaluator']);

  const resolveAllTokens = useCallback(
    (text: string): string => {
      const realValues: Record<string, string> = {
        evaluationYear: String(routeYear ?? ''),
        evaluationPeriod: periodLabel,
        loginUrl: `${window.location.origin}/login`,
        periodFirstDate: periodLabel === '上期' ? `${routeYear}年4月1日` : `${routeYear}年10月1日`,
        periodMonth: periodLabel === '上期' ? `${routeYear}年9月` : `${routeYear}年3月`,
        periodSecondDate: periodLabel === '上期' ? `${routeYear}年10月2日` : `${routeYear}年4月2日`,
        secondPeriodMonth: periodLabel === '上期' ? `${routeYear}年3月` : `${routeYear}年9月`,
      };
      return text.replace(TOKEN_RE, (_m, slug) => {
        if (SERVER_SIDE_TOKENS.has(slug)) return _m;
        if (realValues[slug] !== undefined) return realValues[slug];
        const registry = ALL_TOKEN_REGISTRY[slug];
        if (registry) {
          const examplePart = registry.note.split('例）')[1];
          if (examplePart) return examplePart.split('\n')[0];
        }
        return _m;
      });
    },
    [routeYear, periodLabel],
  );

  const handleAfterClose = useCallback(() => {
    quillRef.current = null;
    setIsEditing(false);
    setIsPreview(false);
    setScheduledDate(null);
    setDateError(false);
    setViewSubject('');
    setViewBody('');
    setEditSubject('');
    setEditBody('');
    setTemplateId(null);
    setTemplateName('');
    setPreviewSubject('');
    setPreviewContent('');
    setToEmail('');
    setCCEmails([]);
    setTempCCEmails([]);
    setCCEmailsToAdd([]);
    setUsersEmailList([]);
  }, []);

  useEffect(() => {
    if (!isModalOpen || !viewBody || quillRef.current) return;
    const t = setTimeout(() => {
      const container = editorDivRef.current;
      if (!container || quillRef.current) return;
      container.innerHTML = tokensToHtml(viewBody, tokensById);
      const q = new Quill(container, EDITOR_CONFIG) as any;
      q.enable(false);
      quillRef.current = q;
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, viewBody]);

  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(isEditing);
  }, [isEditing]);

  const loadData = useCallback(async () => {
    if (!routeYear || !routePeriodIndex) return;
    setIsLoading(true);
    try {
      const [mailRes, tplRes]: any[] = await Promise.all([
        httpAxios.Get(
          `/api/v1/f5/management-evaluation-history/get-to-email-list/${levelType}/${routeYear}/${routePeriodIndex}`,
        ),
        httpAxios.Get('/api/v1/f7/management-evaluation-setting/mail-template-list-by-id', {
          params: { id: defaultTemplateId },
        }),
      ]);

      if (mailRes?.status === 200) {
        const d = mailRes.data;
        setViewSubject(resolveSubject(d?.title ?? ''));
        setViewBody(d?.content ?? '');
      }

      const tpl = tplRes?.status === 200 ? tplRes.data : null;
      if (tpl) {
        setTemplateId(tpl.id ?? defaultTemplateId);
        setTemplateName(tpl.name ?? '');
        setEditSubject(tpl.subject ?? '');
        setEditBody(tpl.content ?? '');
      }
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, [routeYear, routePeriodIndex, levelType, defaultTemplateId, resolveSubject]);

  useEffect(() => {
    if (isModalOpen) loadData();
  }, [isModalOpen, loadData]);

  const handleInsertToken = useCallback(
    (tk: TokenDef) => {
      if (activeField === 'subject') {
        const input = subjectInputRef.current?.input as HTMLInputElement | null;
        if (input) {
          const start = input.selectionStart ?? editSubject.length;
          const end = input.selectionEnd ?? editSubject.length;
          const token = `{{${tk.slug}}}`;
          const newVal = editSubject.slice(0, start) + token + editSubject.slice(end);
          setEditSubject(newVal);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + token.length, start + token.length);
          }, 0);
        }
      } else {
        if (!quillRef.current) return;
        insertToken(quillRef.current, { title: tk.label, slug: tk.slug, id: tk.id }, 'nor');
      }
    },
    [activeField, editSubject],
  );

  const enterEdit = useCallback(() => {
    if (quillRef.current) {
      quillRef.current.enable(true);
      const contentToLoad = editBody || viewBody;
      quillRef.current.clipboard.dangerouslyPasteHTML(tokensToHtml(contentToLoad, tokensById));
    }
    setIsEditing(true);
    setIsPreview(false);
    setActiveField('body');
  }, [editBody, viewBody, tokensById]);

  const cancelEdit = useCallback(() => {
    if (quillRef.current) {
      quillRef.current.clipboard.dangerouslyPasteHTML(tokensToHtml(viewBody, tokensById));
      quillRef.current.enable(false);
    }
    setIsEditing(false);
    setIsPreview(false);
  }, [viewBody, tokensById]);

  const handleTogglePreview = useCallback(() => {
    setIsPreview((v) => {
      if (!v) {
        const rawBody = quillRef.current
          ? htmlToTokens(quillRef.current.root.innerHTML)
          : isEditing
          ? editBody
          : viewBody;
        setPreviewSubject(resolveAllTokens(isEditing ? editSubject : viewSubject));
        setPreviewContent(resolveAllTokens(rawBody));
      }
      return !v;
    });
  }, [isEditing, editBody, viewBody, editSubject, viewSubject, resolveAllTokens]);

  const handleSaveEdit = useCallback(async () => {
    if (!templateId) return;
    setIsSavingTemplate(true);
    try {
      const rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : editBody;
      const res: any = await httpAxios.Put('/api/v1/f7/management-evaluation-setting/edit-mail-template', {
        id: templateId,
        name: templateName,
        subject: editSubject,
        content: rawBody,
      });
      if (res?.status === 200 || res?.status === 201) {
        setEditBody(rawBody);
        const resolvedSubject = resolveAllTokens(editSubject);
        const resolvedBody = resolveAllTokens(rawBody);
        setViewSubject(resolvedSubject);
        setViewBody(resolvedBody);
        if (quillRef.current) {
          quillRef.current.clipboard.dangerouslyPasteHTML(resolvedBody);
          quillRef.current.enable(false);
        }
        setIsEditing(false);
        setIsPreview(false);
        message.success(t('IDS_TEMPLATE_SAVE_SUCCESS'));
      } else {
        message.error(t('IDS_SAVE_FAILED'));
      }
    } catch {
      message.error(t('IDS_SAVE_FAILED'));
    } finally {
      setIsSavingTemplate(false);
    }
  }, [templateId, templateName, editSubject, editBody, resolveAllTokens]);

  const executeSend = useCallback(async () => {
    setIsSending(true);
    try {
      let rawBody: string;
      let currentSubject: string;
      if (isEditing) {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : editBody;
        currentSubject = resolveAllTokens(editSubject);
      } else {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : viewBody;
        currentSubject = resolveAllTokens(viewSubject);
      }
      const currentBody = resolveAllTokens(rawBody);
      const allEmails = [toEmail, ...ccEmails].filter(Boolean);
      const ccEmailStr = ccEmails.filter(Boolean).join(';');

      let result: any;
      if (isScheduled) {
        result = await httpAxios.Post('/api/v1/f5/management-evaluation-history/save-mail-template', {
          evaluationPeriodId: periodId ?? 0,
          status: 0,
          type: levelType,
          sendTimeSetting: scheduledDate?.format('YYYY/MM/DD') ?? null,
          title: currentSubject,
          contentMail: currentBody,
          mailTo: allEmails.join(','),
          mailToObjList: allEmails,
          dataMailCCs: toEmail ? [{ user: toEmail, evaluators: ccEmails.filter(Boolean) }] : [],
        });
      } else {
        result = await httpAxios.Post('/api/v1/f5/management-evaluation-history/send-mail-now', {
          content: {
            toEmails: toEmail,
            ccEmails: ccEmailStr,
            mailContent: { subject: currentSubject, editor: currentBody },
          },
          inputedValues: {
            evaluationPeriodId: periodId ?? 0,
            status: 1,
            type: levelType,
            sendTimeSetting: null,
            sendTimeActual: dayjs().format('YYYY/M/D H:mm'),
            title: currentSubject,
            contentMail: currentBody,
            mailTo: allEmails.join(','),
            mailToObjList: allEmails,
            dataMailCCs: toEmail ? [{ user: toEmail, evaluators: ccEmails.filter(Boolean) }] : [],
          },
        });
      }

      if (result?.status === 201) {
        message.success(isScheduled ? t('MESSAGE.COMMON.IDM_SAVE_SUCCESS') : t('MESSAGE.COMMON.IDM_SEND_MAIL_SUCCESS'));
        setIsModalOpen(false);
      } else {
        message.error(isScheduled ? t('IDS_SCHEDULED_SEND_ERROR') : t('IDS_SEND_FAILED'));
      }
    } catch {
      message.error(isScheduled ? t('IDS_SCHEDULED_SEND_ERROR') : t('IDS_SEND_FAILED'));
    } finally {
      setIsSending(false);
    }
  }, [
    isScheduled,
    scheduledDate,
    isEditing,
    editBody,
    viewBody,
    editSubject,
    viewSubject,
    toEmail,
    ccEmails,
    periodId,
    levelType,
    resolveAllTokens,
    setIsModalOpen,
  ]);

  const handleSend = useCallback(() => {
    if (isScheduled && !scheduledDate) {
      setDateError(true);
      return;
    }
    executeSend();
  }, [isScheduled, scheduledDate, executeSend]);

  const handleTestSend = useCallback(async () => {
    const selfEmail = user?.email;
    if (!selfEmail) {
      message.warning('テスト送信するメールアドレスが見つかりません');
      return;
    }
    setIsSendingTest(true);
    try {
      let rawBody: string;
      let currentSubject: string;
      if (isEditing) {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : editBody;
        currentSubject = resolveAllTokens(editSubject);
      } else {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : viewBody;
        currentSubject = resolveAllTokens(viewSubject);
      }
      const currentBody = resolveAllTokens(rawBody);
      const result: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/send-mail-now', {
        content: { toEmails: selfEmail, mailContent: { subject: currentSubject, editor: currentBody } },
        inputedValues: {
          evaluationPeriodId: periodId ?? 0,
          status: 1,
          type: levelType,
          sendTimeSetting: null,
          sendTimeActual: dayjs().format('YYYY/M/D H:mm'),
          title: currentSubject,
          contentMail: currentBody,
          mailTo: selfEmail,
          mailToObjList: [selfEmail],
        },
      });
      if (result?.status === 201) {
        message.success(`テストメールを ${selfEmail} に送信しました`);
      } else {
        message.error('テスト送信に失敗しました');
      }
    } catch {
      message.error('テスト送信に失敗しました');
    } finally {
      setIsSendingTest(false);
    }
  }, [isEditing, editBody, viewBody, editSubject, viewSubject, resolveAllTokens, periodId, levelType, user]);

  // ── 宛先一覧 modal ────────────────────────────────────────────
  const openRecipientModal = useCallback(async () => {
    setTempCCEmails([...ccEmails]);
    setCCEmailsToAdd([]);
    setIsRecipientModalOpen(true);
    setIsLoadingEmailList(true);
    try {
      const currentEmails = [toEmail, ...ccEmails].filter(Boolean);
      const res = await httpAxios.Post('/api/v1/f5/management-evaluation-history/users-email-list', {
        conditions: JSON.stringify(currentEmails),
      });
      if (res?.status === 200 || res?.status === 201) {
        const list = Array.isArray(res.data) ? res.data : [];
        setUsersEmailList(
          list.map((item: any) => {
            const email = typeof item === 'string' ? item : item?.email ?? item?.fullName ?? '';
            return { label: email, value: email };
          }),
        );
      }
    } catch {
      /* silent */
    } finally {
      setIsLoadingEmailList(false);
    }
  }, [toEmail, ccEmails]);

  const confirmRecipientSelection = useCallback(() => {
    const merged = [...tempCCEmails];
    if (ccEmailsToAdd.length > 0) {
      const existing = new Set(merged);
      ccEmailsToAdd.filter((e) => !existing.has(e)).forEach((e) => merged.push(e));
    }
    setCCEmails(merged);
    setIsRecipientModalOpen(false);
  }, [tempCCEmails, ccEmailsToAdd]);

  const removeTempCC = useCallback((email: string) => {
    setTempCCEmails((p) => p.filter((e) => e !== email));
  }, []);

  const addCCEmailsToList = useCallback(() => {
    if (ccEmailsToAdd.length === 0) return;
    setTempCCEmails((p) => {
      const existing = new Set(p);
      return [...p, ...ccEmailsToAdd.filter((e) => !existing.has(e))];
    });
    setCCEmailsToAdd([]);
  }, [ccEmailsToAdd]);

  const quillCssOverride = useMemo(
    () => (
      <style>
        {!isEditing
          ? `.target-mail-quill .ql-toolbar{display:none!important}.target-mail-quill .ql-container{border:none!important}`
          : `.target-mail-quill .ql-toolbar.ql-snow{border:none!important;border-bottom:1px solid #e2e8f0!important;border-radius:0!important}.target-mail-quill .ql-container.ql-snow{border:none!important}`}
      </style>
    ),
    [isEditing],
  );

  return (
    <>
      {/* ══════════════════════ Main Modal ══════════════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        title={
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              paddingBottom: 10,
              borderBottom: '1px solid #F0F0F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MailOutlined style={{ color: ICON_COLOR }} />
            {t('IDS_SEND_MAIL')}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        afterClose={handleAfterClose}
        width={900}
        destroyOnClose
        footer={null}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
        style={{ top: 60 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 170px)' }}>
          {/* ── Scrollable content ─────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 24px', minHeight: 0 }}>
            <Spin spinning={isLoading} tip={t('IDS_LOADING')} size="small">
              {/* ═══════════ HEADER STRIP ═══════════ */}
              <div
                style={{
                  background: STRIP_BG,
                  border: `1px solid ${STRIP_BORDER}`,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                {/* ── 宛先 (TO) ─────────────────────────────────── */}
                <StripRow label={t('IDS_MAIL_TO')} alignItems="center">
                  {toEmail ? (
                    <Cascader
                      options={[{ label: toEmail, value: toEmail }]}
                      multiple
                      disabled
                      maxTagCount="responsive"
                      value={[[toEmail]]}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <Typography.Text type="secondary" style={{ fontSize: FONT_SIZE }}>
                      {t('IDS_NO_RECIPIENT')}
                    </Typography.Text>
                  )}
                </StripRow>

                {/* ── CC ──────────────────────────────────────────── */}
                <StripRow
                  label={t('IDS_CC_LABEL')}
                  alignItems="center"
                  noBorder
                  action={
                    <Tooltip title={t('IDS_CC_EDIT_TOOLTIP')}>
                      <Button size="small" icon={<EllipsisOutlined />} onClick={openRecipientModal} />
                    </Tooltip>
                  }
                >
                  {ccEmails.length === 0 ? (
                    <Typography.Text type="secondary" style={{ fontSize: FONT_SIZE }}>
                      {t('IDS_CC_NO')}
                    </Typography.Text>
                  ) : (
                    <Cascader
                      options={ccEmails.map((email) => ({ label: email, value: email }))}
                      multiple
                      disabled
                      maxTagCount="responsive"
                      value={ccEmails.map((email) => [email])}
                      style={{ width: '100%' }}
                    />
                  )}
                </StripRow>

                {/* ── 送信予定日時（後で送信のみ）────────────────────── */}
                {isScheduled && (
                  <StripRow label={t('IDS_DATE_TIME')}>
                    <Space size={8}>
                      <DatePicker
                        value={scheduledDate}
                        onChange={(d) => {
                          setScheduledDate(d);
                          if (d) setDateError(false);
                        }}
                        format="YYYY/MM/DD"
                        placeholder={t('IDS_DATE_SCHEDULED_PLACEHOLDER').toString()}
                        disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                        style={{ width: 200 }}
                        status={dateError ? 'error' : undefined}
                        suffixIcon={<CalendarOutlined />}
                      />
                      {dateError && (
                        <Typography.Text type="danger" style={{ fontSize: FONT_SIZE }}>
                          {t('IDS_DATE_REQUIRED')}
                        </Typography.Text>
                      )}
                    </Space>
                  </StripRow>
                )}
              </div>

              {/* ═══════════ EDIT / VIEW SECTION ═════════════════════ */}
              {!isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '0px 0 10px' }}>
                  <Button type="primary" icon={<EditOutlined />} size="middle" onClick={enterEdit}>
                    {t('IDS_MAIL_CONTENT_EDIT')}
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, margin: '0px 0 4px' }}>
                  <Button type="primary" size="middle" loading={isSavingTemplate} onClick={handleSaveEdit}>
                    {t('IDS_BUTTON_SAVE')}
                  </Button>
                  <Button size="middle" onClick={cancelEdit} disabled={isSavingTemplate}>
                    {t('IDS_BUTTON_CANCEL')}
                  </Button>
                </div>
              )}

              {!isEditing && (
                <div style={{ background: STRIP_BG, border: `1px solid ${STRIP_BORDER}`, marginBottom: 10 }}>
                  <StripRow label={t('IDS_MAIL_SUBJECT')} noBorder>
                    <span
                      style={{
                        fontSize: FONT_SIZE,
                        fontWeight: 500,
                        color: '#1a1a1a',
                        lineHeight: '22px',
                        wordBreak: 'break-all',
                      }}
                    >
                      {viewSubject || <Typography.Text type="secondary">—</Typography.Text>}
                    </span>
                  </StripRow>
                </div>
              )}

              {isEditing && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${STRIP_BORDER}`,
                    overflow: 'hidden',
                    margin: '10px 0 0',
                    background: STRIP_BG,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 14,
                      fontSize: FONT_SIZE,
                      fontWeight: 700,
                      color: '#374151',
                      borderRight: `1px solid ${STRIP_BORDER}`,
                      alignSelf: 'stretch',
                      background: '#EEF1F5',
                    }}
                  >
                    {t('IDS_MAIL_SUBJECT')}
                  </div>
                  <div style={{ flex: 1, padding: '8px 12px' }}>
                    <Input
                      ref={subjectInputRef}
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      onFocus={() => setActiveField('subject')}
                      placeholder={t('IDS_SUBJECT_PLACEHOLDER').toString()}
                      style={{
                        fontSize: FONT_SIZE,
                        fontWeight: 500,
                        background: '#fff',
                        borderColor: ICON_COLOR,
                        boxShadow: `0 0 0 2px rgba(0,121,107,0.1)`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ── Edit mode: token bar ── */}
              {isEditing && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${STRIP_BORDER}`,
                    overflow: 'hidden',
                    margin: '10px 0 0',
                    background: STRIP_BG,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 14,
                      fontSize: FONT_SIZE,
                      fontWeight: 700,
                      color: '#374151',
                      borderRight: `1px solid ${STRIP_BORDER}`,
                      alignSelf: 'stretch',
                      background: '#EEF1F5',
                    }}
                  >
                    {t('IDS_VARIABLE')}
                  </div>
                  <div style={{ flex: 1, padding: '10px', display: 'flex', gap: 8, flexWrap: 'wrap', rowGap: 10 }}>
                    {tokens.map((tk) => (
                      <Tooltip
                        key={tk.slug}
                        title={<pre style={{ margin: 0, fontSize: 11, whiteSpace: 'pre-wrap' }}>{tk.note}</pre>}
                        placement="top"
                      >
                        <Tag
                          style={{
                            cursor: 'pointer',
                            margin: 0,
                            fontSize: FONT_SIZE,
                            height: 22,
                            lineHeight: '20px',
                            padding: '0 5px',
                            borderRadius: 3,
                            color: ICON_COLOR,
                            borderColor: '#B2DFDB',
                            background: '#E0F2F1',
                            fontWeight: 500,
                            userSelect: 'none' as const,
                            flexShrink: 0,
                          }}
                          onClick={() => handleInsertToken(tk)}
                        >
                          {tk.label}
                        </Tag>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Body (Quill) ── */}
              <div>
                {quillCssOverride}
                <div
                  style={{
                    border: `1px solid ${isEditing ? ICON_COLOR : '#d9d9d9'}`,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                    boxShadow: isEditing ? `0 0 0 2px rgba(0,121,107,0.1)` : 'none',
                  }}
                >
                  <div
                    className="target-mail-quill"
                    onMouseDown={() => {
                      if (isEditing) setActiveField('body');
                    }}
                  >
                    <div
                      ref={editorDivRef}
                      style={{
                        minHeight: 220,
                        maxHeight: isEditing ? 300 : 280,
                        overflowY: 'auto',
                        background: isEditing ? '#fff' : '#fafafa',
                        fontSize: FONT_SIZE,
                        lineHeight: 1.75,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Preview ── */}
              {isPreview && (
                <div
                  style={{ border: '1px solid rgb(232, 236, 240)', borderRadius: 6, overflow: 'hidden', marginTop: 20 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 12px',
                      borderBottom: '1px solid rgb(232, 236, 240)',
                      fontSize: FONT_SIZE,
                      fontWeight: 600,
                    }}
                  >
                    <EyeOutlined />
                    {t('IDS_PREVIEW')}
                  </div>
                  <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        margin: '0px 0 0',
                        background: STRIP_BG,
                        border: '1px solid rgb(232, 236, 240)',
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: 14,
                          fontSize: FONT_SIZE,
                          fontWeight: 700,
                          color: '#374151',
                          borderRight: `1px solid ${STRIP_BORDER}`,
                          alignSelf: 'stretch',
                          background: '#EEF1F5',
                        }}
                      >
                        {t('IDS_MAIL_SUBJECT')}
                      </div>
                      <div style={{ flex: 1, padding: '8px 12px' }}>
                        <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#1a1a1a' }}>
                          {previewSubject || <Typography.Text type="secondary">—</Typography.Text>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '12px 14px',
                      fontSize: FONT_SIZE,
                      lineHeight: 1.75,
                      background: '#fff',
                      maxHeight: 240,
                      overflowY: 'auto',
                    }}
                  >
                    {previewContent ? (
                      parse(previewContent)
                    ) : (
                      <Typography.Text type="secondary">{t('IDS_NO_CONTENT')}</Typography.Text>
                    )}
                  </div>
                </div>
              )}
            </Spin>
          </div>

          {/* ── Footer ── */}
          <div
            style={{ padding: '15px 24px 0 24px', borderTop: '1px solid #F0F0F0', flexShrink: 0, background: '#fff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button type="primary" loading={isSending} onClick={handleSend} style={{ fontWeight: 600 }}>
                  {isScheduled ? t('IDS_BUTTON_SAVE') : t('IDS_BUTTON_SEND')}
                </Button>
                <Button
                  icon={isPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={handleTogglePreview}
                  disabled={isSending || isSendingTest}
                  size="middle"
                >
                  {t('IDS_PREVIEW')}
                </Button>
                <Button size="middle" onClick={() => setIsModalOpen(false)} disabled={isSending || isSendingTest}>
                  {t('IDS_BUTTON_CANCEL')}
                </Button>
              </Space>
              <Tooltip title={`自分（${user?.email || ''}）へテストメールを送信します`}>
                <Button
                  icon={<SendOutlined />}
                  loading={isSendingTest}
                  onClick={handleTestSend}
                  disabled={isSending}
                  size="middle"
                >
                  テスト送信
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════ 宛先一覧 Modal ══════════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        title={
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 16, fontWeight: 600 }}
          >
            <UserOutlined style={{ color: ICON_COLOR }} />
            {t('IDS_LIST_MAIL_TO')}
          </div>
        }
        open={isRecipientModalOpen}
        onCancel={() => setIsRecipientModalOpen(false)}
        width={560}
        zIndex={1010}
        footer={
          <Space style={{ textAlign: 'left', justifyContent: 'start', width: '100%', marginTop: 3 }}>
            <Button type="primary" icon={<CheckOutlined />} onClick={confirmRecipientSelection}>
              {t('IDS_CONFIRM_TEXT')}
              {`(${tempCCEmails.length + ccEmailsToAdd.filter((e) => !tempCCEmails.includes(e)).length})${t(
                'IDS_PERSON_COUNT_SUFFIX',
              )}`}
            </Button>
            <Button onClick={() => setIsRecipientModalOpen(false)}>{t('IDS_BUTTON_CANCEL')}</Button>
          </Space>
        }
      >
        {/* ── 宛先（TO）section ────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('IDS_RECIPIENT_TO_LABEL')}
          </div>
          <div
            style={{
              border: `1px solid ${STRIP_BORDER}`,
              borderRadius: 6,
              padding: '8px 12px',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <UserOutlined style={{ color: '#6B7280', flexShrink: 0 }} />
            <span
              style={{
                fontSize: FONT_SIZE,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {toEmail || <Typography.Text type="secondary">—</Typography.Text>}
            </span>
            <Tag style={{ margin: 0, fontSize: 11, borderColor: ICON_COLOR, color: ICON_COLOR, background: '#E0F2F1' }}>
              {t('IDS_MAIL_TO')}
            </Tag>
          </div>
        </div>

        {/* ── CC追加 section ────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
            {t('IDS_CC_ADD')}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Select
              mode="multiple"
              placeholder=""
              style={{ flex: 1, minHeight: 28 }}
              value={ccEmailsToAdd}
              onChange={setCCEmailsToAdd}
              options={[
                ...(!tempCCEmails.includes(PROTECTED_EMAIL)
                  ? [{ label: `${PROTECTED_EMAIL} (デフォルト)`, value: PROTECTED_EMAIL }]
                  : []),
                ...usersEmailList.filter((opt) => !tempCCEmails.includes(opt.value) && opt.value !== toEmail),
              ]}
              loading={isLoadingEmailList}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              maxTagCount="responsive"
              notFoundContent={
                isLoadingEmailList ? (
                  <Spin size="small" />
                ) : (
                  <Typography.Text type="secondary" style={{ fontSize: FONT_SIZE }}>
                    {t('IDS_NO_CANDIDATE')}
                  </Typography.Text>
                )
              }
              size="small"
            />
            <Button
              type="primary"
              size="middle"
              icon={<PlusOutlined />}
              disabled={ccEmailsToAdd.length === 0}
              onClick={addCCEmailsToList}
              style={{ flexShrink: 0, height: 28 }}
            >
              {t('IDS_BUTTON_ADD')}
            </Button>
          </div>
          {ccEmailsToAdd.length > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              {t('IDS_ADD_NOTE_RECIPIENT')}
            </Typography.Text>
          )}
        </div>

        {/* ── CC一覧 section ────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('IDS_CC_LABEL')}
            <Tag color="blue" style={{ marginLeft: 8, fontWeight: 600 }}>
              {tempCCEmails.length} {t('IDS_PERSON_COUNT_SUFFIX')}
            </Tag>
          </div>
          <div
            style={{
              maxHeight: 260,
              overflowY: 'auto',
              border: `1px solid ${STRIP_BORDER}`,
              borderRadius: 6,
            }}
          >
            {tempCCEmails.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#9CA3AF', fontSize: FONT_SIZE }}>
                {t('IDS_CC_NO')}
              </div>
            ) : (
              tempCCEmails.map((email) => {
                const isProtected = email === PROTECTED_EMAIL;
                return (
                  <div
                    key={email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: `1px solid ${STRIP_BORDER}`,
                      gap: 8,
                      background: isProtected ? '#FFFBEB' : '#fff',
                    }}
                  >
                    <UserOutlined style={{ color: isProtected ? '#F59E0B' : '#6B7280', flexShrink: 0 }} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: FONT_SIZE,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {email}
                    </span>
                    {isProtected && (
                      <Tag
                        style={{
                          margin: 0,
                          fontSize: 11,
                          borderColor: '#F59E0B',
                          color: '#92400E',
                          background: '#FFFBEB',
                          flexShrink: 0,
                        }}
                      >
                        デフォルト
                      </Tag>
                    )}
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeTempCC(email)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SendMailForTarget;
