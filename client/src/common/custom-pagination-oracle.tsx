import { Pagination } from 'antd';
interface PaginationProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  fnOnchange: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  total: number;
  defaultCurrentPage: number;
  isDisable?: boolean;
  t: any;
  departmentSearch: string;
  emailSearch: string;
  currentPage: number;
  setCurrentPage: any;
  setIsLoadingTable: any;
  companySearch?: string;
}
const CustomPaginationOracle = (props: PaginationProps) => {
  const {
    fnOnchange,
    total,
    defaultCurrentPage,
    setCurrentPage,
    currentPage,
    t,
    departmentSearch,
    emailSearch,
    setIsLoadingTable,
    companySearch,
  } = props;
  const onChange = (pageNumber: number, pageSize: number) => {
    setCurrentPage(pageNumber);
    setIsLoadingTable(true);
    fnOnchange && fnOnchange((pageNumber - 1) * pageSize, pageSize, departmentSearch, emailSearch, companySearch);
  };

  return (
    <Pagination
      disabled={props.isDisable || false}
      total={total || 20}
      onChange={onChange}
      showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')}${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
      style={{ marginTop: '10px' }}
      defaultPageSize={20}
      defaultCurrent={defaultCurrentPage || 1}
      current={currentPage}
      showSizeChanger={false}
    />
  );
};

export default CustomPaginationOracle;
