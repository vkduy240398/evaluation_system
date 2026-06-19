import React from 'react';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';
import { DepartmentProps } from '../../../../../page/admin/user-management/interfaces';
interface DivisionProps {
  divisionId: number;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}
interface Props {
  optionList: DivisionProps[];
  onChange?: (value: (string | number)[], selectedOptions: any[]) => void;
  value: [any, any];
}
interface Option {
  value: string;
  label: string;
  children?: Option[];
}
const SelectBoxTree = (props: Props) => {
  const { optionList, onChange, value } = props;
  const options: any[] = optionList.map((division) => ({
    value: division.divisionId,
    label: division.name,
    children: division.childrens.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  }));
  const displayRender = (labels: string[]) => labels.join(' ► ');

  return (
    <>
      <Cascader<any>
        options={options}
        expandTrigger="hover"
        style={{ width: '100%' }}
        size="small"
        displayRender={displayRender}
        onChange={onChange}
        value={value}
      />
    </>
  );
};

export default SelectBoxTree;
