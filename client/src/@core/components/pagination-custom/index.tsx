import Pagination from 'antd/es/pagination';
import { t } from 'i18next';

interface Props {
  total: number;
  currentPage: number;
  isLoading?: boolean;
  condition?: { [x: string]: any };
  fnOnchange: (arg: { limit?: number; offset?: number; currentPage?: number }) => void;
  fnGetCurrentPage?: (pageNumber: number) => void;
}
const PaginationCustom = (props: Props) => {
  const { currentPage, total, condition, isLoading, fnOnchange, fnGetCurrentPage } = props;

  const onChange = (pageNumber: number, pageSize: number) => {
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    fnOnchange && fnOnchange({ ...condition, limit, offset, currentPage: pageNumber });
    fnGetCurrentPage && fnGetCurrentPage(pageNumber);
  };

  return (
    <>
      <Pagination
        style={{ paddingTop: 10 }}
        disabled={isLoading}
        total={total === undefined ? 20 : total}
        defaultCurrent={1}
        onChange={onChange}
        defaultPageSize={20}
        showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')}${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
        showSizeChanger={false}
        current={currentPage}
      />
    </>
  );
};

export default PaginationCustom;
