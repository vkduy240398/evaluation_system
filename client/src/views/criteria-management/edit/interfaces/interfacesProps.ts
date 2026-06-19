import { DetailBasicBehavior } from '../../../../page/admin/criterion-management/interfaces/InterfacesProps';

type type = 'content' | 'id' | 'versionId' | 'title' | 'difficulty';
export interface TablePropsComponent {
  dataSources: DetailBasicBehavior;
  selectedRowKeys: any;
  setSelectRowsKeys: any;
  setSelectRecord: any;
  selectRecords: any;
  setDataSource: (data: any, index: number, keysData: type) => void;
  dataSourcesParent?: any;
  setDataSourcesParent?: any;
  listPoints:
    | {
        point: number;
        id: number;
        note: string;
        versionId: number;
      }[]
    | [];
}
