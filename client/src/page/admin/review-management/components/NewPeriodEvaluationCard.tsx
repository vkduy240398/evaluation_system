import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { WarningFilled, RightOutlined, GlobalOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import moment from 'moment';
import { urlCompanyCode } from '../../../../common/util';

interface DateRange {
  start: string | null;
  end: string | null;
}

interface NewPeriodEvaluationCardProps {
  item: any;
  fixedGoal: (item: any) => void;
  undoFixGoal: (item: any) => void;
  fixedEvaluation: (item: any) => void;
  undoFixEvaluation: (item: any) => void;
  fixedEvaluationPublic: (item: any) => void;
  onClick: () => void;
  isCurrentPeriod?: boolean;
}

/* ── Responsive breakpoints ──────────────────────────────────────────────────
 *  < 768  → MOBILE   : vertical stepper (phone + small tablet)
 *  768–991 → TABLET  : compact horizontal (iPad portrait, tablet landscape)
 *  ≥ 992  → DESKTOP  : full horizontal (iPad landscape, laptop, desktop)
 * ────────────────────────────────────────────────────────────────────────── */
type ViewMode = 'mobile' | 'tablet' | 'desktop';

function useViewMode(): ViewMode {
  const [mode, setMode] = useState<ViewMode>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return w < 768 ? 'mobile' : w < 992 ? 'tablet' : 'desktop';
  });

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setMode(w < 768 ? 'mobile' : w < 992 ? 'tablet' : 'desktop');
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return mode;
}

