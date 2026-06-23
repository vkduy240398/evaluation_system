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
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  MoreOutlined,
  SmallDashOutlined,
  DashOutlined,
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
import './SendMail.css';
import httpAxios from '../../../../common/http';
import { useAuth } from '../../../../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import parse from 'html-react-parser';
import { TOKENS as MAIL_TOKENS } from '../../../admin/mail-management/mail-manage-tab/mailTokens';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

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

// ── Utilities ─────────────────────────────────────────────────────
const TOKEN_RE = /\{\{(\w+)\}\}/gi;
const ICON_COLOR = '#007240';
const STRIP_BG = '#F8FAFC';
const STRIP_BORDER = '#E8ECF0';
const PROTECTED_EMAIL = 'gnw-legal@geonet.co.jp';
const FONT_SIZE = 14;
const FONT_TOOLTIP = 11;
const getEmail = (r: any): string => (typeof r === 'string' ? r : r?.email ?? r?.fullName ?? '');

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

// ── mailType → { apiType (EmailType), templateId (TemplateMailId) } ─
// Backend: EmailType.USER_GOAL_SETTING_PERIOD=7  → TemplateMailId.COMMON_GOAL_SETTING=5
//          EmailType.USER_EVALUATION_PERIOD=8    → TemplateMailId.COMMON_EVALUATION_SETTING=12
const MAIL_TYPE_MAP: Record<string, { apiType: number; templateId: number }> = {
  goal: { apiType: 7, templateId: 5 },
  evaluation: { apiType: 8, templateId: 12 },
};

// ── Token definitions ─────────────────────────────────────────────
interface TokenDef {
  label: string;
  slug: string;
  id: number;
  note: string;
}

// Registry đầy đủ (đồng bộ với EditMailTemplateScreen) — dùng để:
//   1. Render MỌI token trong nội dung template thành chip trong Quill
//   2. Fallback example value cho preview khi không có giá trị thực
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
  dayCreationGoalStart: {
    label: '日作成目標開始',
    id: 32,
    note: 'キーワード：{{dayCreationGoalStart}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)',
  },
  dayCreationGoalEnd: {
    label: '日作成目標終了',
    id: 33,
    note: 'キーワード：{{dayCreationGoalEnd}}\nフォーマット：M月D日 (曜日)\n例）4月15日 (月)',
  },
  dayEvaluationStart: {
    label: '日評価開始',
    id: 34,
    note: 'キーワード：{{dayEvaluationStart}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)',
  },
  dayEvaluationEnd: {
    label: '日評価終了',
    id: 35,
    note: 'キーワード：{{dayEvaluationEnd}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)',
  },
  toUser: { label: '被評価者へ', id: 36, note: 'キーワード：{{toUser}}\nフォーマット：{{toUser}}さん\n例）長谷川さん' },
  ccEvaluator: {
    label: '評価者へ',
    id: 37,
    note: 'キーワード：{{ccEvaluator}}\nフォーマット：{{ccEvaluator}}さん\n例）後藤さん、桑原さん',
  },
  companyName: { label: '会社名', id: 39, note: 'キーワード：{{companyName}}\n例）GEO Holdings' },
  typeFeedback: { label: 'フィードバックタイプ', id: 40, note: 'キーワード：{{typeFeedback}}\n例）その他' },
  status: { label: 'ステータス', id: 41, note: 'キーワード：{{status}}\n例）対応不要' },
  overview: { label: '課題概要', id: 42, note: 'キーワード：{{overview}}\n例）目標設定プロセスに関する質問' },
  userName: { label: '被評価者', id: 43, note: 'キーワード：{{userName}}\n例）手嶋 兼次' },
  divisionName: { label: '部署', id: 44, note: 'キーワード：{{divisionName}}\n例）グローバルシステム管理部' },
  level: { label: '等級', id: 45, note: 'キーワード：{{level}}\n例）2' },
};

