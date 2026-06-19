// ** React Imports
import React, { useEffect, useState } from 'react';

// ** Icon Imports
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

//  ** Antd Imports
import { Tooltip } from 'antd';
import Space from 'antd/es/space';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Select from 'antd/es/select';
import { Col, Row } from 'antd/es/grid';
import Form, { FormInstance } from 'antd/es/form';

// ** I18 Imports
import { t } from 'i18next';

//  ** Component Imports
import AdminPeriodApiService from '../../../common/api/adminPeriod';
import PaginationCustom from '../../../@core/components/pagination-custom';
import { EvaluationByPeriodType, PeriodType } from '../../../types/api/adminPeriodType';
import exceptionPopupColumn from '../../../views/admin-period/column/exceptionPopupColumn';
import TableRowSelectedCustomComponent from '../../../@core/components/table-custom/TableRowSelectedCustomComponent';

// ** Type Imports
import { ExceptionPeriodType } from '../../../types/pages/exception-period/ExceptionPeriodType';

// ** Styles Imports
import { StyledComponent } from '@emotion/styled';

const { Item } = Form;
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { xl: 4, lg: 6, md: 8, sm: 12, xs: 24 },
};

// ** Type
type OptionType = {
  label: string;
  value: any;
};
type DepartmentOptionType = {
  label: any;
  value: any;
  type: any;
};
type Props = {
  year: number;
  form: FormInstance;
  companies: OptionType[];
  departments: DepartmentOptionType[];
  periodIndex: number;
  setEvaluator: (value: OptionType[]) => void;
  selectedRows: any[];
  ButtonCustom: StyledComponent<any>;
  setSelectedRow: (data: any) => void;
  handleSavePopup: (response: { evaluations: EvaluationByPeriodType[]; period: PeriodType }) => void;
  isOpenExceptionPopup: boolean;
  handleExceptionPopup: () => void;
  periodId: number;
};

const ExceptionPeriodAddNew = (props: Props) => {
  const {
    year,
    form,
    companies,
    departments,
    periodIndex,
    setEvaluator,
    selectedRows,
    ButtonCustom,
    setSelectedRow,
    handleSavePopup,
    isOpenExceptionPopup,
    handleExceptionPopup,
    periodId,
  } = props;

  // ** State
  const [total, setTotal] = useState<number>(20);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [currentPage, getPageCurrent] = useState<number>(1);

  const [isHiddenTable, setHiddenTable] = useState<boolean>(true);

  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);

  const [dataSources, setDataSource] = useState<ExceptionPeriodType[]>([]);

  const [condition, setCondition] = useState<{
    departmentId: number;
    companyId: number;
    searchField: string;
  }>();

  // ** Effect
  useEffect(() => {
    setDataSource([]);

    return () => {
      setDataSource([]);
      setHiddenTable(true);
    };
  }, [isOpenExceptionPopup]);

  const callback = (data: { dataList: ExceptionPeriodType[]; count: number }) => {
    setDataSource(data.dataList);
    setTotal(data.count);
  };

  // ** Functional
  const convertValue = (num: number) => (num && num >= 0 ? num : undefined);
  const onFinish = async (
    values: {
      departmentId: number;
      companyId: number;
      searchField: string;
      limit?: number;
      offset?: number;
    },
    isPagination?: boolean,
  ) => {
    const departmentId = convertValue(values.departmentId);
    const companyId = convertValue(values.companyId);
    setLoading(true);
    setButtonLoading(true);
    await AdminPeriodApiService.getUserActiveByCondition({
      ...values,
      departmentId,
      companyId,
      periodId,
      callback,
    }).then(() => {
      setLoading(false);
      setButtonLoading(false);
      setHiddenTable(false);
      !isPagination && getPageCurrent(1);
      setCondition({ ...values });
      setSelectedRow([]);
    });
  };

  const handleSearchPagination = async (arg: { limit?: number; offset?: number }) => {
    if (condition) await onFinish({ ...condition, ...arg }, true);
  };

  const handleGetEvaluationPeriod = () => {
    if (selectedRows.length > 0) {
      const userId = selectedRows[0].id;
      setButtonLoading(true);
      AdminPeriodApiService.getEvaluationPeriod({
        userId,
        year,
        periodIndex,
        callback: (data) => handleSavePopup(data),
      }).then(() => {
        AdminPeriodApiService.getEvaluatorUsers({
          evaluationCreatorId: userId,
          callback: (options) => {
            setButtonLoading(false);
            handleExceptionPopup();
            setEvaluator(options);
          },
        });
      });
    }
  };

  return (
    <>
      {/* Search field */}
      <Form
        {...layout}
        form={form}
        initialValues={{ companyId: -1, departmentId: -1 }}
        labelAlign="left"
        colon={false}
        requiredMark={false}
        onFinish={onFinish}
        labelCol={{ span: 1 }}
      >
        <Item label={t('IDS_EVALUATION_PERIOD')}>{`${year}年${
          periodIndex === 2 ? t('IDS_SECOND_PERIOD') : t('IDS_FIRST_PERIOD')
        }`}</Item>
        <Item label={t('IDS_COMPANY')} name="companyId">
          <Select
            style={{ width: '200px' }}
            showSearch
            options={[{ label: t('IDS_ALL'), value: -1 }, ...companies]}
            filterOption={(inputValue, option) =>
              option?.label?.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
          />
        </Item>
        <Item label={t('IDS_DEPARTMENT')} name="departmentId">
          <Select
            style={{ width: '200px' }}
            showSearch
            options={[{ label: t('IDS_ALL'), value: -1 }, ...departments]}
            filterOption={(inputValue, option) =>
              option?.label?.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
          />
        </Item>

        <div style={{ width: '240px' }}>
          <Item
            label={
              <Row>
                <Col>{(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1]}</Col>
                <Col>
                  <Tooltip
                    title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
                    color="#424242"
                    overlayInnerStyle={{ fontSize: '11px' }}
                  >
                    <Icon
                      component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                      style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            }
            name="searchField"
            rules={[
              {
                max: 30,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
              },
            ]}
          >
            <Input maxLength={31} style={{ width: '200px' }} />
          </Item>
        </div>
        <Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: 10 }}
            loading={isLoading}
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Item>
      </Form>

      {!isHiddenTable ? (
        <div style={{ marginBottom: 15, marginTop: 20 }}>
          {/* Table */}
          <TableRowSelectedCustomComponent
            isLoading={isLoading}
            selectType="radio"
            dataSources={dataSources}
            columns={exceptionPopupColumn()}
            setSelectedRow={setSelectedRow}
            size="small"
            resetSelectRow={selectedRows}
          />

          {/* Pagination */}
          {dataSources.length > 0 && (
            <PaginationCustom
              fnOnchange={handleSearchPagination}
              total={total}
              fnGetCurrentPage={getPageCurrent}
              currentPage={currentPage}
              isLoading={isLoading}
            />
          )}
        </div>
      ) : (
        <div style={{ marginBottom: 10 }}></div>
      )}

      {/* Button */}
      {/* Visible when click search */}
      {!isHiddenTable && (
        <Space direction="horizontal" size={'small'}>
          <ButtonCustom
            type="primary"
            disabled={selectedRows.length === 0}
            onClick={handleGetEvaluationPeriod}
            loading={isButtonLoading}
          >
            {t('IDS_SELECTION')}
          </ButtonCustom>
          <Button
            type="default"
            className="cancel_button"
            onClick={() => {
              handleExceptionPopup();
              setSelectedRow([]);
            }}
          >
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </Space>
      )}
    </>
  );
};

export default ExceptionPeriodAddNew;
