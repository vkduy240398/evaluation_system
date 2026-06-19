import React, { useState } from 'react';
import { Button, Cascader, Dropdown, MenuProps, Checkbox } from 'antd';
interface Props {
  filterKeyValues: any[];
  handleDisplayMediumClass: (mediumClass: any[], options: any, index: number) => void;
  index: number;
}
const CascaderMediumClass = (props: Props) => {
  const { filterKeyValues, handleDisplayMediumClass, index } = props;

  // Adapt onChange to match Cascader's expected signature
  return (
    // <Cascader
    //   key={index}
    //   multiple
    //   options={filterKeyValues}
    //   onChange={(value, option) => {
    //     handleDisplayMediumClass(value, option, index);
    //   }}
    //   placeholder="選択してください"
    //   style={{ width: 200 }}
    // />
    <>
      <div>
        {filterKeyValues.map((item, index) => (
          <div key={index}>
            <h4>{item.label}</h4>
            <ul>
              {item.children.map((child: any, childIndex: number) => (
                <li key={childIndex}>
                  <Checkbox>{child.label}</Checkbox>
                  {
                    <ul>
                      {child.children.map((childs: any, childIndexes: number) => (
                        <li key={childIndexes}>
                          <Checkbox
                            onChange={(e) => {
                              // handleCheckBoxItemsMediumClass(childs.label, child.children, index, e.ta);
                            }}
                          >
                            {childs.label}
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default CascaderMediumClass;
