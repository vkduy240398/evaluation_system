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
  Form,
  Cascader,
} from 'antd';
import {
  SendOutlined,
  MailOutlined,
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import TokenBlot from '../mail-management/mail-manage-tab/quill/TokenBlot';
import TokenDrop, { TOKEN_MODULE_NAME } from '../mail-management/mail-manage-tab/quill/TokenDrop';
import insertToken from '../mail-management/mail-manage-tab/quill/insertToken';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'react-quill/dist/quill.snow.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '../mail-management/mail-manage-tab/quill/token.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './SendEmailModalFixed.css';
import httpAxios from '../../../common/http';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import parse from 'html-react-parser';
import { TemplateMailId } from '../send-email/TemplateMailId';
import { TOKENS as MAIL_TOKENS } from '../mail-management/mail-manage-tab/mailTokens';
import ShowMoreMailCCPopUp from '../period-evaluation/period-evaluation-detail/components/ShowMoreMailCCPopUp';
import AdminEvaluationApiService from '../../../common/api/adminEvaluation';
import localeJa from '../../../@core/locales/jaDatePick';
import { RangePickerProps } from 'antd/es/date-picker';
import { useAuth } from '../../../hooks/useAuth';
import { t } from 'i18next';

const { RangePicker } = DatePicker;

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
const ICON_COLOR = '#007240';
const STRIP_BG = '#F8FAFC';
const STRIP_BORDER = '#E8ECF0';
const FONT_SIZE = 14;
const FONT_TOOLTIP = 11;
// ── Email type map: (fixedType, sendType) → :type param for get-mail-template-fixed ─
// evaluatorWithoutTimeStatus shares the same email type as evaluatorWithoutTime
// (STATUS variants '4'/'8' are only for getExistIdsSend, not for template fetch)
const MAIL_TYPE_MAP: Record<string, Record<string, TemplateMailId>> = {
  fixedGoal: {
    userAndEvaluatorWithoutTime: TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME, // '1'
    evaluatorWithoutTime: TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME, // '2'
    evaluatorWithoutTimeStatus: TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME, // '2'
    userAndEvaluator: TemplateMailId.GOAL_USER_AND_EVALUATOR, // '3'
  },
  fixedEvaluation: {
    userAndEvaluatorWithoutTime: TemplateMailId.EVALUATION_USER_AND_EVALUATOR_WITHOUT_TIME, // '5'
    evaluatorWithoutTime: TemplateMailId.EVALUATION_EVALUATOR_WITHOUT_TIME, // '6'
    evaluatorWithoutTimeStatus: TemplateMailId.EVALUATION_EVALUATOR_WITHOUT_TIME, // '6'
    userAndEvaluator: TemplateMailId.EVALUATION_USER_AND_EVALUATOR, // '7'
  },
};

// ── Static fallback: DB template IDs for mail-template-list-by-id ─
// Derived from backend TemplateMailId enum (server/src/enum/TemplateMailId.ts):
//   EmailTypeFixed '1' → mailService.getMailNotiGoalFixedUserAndEvaluatorWOTime → TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME = 7
//   EmailTypeFixed '2' → mailService.getMailNotiGoalFixedEvaluatorWOTime         → TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME          = 8
//   EmailTypeFixed '3' → mailService.getMailNotiGoalFixedUserAndEvaluator        → TemplateMailId.GOAL_USER_AND_EVALUATOR              = 9
//   EmailTypeFixed '5' → mailService.getMailNotiEvalFixedUserAndEvaluatorWOTime  → TemplateMailId.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME  = 14
//   EmailTypeFixed '6' → mailService.getMailNotiEvalFixedEvaluatorWOTime         → TemplateMailId.EVAL_EVALUATOR_WITHOUT_TIME           = 15
//   EmailTypeFixed '7' → mailService.getMailNotiEvalFixedUserAndEvaluator        → TemplateMailId.EVAL_USER_AND_EVALUATOR               = 16
const FALLBACK_TEMPLATE_DB_ID: Record<string, Record<string, number>> = {
  fixedGoal: {
    userAndEvaluatorWithoutTime: 7,
    evaluatorWithoutTime: 8,
    evaluatorWithoutTimeStatus: 8,
    userAndEvaluator: 9,
  },
  fixedEvaluation: {
    userAndEvaluatorWithoutTime: 14,
    evaluatorWithoutTime: 15,
    evaluatorWithoutTimeStatus: 15,
    userAndEvaluator: 16,
  },
};

// ── emailType for sendEmailFixedGoal API ─────────────────────────
const EMAIL_TYPE_MAP: Record<string, Record<string, number>> = {
  fixedGoal: {
    userAndEvaluatorWithoutTime: 1,
    evaluatorWithoutTime: 9,
    evaluatorWithoutTimeStatus: 9,
    userAndEvaluator: 2,
  },
  fixedEvaluation: {
    userAndEvaluatorWithoutTime: 3,
    evaluatorWithoutTime: 10,
    evaluatorWithoutTimeStatus: 10,
    userAndEvaluator: 4,
  },
};

// ── Quill helpers ─────────────────────────────────────────────────
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

// ── ALL_TOKEN_REGISTRY for Quill chip rendering ───────────────────
const ALL_TOKEN_REGISTRY: Record<string, { label: string; id: number; note: string }> = {};
MAIL_TOKENS.forEach((t) => {
  ALL_TOKEN_REGISTRY[t.slug] = { label: t.title, id: t.id, note: t.note };
});

// ── StripRow ──────────────────────────────────────────────────────
const StripRow: React.FC<{
  label: string;
  action?: React.ReactNode;
  noBorder?: boolean;
  alignItems?: 'center' | 'flex-start';
  children: React.ReactNode;
  isChangeTime?: boolean;
  marginBottom?: number;
}> = ({ label, action, noBorder, alignItems = 'center', children, isChangeTime, marginBottom }) => (
  <div
    style={{
      display: 'flex',
      alignItems,
      gap: 0,
      borderBottom: noBorder ? 'none' : `1px solid ${STRIP_BORDER}`,
      minHeight: 44,
      marginBottom: marginBottom ? marginBottom : 0,
      background: STRIP_BG,
      border: `1px solid ${STRIP_BORDER}`,
    }}
  >
    <div
      style={{
        minWidth: isChangeTime ? 100 : 56,
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

// ── Types ─────────────────────────────────────────────────────────
type TypeSendMail =
  | 'userAndEvaluatorWithoutTime'
  | 'userAndEvaluator'
  | 'evaluatorWithoutTime'
  | 'evaluatorWithoutTimeStatus'
  | undefined;

interface Period {
  id: number;
  year: string;
  periodIndex: number;
  dateCreationGoalDepartmentEnd: string;
  dateCreationGoalDepartmentStart: string;
  dateCreationGoalEnd: string;
  dateCreationGoalStart: string;
  dateEvaluationDepartmentEnd: string;
  dateEvaluationDepartmentStart: string;
  dateEvaluationEnd: string;
  dateEvaluationStart: string;
}

interface RowData {
  id: number[];
  userName: string[];
  evaluatorName: any;
  userEmails: string[];
  evaluatorEmails: Set<string> | string[];
  status: number;
  evaluationPeriodId: number;
  type: 'fixedGoal' | 'fixedEvaluation';
  userAndEvaluator: { id?: number; user: string; evaluators: string[] }[];
}

interface TokenDef {
  label: string;
  slug: string;
  id: number;
  note: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: TypeSendMail;
  period: Period;
  rowData: RowData;
  isChangeTime: boolean;
  handleSearch: () => void;
  setSelectRows: (rows: any) => void;
  emailEmployeeMap?: Record<string, string>;
}

// ── Component ─────────────────────────────────────────────────────
const SendEmailModalFixed: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  period,
  rowData,
  isChangeTime,
  handleSearch,
  setSelectRows,
  emailEmployeeMap = {},
}) => {
  const { user } = useAuth();
  const defaultMail = user?.emailHR;

  // ── Loading / sending state ───────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // ── Date pickers (isChangeTime / userAndEvaluator) ────────────
  const [goalEvaluationTimes, setGoalEvaluationTimes] = useState<string[]>([]);
  const [goalDepartmentEvaluationTimes, setGoalDepartmentEvaluationTimes] = useState<string[]>([]);
  const [isDepartmentSaved, setIsDepartmentSaved] = useState(false);
  const [isPersonalSaved, setIsPersonalSaved] = useState(false);

  // ── Recipients ────────────────────────────────────────────────
  const [toUserList, setToUserList] = useState<string[]>([]);
  const [dataMailCCs, setDataMailCCs] = useState<{ id?: number; user: string; evaluators: string[] }[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isCCListOpen, setIsCCListOpen] = useState(false);
  const [tempToList, setTempToList] = useState<string[]>([]);
  const [emailsToAdd, setEmailsToAdd] = useState<string[]>([]);
  const [usersEmailList, setUsersEmailList] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingEmailList, setIsLoadingEmailList] = useState(false);
  const [protectedEmailIndex, setProtectedEmailIndex] = useState<number>(-1);

  // ── Mail content ─────────────────────────────────────────────
  const [viewSubject, setViewSubject] = useState('');
  const [viewBody, setViewBody] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [emailTypeState, setEmailTypeState] = useState<number>(1);
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  // ── Quill refs ────────────────────────────────────────────────
  const quillRef = useRef<any>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const subjectInputRef = useRef<any>(null);
  const [activeField, setActiveField] = useState<'subject' | 'body'>('body');

  // ── tokensById for Quill chip rendering ──────────────────────
  const tokensById = useMemo(() => {
    const m: Record<string, any> = {};
    Object.entries(ALL_TOKEN_REGISTRY).forEach(([slug, tk]) => {
      m[slug] = { ...tk, slug };
    });
    return m;
  }, []);

  // ── Token bar: filter by templateId.listTemplate ─────────────
  const tokens = useMemo<TokenDef[]>(
    () =>
      templateId
        ? MAIL_TOKENS.filter((t) => t.listTemplate.includes(templateId)).map((t) => ({
            label: t.title,
            slug: t.slug,
            id: t.id,
            note: t.note,
          }))
        : [],
    [templateId],
  );

  // ── Date helpers ──────────────────────────────────────────────
  const isFixedGoal = rowData.type === 'fixedGoal';

  const getDateStart = () => (isFixedGoal ? period.dateCreationGoalStart : period.dateEvaluationStart);
  const getDateEnd = () => (isFixedGoal ? period.dateCreationGoalEnd : period.dateEvaluationEnd);
  const getDateDeptStart = () =>
    isFixedGoal ? period.dateCreationGoalDepartmentStart : period.dateEvaluationDepartmentStart;
  const getDateDeptEnd = () =>
    isFixedGoal ? period.dateCreationGoalDepartmentEnd : period.dateEvaluationDepartmentEnd;

  const dateGoals = useMemo(
    () => [
      dayjs(moment(getDateStart()).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
      dayjs(moment(getDateEnd()).format('YYYY-MM-DD'), 'YYYY-MM-DD').isBefore(dayjs().endOf('day'))
        ? dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
        : dayjs(moment(getDateEnd()).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    ],
    [period, isFixedGoal],
  );

  const dateDepartments = useMemo(
    () => [
      dayjs(moment(getDateDeptStart()).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
      dayjs(moment(getDateDeptEnd()).format('YYYY-MM-DD'), 'YYYY-MM-DD').isBefore(dayjs().endOf('day'))
        ? dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
        : dayjs(moment(getDateDeptEnd()).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    ],
    [period, isFixedGoal],
  );

  const disabledDate: RangePickerProps['disabledDate'] = useCallback(
    (current: Dayjs) => {
      return Boolean(
        (current && current < dayjs(moment(getDateEnd()).format('YYYY-MM-DD'))) || current < dayjs().endOf('day'),
      );
    },
    [period, isFixedGoal],
  );

  const disabledDateDepartment: RangePickerProps['disabledDate'] = useCallback(
    (current: Dayjs) => {
      return Boolean(
        (current && current < dayjs(moment(getDateDeptEnd()).format('YYYY-MM-DD'))) || current < dayjs().endOf('day'),
      );
    },
    [period, isFixedGoal],
  );

  // ── Preview token resolution ───────────────────────────────────
  const resolveAllTokens = useCallback(
    (text: string): string => {
      const realValues: Record<string, string> = {
        evaluationYear: String(period.year ?? ''),
        evaluationPeriod: period.periodIndex === 1 ? '上期' : '下期',
        loginUrl: `${window.location.origin}/login`,
      };
      return text.replace(TOKEN_RE, (_m, slug) => {
        if (realValues[slug] !== undefined) return realValues[slug];
        const registry = ALL_TOKEN_REGISTRY[slug];
        if (registry) {
          const ex = registry.note.split('例）')[1];
          if (ex) return ex.split('\n')[0];
        }
        return _m;
      });
    },
    [period],
  );

  // ── Recipients helpers ─────────────────────────────────────────
  const handleFormValue = useCallback((data: string[]) => {
    setToUserList(data);
  }, []);

  const handleGetListUserAndEvaluatorsEmails = (data: { user: string; evaluators: string[] }[]): string[] => {
    const emails: string[] = [];
    data.forEach((item) => {
      emails.push(item.user, ...item.evaluators);
    });
    return emails;
  };

  const initRecipients = useCallback(() => {
    if (!type) return;
    if (type === 'userAndEvaluatorWithoutTime') {
      const emails = handleGetListUserAndEvaluatorsEmails(rowData.userAndEvaluator);
      const unique = Array.from(new Set([...(defaultMail ? [defaultMail] : []), ...emails]));
      setToUserList(unique);
      const updatedCCs = rowData.userAndEvaluator.map((item) => ({
        ...item,
        evaluators:
          defaultMail && !item.evaluators.includes(defaultMail)
            ? [...item.evaluators, defaultMail]
            : [...item.evaluators],
      }));
      setDataMailCCs(updatedCCs);
    } else if (type === 'evaluatorWithoutTime' || type === 'evaluatorWithoutTimeStatus') {
      const emails = Array.from(new Set([...(defaultMail ? [defaultMail] : []), ...rowData.evaluatorEmails]));
      setToUserList(Array.from(emails));
    } else {
      const emails = Array.from(
        new Set([...(defaultMail ? [defaultMail] : []), ...rowData.userEmails, ...rowData.evaluatorEmails]),
      );
      setToUserList(Array.from(emails));
    }
  }, [type, rowData, defaultMail]);

  // ── Load mail template data ───────────────────────────────────
  const loadData = useCallback(async () => {
    if (!type || !rowData.type) return;

    // emailType is the :type param for get-mail-template-fixed (e.g. '1', '2', '5', '6'...)
    const emailType = MAIL_TYPE_MAP[rowData.type]?.[type];
    const eType = EMAIL_TYPE_MAP[rowData.type]?.[type] ?? 1;
    setEmailTypeState(eType);

    const evaluationId =
      type === 'evaluatorWithoutTime' || type === 'evaluatorWithoutTimeStatus'
        ? rowData.id?.length === 1
          ? rowData.id[0]
          : 0
        : 0;

    setIsLoading(true);
    try {
      // Step 1: get rendered view content (server-resolved tokens) using email type
      const viewRes: any = await httpAxios.Get(
        `/api/v1/f5/management-evaluation-history/get-mail-template-fixed/${emailType}/${period.id}/${evaluationId}`,
      );

      if (viewRes?.status === 200) {
        setViewSubject(viewRes.data?.title ?? '');
        setViewBody(viewRes.data?.content ?? '');
      }

      // Step 2: get raw edit template.
      // Prefer the id returned by Step 1; fall back to the static mapping
      // (see FALLBACK_TEMPLATE_DB_ID) so the edit template is always loaded.
      const tplId: number = viewRes.data?.id ?? FALLBACK_TEMPLATE_DB_ID[rowData.type]?.[type];
      if (!tplId) return;

      const tplRes: any = await httpAxios.Get('/api/v1/f7/management-evaluation-setting/mail-template-list-by-id', {
        params: { id: tplId },
      });

      if (tplRes?.status === 200) {
        const tpl = tplRes.data;
        setTemplateId(tpl?.id ?? tplId);
        setTemplateName(tpl?.name ?? '');
        setEditSubject(tpl?.subject ?? '');
        setEditBody(tpl?.content ?? '');
      }
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, [type, rowData.type, rowData.id, period.id]);

  // ── Initialize on open ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    initRecipients();
    loadData();
    if (isChangeTime) {
      setGoalEvaluationTimes([dateGoals[0].format('YYYY/M/D'), dateGoals[1].format('YYYY/M/D')]);
      setGoalDepartmentEvaluationTimes([dateDepartments[0].format('YYYY/M/D'), dateDepartments[1].format('YYYY/M/D')]);
      setIsDepartmentSaved(dateDepartments[0].format('YYYY/M/D') !== 'Invalid Date');
      setIsPersonalSaved(dateGoals[0].format('YYYY/M/D') !== 'Invalid Date');
    }
  }, [isOpen]);

  // ── Reset on close ────────────────────────────────────────────
  const handleAfterClose = useCallback(() => {
    quillRef.current = null;
    setIsEditing(false);
    setIsPreview(false);
    setViewSubject('');
    setViewBody('');
    setEditSubject('');
    setEditBody('');
    setTemplateId(null);
    setTemplateName('');
    setPreviewSubject('');
    setPreviewContent('');
    setToUserList([]);
    setDataMailCCs([]);
    setTempToList([]);
    setEmailsToAdd([]);
    setUsersEmailList([]);
    setIsCCListOpen(false);
    setProtectedEmailIndex(-1);
  }, []);

  // ── Initialize Quill (view mode) ──────────────────────────────
  useEffect(() => {
    if (!isOpen || !viewBody || quillRef.current) return;
    const timer = setTimeout(() => {
      const container = editorDivRef.current;
      if (!container || quillRef.current) return;
      container.innerHTML = tokensToHtml(viewBody, tokensById);
      const q = new Quill(container, EDITOR_CONFIG) as any;
      q.enable(false);
      quillRef.current = q;
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, viewBody]);

  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(isEditing);
  }, [isEditing]);

  // ── Edit mode ─────────────────────────────────────────────────
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

  // ── Save template ─────────────────────────────────────────────
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

  // ── Insert token ──────────────────────────────────────────────
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

  // ── Preview ───────────────────────────────────────────────────
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

  // ── Send ──────────────────────────────────────────────────────
  const executeSend = useCallback(async () => {
    setIsSending(true);
    const isFilterStatus = type === 'evaluatorWithoutTimeStatus';
    try {
      let rawBody: string;
      let currentSubject: string;
      if (isEditing) {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : editBody;
        currentSubject = editSubject;
      } else {
        rawBody = quillRef.current ? htmlToTokens(quillRef.current.root.innerHTML) : viewBody;
        currentSubject = viewSubject;
      }

      await AdminEvaluationApiService.sendEmailFixedGoal(
        toUserList,
        { subject: currentSubject, editor: rawBody },
        emailTypeState,
        rowData.status,
        rowData.evaluationPeriodId,
        isChangeTime ? goalEvaluationTimes : [],
        isChangeTime ? goalDepartmentEvaluationTimes : [],
        rowData.id,
        rowData.type,
        dataMailCCs,
        () => {
          message.success(t('MESSAGE.COMMON.IDM_SEND_MAIL_SUCCESS'));
          handleSearch();
          setSelectRows([]);
          onClose();
        },
        setIsSending,
        () => {
          /* handled above */
        },
        isFilterStatus,
      );
    } catch {
      message.error(t('IDS_SEND_FAILED'));
      setIsSending(false);
    }
  }, [
    isEditing,
    editBody,
    viewBody,
    editSubject,
    viewSubject,
    toUserList,
    dataMailCCs,
    emailTypeState,
    rowData,
    isChangeTime,
    goalEvaluationTimes,
    goalDepartmentEvaluationTimes,
    type,
    handleSearch,
    setSelectRows,
    onClose,
  ]);

  const handleSend = useCallback(() => {
    if (isChangeTime && (!goalEvaluationTimes[0] || !goalDepartmentEvaluationTimes[0])) {
      message.warning(t('IDS_PERIOD_REQUIRED'));
      return;
    }
    setIsConfirmOpen(true);
  }, [isChangeTime, goalEvaluationTimes, goalDepartmentEvaluationTimes]);

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
        currentSubject = viewSubject;
      }
      const resolvedBody = resolveAllTokens(rawBody);
      const result: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/send-mail-now', {
        content: { toEmails: selfEmail, mailContent: { subject: currentSubject, editor: resolvedBody } },
        inputedValues: {
          evaluationPeriodId: rowData.evaluationPeriodId ?? 0,
          status: rowData.status,
          type: emailTypeState,
          sendTimeSetting: null,
          sendTimeActual: dayjs().format('YYYY/M/D H:mm'),
          title: currentSubject,
          contentMail: resolvedBody,
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
  }, [isEditing, editBody, viewBody, editSubject, viewSubject, resolveAllTokens, rowData, emailTypeState, user]);

  // ── Recipient modal ───────────────────────────────────────────
  const openRecipientModal = useCallback(async () => {
    setTempToList([...toUserList]);
    setEmailsToAdd([]);
    setIsRecipientModalOpen(true);
    if (defaultMail) setProtectedEmailIndex(toUserList.indexOf(defaultMail));
    setIsLoadingEmailList(true);
    try {
      const res: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/users-email-list', {
        conditions: JSON.stringify(toUserList),
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
  }, [toUserList]);

  const confirmRecipientSelection = useCallback(() => {
    const merged = [...tempToList];
    if (emailsToAdd.length > 0) {
      const existing = new Set(merged);
      emailsToAdd
        .filter((e) => !existing.has(e))
        .forEach((e) => {
          if (e === defaultMail && protectedEmailIndex >= 0 && protectedEmailIndex <= merged.length) {
            merged.splice(protectedEmailIndex, 0, e);
          } else {
            merged.push(e);
          }
        });
    }
    setToUserList(merged);
    setIsRecipientModalOpen(false);
  }, [tempToList, emailsToAdd, defaultMail, protectedEmailIndex]);

  const removeTempRecipient = useCallback((email: string) => {
    setTempToList((p) => p.filter((e) => e !== email));
  }, []);

  const addEmailsToList = useCallback(() => {
    if (emailsToAdd.length === 0) return;
    setTempToList((p) => {
      const existing = new Set(p);
      const toInsert = emailsToAdd.filter((e) => !existing.has(e));
      const result = [...p];
      toInsert.forEach((e) => {
        if (e === defaultMail && protectedEmailIndex >= 0 && protectedEmailIndex <= result.length) {
          result.splice(protectedEmailIndex, 0, e);
        } else {
          result.push(e);
        }
      });
      return result;
    });
    setEmailsToAdd([]);
  }, [emailsToAdd, defaultMail, protectedEmailIndex]);

  // ── CSS overrides for Quill ───────────────────────────────────
  const quillCssOverride = useMemo(
    () => (
      <style>
        {!isEditing
          ? `.fixed-mail-quill .ql-toolbar{display:none!important}.fixed-mail-quill .ql-container{border:none!important}`
          : `.fixed-mail-quill .ql-toolbar.ql-snow{border:none!important;border-bottom:1px solid #e2e8f0!important}.fixed-mail-quill .ql-container.ql-snow{border:none!important}`}
      </style>
    ),
    [isEditing],
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════ Main Modal ══════════════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        title={
          <Typography.Title
            style={{
              paddingBottom: 15,
              borderBottom: '1px solid #F0F0F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            level={4}
          >
            <MailOutlined style={{ color: ICON_COLOR }} />
            {t('IDS_SEND_MAIL')}
            {isEditing && (
              <Tag color="blue" style={{ margin: '0 0 0 4px', fontWeight: 600 }}>
                {t('IDS_EDITING')}
              </Tag>
            )}
          </Typography.Title>
        }
        open={isOpen}
        onCancel={onClose}
        afterClose={handleAfterClose}
        width={900}
        style={{ top: 20 }}
        destroyOnClose
        footer={null}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
        maskClosable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 170px)' }}>
          {/* ── Scrollable content ─────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', minHeight: 0 }}>
            <Spin spinning={isLoading} tip={t('IDS_LOADING')} size="small">
              {/* ═══════════ HEADER STRIP ═══════════════════════════ */}
              <div
                style={{
                  overflow: 'hidden',
                  marginBottom: isChangeTime ? 10 : 0,
                }}
              >
                {/* ── 宛先 ────────────────────────────────────────── */}
                <StripRow
                  label={t('IDS_MAIL_TO')}
                  alignItems="center"
                  isChangeTime={isChangeTime}
                  marginBottom={10}
                  action={
                    <Tooltip
                      title={t('IDS_ADD_CHANGE_RECIPIENT')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
                    >
                      <Button
                        size="small"
                        icon={<EllipsisOutlined />}
                        onClick={
                          type === 'userAndEvaluatorWithoutTime' ? () => setIsCCListOpen(true) : openRecipientModal
                        }
                      />
                    </Tooltip>
                  }
                >
                  {toUserList.length === 0 ? (
                    <Typography.Text type="secondary" style={{ fontSize: FONT_SIZE }}>
                      {t('IDS_NO_RECIPIENT')}
                    </Typography.Text>
                  ) : (
                    <Cascader
                      options={toUserList.map((email) => ({ label: email, value: email }))}
                      multiple
                      disabled
                      maxTagCount="responsive"
                      value={toUserList.map((email) => [email])}
                      style={{ width: '100%' }}
                    />
                  )}
                </StripRow>

                {/* ── 実施期間 (isChangeTime のみ) ─────────────────── */}
                {isChangeTime && (
                  <>
                    <StripRow
                      label={isFixedGoal ? t('IDS_DEPT_GOAL') : t('IDS_DEPARTMENT_RESULT')}
                      alignItems="center"
                      isChangeTime={isChangeTime}
                      marginBottom={10}
                    >
                      <RangePicker
                        locale={localeJa}
                        format="YYYY/M/D"
                        onCalendarChange={(_, date) => setGoalDepartmentEvaluationTimes(date)}
                        disabled={[isDepartmentSaved, false]}
                        disabledDate={disabledDateDepartment}
                        allowClear={false}
                        defaultValue={[dateDepartments[0], dateDepartments[1]]}
                      />
                    </StripRow>
                    <StripRow
                      label={isFixedGoal ? t('IDS_ACHIEVEMENT_PERSONAL') : t('IDS_EVALUATION_PERSONAL')}
                      alignItems="center"
                      noBorder
                      isChangeTime={isChangeTime}
                    >
                      <RangePicker
                        locale={localeJa}
                        format="YYYY/M/D"
                        onCalendarChange={(_, date) => setGoalEvaluationTimes(date)}
                        disabled={[isPersonalSaved, false]}
                        disabledDate={disabledDate}
                        allowClear={false}
                        defaultValue={[dateGoals[0], dateGoals[1]]}
                      />
                    </StripRow>
                  </>
                )}
              </div>

              {/* ═══════════ EDIT / VIEW SECTION ════════════════════ */}
              {!isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '0px 0 10px' }}>
                  <Button type="primary" size="middle" onClick={enterEdit} icon={<EditOutlined />}>
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

              {/* ── 件名 view mode ── */}
              {!isEditing && (
                <div style={{ marginBottom: 10 }}>
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

              {/* ── 件名 edit mode ── */}
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

              {/* ── Token bar (edit mode) ── */}
              {isEditing && tokens.length > 0 && (
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
                  <div
                    className="fixed-mail-quill"
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
                    {/* <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                      件名
                    </Typography.Text>
                    <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#1a1a1a' }}>
                      {previewSubject || <Typography.Text type="secondary">—</Typography.Text>}
                    </div> */}
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
          <div style={{ padding: '5px 10px 0 0px', flexShrink: 0, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="middle" type="primary" loading={isSending} onClick={handleSend} style={{ fontWeight: 600 }}>
                  {t('IDS_BUTTON_SEND')}
                </Button>
                <Button
                  size="middle"
                  icon={isPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={handleTogglePreview}
                  disabled={isSending || isSendingTest}
                >
                  {t('IDS_PREVIEW')}
                </Button>
                <Button size="middle" onClick={onClose} disabled={isSending || isSendingTest}>
                  {t('IDS_BUTTON_CANCEL')}
                </Button>
              </div>
              <Tooltip
                title={`自分（${user?.email || ''}）へテストメールを送信します`}
                color="#424242"
                overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
              >
                <Button size="middle" icon={<SendOutlined />} loading={isSendingTest} onClick={handleTestSend} disabled={isSending}>
                  テスト送信
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════ 送信確認 Modal ══════════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        open={isConfirmOpen}
        title={
          <Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
            {t('POPUP_DIALOG.TITLE.CONFIRM')}
          </Typography.Title>
        }
        onCancel={() => setIsConfirmOpen(false)}
        zIndex={1010}
        width={420}
        style={{ top: 20 }}
        maskClosable={false}
        destroyOnClose
        footer={null}
      >
        <p>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SEND_MAIL')}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <Button
            size="middle"
            type="primary"
            loading={isSending}
            onClick={async () => {
              await executeSend();
              setIsConfirmOpen(false);
            }}
          >
            {t('IDS_BUTTON_SEND')}
          </Button>
          <Button size="middle" onClick={() => setIsConfirmOpen(false)} disabled={isSending}>
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </div>
      </Modal>

      {/* ══════════════════════ CC per-user Modal (userAndEvaluatorWithoutTime) ══════════ */}
      {type === 'userAndEvaluatorWithoutTime' && (
        <ShowMoreMailCCPopUp
          isOpenMailCCList={isCCListOpen}
          setOpenMailCCList={setIsCCListOpen}
          toUserList={toUserList}
          dataMailCCs={dataMailCCs}
          setDataMailCCs={(v) => setDataMailCCs(v)}
          handleFormValue={handleFormValue}
          handleGetListUserAndEvaluatorsEmails={handleGetListUserAndEvaluatorsEmails}
          emailEmployeeMap={emailEmployeeMap}
        />
      )}

      {/* ══════════════════════ 宛先編集 Modal ══════════════════════ */}
      <Modal
        rootClassName="send-mail-modal"
        title={
          <Typography.Title level={4} style={{ paddingBottom: 15 }}>
            <UserOutlined style={{ color: ICON_COLOR, paddingRight: 5 }} />
            {t('IDS_RECIPIENT_SETTING')}
          </Typography.Title>
        }
        open={isRecipientModalOpen}
        onCancel={() => setIsRecipientModalOpen(false)}
        width={560}
        style={{ top: 20 }}
        zIndex={1010}
        destroyOnClose
        maskClosable={false}
        footer={null}
      >
        {/* メールを追加 - evaluatorWithoutTime / evaluatorWithoutTimeStatus では非表示 */}
        {type !== 'evaluatorWithoutTime' && type !== 'evaluatorWithoutTimeStatus' && (
          <div style={{ marginBottom: 15 }}>
            <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 0 }}>
              {t('IDS_ADD_MAIL')}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Select
                mode="multiple"
                placeholder=""
                style={{ flex: 1 }}
                value={emailsToAdd}
                onChange={setEmailsToAdd}
                options={[
                  ...(defaultMail && !tempToList.includes(defaultMail)
                    ? [{ label: `${defaultMail} (デフォルト)`, value: defaultMail }]
                    : []),
                  ...usersEmailList.filter((opt) => !tempToList.includes(opt.value)),
                ]}
                loading={isLoadingEmailList}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                maxTagCount="responsive"
                notFoundContent={
                  isLoadingEmailList ? (
                    <Spin size="small" />
                  ) : (
                    <Typography.Text type="secondary">{t('IDS_NO_CANDIDATE')}</Typography.Text>
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
          </div>
        )}

        {/* 現在の送信先 */}
        <div>
          <div style={{ fontSize: FONT_SIZE, fontWeight: 600, color: '#374151', marginBottom: 0 }}>
            {t('IDS_CURRENT_RECIPIENT')}
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto', border: `1px solid ${STRIP_BORDER}`, borderRadius: 6 }}>
            {tempToList.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#9CA3AF', fontSize: FONT_SIZE }}>
                {t('IDS_NO_SEND_RECIPIENT')}
              </div>
            ) : (
              tempToList.map((email) => {
                const isDefault = email === defaultMail;
                return (
                  <div
                    key={email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: `1px solid ${STRIP_BORDER}`,
                      gap: 8,
                      background: isDefault ? '#FFFBEB' : '#fff',
                    }}
                  >
                    <UserOutlined style={{ color: isDefault ? '#F59E0B' : '#6B7280', flexShrink: 0 }} />
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
                    {isDefault && (
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
                    {(isDefault || type !== 'evaluatorWithoutTimeStatus') && (
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeTempRecipient(email)}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <Button size="middle" type="primary" icon={<CheckOutlined />} onClick={confirmRecipientSelection}>
            {t('IDS_CONFIRM_TEXT')}
            {`(${tempToList.length + emailsToAdd.filter((e) => !tempToList.includes(e)).length}${t(
              'IDS_PERSON_COUNT_SUFFIX',
            )})`}
          </Button>
          <Button size="middle" onClick={() => setIsRecipientModalOpen(false)}>{t('IDS_BUTTON_CANCEL')}</Button>
        </div>
      </Modal>
    </>
  );
};

export default SendEmailModalFixed;
