import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchProps } from './interfaces/interfaces';
import { Button, Cascader, Col, Form, Row, Select } from 'antd';
import { getConditionSearch } from './restApi/conditionSearch';
import EmptyComponent from '../../../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';

const SearchForm = (props: searchProps) => {
  const { form, isLoading, setLoading, clearCondition } = props;
  const { t } = useTranslation();
  const [divisionList, setDivisionList] = useState([]) as any;
  const [companyList, setListCompany] = useState<{ label: any; value: any }[]>([]);

  useEffect(() => {
    const callBack = (data: {
      company: { id: number; name: string }[];
      departments: { id: number; code: string; name: string }[];
      divisions: {
        id: number;
        code: string;
        name: string;
        divisionId: number;
        childrens: {
          code: string;
          codeName: string;
          name: string;
          id: number;
        }[];
      }[];
    }) => {
      if (data.company.length > 0) {
        const companyList = data.company.map((v) => ({
          value: v.id,
          label: v.name,
        }));
        setListCompany(companyList);

        const divisionList = data.divisions.map((v) => {
          if (v.childrens.length <= 1) {
            return {
              value: v.divisionId,
              label: v.name,
            };
          }
          return {
            value: v.divisionId,
            label: v.name,
            children: [
              { label: t('IDS_ALL'), value: -1 },
              ...v.childrens.map((val) => ({ value: val.id, label: val.name })),
            ],
          };
        });
        setDivisionList(divisionList);
      }
    };

    const errorCallBack = (bool: boolean) => setLoading(bool);
    getConditionSearch(callBack, errorCallBack);
  }, []);

  const roleList = [
    { id: '-1', name: t('IDS_ALL') },
    { id: 1, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2] },
    { id: 3, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3] },
    { id: 4, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4] },
    { id: 5, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5] },
    { id: 6, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6] },
    { id: 7, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7] },
    { id: 8, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8] },
  ];

  const displayRender = (labels: string[]) => {
    return labels
      .filter((item) => !Number.isNaN(item) && item !== 'NaN' && item !== undefined && item !== null)
      .join(' ► ');
  };

  const levelList = [];
  for (let i = 1; i <= 10; i++) {
    levelList.push({ value: i.toString(), label: i.toString() });
  }

  const colProps = { xs: 24, sm: 12, md: 6, style: { minWidth: 0 } };

  return (
    <Row gutter={[12, 8]} align="bottom" style={{ marginBottom: 0 }}>
      <Col {...colProps}>
        <Form.Item
          label={t('IDS_COMPANY')}
          name="company"
          initialValue={'-1'}
          style={{ marginBottom: 0 }}
        >
          <Select
            size="small"
            showSearch
            fieldNames={{ label: 'label', value: 'value' }}
            options={[{ label: t('IDS_ALL'), value: '-1' }, ...companyList]}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            notFoundContent={<EmptyComponent />}
          />
        </Form.Item>
      </Col>

      <Col {...colProps}>
        <Form.Item
          label={t('IDS_DEPARTMENT')}
          name={'division'}
          initialValue={'-1'}
          colon={false}
          style={{ marginBottom: 0 }}
        >
          <Cascader
            size="small"
            options={[{ label: t('IDS_ALL'), value: '-1' }, ...divisionList]}
            style={{ width: '100%' }}
            showSearch
            displayRender={displayRender}
            clearIcon={false}
          />
        </Form.Item>
      </Col>

      <Col {...colProps}>
        <Form.Item
          label={t('IDS_ROLE')}
          name="role"
          initialValue={'-1'}
          colon={false}
          style={{ marginBottom: 0 }}
        >
          <Select
            size="small"
            fieldNames={{ label: 'name', value: 'id' }}
            options={roleList}
          />
        </Form.Item>
      </Col>

      <Col {...colProps}>
        <Form.Item
          label={t('IDS_EVALUATION_SKILL')}
          name="skill"
          initialValue={'-1'}
          style={{ marginBottom: 0 }}
        >
          <Select
            size="small"
            options={[
              { value: '-1', label: t('IDS_ALL') },
              { value: 1, label: t('IDS_HAVE') },
              { value: 0, label: t('IDS_NOT_HAVE') },
            ]}
          />
        </Form.Item>
      </Col>

      <Col {...colProps}>
        <Form.Item
          label={t('IDS_LEVEL')}
          name="level"
          initialValue={'-1'}
          style={{ marginBottom: 0 }}
        >
          <Cascader
            size="small"
            options={[{ label: t('IDS_ALL'), value: '-1', children: levelList }]}
            style={{ width: '100%' }}
            showSearch
            clearIcon={false}
            multiple
            allowClear={false}
          />
        </Form.Item>
      </Col>

      {/* Buttons — pushed to the right */}
      <Col
        xs={24}
        sm={12}
        md={18}
        style={{ minWidth: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12 }}
      >
        <Button type="default" size="middle" onClick={clearCondition} loading={isLoading}>
          {t('IDS_BUTTON_CLEAR_FILTER')}
        </Button>
        <Button type="primary" size="middle" htmlType="submit" loading={isLoading} icon={<SearchOutlined />}>
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Col>
    </Row>
  );
};

export default SearchForm;
