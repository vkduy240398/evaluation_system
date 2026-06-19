import React, { Fragment, useState } from 'react';
import { Tag, Progress, Tooltip, Typography } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  UndoOutlined,
  WarningFilled,
  TeamOutlined,
  RightOutlined,
  CheckOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { t } from 'i18next';

import { urlCompanyCode } from '../../../../common/util';
import './PeriodEvaluationCard.css';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';

interface DateRange {
  start: string;
  end: string;
}

interface PeriodEvaluationCardProps {
  item: any;
  fixedGoal: (item: any) => void;
  undoFixGoal: (item: any) => void;
  fixedEvaluation: (item: any) => void;
  undoFixEvaluation: (item: any) => void;
  fixedEvaluationPublic: (item: any) => void;
  onClick: () => void;
  isCurrentPeriod?: boolean;
  goalDeptRange?: DateRange;
  evalDeptRange?: DateRange;
}

const PeriodEvaluationCard = ({
  item,
  fixedGoal,
  undoFixGoal,
  fixedEvaluation,
  undoFixEvaluation,
  fixedEvaluationPublic,
  onClick,
  isCurrentPeriod = false,
  goalDeptRange,
  evalDeptRange,
}: PeriodEvaluationCardProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [arrowHovered, setArrowHovered] = useState(false);

  const stepLabels = [
    t('IDS_AIM_SETTING'),
    t('IDS_FIX_GOAL'),
    t('IDS_EVALUATION'),
    t('IDS_FIX_EVALUATION'),
    t('IDS_PUBLIC_EVALUATION'),
  ];

  // --- Enable logic (mirror of ColumnImplementation) ---
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

  // --- Step logic ---
  // Returns 0 when the period has not started (no records enrolled yet)
  const getCurrentStep = (): number => {
    if (item.checkFixed === 2) return 6;
    if (item.checkFixed === 1) return 5;
    if (isDisplayFixEvalation()) return 4;
    if (item.totalRecord > 0 && item.goalFixedRecord === item.totalRecord) return 3;
    if (item.totalRecord > 0) return 2;

    return 0; // not started
  };

  const currentStep = getCurrentStep();

  const getStepStatus = (s: number): 'done' | 'active' | 'pending' =>
    s < currentStep ? 'done' : s === currentStep ? 'active' : 'pending';

  const getStepDescription = (s: number): string => {
    const rec = t('IDS_RECORD');
    switch (s) {
      case 1:
        return item.goals || item.departmentGoals ? t('EVALUATION_PERIOD_SCREEN.IDS_CONFIGURED') : '';
      case 2:
        return item.totalRecord > 0 ? `${item.goalFixedRecord || 0}/${item.totalRecord}${rec}` : '';
      case 3:
        return '';
      case 4:
        return item.totalRecord > 0 ? `${item.evaluationFixedRecord || 0}/${item.totalRecord}${rec}` : '';
      case 5:
        return item.totalRecord > 0 ? `${item.evaluationConfirmFixedRecord || 0}/${item.totalRecord}${rec}` : '';
      default:
        return '';
    }
  };

  const isCompleted = item.checkFixed === 2;
  const isStarted = item.totalRecord > 0;
  const statusBadge = isCompleted
    ? { label: t('IDS_STATUS_COMPLETED'), color: 'blue' }
    : isStarted
    ? { label: t('EVALUATION_PERIOD_SCREEN.IDS_IN_PROGRESS'), color: 'green-inverse' }
    : { label: t('IDS_STATUS_NOT_STARTED'), color: 'default' };
  const colorPeriod = isCompleted
    ? {
        size: 13,
        color: 'blue',
        fontWeight: 600,
        background: '#EBF8FF',
        backgroundButton: '#2B6CB0',
        backgoundPeriodEvaluate: '#7C8795',
        backgoundPeriodGoal: '#7C8795',
      }
    : isStarted
    ? {
        size: 14,
        color: 'rgb(0, 114, 64)',
        fontWeight: 600,
        background: '#E6F4EA',
        backgroundButton: '#16A34A',
        backgoundPeriodEvaluate: '#1677FF',
        backgoundPeriodGoal: '#007240',
      }
    : {
        size: 13,
        color: 'default',
        fontWeight: 400,
        background: '#EBEBEB',
        backgroundButton: '#7C8795',
        backgoundPeriodEvaluate: '#7C8795',
        backgoundPeriodGoal: '#7C8795',
      };
  // --- Independent button visibility (each evaluated on its own condition) ---
  const canGoalConfirm = isGoalConfirmEnabled();
  const canEvalConfirm = isDisplayFixEvalation();
  const canPublish = isDisplayPublicEvaluation();
  const isActionBarVisible = isStarted && !isCompleted;

  // Per-row progress
  const pct = (cur: number, tot: number) => (tot > 0 ? Math.round((cur / tot) * 100) : 0);
  const goalProgress = pct(item.goalFixedRecord || 0, item.totalRecord || 0);
  const evalProgress = pct(item.evaluationFixedRecord || 0, item.totalRecord || 0);
  const publicProgress = pct(item.evaluationConfirmFixedRecord || 0, item.totalRecord || 0);

  // Per-row alerts
  const _sfx = item.periodIndex === 1 ? t('IDS_FIRST_PERIOD_WITH_YEAR') : t('IDS_SECOND_PERIOD_WITH_YEAR');
  const _base = `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${item.id}&year=${item.year}${_sfx}`;
  const goalAlert =
    canGoalConfirm && item.goalRecord > 0 ? { count: item.goalRecord, url: `${_base}&type=fixedGoal` } : null;
  const evalAlert =
    canEvalConfirm && item.evaluationRecord > 0
      ? { count: item.evaluationRecord, url: `${_base}&type=fixedEvaluation` }
      : null;
  const publicAlert =
    canPublish && item.evaluationConfirmRecord > 0 && item.checkFixed === 1
      ? { count: item.evaluationConfirmRecord, url: `${_base}&type=fixedEvaluationConfirm` }
      : null;

  // Per-row undo
  const isUndoGoalEnabled = canUndoGoal();
  const isUndoEvalEnabled = item.checkFixed !== 2;

  // Button styles
  const baseBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    height: 20,
    padding: '0 8px',
    borderRadius: 4,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  };
  const primaryBtnStyle = (disabled = false): React.CSSProperties => ({
    ...baseBtnStyle,
    background: disabled ? '#d9d9d9' : '#007240',
    color: disabled ? 'rgba(0,0,0,0.25)' : '#fff',
    border: `1px solid ${disabled ? '#d9d9d9' : '#007240'}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });
  const warningBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    background: '#fa8c16',
    color: '#fff',
    border: '1px solid #fa8c16',
    width: 62,
    justifyContent: 'center', // fixed: max "▲999件"
    textDecoration: 'underline',
  };
  const undoBtnStyle = (enabled: boolean): React.CSSProperties => ({
    ...baseBtnStyle,
    border: '1px solid #d9d9d9',
    background: '#fff',
    cursor: enabled ? 'pointer' : 'not-allowed',
    color: enabled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.25)',
    width: 74,
    justifyContent: 'center', // fixed: "↺ 元に戻す"
  });

  // Shared column widths for action bar rows — keeps columns aligned across rows
  const colLabel: React.CSSProperties = {
    width: 80,
    flexShrink: 0,
    fontSize: 11,
    fontWeight: 700,
    color: '#555',
    whiteSpace: 'nowrap',
  };
  const colCounter: React.CSSProperties = {
    width: 68,
    flexShrink: 0,
    fontSize: 11,
    color: '#555',
    whiteSpace: 'nowrap',
    textAlign: 'right',
  };
  const colProgress: React.CSSProperties = { flex: 1, minWidth: 80 };

  // colActions: fixed width = alert(62) + gap(6) + undo(74) = 142px
  // guarantees all rows end the progress bar at the same x position
  const colActions: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    justifyContent: 'flex-end',
  };

  // Invisible placeholders preserve column width when alert/undo are absent
  // const colPlaceholderAlert: React.CSSProperties = { width: 62, flexShrink: 0 };
  const colPlaceholderUndo: React.CSSProperties = { width: 74, flexShrink: 0 };
  const rowStyle = (hasBorder: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 10px',
    borderBottom: hasBorder ? '1px solid #f0f0f0' : 'none',
  });

  return (
    <div
      style={{
        border: isCurrentPeriod ? '1px solid #52c41a' : '1px solid #d9d9d9',
        borderLeft: isCurrentPeriod ? '4px solid #389e0d' : '4px solid #bfbfbf',
        borderRadius: 6,
        marginBottom: 8,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* ── Header (single row) ── */}
      <div
        style={{
          padding: '6px 10px',
          borderBottom: isCurrentPeriod ? '1px solid #d6ece0' : '1px solid #f0f0f0',
          background: colorPeriod.background,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        <Typography.Text
          strong
          style={{
            fontSize: colorPeriod.size,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: colorPeriod.fontWeight,
          }}
          onClick={onClick}
        >
          {item.evaluationPeriod}
        </Typography.Text>

        <Tag
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: '18px',
            flexShrink: 0,
            background: colorPeriod.backgroundButton,
            color: '#fff',
          }}
        >
          {statusBadge.label}
        </Tag>

        {item.totalRecord > 0 && (
          <Tag
            style={{
              margin: 0,
              borderRadius: 10,
              fontSize: 11,
              lineHeight: '18px',
              flexShrink: 0,
              background: colorPeriod.backgroundButton,
              color: '#fff',
            }}
          >
            <TeamOutlined style={{ marginRight: 2 }} />
            {item.totalRecord}
            {t('IDS_RECORD')}
          </Tag>
        )}

        {(item.departmentGoals || item.goals) && (
          <Tooltip
            title={
              item.goalDeptRange ? (
                <span style={{ fontSize: 12 }}>
                  {t('EVALUATION_PERIOD_SCREEN.IDS_TOOL_TIP_TOAST_MIN_MAX_DATE_GOAL')}
                  <br />
                  <strong>
                    {item.goalDeptRange.start} ～ {item.goalDeptRange.end}
                  </strong>
                </span>
              ) : undefined
            }
            color="#424242"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                border: '1px solid #b7eb8f',
                borderRadius: 5,
                padding: '2px 8px 2px 3px',
                background: '#fff',
                cursor: goalDeptRange ? 'help' : 'default',
              }}
            >
              <span
                style={{
                  background: colorPeriod.backgoundPeriodGoal,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 3,
                  lineHeight: '18px',
                }}
              >
                {t('IDS_AIM_SETTING')}
              </span>
              <Typography.Text style={{ fontSize: 12, color: '#333', fontWeight: 600 }}>
                {item.departmentGoals && (
                  <>
                    {t('IDS_DEPARTMENT_PERIOD')}: {item.departmentGoals}
                  </>
                )}
                {item.departmentGoals && item.goals && '　'}
                {item.goals && (
                  <>
                    {t('IDS_PERSONAL_PERIOD')}: {item.goals}
                  </>
                )}
              </Typography.Text>
            </div>
          </Tooltip>
        )}

        {(item.divisionEvaluate || item.personalEvaluation) && (
          <Tooltip
            title={
              item.evalDeptRange ? (
                <span style={{ fontSize: 12 }}>
                  {t('EVALUATION_PERIOD_SCREEN.IDS_TOOL_TIP_TOAST_MIN_MAX_DATE_EVALUATE')}
                  <br />
                  <strong>
                    {item.evalDeptRange.start} ～ {item.evalDeptRange.end}
                  </strong>
                </span>
              ) : undefined
            }
            color="#424242"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                border: '1px solid #91caff',
                borderRadius: 5,
                padding: '2px 8px 2px 3px',
                background: '#fff',
                cursor: evalDeptRange ? 'help' : 'default',
              }}
            >
              <span
                style={{
                  background: colorPeriod.backgoundPeriodEvaluate,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 3,
                  lineHeight: '18px',
                }}
              >
                {t('IDS_EVALUATION')}
              </span>
              <Typography.Text style={{ fontSize: 12, color: '#333', fontWeight: 600 }}>
                {item.divisionEvaluate && (
                  <>
                    {t('IDS_DEPARTMENT_PERIOD')}: {item.divisionEvaluate}
                  </>
                )}
                {item.divisionEvaluate && item.personalEvaluation && '　'}
                {item.personalEvaluation && (
                  <>
                    {t('IDS_PERSONAL_PERIOD')}: {item.personalEvaluation}
                  </>
                )}
              </Typography.Text>
            </div>
          </Tooltip>
        )}

        <div
          onClick={onClick}
          onMouseEnter={() => setArrowHovered(true)}
          onMouseLeave={() => setArrowHovered(false)}
          style={{
            marginLeft: 'auto',
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: arrowHovered ? colorPeriod.backgroundButton : '#e6f7ee',
            border: `1.5px solid ${arrowHovered ? colorPeriod.backgroundButton : colorPeriod.backgroundButton}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.18s, border-color 0.18s',
          }}
        >
          <RightOutlined style={{ fontSize: 12, color: arrowHovered ? '#fff' : colorPeriod.backgroundButton }} />
        </div>
      </div>

      {/* ── Stepper ── */}
      <div
        style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        {[1, 2, 3, 4, 5].map((s) => {
          const status = getStepStatus(s);

          return (
            <Fragment key={s}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 95,
                  flexShrink: 0,
                }}
              >
                {status === 'pending' ? (
                  <ClockCircleOutlined style={{ fontSize: 18, color: '#bfbfbf', marginBottom: 2 }} />
                ) : (
                  <CheckCircleFilled style={{ fontSize: 18, color: colorPeriod.backgroundButton, marginBottom: 2 }} />
                )}
                <Typography.Text style={{ fontSize: 11, fontWeight: 500, textAlign: 'center' }}>
                  {stepLabels[s - 1]}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>
                  {getStepDescription(s)}
                </Typography.Text>
              </div>

              {s < 5 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: status === 'done' ? colorPeriod.backgroundButton : '#e8e8e8',
                    marginTop: 9,
                    minWidth: 12,
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* ── Action Bar: one row per active step ── */}
      {isActionBarVisible && (
        <div style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }} onClick={(e) => e.stopPropagation()}>
          {/* Row 1: 目標確定 — visible until period fully completed */}
          {isActionBarVisible && (
            <div style={rowStyle(canEvalConfirm || canPublish || item.checkFixed === 1)}>
              <span style={colLabel}>{stepLabels[1]}</span>
              <Tooltip title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_GOAL')}>
                <button
                  disabled={!canGoalConfirm}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canGoalConfirm) fixedGoal(item);
                  }}
                  style={primaryBtnStyle(!canGoalConfirm)}
                >
                  <CheckOutlined style={{ fontSize: 10 }} />
                  {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
                </button>
              </Tooltip>
              <span style={colCounter}>
                {item.goalFixedRecord || 0}/{item.totalRecord}
                {t('IDS_RECORD')}
              </span>
              <div style={colProgress}>
                <Progress percent={goalProgress} size="small" />
              </div>
              <div style={colActions}>
                {goalAlert && (
                  <Tooltip title={t('IDS_ALERT')}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(goalAlert.url, '_blank');
                      }}
                      style={warningBtnStyle}
                    >
                      <WarningFilled style={{ fontSize: 10 }} />
                      {goalAlert.count}
                      {t('IDS_RECORD')}
                    </button>
                  </Tooltip>
                )}
                <Tooltip title={t('IDS_UNDO')}>
                  <button
                    disabled={!isUndoGoalEnabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUndoGoalEnabled) undoFixGoal(item);
                    }}
                    style={undoBtnStyle(isUndoGoalEnabled)}
                  >
                    <UndoOutlined style={{ fontSize: 10 }} />
                    {t('IDS_UNDO')}
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Row 2: 評価結果確定 — visible only when active */}
          {canEvalConfirm && (
            <div style={rowStyle(canPublish)}>
              <span style={colLabel}>{stepLabels[3]}</span>
              <Tooltip title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION')}>
                <button
                  disabled={!canEvalConfirm}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canEvalConfirm) fixedEvaluation(item);
                  }}
                  style={primaryBtnStyle(!canEvalConfirm)}
                >
                  <CheckOutlined style={{ fontSize: 10 }} />
                  {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
                </button>
              </Tooltip>
              <span style={colCounter}>
                {item.evaluationFixedRecord || 0}/{item.totalRecord}
                {t('IDS_RECORD')}
              </span>
              <div style={colProgress}>
                <Progress percent={evalProgress} size="small" />
              </div>
              <div style={colActions}>
                {evalAlert && (
                  <Tooltip title={t('IDS_ALERT')}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(evalAlert.url, '_blank');
                      }}
                      style={warningBtnStyle}
                    >
                      <WarningFilled style={{ fontSize: 10 }} />
                      {evalAlert.count}
                      {t('IDS_RECORD')}
                    </button>
                  </Tooltip>
                )}
                <Tooltip title={t('IDS_UNDO')}>
                  <button
                    disabled={!isUndoEvalEnabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUndoEvalEnabled) undoFixEvaluation(item);
                    }}
                    style={undoBtnStyle(isUndoEvalEnabled)}
                  >
                    <UndoOutlined style={{ fontSize: 10 }} />
                    {t('IDS_UNDO')}
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Row 3: 評価結果公開 — visible only when active */}
          {canPublish && (
            <div style={rowStyle(false)}>
              <span style={colLabel}>{stepLabels[4]}</span>
              <Tooltip title={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}>
                <button
                  disabled={!canPublish}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canPublish) fixedEvaluationPublic(item);
                  }}
                  style={primaryBtnStyle(!canPublish)}
                >
                  <GlobalOutlined style={{ fontSize: 10 }} />
                  {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}
                </button>
              </Tooltip>
              <span style={colCounter}>
                {item.evaluationConfirmFixedRecord || 0}/{item.totalRecord}
                {t('IDS_RECORD')}
              </span>
              <div style={colProgress}>
                <Progress percent={publicProgress} size="small" />
              </div>
              <div style={colActions}>
                {publicAlert && (
                  <Tooltip title={t('IDS_ALERT')}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(publicAlert.url, '_blank');
                      }}
                      style={warningBtnStyle}
                    >
                      <WarningFilled style={{ fontSize: 10 }} />
                      {publicAlert.count}
                      {t('IDS_RECORD')}
                    </button>
                  </Tooltip>
                )}
                <div style={colPlaceholderUndo} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodEvaluationCard;
