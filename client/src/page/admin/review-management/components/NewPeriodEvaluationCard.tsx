import React, { useState, useEffect, ReactNode } from 'react';
import { Button, Tag, Tooltip, Typography } from 'antd';
import {
  WarningFilled,
  RightOutlined,
  GlobalOutlined,
  UndoOutlined,
  TeamOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
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
  const isGoalConfirmEnabled = () => item.totalRecord > 0 && item.goalFixedRecord !== item.totalRecord;

  const isDisplayFixEvalation = () => {
    const endPersonal = item.personalEvaluation?.split(' ～ ')[0];
    const endDivision = item.divisionEvaluate?.split(' ～ ')[0];
    if (!endPersonal && !endDivision) return false;
    return (
      item.checkFixed !== 2 &&
      item.totalRecord !== 0 &&
      ((endPersonal && moment(endPersonal, 'YYYY/M/D').format('YYYY/MM/DD') <= moment().format('YYYY/MM/DD')) ||
        (endDivision && moment(endDivision, 'YYYY/M/D').format('YYYY/MM/DD') <= moment().format('YYYY/MM/DD')))
    );
  };

  const isDisplayPublicEvaluation = () =>
    item.checkFixed <= 1 && item.evaluationConfirmRecord === 0 && item.totalRecord !== 0;

  const canUndoGoal = () =>
    item.checkFixed !== 2 &&
    moment(item.personalEvaluation?.split(' ～ ')[0]).format('YYYY/MM/DD') >= moment().format('YYYY/MM/DD') &&
    moment(item.divisionEvaluate?.split(' ～ ')[0]).format('YYYY/MM/DD') >= moment().format('YYYY/MM/DD');

  const canGoalConfirm = isGoalConfirmEnabled();
  const canEvalConfirm = isDisplayFixEvalation();
  const canPublish = isDisplayPublicEvaluation();
  const isUndoGoalOk = canUndoGoal();
  const isUndoEvalOk = item.checkFixed !== 2;
  const isCompleted = item.checkFixed === 2;
  const isStarted = item.totalRecord > 0;

  /* Visibility rules — identical to old PeriodEvaluationCard */
  const showGoalAction = isStarted && !isCompleted;
  const showEvalAction = canEvalConfirm;
  const showPublishAction = canPublish;

  /* ── Colors ── */
  const primaryColor = isCompleted ? '#2B6CB0' : isStarted ? '#007240' : '#7C8795';
  const bgColor = isCompleted ? '#EBF8FF' : isStarted ? '#E6F4EA' : '#EBEBEB';
  const statusLabel = isCompleted
    ? t('IDS_STATUS_COMPLETED')
    : isStarted
    ? t('EVALUATION_PERIOD_SCREEN.IDS_IN_PROGRESS')
    : t('IDS_STATUS_NOT_STARTED');

  /* ── Alert URLs ── */
  const sfx = item.periodIndex === 1 ? t('IDS_FIRST_PERIOD_WITH_YEAR') : t('IDS_SECOND_PERIOD_WITH_YEAR');
  const baseUrl = `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${item.id}&year=${item.year}${sfx}`;
  const goalAlertUrl = canGoalConfirm && item.goalRecord > 0 ? `${baseUrl}&type=fixedGoal` : null;
  const evalAlertUrl = canEvalConfirm && item.evaluationRecord > 0 ? `${baseUrl}&type=fixedEvaluation` : null;
  const publicAlertUrl =
    canPublish && item.evaluationConfirmRecord > 0 && item.checkFixed === 1
      ? `${baseUrl}&type=fixedEvaluationConfirm`
      : null;

  /* ── Step active states (mirrors PeriodEvaluationCard getCurrentStep) ── */
  const getCurrentStep = (): number => {
    if (item.checkFixed === 2) return 6;
    if (item.checkFixed === 1) return 5;
    if (canEvalConfirm) return 4;
    if (item.totalRecord > 0 && item.goalFixedRecord === item.totalRecord) return 3;
    if (item.totalRecord > 0) return 2;
    return 0;
  };
  const currentStep = getCurrentStep();
  const stepDone = (s: number) => s < currentStep;
  const stepActive = (s: number) => s === currentStep;
  const circleOn = [1, 2, 3, 4, 5].map((s) => stepDone(s) || stepActive(s));
  const connOn = [1, 2, 3, 4].map((s) => stepDone(s));

  /* ── Size tokens per view ──────────────────────────────────────────────────
   * BASE_FONT: điều chỉnh 1 biến này để thay đổi font size toàn bộ card.
   * Các biến khác tính tương đối so với BASE_FONT.
   * ─────────────────────────────────────────────────────────────────────── */
  const BASE_FONT = 14;
  const CIRC = view === 'desktop' ? 28 : 24;
  const FONT_LBL = BASE_FONT;
  const FONT_DATE = BASE_FONT;
  const FONT_BTN = BASE_FONT;
  const FONT_BADGE = BASE_FONT;
  const FONT_TOOLTIP = 11;
  const FONT_ICON = BASE_FONT + 1;
  const BTN_H = 20;

  /* ── Shared sub-components ── */

  const StepCircle = ({ idx }: { idx: number }) => (
    <div
      style={{
        width: CIRC,
        height: CIRC,
        borderRadius: '50%',
        background: circleOn[idx] ? primaryColor : '#bfbfbf',
        color: '#fff',
        fontSize: CIRC >= 28 ? 13 : 11,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {idx + 1}
    </div>
  );

  const AlertBtn = ({ url, count }: { url: string; count?: number }) => (
    <Tooltip title={t('IDS_ALERT')} color="#424242" overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(url, '_blank');
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          height: BTN_H,
          borderRadius: 4,
          border: '1px solid #fa8c16',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          textDecoration: 'underline',
          minWidth: 62,
          justifyContent: 'center',
        }}
      >
        <WarningFilled style={{}} />
        {count !== undefined ? `${count}${t('IDS_RECORD')}` : 'Alert'}
      </button>
    </Tooltip>
  );

  const GoalIndivIcon = ({ range }: { range: DateRange | null }) => {
    if (!range?.start) return null;
    return (
      <Tooltip
        title={`個別目標設定期間：個別設定された全データの「最早開始日」から「最遅終了日」までの範囲を表示しています。`}
        color="#424242"
        overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
      >
        <InfoCircleOutlined
          style={{ fontSize: FONT_ICON, color: 'rgb(110, 91, 20)', cursor: 'help', verticalAlign: 'middle' }}
        />
      </Tooltip>
    );
  };

  const EvalIndivIcon = ({ range }: { range: DateRange | null }) => {
    if (!range?.start) return null;
    return (
      <Tooltip
        title={`個別評価実施期間：個別設定された全データの「最早開始日」から「最遅終了日」までの範囲を表示しています。`}
        color="#424242"
        overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
      >
        <InfoCircleOutlined
          style={{ fontSize: FONT_ICON, color: 'rgb(110, 91, 20)', cursor: 'help', verticalAlign: 'middle' }}
        />
      </Tooltip>
    );
  };

  const btnConfirmStyle = (disabled: boolean): React.CSSProperties => ({
    height: BTN_H,
    padding: '0 8px',
    borderRadius: 4,
    border: `1px solid ${disabled ? '#d9d9d9' : primaryColor}`,
    background: disabled ? '#f5f5f5' : primaryColor,
    color: disabled ? 'rgba(0,0,0,0.25)' : '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: FONT_BTN,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    whiteSpace: 'nowrap',
  });

  const btnUndoStyle = (enabled: boolean): React.CSSProperties => ({
    height: BTN_H,
    padding: '0 8px',
    borderRadius: 4,
    border: '1px solid #d9d9d9',
    background: '#fff',
    color: enabled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.25)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontSize: FONT_BTN,
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  });

  const DateRow = ({ label, value }: { label: ReactNode; value: string }) => (
    <div style={{ fontSize: FONT_DATE, lineHeight: '18px', color: '#444', whiteSpace: 'nowrap', marginBottom: 5 }}>
      <span style={{ fontWeight: 600, color: '#555' }}>{label}</span> {value}
    </div>
  );

  /* Goal dates block (reused in both layouts) */
  const GoalDates = () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 0 }}>
      {item.departmentGoals && <DateRow label={t('IDS_DEPARTMENT_PERIOD')} value={item.departmentGoals} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {item.goals && <DateRow label={t('IDS_PERSONAL_PERIOD')} value={item.goals} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {item.goals && (
          <DateRow
            label={<label style={{}}> {t('IDS_INDIVIDUAL_PERIOD')}</label>}
            value={`${goalIndiv?.start} ～ ${goalIndiv?.end}`}
          />
        )}
        <GoalIndivIcon range={goalIndiv} />
      </div>
    </div>
  );

  /* Eval dates block (reused in both layouts) */
  const EvalDates = () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 0 }}>
      {item.divisionEvaluate && <DateRow label={t('IDS_DEPARTMENT_PERIOD')} value={item.divisionEvaluate} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {item.personalEvaluation && <DateRow label={t('IDS_PERSONAL_PERIOD')} value={item.personalEvaluation} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {item.personalEvaluation && (
          <DateRow
            label={<label style={{}}> {t('IDS_INDIVIDUAL_PERIOD')}</label>}
            value={`${evalIndiv?.start} ～ ${evalIndiv?.end}`}
          />
        )}
        <EvalIndivIcon range={evalIndiv} />
      </div>
    </div>
  );

  /* Action block for 目標確定 / 結果確定 */
  const ActionBlock = ({
    fixedCount,
    total,
    alertUrl,
    alertCount,
    onConfirm,
    onUndo,
    confirmDisabled,
    undoEnabled,
    vertical,
  }: {
    fixedCount: number;
    total: number;
    alertUrl: string | null;
    alertCount?: number;
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: vertical ? 'flex-start' : 'center',
          gap: 4,
        }}
      >
        <span style={{ fontSize: FONT_DATE, whiteSpace: 'nowrap' }}>
          {fixedCount}/{total}
          {t('IDS_RECORD')}
        </span>
        {alertUrl && <AlertBtn url={alertUrl} count={alertCount} />}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Tooltip
          title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_GOAL')}
          color="#424242"
          overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
        >
          <Button
            disabled={confirmDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            type="primary"
            size="middle"
            // style={btnConfirmStyle(confirmDisabled)}
          >
            {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
          </Button>
        </Tooltip>
        <Tooltip title={t('IDS_UNDO')} color="#424242" overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}>
          <Button
            disabled={!undoEnabled}
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
            type="default"
            size="middle"
          >
            {t('IDS_UNDO')}
          </Button>
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
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          justifyContent: vertical ? 'flex-start' : 'center',
        }}
      >
        <span style={{ fontSize: FONT_DATE, whiteSpace: 'nowrap' }}>
          {item.evaluationConfirmFixedRecord || 0}/{item.totalRecord}
          {t('IDS_RECORD')}
        </span>
        {publicAlertUrl && <AlertBtn url={publicAlertUrl} count={item.evaluationConfirmRecord} />}
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
      <Tooltip
        title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}
        color="#424242"
        overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            fixedEvaluationPublic(item);
          }}
          style={btnConfirmStyle(false)}
        >
          <GlobalOutlined style={{ fontSize: FONT_ICON }} />
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
    const VConn = ({ idx, children }: { idx: number; children?: React.ReactNode }) => (
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
        {children && <div style={{ flex: 1, padding: '6px 0 6px 10px' }}>{children}</div>}
      </div>
    );

    /* One step row */
    const VStep = ({ idx, label, children }: { idx: number; label: string; children?: React.ReactNode }) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <StepCircle idx={idx} />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <span
            style={{
              fontSize: FONT_LBL,
              fontWeight: 600,
              color: '#333',
              display: 'block',
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
        <VConn idx={0}>{(item.departmentGoals || item.goals || goalIndiv?.start) && <GoalDates />}</VConn>

        {/* ② 目標確定 */}
        <VStep idx={1} label={t('IDS_FIX_GOAL')}>
          {showGoalAction && (
            <ActionBlock
              vertical
              fixedCount={item.goalFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={goalAlertUrl}
              alertCount={item.goalRecord}
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
        <VConn idx={2}>{(item.divisionEvaluate || item.personalEvaluation || evalIndiv?.start) && <EvalDates />}</VConn>

        {/* ④ 結果確定 */}
        <VStep idx={3} label={t('IDS_FIX_EVALUATION')}>
          {showEvalAction && (
            <ActionBlock
              vertical
              fixedCount={item.evaluationFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={evalAlertUrl}
              alertCount={item.evaluationRecord}
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
    /*
     * CSS Grid: 9 columns = step col × 5 + connector col × 4.
     * Step columns: auto (shrink to circle/label width).
     * Connector columns: 1fr (expand to fill remaining space).
     *
     * Row 1 (circles): all items in row 1 → circles + lines, vertically centred.
     * Row 2 (content): labels + dates/actions in row 2, aligned to top.
     *
     * Because both rows share the same grid-template-columns, circles and
     * their labels are always in the same column → perfectly aligned.
     */
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto 1fr auto',
      width: '100%',
    };

    const stepLabelStyle: React.CSSProperties = {
      fontSize: FONT_LBL,
      fontWeight: 600,
      color: '#333',
      textAlign: 'center',
      marginTop: 6,
      whiteSpace: view === 'desktop' ? 'nowrap' : 'normal',
    };

    /* Line cell — row 1, spans its connector column */
    const ConnLine = ({ col, idx }: { col: number; idx: number }) => (
      <div
        style={{
          gridColumn: col,
          gridRow: 1,
          height: 2,
          background: connOn[idx] ? primaryColor : '#e8e8e8',
          alignSelf: 'center',
        }}
      />
    );

    return (
      <div style={gridStyle}>
        {/* ── Row 1: circles + lines ── */}
        {/* Circles: gridRow 1, each in its step column */}
        {[0, 1, 2, 3, 4].map((idx) => (
          <div key={idx} style={{ gridColumn: idx * 2 + 1, gridRow: 1, display: 'flex', justifyContent: 'center' }}>
            <StepCircle idx={idx} />
          </div>
        ))}
        {/* Lines: gridRow 1, each in its connector column */}
        <ConnLine col={2} idx={0} />
        <ConnLine col={4} idx={1} />
        <ConnLine col={6} idx={2} />
        <ConnLine col={8} idx={3} />

        {/* ── Row 2: labels + dates + actions ── */}
        {/* ① 目標設定 — col 1: label + goal dates below */}
        <div style={{ gridColumn: 1, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={stepLabelStyle}>{t('IDS_AIM_SETTING')}</span>
          <div style={{ marginTop: 4, textAlign: 'left' }}>
            <GoalDates />
          </div>
        </div>

        {/* Connector 0→1 — empty — col 2 */}
        <div style={{ gridColumn: 2, gridRow: 2 }} />

        {/* ② 目標確定 — col 3 */}
        <div style={{ gridColumn: 3, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={stepLabelStyle}>{t('IDS_FIX_GOAL')}</span>
          {showGoalAction && (
            <ActionBlock
              fixedCount={item.goalFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={goalAlertUrl}
              alertCount={item.goalRecord}
              onConfirm={() => fixedGoal(item)}
              onUndo={() => undoFixGoal(item)}
              confirmDisabled={!canGoalConfirm}
              undoEnabled={isUndoGoalOk}
            />
          )}
        </div>

        {/* Connector 1→2 — empty — col 4 */}
        <div style={{ gridColumn: 4, gridRow: 2 }} />

        {/* ③ 評価 — col 5: label + eval dates below */}
        <div style={{ gridColumn: 5, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={stepLabelStyle}>{t('IDS_EVALUATION')}</span>
          <div style={{ marginTop: 4, textAlign: 'left' }}>
            <EvalDates />
          </div>
        </div>

        {/* Connector 2→3 — empty — col 6 */}
        <div style={{ gridColumn: 6, gridRow: 2 }} />

        {/* ④ 結果確定 — col 7 */}
        <div style={{ gridColumn: 7, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={stepLabelStyle}>{t('IDS_FIX_EVALUATION')}</span>
          {showEvalAction && (
            <ActionBlock
              fixedCount={item.evaluationFixedRecord || 0}
              total={item.totalRecord}
              alertUrl={evalAlertUrl}
              alertCount={item.evaluationRecord}
              onConfirm={() => fixedEvaluation(item)}
              onUndo={() => undoFixEvaluation(item)}
              confirmDisabled={!canEvalConfirm}
              undoEnabled={isUndoEvalOk}
            />
          )}
        </div>

        {/* Connector 3→4 — empty — col 8 */}
        <div style={{ gridColumn: 8, gridRow: 2 }} />

        {/* ⑤ 評価結果公開 — col 9 */}
        <div style={{ gridColumn: 9, gridRow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          <Typography.Text strong style={{ fontSize: 16, cursor: 'pointer' }} onClick={onClick}>
            {item.evaluationPeriod}
          </Typography.Text>
          <span
            style={{
              fontSize: FONT_BADGE,
              lineHeight: '18px',
              flexShrink: 0,
              borderRadius: 20,
              padding: '1px 10px',
              background: 'rgb(255, 251, 230)',
              color: 'rgba(121, 119, 119, 0.88)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {statusLabel}
          </span>

          {item.totalRecord > 0 && (
            <span
              style={{
                fontSize: FONT_BADGE,
                lineHeight: '18px',
                flexShrink: 0,
                borderRadius: 10,
                padding: '1px 8px',
                background: 'rgb(255, 251, 230)',
                color: 'rgba(0, 0, 0, 0.88)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              <TeamOutlined style={{ marginRight: 2 }} />
              {item.totalRecord}
              {t('IDS_RECORD')}
            </span>
          )}
        </div>
        <Button type={`${isStarted ? 'primary' : 'default'}`} onClick={onClick} size="middle">
          詳細を見る
        </Button>
      </div>

      {/* ── Stepper body ── */}
      <div style={{ padding: view === 'mobile' ? '14px 12px' : '14px 16px' }} onClick={(e) => e.stopPropagation()}>
        {view === 'mobile' ? renderMobile() : renderHorizontal()}
      </div>
    </div>
  );
};

export default NewPeriodEvaluationCard;