const NewPeriodEvaluationCard: React.FC<NewPeriodEvaluationCardProps> = ({
  item,
  fixedGoal,
  undoFixGoal,
  fixedEvaluation,
  undoFixEvaluation,
  fixedEvaluationPublic,
  onClick,
  isCurrentPeriod = false,
}) => {
  const view = useViewMode();

  const goalIndiv: DateRange | null = item.goalDeptRange?.start ? item.goalDeptRange : null;
  const evalIndiv: DateRange | null = item.evalDeptRange?.start ? item.evalDeptRange : null;

  /* ── Business logic (mirrors PeriodEvaluationCard exactly) ── */
  const isGoalConfirmEnabled = () =>
    item.totalRecord > 0 && item.goalFixedRecord !== item.totalRecord;

  const isDisplayFixEvalation = () => {
    const endPersonal = item.personalEvaluation?.split(' ～ ')[0];
    const endDivision = item.divisionEvaluate?.split(' ～ ')[0];
    if (!endPersonal && !endDivision) return false;
    return (
      item.checkFixed !== 2 &&
      item.totalRecord !== 0 &&
      ((endPersonal &&
        moment(endPersonal, 'YYYY/M/D').format('YYYY/MM/DD') <=
          moment().format('YYYY/MM/DD')) ||
        (endDivision &&
          moment(endDivision, 'YYYY/M/D').format('YYYY/MM/DD') <=
            moment().format('YYYY/MM/DD')))
    );
  };

  const isDisplayPublicEvaluation = () =>
    item.checkFixed <= 1 &&
    item.evaluationConfirmRecord === 0 &&
    item.totalRecord !== 0;

  const canUndoGoal = () =>
    item.checkFixed !== 2 &&
    moment(item.personalEvaluation?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
      moment().format('YYYY/MM/DD') &&
    moment(item.divisionEvaluate?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
      moment().format('YYYY/MM/DD');

  const canGoalConfirm = isGoalConfirmEnabled();
  const canEvalConfirm = isDisplayFixEvalation();
  const canPublish     = isDisplayPublicEvaluation();
  const isUndoGoalOk  = canUndoGoal();
  const isUndoEvalOk  = item.checkFixed !== 2;
  const isCompleted   = item.checkFixed === 2;
  const isStarted     = item.totalRecord > 0;

  /* Visibility rules — identical to old PeriodEvaluationCard */
  const showGoalAction    = isStarted && !isCompleted;
  const showEvalAction    = canEvalConfirm;
  const showPublishAction = canPublish;

  /* ── Colors ── */
  const primaryColor =
    isCompleted ? '#2B6CB0' : isStarted ? '#007240' : '#7C8795';
  const bgColor =
    isCompleted ? '#EBF8FF' : isStarted ? '#E6F4EA' : '#EBEBEB';
  const statusLabel = isCompleted
    ? t('IDS_STATUS_COMPLETED')
    : isStarted
    ? t('EVALUATION_PERIOD_SCREEN.IDS_IN_PROGRESS')
    : t('IDS_STATUS_NOT_STARTED');

  /* ── Alert URLs ── */
  const sfx =
    item.periodIndex === 1
      ? t('IDS_FIRST_PERIOD_WITH_YEAR')
      : t('IDS_SECOND_PERIOD_WITH_YEAR');
  const baseUrl = `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${item.id}&year=${item.year}${sfx}`;
  const goalAlertUrl =
    canGoalConfirm && item.goalRecord > 0
      ? `${baseUrl}&type=fixedGoal`
      : null;
  const evalAlertUrl =
    canEvalConfirm && item.evaluationRecord > 0
      ? `${baseUrl}&type=fixedEvaluation`
      : null;
  const publicAlertUrl =
    canPublish && item.evaluationConfirmRecord > 0 && item.checkFixed === 1
      ? `${baseUrl}&type=fixedEvaluationConfirm`
      : null;

  /* ── Active states ── */
  const circleOn = [
    true,
    isStarted,
    isStarted,
    canEvalConfirm || isCompleted,
    canPublish     || isCompleted,
  ];
  const connOn = [
    isStarted,
    isStarted,
    canEvalConfirm || isCompleted,
    canPublish     || isCompleted,
  ];

  /* ── Size tokens per view ── */
  const CIRC      = view === 'desktop' ? 28 : 24;
  const FONT_LBL  = view === 'desktop' ? 12 : 11;
  const FONT_DATE = view === 'desktop' ? 11 : 10;
  const FONT_BTN  = view === 'desktop' ? 12 : 11;
  const BTN_H     = view === 'desktop' ? 26 : 22;

  /* ── Shared sub-components ── */

  const StepCircle = ({ idx }: { idx: number }) => (
    <div
      style={{
        width: CIRC, height: CIRC, borderRadius: '50%',
        background: circleOn[idx] ? primaryColor : '#bfbfbf',
        color: '#fff', fontSize: CIRC >= 28 ? 13 : 11, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {idx + 1}
    </div>
  );

  const AlertBtn = ({ url }: { url: string }) => (
    <button
      onClick={(e) => { e.stopPropagation(); window.open(url, '_blank'); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: 10, height: 20, padding: '0 6px', borderRadius: 3,
        border: '1px solid #fa8c16', background: '#fa8c16',
        color: '#fff', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
      }}
    >
      <WarningFilled style={{ fontSize: 9 }} /> Alert
    </button>
  );

  const IndivBadge = ({ range }: { range: DateRange | null }) => {
    if (!range?.start) return null;
    return (
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
          background: '#FFF8E1', border: '1px solid #FFB300',
          borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#7D5100',
        }}
      >
        <span
          style={{
            background: '#FA8C16', color: '#fff', borderRadius: 3,
            padding: '1px 4px', fontSize: 9, fontWeight: 600,
          }}
        >
          個別
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>
          {range.start} ～ {range.end}
        </span>
      </div>
    );
  };

  const btnConfirmStyle = (disabled: boolean): React.CSSProperties => ({
    height: BTN_H, padding: '0 8px', borderRadius: 4,
    border: `1px solid ${disabled ? '#d9d9d9' : primaryColor}`,
    background: disabled ? '#f5f5f5' : primaryColor,
    color: disabled ? 'rgba(0,0,0,0.25)' : '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: FONT_BTN, fontWeight: 500,
    display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap',
  });

  const btnUndoStyle = (enabled: boolean): React.CSSProperties => ({
    height: BTN_H, padding: '0 8px', borderRadius: 4,
    border: '1px solid #d9d9d9', background: '#fff',
    color: enabled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.25)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontSize: FONT_BTN,
    display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
  });

  /* Goal dates block (reused in both layouts) */
  const GoalDates = () => (
    <>
      {item.departmentGoals && (
        <div style={{ fontSize: FONT_DATE, lineHeight: '18px', color: '#444' }}>
          <span style={{ fontWeight: 600, color: '#555' }}>
            {t('IDS_DEPARTMENT_PERIOD')}:
          </span>{' '}
          {item.departmentGoals}
        </div>
      )}
      {item.goals && (
        <div style={{ fontSize: FONT_DATE, lineHeight: '18px', color: '#444' }}>
          <span style={{ fontWeight: 600, color: '#555' }}>
            {t('IDS_PERSONAL_PERIOD')}:
          </span>{' '}
          {item.goals}
        </div>
      )}
      <IndivBadge range={goalIndiv} />
    </>
  );

  /* Eval dates block (reused in both layouts) */
  const EvalDates = () => (
    <>
      {item.divisionEvaluate && (
        <div style={{ fontSize: FONT_DATE, lineHeight: '18px', color: '#444' }}>
          <span style={{ fontWeight: 600, color: '#555' }}>
            {t('IDS_DEPARTMENT_PERIOD')}:
          </span>{' '}
          {item.divisionEvaluate}
        </div>
      )}
      {item.personalEvaluation && (
        <div style={{ fontSize: FONT_DATE, lineHeight: '18px', color: '#444' }}>
          <span style={{ fontWeight: 600, color: '#555' }}>
            {t('IDS_PERSONAL_PERIOD')}:
          </span>{' '}
          {item.personalEvaluation}
        </div>
      )}
      <IndivBadge range={evalIndiv} />
    </>
  );

  /* Action block for 目標確定 / 結果確定 */
  const ActionBlock = ({
    fixedCount,
    total,
    alertUrl,
    onConfirm,
    onUndo,
    confirmDisabled,
    undoEnabled,
    vertical,
  }: {
    fixedCount: number;
    total: number;
    alertUrl: string | null;
    onConfirm: () => void;
    onUndo: () => void;
    confirmDisabled: boolean;
    undoEnabled: boolean;
    vertical?: boolean;
  }) => (
    <div
      style={{
        marginTop: 6,
        textAlign: vertical ? 'left' : 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: vertical ? 'flex-start' : 'center',
        gap: 5,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: vertical ? 'flex-start' : 'center',
          gap: 4,
        }}
      >
        <span style={{ fontSize: FONT_DATE, whiteSpace: 'nowrap' }}>
          {fixedCount}/{total}{t('IDS_RECORD')}
        </span>
        {alertUrl && <AlertBtn url={alertUrl} />}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Tooltip title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_GOAL')}>
          <button
            disabled={confirmDisabled}
            onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            style={btnConfirmStyle(confirmDisabled)}
          >
            {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
          </button>
        </Tooltip>
        <Tooltip title={t('IDS_UNDO')}>
          <button
            disabled={!undoEnabled}
            onClick={(e) => { e.stopPropagation(); onUndo(); }}
            style={btnUndoStyle(undoEnabled)}
          >
            {t('IDS_UNDO')}
          </button>
        </Tooltip>
      </div>
    </div>
  );

  /*
   * PublishCounter — record count for step 5.
   * Shown ALWAYS when totalRecord > 0 (mirrors getStepDescription(5) in old card).
   */
  const PublishCounter = ({ vertical }: { vertical?: boolean }) => {
    if (!item.totalRecord) return null;
    return (
      <div
        style={{
          marginTop: 6,
          display: 'flex', alignItems: 'center', gap: 4,
          justifyContent: vertical ? 'flex-start' : 'center',
        }}
      >
        <span style={{ fontSize: FONT_DATE, whiteSpace: 'nowrap' }}>
          {item.evaluationConfirmFixedRecord || 0}/{item.totalRecord}{t('IDS_RECORD')}
        </span>
        {publicAlertUrl && <AlertBtn url={publicAlertUrl} />}
      </div>
    );
  };

  /*
   * PublishButton — publish action button.
   * Shown ONLY when canPublish (same as old card Row 3 visibility).
   */
  const PublishButton = ({ vertical }: { vertical?: boolean }) => (
    <div
      style={{
        marginTop: 5,
        display: 'flex',
        justifyContent: vertical ? 'flex-start' : 'center',
      }}
    >
      <Tooltip title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}>
        <button
          onClick={(e) => { e.stopPropagation(); fixedEvaluationPublic(item); }}
          style={btnConfirmStyle(false)}
        >
          <GlobalOutlined style={{ fontSize: 10 }} />
          {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}
        </button>
      </Tooltip>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════
   * VERTICAL LAYOUT  (mobile < 768px)
   *
   * Each step is a horizontal row: [circle] [label + content]
   * Connector between steps: an absolutely-positioned vertical line
   * that spans the connector div's full height.
   * Dates appear in connector zones (preserving the design intent).
   * ═══════════════════════════════════════════════════════════════════════ */
  const renderMobile = () => {
    /* Vertical connector div with optional content to the right of the line */
    const VConn = ({
      idx,
      children,
    }: {
      idx: number;
      children?: React.ReactNode;
    }) => (
      <div style={{ display: 'flex', position: 'relative', minHeight: 16 }}>
        {/* Vertical line (absolutely positioned so it stretches full height) */}
        <div
          style={{
            position: 'absolute',
            left: CIRC / 2 - 1,
            top: 0,
            bottom: 0,
            width: 2,
            background: connOn[idx] ? primaryColor : '#e8e8e8',
          }}
        />
        {/* Placeholder column to keep content aligned with circle */}
        <div style={{ width: CIRC, flexShrink: 0 }} />
        {/* Optional date content */}
        {children && (
          <div style={{ flex: 1, padding: '6px 0 6px 10px' }}>{children}</div>
        )}
      </div>
    );

    /* One step row */
    const VStep = ({
      idx,
      label,
      children,
    }: {
      idx: number;
      label: string;
      children?: React.ReactNode;
    }) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <StepCircle idx={idx} />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <span
            style={{
              fontSize: FONT_LBL, fontWeight: 600, color: '#333', display: 'block',
            }}
          >
            {label}
          </span>
          {children}
        </div>
      </div>
    );

    return (
      <div>
        {/* ① 目標設定 */}
        <VStep idx={0} label={t('IDS_AIM_SETTING')} />

        {/* Connector 0→1 — goal dates */}
        <VConn idx={0}>
          {(item.departmentGoals || item.goals || goalIndiv?.start) && <GoalDates />}
        </VConn>

        {/* ② 目標確定 */}
        <VStep idx={1} label={t('IDS_FIX_GOAL')}>
          {showGoalAction && (
            <ActionBlock
              vertical
              fixedCount={item.goalFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={goalAlertUrl}
              onConfirm={() => fixedGoal(item)}
              onUndo={() => undoFixGoal(item)}
              confirmDisabled={!canGoalConfirm}
              undoEnabled={isUndoGoalOk}
            />
          )}
        </VStep>

        {/* Connector 1→2 — no dates */}
        <VConn idx={1} />

        {/* ③ 評価 */}
        <VStep idx={2} label={t('IDS_EVALUATION')} />

        {/* Connector 2→3 — eval dates */}
        <VConn idx={2}>
          {(item.divisionEvaluate || item.personalEvaluation || evalIndiv?.start) && <EvalDates />}
        </VConn>

        {/* ④ 結果確定 */}
        <VStep idx={3} label={t('IDS_FIX_EVALUATION')}>
          {showEvalAction && (
            <ActionBlock
              vertical
              fixedCount={item.evaluationFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={evalAlertUrl}
              onConfirm={() => fixedEvaluation(item)}
              onUndo={() => undoFixEvaluation(item)}
              confirmDisabled={!canEvalConfirm}
              undoEnabled={isUndoEvalOk}
            />
          )}
        </VStep>

        {/* Connector 3→4 — no dates */}
        <VConn idx={3} />

        {/* ⑤ 評価結果公開 */}
        <VStep idx={4} label={t('IDS_PUBLIC_EVALUATION')}>
          <PublishCounter vertical />
          {showPublishAction && <PublishButton vertical />}
        </VStep>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
   * HORIZONTAL LAYOUT  (tablet ≥ 768px  and  desktop ≥ 992px)
   *
   * Structure: step node ─── connector zone ─── step node ─── ...
   * Connector zones contain the horizontal line (at circle-centre height)
   * and, for zones 0→1 and 2→3, the date ranges below the line.
   * ═══════════════════════════════════════════════════════════════════════ */
  const renderHorizontal = () => {
    /* The 2px horizontal bar at circle-centre height */
    const HLine = ({ idx }: { idx: number }) => (
      <div
        style={{
          marginTop: CIRC / 2 - 1,
          height: 2,
          background: connOn[idx] ? primaryColor : '#e8e8e8',
        }}
      />
    );

    const stepLabelStyle: React.CSSProperties = {
      fontSize: FONT_LBL, fontWeight: 600, color: '#333',
      display: 'block', textAlign: 'center', marginTop: 6,
      whiteSpace: view === 'desktop' ? 'nowrap' : 'normal',
      maxWidth: view === 'tablet' ? 80 : undefined,
    };

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ① 目標設定 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <StepCircle idx={0} />
          <span style={stepLabelStyle}>{t('IDS_AIM_SETTING')}</span>
        </div>

        {/* Connector 0→1 — goal dates below the line */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <HLine idx={0} />
          <div style={{ padding: '6px 8px 0' }}>
            <GoalDates />
          </div>
        </div>

        {/* ② 目標確定 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <StepCircle idx={1} />
          <span style={stepLabelStyle}>{t('IDS_FIX_GOAL')}</span>
          {showGoalAction && (
            <ActionBlock
              fixedCount={item.goalFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={goalAlertUrl}
              onConfirm={() => fixedGoal(item)}
              onUndo={() => undoFixGoal(item)}
              confirmDisabled={!canGoalConfirm}
              undoEnabled={isUndoGoalOk}
            />
          )}
        </div>

        {/* Connector 1→2 — line only */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <HLine idx={1} />
        </div>

        {/* ③ 評価 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <StepCircle idx={2} />
          <span style={stepLabelStyle}>{t('IDS_EVALUATION')}</span>
        </div>

        {/* Connector 2→3 — eval dates below the line */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <HLine idx={2} />
          <div style={{ padding: '6px 8px 0' }}>
            <EvalDates />
          </div>
        </div>

        {/* ④ 結果確定 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <StepCircle idx={3} />
          <span style={stepLabelStyle}>{t('IDS_FIX_EVALUATION')}</span>
          {showEvalAction && (
            <ActionBlock
              fixedCount={item.evaluationFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={evalAlertUrl}
              onConfirm={() => fixedEvaluation(item)}
              onUndo={() => undoFixEvaluation(item)}
              confirmDisabled={!canEvalConfirm}
              undoEnabled={isUndoEvalOk}
            />
          )}
        </div>

        {/* Connector 3→4 — line only */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <HLine idx={3} />
        </div>

        {/* ⑤ 評価結果公開 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <StepCircle idx={4} />
          <span style={stepLabelStyle}>{t('IDS_PUBLIC_EVALUATION')}</span>
          <PublishCounter />
          {showPublishAction && <PublishButton />}
        </div>

      </div>
    );
  };

  /* ── Card shell ── */
  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderLeft: isCurrentPeriod ? '4px solid #389e0d' : '4px solid #bfbfbf',
        borderRadius: 6,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: view === 'mobile' ? '8px 12px' : '8px 16px',
          borderBottom: '1px solid #f0f0f0',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: view === 'mobile' ? 'wrap' : 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Typography.Text
            strong
            style={{ fontSize: view === 'mobile' ? 13 : 14, cursor: 'pointer' }}
            onClick={onClick}
          >
            {item.evaluationPeriod}
          </Typography.Text>
          <Tag
            style={{
              margin: 0, background: primaryColor, color: '#fff',
              fontSize: 11, lineHeight: '18px', border: 'none', flexShrink: 0,
            }}
          >
            {statusLabel}
          </Tag>
        </div>
        <button
          onClick={onClick}
          style={{
            background: 'transparent', color: primaryColor,
            border: `1px solid ${primaryColor}`, borderRadius: 4,
            padding: view === 'mobile' ? '3px 10px' : '4px 14px',
            cursor: 'pointer', fontSize: view === 'mobile' ? 11 : 12,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            flexShrink: 0,
          }}
        >
          詳細を見る <RightOutlined style={{ fontSize: 10 }} />
        </button>
      </div>

      {/* ── Stepper body ── */}
      <div
        style={{ padding: view === 'mobile' ? '14px 12px' : '14px 16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {view === 'mobile' ? renderMobile() : renderHorizontal()}
      </div>
    </div>
  );
};

export default NewPeriodEvaluationCard;
