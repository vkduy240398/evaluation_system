import { SortOrder } from 'antd/lib/table/interface';
import { FC, ReactElement } from 'react';
import { FaLongArrowAltDown, FaLongArrowAltUp, FaSort } from 'react-icons/fa';

interface Props {
  title: string;
  sortOrder?: SortOrder;
}

const SortColumnTitle: FC<Props> = (props) => {
  let sortIcon: ReactElement;
  if (!props.sortOrder) {
    sortIcon = <FaSort />;
  } else {
    sortIcon = props.sortOrder === 'ascend' ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {props.title}
      {sortIcon}
    </div>
  );
};

export default SortColumnTitle;