// ── StripRow — row inside the gray header strip ───────────────────
const StripRow: React.FC<{
  label: string;
  action?: React.ReactNode;
  noBorder?: boolean;
  alignItems?: 'center' | 'flex-start';
  children: React.ReactNode;
  marginBottom?: number;
}> = ({ label, action, noBorder, alignItems = 'center', children, marginBottom }) => (
  <div
    style={{
      display: 'flex',
      alignItems,
      gap: 0,
      minHeight: 44,
      marginBottom: marginBottom ? marginBottom : 0,
      background: STRIP_BG,
      border: `1px solid ${STRIP_BORDER}`,
    }}
  >
    {/* Label column */}
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

    {/* Content column */}
    <div style={{ flex: 1, minWidth: 0, padding: '5px' }}>{children}</div>

    {/* Action column */}
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
interface SendMailProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  isScheduled?: boolean;
  mailType?: string;
  routeYear?: string | number;
  routePeriodIndex?: string | number;
  periodData?: any;
  departmentId?: number;
}

// ── Component ─────────────────────────────────────────────────────
const SendMail: React.FC<SendMailProps> = ({
  isModalOpen,
  setIsModalOpen,
  isScheduled = false,
  mailType = '',
  routeYear,
  routePeriodIndex,
  periodData,
  departmentId,
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
  const [recipients, setRecipients] = useState<any[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [tempRecipients, setTempRecipients] = useState<any[]>([]);
  const [emailsToAdd, setEmailsToAdd] = useState<string[]>([]);
  const [usersEmailList, setUsersEmailList] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingEmailList, setIsLoadingEmailList] = useState(false);
  const [protectedEmailIndex, setProtectedEmailIndex] = useState<number>(-1);

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
  // 変数バー: templateId の listTemplate に基づいてフィルタ (EditMailTemplateScreen と同じロジック)
  const tokens = useMemo(() => {
    const tplId = (MAIL_TYPE_MAP[mailType] ?? MAIL_TYPE_MAP['goal']).templateId;
    return MAIL_TOKENS.filter((t) => t.listTemplate.includes(tplId)).map((t) => ({
      label: t.title,
      slug: t.slug,
      id: t.id,
      note: t.note,
    }));
  }, [mailType]);

  // Quill chip 描画用: ALL_TOKEN_REGISTRY を使いテンプレート内の全トークンを chip 化
  const tokensById = useMemo(() => {
    const m: Record<string, any> = {};
    Object.entries(ALL_TOKEN_REGISTRY).forEach(([slug, tk]) => {
      m[slug] = { ...tk, slug };
    });
    return m;
  }, []);

  const resolveSubject = useCallback(
    (raw: string) =>
      raw
        .replace(/\{\{evaluationYear\}\}/gi, String(routeYear ?? ''))
        .replace(/\{\{evaluationPeriod\}\}/gi, periodLabel),
    [routeYear, periodLabel],
  );

  const resolveAllTokens = useCallback(
    (text: string): string => {
      // Giá trị thực cho các token có dữ liệu cụ thể
      const realValues: Record<string, string> = {
        evaluationYear: String(routeYear ?? ''),
        evaluationPeriod: periodLabel,
        loginUrl: `${window.location.origin}/login`,
        periodFirstDate: periodLabel === '上期' ? `${routeYear}年4月1日` : `${routeYear}年10月1日`,
        periodMonth: periodLabel === '上期' ? `${routeYear}年9月` : `${routeYear}年3月`,
        periodSecondDate: periodLabel === '上期' ? `${routeYear}年10月2日` : `${routeYear}年4月2日`,
        secondPeriodMonth: periodLabel === '上期' ? `${routeYear}年3月` : `${routeYear}年9月`,
      };
      // Giống handleReplacePreview của EditMailTemplateScreen:
      // token không có giá trị thực → dùng phần "例）..." trong note làm giá trị mẫu
      return text.replace(TOKEN_RE, (_m, slug) => {
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
    setRecipients([]);
    setTemplateId(null);
    setTemplateName('');
    setPreviewSubject('');
    setPreviewContent('');
    setTempRecipients([]);
    setEmailsToAdd([]);
    setUsersEmailList([]);
    setProtectedEmailIndex(-1);
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
    const { apiType, templateId: tplId } = MAIL_TYPE_MAP[mailType] ?? MAIL_TYPE_MAP['goal'];
    try {
      const [mailRes, tplRes]: any[] = await Promise.all([
        httpAxios.Get(
          `/api/v1/f5/management-evaluation-history/get-to-email-list/${apiType}/${routeYear}/${routePeriodIndex}`,
          departmentId ? { params: { departmentId } } : undefined,
        ),
        httpAxios.Get('/api/v1/f7/management-evaluation-setting/mail-template-list-by-id', { params: { id: tplId } }),
      ]);

      if (mailRes?.status === 200) {
        const d = mailRes.data;
        const list = Array.isArray(d?.toEmailList) ? d.toEmailList : [];
        const hasProtected = list.some((r: any) => getEmail(r) === PROTECTED_EMAIL);
        setRecipients(hasProtected ? list : [PROTECTED_EMAIL, ...list]);
        setViewSubject(resolveSubject(d?.title ?? ''));
        setViewBody(d?.content ?? '');
      }

      // Template data for edit mode from dedicated template API (mail-template-list-by-id?id=tplId)
      const tpl = tplRes?.status === 200 ? tplRes.data : null;
      if (tpl) {
        setTemplateId(tpl.id ?? tplId);
        setTemplateName(tpl.name ?? '');
        setEditSubject(tpl.subject ?? '');
        setEditBody(tpl.content ?? '');
      }
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, [routeYear, routePeriodIndex, mailType, departmentId, resolveSubject]);

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
      // Luôn load editBody vào Quill khi vào edit mode.
      // Nếu editBody rỗng thì dùng viewBody làm fallback để không để Quill giữ nội dung cũ.
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

  // ── 送信の実処理を分離 ────────────────────────────────────────────
  // 今すぐ送信: send-mail-now のみ呼び出し（テンプレート保存なし）
  // 後で送信: save-mail-template を呼び出してcronジョブを登録
  const executeSend = useCallback(async () => {
    setIsSending(true);
    const { apiType } = MAIL_TYPE_MAP[mailType] ?? MAIL_TYPE_MAP['goal'];
    try {
      // Edit mode: Quill có nội dung đã chỉnh sửa (chip → {{slug}}) → resolve tất cả token
      // View mode: Quill có nội dung view → resolve các token còn lại
      // Fallback khi Quill chưa khởi tạo: dùng editBody (edit) hoặc viewBody (view)
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
      const emailList = recipients.map(getEmail).filter(Boolean);

      let result: any;

      if (isScheduled) {
        result = await httpAxios.Post('/api/v1/f5/management-evaluation-history/save-mail-template', {
          evaluationPeriodId: periodData?.id ?? 0,
          status: 0,
          type: apiType,
          sendTimeSetting: scheduledDate?.format('YYYY/MM/DD HH:mm') ?? null,
          title: currentSubject,
          contentMail: currentBody,
          mailTo: emailList.join(','),
          mailToObjList: emailList,
        });
      } else {
        result = await httpAxios.Post('/api/v1/f5/management-evaluation-history/send-mail-now', {
          content: { toEmails: emailList.join(';'), mailContent: { subject: currentSubject, editor: currentBody } },
          inputedValues: {
            evaluationPeriodId: periodData?.id ?? 0,
            status: 1,
            type: apiType,
            sendTimeSetting: null,
            sendTimeActual: dayjs().format('YYYY/M/D H:mm'),
            title: currentSubject,
            contentMail: currentBody,
            mailTo: emailList.join(','),
            mailToObjList: emailList,
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
    recipients,
    periodData,
    mailType,
    resolveAllTokens,
    setIsModalOpen,
  ]);

  // ── Lưu template lên server và quay về view mode ─────────────────
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
        // editBody giữ nguyên raw (có {{slug}}) để dùng khi vào lại edit mode
        setEditBody(rawBody);
        // viewSubject và viewBody dùng giá trị đã resolve để hiển thị ở view mode
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
  }, [templateId, templateName, editSubject, editBody, tokensById, resolveAllTokens]);

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
    const { apiType } = MAIL_TYPE_MAP[mailType] ?? MAIL_TYPE_MAP['goal'];
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
          evaluationPeriodId: periodData?.id ?? 0,
          status: 1,
          type: apiType,
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
  }, [isEditing, editBody, viewBody, editSubject, viewSubject, resolveAllTokens, periodData, mailType, user]);

  const openEmailModal = useCallback(async () => {
    setTempRecipients([...recipients]);
    setEmailsToAdd([]);
    setIsEmailModalOpen(true);
    setProtectedEmailIndex(recipients.findIndex((r) => getEmail(r) === PROTECTED_EMAIL));
    setIsLoadingEmailList(true);
    try {
      const currentEmails = recipients.map(getEmail).filter(Boolean);
      const res = await httpAxios.Post('/api/v1/f5/management-evaluation-history/users-email-list', {
        conditions: JSON.stringify(currentEmails),
      });
      if (res?.status === 200 || res?.status === 201) {
        const list = Array.isArray(res.data) ? res.data : [];
        setUsersEmailList(
          list.map((item: any) => {
            const email = getEmail(item);
            return { label: email, value: email };
          }),
        );
      }
    } catch {
      /* silent */
    } finally {
      setIsLoadingEmailList(false);
    }
  }, [recipients]);

  // ── [改善4] 確定時に emailsToAdd を自動マージ ────────────────────
  const confirmEmailSelection = useCallback(() => {
    const merged = [...tempRecipients];
    if (emailsToAdd.length > 0) {
      const existing = new Set(merged.map(getEmail));
      emailsToAdd
        .filter((e) => !existing.has(e))
        .forEach((e) => {
          if (e === PROTECTED_EMAIL && protectedEmailIndex >= 0 && protectedEmailIndex <= merged.length) {
            merged.splice(protectedEmailIndex, 0, e);
          } else {
            merged.push(e);
          }
        });
    }
    setRecipients(merged);
    setIsEmailModalOpen(false);
  }, [tempRecipients, emailsToAdd, protectedEmailIndex]);

  const removeTempRecipient = useCallback((email: string) => {
    setTempRecipients((p) => p.filter((r) => getEmail(r) !== email));
  }, []);

  const addEmailsToList = useCallback(() => {
    if (emailsToAdd.length === 0) return;
    setTempRecipients((p) => {
      const existing = new Set(p.map(getEmail));
      const toInsert = emailsToAdd.filter((e) => !existing.has(e));
      const result = [...p];
      toInsert.forEach((e) => {
        if (e === PROTECTED_EMAIL && protectedEmailIndex >= 0 && protectedEmailIndex <= result.length) {
          result.splice(protectedEmailIndex, 0, e);
        } else {
          result.push(e);
        }
      });
      return result;
    });
    setEmailsToAdd([]);
  }, [emailsToAdd, protectedEmailIndex]);

  const quillCssOverride = useMemo(
    () => (
      <style>
        {!isEditing
          ? `.send-mail-quill .ql-toolbar{display:none!important}.send-mail-quill .ql-container{border:none!important}`
          : `.send-mail-quill .ql-toolbar.ql-snow{border:none!important;border-bottom:1px solid #e2e8f0!important;border-radius:0!important}.send-mail-quill .ql-container.ql-snow{border:none!important}`}
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
          <Typography.Title
            level={4}
            style={{
              fontSize: 18,
              fontWeight: 600,
              paddingBottom: 15,
              borderBottom: '1px solid #F0F0F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MailOutlined style={{ color: ICON_COLOR }} />
            {t('IDS_SEND_MAIL')}
            {isScheduled && (
              <Tag icon={<ClockCircleOutlined />} color="orange" style={{ margin: '0 0 0 4px', fontWeight: 600 }}>
                {t('IDS_SEND_MAIL_SETTING_TIME')}
              </Tag>
            )}
            {isEditing && (
              <Tag color="blue" style={{ margin: '0 0 0 4px', fontWeight: 600 }}>
                {t('IDS_EDITING')}
              </Tag>
            )}
          </Typography.Title>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        afterClose={handleAfterClose}
        width={900}
        style={{ top: 60 }}
        destroyOnClose
        footer={null}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Flex column: scroll area on top, footer pinned at bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 170px)' }}>
          {/* ── Scrollable content ─────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', minHeight: 0 }}>
            <Spin spinning={isLoading} tip={t('IDS_LOADING')} size="small">
              {/* ═══════════ HEADER STRIP (gray background) ═══════════ */}
              <div
                style={{
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                {/* ── 送信予定日時（後で送信のみ）────────────────────────── */}
                {isScheduled && (
                  <StripRow label={t('IDS_DATE_TIME')} marginBottom={isScheduled ? 10 : 0}>
                    <Space size={8}>
                      <DatePicker
                        value={scheduledDate}
                        popupClassName="send-mail-datepicker-popup"
                        onChange={(d) => {
                          setScheduledDate(d);
                          if (d) setDateError(false);
                        }}
                        showTime={{ format: 'HH:mm', showSecond: false }}
                        format="YYYY/MM/DD HH:mm"
                        placeholder={t('IDS_DATE_SCHEDULED_PLACEHOLDER').toString()}
                        disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                        disabledTime={(d) => {
                          const now = dayjs();
                          if (!d || !d.isSame(now, 'day')) return {};
                          return {
                            disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
                            disabledMinutes: (h) =>
                              h === now.hour() ? Array.from({ length: now.minute() }, (_, i) => i) : [],
                          };
                        }}
                        style={{ width: 200 }}
                        status={dateError ? 'error' : undefined}
                        suffixIcon={<CalendarOutlined />}
                        inputReadOnly
                      />
                      {dateError && (
                        <Typography.Text type="danger" style={{ fontSize: FONT_SIZE }}>
                          {t('IDS_DATE_REQUIRED')}
                        </Typography.Text>
                      )}
                    </Space>
                  </StripRow>
                )}
                {/* ── 宛先 ────────────────────────────────────────────── */}
                <StripRow
                  label={t('IDS_MAIL_TO')}
                  alignItems="center"
                  action={
                    <Tooltip
                      title={t('IDS_ADD_CHANGE_RECIPIENT')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
                    >
                      <Button size="small" icon={<EllipsisOutlined />} onClick={openEmailModal} />
                    </Tooltip>
                  }
                >
                  {recipients.length === 0 ? (
                    <Typography.Text type="secondary" style={{ fontSize: FONT_SIZE }}>
                      {t('IDS_NO_RECIPIENT')}
                    </Typography.Text>
                  ) : (
                    <Cascader
                      options={recipients
                        .map(getEmail)
                        .filter(Boolean)
                        .map((email) => ({ label: email, value: email }))}
                      multiple
                      disabled
                      maxTagCount="responsive"
                      value={recipients
                        .map(getEmail)
                        .filter(Boolean)
                        .map((email) => [email])}
                      style={{ width: '100%' }}
                    />
                  )}
                </StripRow>
              </div>
              {/* end header strip */}

              {/* ═══════════ EDIT / VIEW SECTION ═════════════════════ */}
              {/* ── View mode: edit trigger ── */}
              {!isEditing ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    margin: '0px 0 10px',
                  }}
                >
                  <Button type="primary" icon={<EditOutlined />} size="middle" onClick={enterEdit}>
                    {t('IDS_MAIL_CONTENT_EDIT')}
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
                  <Button type="primary" size="middle" loading={isSavingTemplate} onClick={handleSaveEdit}>
                    {t('IDS_BUTTON_SAVE')}
                  </Button>
                  <Button size="middle" onClick={cancelEdit} disabled={isSavingTemplate}>
                    {t('IDS_BUTTON_CANCEL')}
                  </Button>
                </div>
              )}
              {!isEditing && (
                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
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
              {/* ── Edit mode: 件名 input ── */}
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
                    marginBottom: isPreview ? 15 : 0,
                  }}
                >
                  {/* Quill */}
                  <div
                    className="send-mail-quill"
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

              {/* ── Preview ───────────────────────────────────────────── */}
              {isPreview && (
                <div
                  style={{
                    border: '1px solid rgb(232, 236, 240)',
                    borderRadius: 6,
                    overflow: 'hidden',
                    marginTop: 20,
                  }}
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
          {/* end scrollable content */}

          {/* ── Footer — pinned ──────────────────────────────────── */}
          <div style={{ padding: '5px 10px 0 0px', flexShrink: 0, background: '#fff' }}>
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
              <Tooltip
                title={`自分（${user?.email || ''}）へテストメールを送信します`}
                color="#424242"
                overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
              >
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
        {/* end flex column */}
      </Modal>

      {/* ══════════════════════ 宛先の設定 Modal ══════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        title={
          <Typography.Title level={4} style={{ paddingBottom: 15 }}>
            <UserOutlined style={{ color: ICON_COLOR, paddingRight: 5 }} />
            {t('IDS_RECIPIENT_SETTING')}
          </Typography.Title>
        }
        open={isEmailModalOpen}
        onCancel={() => setIsEmailModalOpen(false)}
        width={560}
        centered
        zIndex={1010}
        footer={
          <Space style={{ textAlign: 'left', justifyContent: 'start', width: '100%', marginTop: 3 }}>
            {/* [改善4] 確定時に emailsToAdd を自動マージするため、件数表示も合算 */}
            <Button type="primary" icon={<CheckOutlined />} onClick={confirmEmailSelection}>
              {t('IDS_CONFIRM_TEXT')}
              {`(${
                tempRecipients.length + emailsToAdd.filter((e) => !tempRecipients.some((r) => getEmail(r) === e)).length
              })${t('IDS_PERSON_COUNT_SUFFIX')}`}
            </Button>
            <Button onClick={() => setIsEmailModalOpen(false)}>{t('IDS_BUTTON_CANCEL')}</Button>
          </Space>
        }
      >
        {/* ── メールを追加 ──────────────────────────────────────── */}
        <div style={{ marginBottom: 15 }}>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 0 }}>
            {t('IDS_ADD_MAIL')}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Select
              mode="multiple"
              placeholder=""
              style={{ flex: 1, minHeight: 28 }}
              value={emailsToAdd}
              onChange={setEmailsToAdd}
              options={[
                ...(!tempRecipients.some((r) => getEmail(r) === PROTECTED_EMAIL)
                  ? [{ label: `${PROTECTED_EMAIL} (デフォルト)`, value: PROTECTED_EMAIL }]
                  : []),
                ...usersEmailList.filter((opt) => !tempRecipients.some((r) => getEmail(r) === opt.value)),
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
              disabled={emailsToAdd.length === 0}
              onClick={addEmailsToList}
              style={{ flexShrink: 0, height: 28 }}
            >
              {t('IDS_BUTTON_ADD')}
            </Button>
          </div>
          {/* [改善4] 選択済み候補がある場合のヒント */}
          {emailsToAdd.length > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              {t('IDS_ADD_NOTE_RECIPIENT')}
            </Typography.Text>
          )}
        </div>

        {/* ── 現在の送信先 ──────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 0 }}>
            {t('IDS_CURRENT_RECIPIENT')}
          </div>
          <div
            style={{
              maxHeight: 260,
              overflowY: 'auto',
              border: `1px solid ${STRIP_BORDER}`,
              borderRadius: 6,
            }}
          >
            {tempRecipients.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#9CA3AF', fontSize: FONT_SIZE }}>
                {t('IDS_NO_SEND_RECIPIENT')}
              </div>
            ) : (
              tempRecipients.map((r) => {
                const email = getEmail(r);
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
                      onClick={() => removeTempRecipient(email)}
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

export default SendMail;
