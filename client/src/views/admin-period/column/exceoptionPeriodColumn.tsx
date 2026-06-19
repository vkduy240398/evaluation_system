import Button from 'antd/es/button';
import { EvaluationByPeriodType, IEvaluationByPeriodType, PeriodType } from '../../../types/api/adminPeriodType';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import Select from 'antd/es/select';

import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import { DatePicker } from 'antd/lib';
import dayjs from 'dayjs';

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setFocusAchievementPersonalError } from '../../../store/userEvaluation';
import localeJa from '../../../@core/locales/jaDatePick';
import { compareDateEvaluation, dayJsFormat, isFloat } from '../../../common/util';
import { t } from 'i18next';
import Tooltip from 'antd/es/tooltip';
import { setErrorExceptionDate } from '../../../store/exception';
import { Cascader, Checkbox, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

// import Dropdown from 'antd/es/dropdown';
// import { MenuProps } from 'antd/es/menu';
// import Space from 'antd/es/space';

// ** Antd Imports Icons
// import { CaretUpOutlined } from '@ant-design/icons/lib/icons';

// ** Type
type OptionType = {
  label: any;
  value: any;
};

type DepartmentOptionType = {
  label: any;
  value: any;
  type: any;
};
type KeyEvaluation = keyof EvaluationByPeriodType;

interface Props {
  departments?: DepartmentOptionType[];
  companies?: OptionType[];
  evaluators?: OptionType[];
  period?: PeriodType | null;
  listSkills?: any;
  handleChange: (index: number, key: KeyEvaluation, value: any, key2?: KeyEvaluation, value2?: any) => void;
  handleDelteRow: (str: string) => void;
  handleCaculatorPercent: () => void;
  disabledPeriodDate: (current: dayjs.Dayjs, index: number) => boolean;
  submitForm: FormInstance;
  buttonShowMore?: any;
  evaluations?: any;
  isEvaluationTime?: any;
}
const levelOptions: OptionType[] = [];
for (let i = 1; i <= 10; i++) {
  levelOptions.push({
    value: i,
    label: i,
  });
}

const validateDatePicker = (value: any[]) => {
  if (value.length < 2) return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string));
  if (value[0] === null || value[1] === null)
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string));

  return Promise.resolve();
};
const exceptionPeriodColumn = (props: Props) => {
  const store = useSelector((state: RootState) => state.userEvaluation);
  const storeException = useSelector((state: RootState) => state.exceptionF7);

  const dispatch = useDispatch<AppDispatch>();

  const isFocusError = store.isFocusAchievementPersonalError;
  const isErrorExceptionDate = storeException.isError;

  const {
    evaluators,
    period,
    submitForm,
    handleChange,
    handleDelteRow,
    handleCaculatorPercent,
    buttonShowMore,
    evaluations,
    isEvaluationTime,
  } = props;
  const { Item } = Form;
  const { RangePicker } = DatePicker;

  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    const startDate = dayjs().subtract(1, 'day');
    const endDate = dayjs().add(12, 'month');

    return current && (current < startDate || current > endDate);
  };

  // const _disabledDateSendMail: RangePickerProps['disabledDate'] = (current) => {
  //   const startDate = dayjs().endOf('day');
  //   const endDate = dayjs().add(6, 'month');

  //   // Can not select days before today and today
  //   return current && (current < startDate || current > endDate);
  // };

  const companies = props.companies?.map((v) => ({ ...v, value: v.label, id: v.value })) || [];
  const departments = props.departments?.map((v) => ({ ...v, value: v.label, id: v.value })) || [];

  const evaluatorOptions = (value: any, label: any) => {
    if (evaluators) {
      if (value === null || value === undefined) return evaluators;
      const isFindEvalutorOld = evaluators.some((s) => s.value === value);
      if (isFindEvalutorOld) return evaluators;

      return [{ value, label }, ...evaluators];
    }

    return [];
  };

  const isShowInput = (status: number) => ![99, 100].includes(status);

  const evaluatorDisables = (options: OptionType[], record: IEvaluationByPeriodType) => {
    return options.map((v) => ({
      ...v,
      disabled: [record.evaluator05, record.evaluator10, record.evaluator20].includes(v.value),
    }));
  };

  // const goalItems: MenuProps['items'] | any = (levelType: 5 | 6, index: number) => [
  //   {
  //     key: `Send mail now`,
  //     label: t('IDS_SEND_MAIL_NOW'),
  //     onClick() {
  //       //
  //       handleOpenSendMail && handleOpenSendMail('0', levelType, index);
  //     },
  //   },
  //   {
  //     key: 'Send mail with setting time',
  //     label: t('IDS_SEND_MAIL_SETTING_TIME'),
  //     onClick() {
  //       //
  //       handleOpenSendMail && handleOpenSendMail(1, levelType, index);
  //     },
  //   },
  // ];

  const filterOption = (inputValue: string, option: any) => {
    return (option?.label || '')?.toLowerCase().includes(inputValue?.toLowerCase()) || false;
  };

  // console.log(12005, submitForm.getFieldValue(`level-${record.key}`));

  const columns: ColumnsType<IEvaluationByPeriodType> = [
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const,
      width: 40,
      render(_, record) {
        const isEvaluationTimeUser = compareDateEvaluation(period?.dateEvaluationStart, period?.dateEvaluationEnd);
        const isEvaluationTimeDepartment = compareDateEvaluation(
          period?.dateEvaluationDepartmentStart,
          period?.dateEvaluationDepartmentEnd,
        );

        // if (record.creationUser !== null && record.status === 0 && record.createdByCronjob !== 1)
        return (
          <Button
            icon={<DeleteOutlined />}
            style={{ color: '#007240 ' }}
            onClick={() => handleDelteRow(record.key)}
            // disabled={
            //   record.isDisable ||
            //   !(record.creationUser !== null && record.status === 0 && record.createdByCronjob !== 1)
            // }
            disabled={
              evaluations.length === 1 || isEvaluationTimeUser || isEvaluationTimeDepartment || isEvaluationTime
            }
          />
        );
      },
    },
    {
      title: t('IDS_COMMON_USER_INFO'),
      dataIndex: 'companyName',
      key: 'companyName',
      width: '15%',
      render(text, record: any, index) {
        if (record.isEdit)
          return (
            <>
              <Item
                style={{ margin: 0, width: '100%' }}
                name={`companyName-${record.key}`}
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                initialValue={record.companyName}
                label={t('IDS_COMPANY')}
              >
                <Select
                  showSearch
                  options={companies}
                  filterOption={filterOption}
                  onChange={(value) => handleChange(index, 'companyName', value)}
                  className="input-selected-table"
                />
              </Item>
              <Item
                style={{ margin: 0, width: '100%' }}
                name={`divisionName-${record.key}`}
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                initialValue={record?.divisionName}
                label={t('IDS_DEPARTMENT')}
              >
                <Select
                  showSearch
                  options={departments.filter((f) => f.type === 1)}
                  filterOption={filterOption}
                  onChange={(value, option: any) =>
                    handleChange(index, 'divisionName', value, 'divisionId', option?.id)
                  }
                  className="input-selected-table"
                />
              </Item>
              <Item
                style={{ margin: 0 }}
                name={`departmentName-${record.key}`}
                rules={[{ required: record.level < 8, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                initialValue={record?.departmentName}
                label={t('IDS_TYPE_DEPARTMENT_NAME')}
              >
                <Select
                  showSearch
                  allowClear
                  options={departments.filter((f) => f.type === 0)}
                  filterOption={filterOption}
                  onChange={(value, option: any) =>
                    handleChange(index, 'departmentName', value, 'departmentId', option?.id)
                  }
                  className="input-selected-table"
                />
              </Item>
            </>
          );

        const companyName = record.companyName;
        const divisionName = record?.divisionName;
        const departmentName = record?.departmentName;

        return (
          <>
            {companyName && <div style={{ textAlign: 'left' }}>会社: {companyName}</div>}
            {divisionName && <div style={{ textAlign: 'left' }}>部署: {divisionName}</div>}
            {departmentName && <div style={{ textAlign: 'left' }}>課名: {departmentName}</div>}
          </>
        );
      },
    },

    // {
    //   title: t('IDS_DEPARTMENT'),
    //   dataIndex: 'divisionName',
    //   key: 'divisionName',
    //   width: '150px',
    //   render(text, record, index) {
    //     if (record.isEdit)
    //       return (
    //         <Item
    //           style={{ margin: 0, width: '100%' }}
    //           name={`divisionName-${record.key}`}
    //           rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
    //           initialValue={text}
    //         >
    //           <Select
    //             showSearch
    //             options={departments.filter((f) => f.type === 1)}
    //             filterOption={filterOption}
    //             onChange={(value, option: any) => handleChange(index, 'divisionName', value, 'divisionId', option?.id)}
    //             className="input-selected-table"
    //           />
    //         </Item>
    //       );

    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
    // {
    //   title: t('IDS_TYPE_DEPARTMENT_NAME'),
    //   dataIndex: 'departmentName',
    //   key: 'departmentName',

    //   width: '150px',

    //   render(text, record, index) {
    //     if (record.isEdit)
    //       return (
    //         <Item
    //           style={{ margin: 0 }}
    //           name={`departmentName-${record.key}`}
    //           rules={[{ required: record.level < 8, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
    //           initialValue={text}
    //         >
    //           <Select
    //             showSearch
    //             allowClear
    //             options={departments.filter((f) => f.type === 0)}
    //             filterOption={filterOption}
    //             onChange={(value, option: any) =>
    //               handleChange(index, 'departmentName', value, 'departmentId', option?.id)
    //             }
    //             className="input-selected-table"
    //           />
    //         </Item>
    //       );

    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'period',
      key: 'period',
      width: 150,
      align: 'center',

      render(_, record, index) {
        const startTime = record.periodStart ? dayjs(record.periodStart, 'YYYY/M') : null;
        const endTime = record.periodEnd ? dayjs(record.periodEnd, 'YYYY/M') : null;
        if (isShowInput(record.status))
          return (
            <Item
              style={{ margin: 0 }}
              name={`period-${record.key}`}
              initialValue={[startTime, endTime]}
              rules={[
                {
                  validator(_rule, value) {
                    return validateDatePicker(value);
                  },
                },
              ]}
            >
              <RangePicker
                allowClear={false}
                style={{ width: '100%', padding: '0 5px', borderColor: isErrorExceptionDate ? '#FF4D4F' : '' }}
                picker="month"
                format={'YYYY/M'}
                locale={localeJa}
                onChange={(e) => {
                  if (e) {
                    const startTime = dayjs(e[0], 'YYYY/M').format('YYYY/M');
                    const endTime = dayjs(e[1], 'YYYY/M').format('YYYY/M');

                    handleChange(index, 'periodStart', startTime, 'periodEnd', endTime);

                    dispatch(setErrorExceptionDate(false));
                  }
                }}

                // disabledDate={(e) => disabledPeriodDate(e, index)}
              />
            </Item>
          );

        return `${record.periodStart} ～ ${record.periodEnd}`;
      },
    },

    {
      title: (
        <>
          {t('IDS_CALCULATED_RATIO')}
          <Tooltip title={t('MESSAGE.COMMON.IDM_AUTO_CALC_PERCENT')}>
            <Button
              type="ghost"
              style={{ color: 'red' }}
              size="small"
              icon={<SettingOutlined />}
              onClick={handleCaculatorPercent}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'percentPoint',
      key: 'percentPoint',
      align: 'center' as const,
      width: 60,

      render(text, record, index) {
        return (
          <Item
            name={`percentPoint-${record.key}`}
            initialValue={text}
            style={{ margin: 0 }}
            rules={[
              {
                validator(_, v: string) {
                  const value = v?.toString();
                  const isRequired = (evaluations?.length ?? 0) > 1;
                  if (!value || value === '') {
                    return isRequired
                      ? Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string))
                      : Promise.resolve();
                  }
                  if (isNaN(Number(value)))
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
                  if (isFloat(value))
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
                  if (Number(value) < 0)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
                  if (Number(value) > 100)
                    return Promise.reject(new Error((t('MESSAGE.COMMON.IDM_MAX_VALUE') ?? '').replace('{max value}', '100')));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onChange={(e) => {
                isFocusError && dispatch(setFocusAchievementPersonalError(false));

                handleChange(index, 'percentPoint', e.target.value);
              }}
              style={{ borderColor: isFocusError ? '#FF4D4F' : '', textAlign: 'center' }}
              maxLength={3}
            />
          </Item>
        );
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      key: 'level',
      align: 'center' as const,
      width: 30,

      render(text, record, index) {
        if (record.isEdit)
          return (
            <Item
              style={{ margin: 0 }}
              name={`level-${record.key}`}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              initialValue={text}
            >
              <Select
                options={levelOptions}
                onChange={(e) => {
                  submitForm.validateFields([`departmentName-${record.key}`]);
                  handleChange(index, 'level', e);
                }}
              />
            </Item>
          );

        return text;
      },
    },

    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      key: 'level',
      align: 'center' as const,
      width: 60,

      render(text, record, index) {
        if (record.isEdit)
          return (
            <Item style={{ margin: 0 }} name={`flagSkill-${record.key}`} initialValue={text} valuePropName="checked">
              <Checkbox
                // disabled={submitForm.getFieldValue(`level-${record.key}`) > 7}
                value={1}
                onChange={(e) => {
                  submitForm.validateFields([`skillUser-${record.key}`]);
                  handleChange(index, 'flagSkill', e.target.checked ? 1 : 0);
                }}
              ></Checkbox>
              {/* <Select options={levelOptions} onChange={(e) => handleChange(index, 'level', e)} /> */}
            </Item>
          );

        return record.flagSkill === 1 ? t('IDS_HAVE') : t('IDS_NOT_HAVE');
      },
    },

    {
      title: t('IDS_IMPLEMENT_GOAL'),
      dataIndex: 'dateCreationGoalStartEnd',
      key: 'dateCreationGoalStartEnd',
      width: 190,
      align: 'center',
      render(_, record, index) {
        if (period) {
          const startTime = record.dateCreationGoalStart || null;
          const endTime = record.dateCreationGoalEnd || null;

          if (isShowInput(record.status))
            return (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Item
                  style={{ margin: 0, display: 'flex', alignItems: 'center' }}
                  name={`dateCreationGoalStartEnd-${record.key}`}
                  initialValue={[
                    startTime === null ? null : dayJsFormat(startTime, 'YYYY/M/D', true),
                    endTime === null ? null : dayJsFormat(endTime, 'YYYY/M/D', true),
                  ]}
                  rules={[
                    {
                      validator(_rule, value) {
                        return validateDatePicker(value);
                      },
                    },
                  ]}
                >
                  <RangePicker
                    style={{ width: '100%', padding: '0 5px' }}
                    format={'YYYY/M/D'}
                    locale={localeJa}
                    allowClear={false}
                    onChange={(e) => {
                      if (e) {
                        const startTime = dayJsFormat(e[0]);
                        const endTime = dayJsFormat(e[1]);

                        handleChange(index, 'dateCreationGoalStart', startTime, 'dateCreationGoalEnd', endTime);
                      }
                    }}
                    disabledDate={disabledDate}
                  />
                </Item>
              </div>
            );

          return startTime || endTime ? `${startTime || ''} ～ ${endTime || ''}` : '';
        }
      },
    },
    {
      title: t('IDS_EVALUATION_IMPLEMENTATION'),
      dataIndex: 'dateEvaluationStartEnd',
      key: 'dateEvaluationStartEnd',
      width: 190,
      align: 'center',

      render(_, record, index) {
        if (period) {
          const startTime = record.dateEvaluationStart === undefined ? null : record.dateEvaluationStart || null;

          // (record.level <= 7 ? period.dateEvaluationStart : period.dateEvaluationDepartmentStart); // period.dateEvaluationDepartmentStart
          const endTime = record.dateEvaluationEnd === undefined ? null : record.dateEvaluationEnd || null;

          // (record.level <= 7 ? period.dateEvaluationEnd : period.dateEvaluationDepartmentEnd); // period.dateEvaluationDepartmentEnd

          // const _dateSendMail = record.dateSendMailEvaluation ? dayjs(record.dateSendMailEvaluation) : null;
          if (isShowInput(record.status))
            return (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Item
                  style={{ margin: 0 }}
                  name={`dateEvaluationStartEnd-${record.key}`}
                  initialValue={[
                    startTime === null ? null : dayJsFormat(startTime, 'YYYY/M/D', true),
                    endTime === null ? null : dayJsFormat(endTime, 'YYYY/M/D', true),
                  ]}

                  // rules={[
                  //   {
                  //     validator(_rule, value) {
                  //       return validateDatePicker(value);
                  //     },
                  //   },
                  // ]}
                >
                  <RangePicker
                    style={{ width: '100%', padding: '0 5px' }}
                    format={'YYYY/M/D'}
                    locale={localeJa}
                    allowClear={false}
                    onChange={(e) => {
                      if (e) {
                        const startTime = dayJsFormat(e[0]);
                        const endTime = dayJsFormat(e[1]);

                        handleChange(index, 'dateEvaluationStart', startTime, 'dateEvaluationEnd', endTime);
                      }
                    }}
                    disabledDate={disabledDate}
                  />
                </Item>

                {/* <Item style={{ margin: 0 }}>
                  <Space.Compact
                    size={'small'}
                    direction="horizontal"
                    style={{ width: 210, padding: '5px 0', justifyContent: 'center' }}
                  >
                    <Item
                      name={`checkSendMailEvaluation-${record.key}`}
                      // initialValue={record.checkSendMailEvaluation}
                      valuePropName="checked"
                      noStyle
                    >
                      <Dropdown
                        trigger={['click']}
                        menu={{ items: goalItems(6, index) }}
                        key={'drop-down-key-2'}
                        placement="top"
                        disabled={record.isAddNew}
                      >
                        <Button className="button-normal" type="primary" size="middle">
                          {t('IDS_SEND_MAIL')}
                          <CaretUpOutlined style={{ fontSize: 18 }} />
                        </Button>
                      </Dropdown>
                    </Item>
                  </Space.Compact>
                </Item> */}
              </div>
            );

          return `${startTime || ''} ${startTime || endTime ? '～' : ''} ${endTime || ''}`;
        }
      },
    },
    {
      title: t('IDS_EVALUATOR'),
      dataIndex: 'evaluator05',
      key: 'evaluator05',
      width: 200,
      render(text, record, index) {
        const option05s = evaluatorDisables(evaluatorOptions(record.evaluator05, record.evaluator05Name), record);
        const option10s = evaluatorDisables(evaluatorOptions(record.evaluator10, record.evaluator10Name), record);
        const option20s = evaluatorDisables(evaluatorOptions(record.evaluator20, record.evaluator20Name), record);

        if (isShowInput(record.status))
          return (
            <>
              <Item
                style={{ margin: 0 }}
                name={`evaluator05-${record.key}`}
                initialValue={record.evaluator05}
                label={t('IDS_EVALUATOR_0_5')}
              >
                <Select
                  allowClear
                  showSearch
                  className={`${
                    record.evaluator05Error ? 'select-box-antd-custom input-selected-table' : 'input-selected-table'
                  }`}
                  options={option05s}
                  filterOption={filterOption}
                  bordered
                  onChange={(e) => handleChange(index, 'evaluator05', e)}
                />
              </Item>
              <Item
                style={{ margin: 0 }}
                name={`evaluator10-${record.key}`}
                initialValue={record.evaluator10}
                label={t('IDS_EVALUATOR_1')}
              >
                <Select
                  allowClear
                  showSearch
                  options={option10s}
                  className={`${
                    record.evaluator10Error ? 'select-box-antd-custom input-selected-table' : 'input-selected-table'
                  }`}
                  filterOption={filterOption}
                  onChange={(e) => handleChange(index, 'evaluator10', e)}
                />
              </Item>
              <Item
                style={{ margin: 0 }}
                name={`evaluator20-${record.key}`}
                initialValue={record.evaluator20}
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                label={t('IDS_EVALUATOR_2')}
              >
                <Select
                  showSearch
                  options={option20s}
                  filterOption={filterOption}
                  onChange={(e) => handleChange(index, 'evaluator20', e)}
                  className="input-selected-table"
                />
              </Item>
            </>
          );

        const evaluator05Name = record.evaluator05Name;
        const evaluator10Name = record.evaluator10Name;
        const evaluator20Name = record.evaluator20Name;

        return (
          <>
            {' '}
            {evaluator05Name && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_EVALUATOR_0_5')}: {evaluator05Name}
              </div>
            )}
            {evaluator10Name && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_EVALUATOR_1')}: {evaluator10Name}
              </div>
            )}
            {evaluator20Name && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_EVALUATOR_2')}: {evaluator20Name}
              </div>
            )}{' '}
          </>
        );
      },
    },

    // {
    //   title: t('IDS_EVALUATOR_1'),
    //   dataIndex: 'evaluator10',
    //   key: 'evaluator10',
    //   width: 150,

    //   render(text, record, index) {
    //     const options = evaluatorDisables(evaluatorOptions(text, record.evaluator10Name), record);

    //     if (isShowInput(record.status))
    //       return (
    //         <Item style={{ margin: 0, width: '100%' }} name={`evaluator10-${record.key}`} initialValue={text}>
    //           <Select
    //             allowClear
    //             showSearch
    //             options={options}
    //             className={`${
    //               record.evaluator10Error ? 'select-box-antd-custom input-selected-table' : 'input-selected-table'
    //             }`}
    //             filterOption={filterOption}
    //             onChange={(e) => handleChange(index, 'evaluator10', e)}
    //           />
    //         </Item>
    //       );

    //     return record.evaluator10Name || '';
    //   },
    // },
    // {
    //   title: t('IDS_EVALUATOR_2'),
    //   dataIndex: 'evaluator20',
    //   key: 'evaluator20',
    //   width: 150,
    //   render(text, record, index) {
    //     const options = evaluatorDisables(evaluatorOptions(text, record.evaluator20Name), record);
    //     if (isShowInput(record.status))
    //       return (
    //         <Item
    //           style={{ margin: 0, width: '100%' }}
    //           name={`evaluator20-${record.key}`}
    //           initialValue={text}
    //           rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
    //         >
    //           <Select
    //             showSearch
    //             options={options}
    //             filterOption={filterOption}
    //             onChange={(e) => handleChange(index, 'evaluator20', e)}
    //             className="input-selected-table"
    //           />
    //         </Item>
    //       );

    //     return record.evaluator20Name;
    //   },
    // },
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'template',
      key: 'template',
      width: '25%',

      render(text, record: any, index) {
        if (record.status < 50) {
          return (
            <>
              <Item
                style={{ margin: 0, width: '100%' }}
                name={`skillUser-${record.key}`}
                rules={[{ required: record.flagSkill == 1, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                initialValue={record?.skillUser?.map((v: any) => [v])}
              >
                <Cascader
                  className="Cascader"
                  showSearch
                  style={{ margin: 0, width: '100%' }}
                  size="small"
                  options={props.listSkills}
                  multiple
                  allowClear={false}
                  maxTagTextLength={150}
                  onChange={(selectedOptions) => {
                    const selectedSkills = selectedOptions.flat() as number[];
                    handleChange(index, 'skillUser', selectedSkills);
                  }}
                />
              </Item>
              {record.flagSkill == 1 && (
                <div style={{ color: 'red', fontSize: 12 }}>{t('MESSAGE.COMMON.IDM_NOTE_CHANGE_TEMPLATE_SKILL')}</div>
              )}
            </>
          );
        }

        if (record.skillNameUser?.length > 0) {
          const options: { skillName: string }[] = [];
          const defaultValueList: string[] = [];

          record.skillNameUser.forEach((item: any) => {
            options.push({
              skillName: item,
            });
            defaultValueList.push(item.split(','));
          });

          return (
            <>
              <Row>
                <Cascader
                  style={{ width: '80%' }}
                  multiple
                  allowClear={false}
                  maxTagCount="responsive"
                  value={defaultValueList}
                  open={false}
                  suffixIcon
                  removeIcon
                />
                {typeof buttonShowMore === 'function' ? buttonShowMore(options) : null}
              </Row>
            </>
          );
        }
      },
    },
  ];

  return columns;
};

export default exceptionPeriodColumn;
