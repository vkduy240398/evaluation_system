import { DataState } from '../DataState';

export interface DataStateProps {
  dataState: DataState<any>;
  setDataState: React.Dispatch<React.SetStateAction<DataState<any>>>;
  optionStatus?: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData?: Function;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setIsLoading?: Function;
  type?: string;
  condition?: any;
}
