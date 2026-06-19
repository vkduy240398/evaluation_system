import { NotificationPlacement } from 'antd/es/notification/interface';
import { ChildrenBasicBehavior, DataValues } from '../../interfaces/InterfacesProps';
import { t } from 'i18next';

export const cloneRecordsFunc = (
  selectRecords: any[],
  dataSources: DataValues,
  openNotification: (placement: NotificationPlacement, mesage: string) => void,
  setDataSources: any,
  transition: any,
) => {
  if (selectRecords.length <= 0) {
    // Nếu không chọn hàng nào sẽ copy record cuối bảng
    const arrays: any = dataSources.data.children[dataSources.data.children.length - 1];

    const clones = {
      ...arrays,
      versionId: dataSources.data.id,
      id: Math.random().toString(36).slice(2),
      key: Math.random().toString(36).slice(2),
    };
    const totals = [...dataSources.data.children, clones];
    if (totals.length <= 100) {
      transition(() => {
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            children: [...dataSources.data.children, clones],
          },
        });
      });
    } else {
      openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
    }
  } else {
    const arrays = selectRecords.map((v: ChildrenBasicBehavior) => {
      const data = dataSources.data.children.find((f) => f.id === v.id);

      return {
        ...data,
        versionId: dataSources.data.id,
        id: Math.random().toString(36).slice(2),
        key: Math.random().toString(36).slice(2),
      };
    });

    const totals = [...dataSources.data.children, ...arrays];
    if (totals.length <= 100) {
      setDataSources({
        ...dataSources,
        data: {
          ...dataSources.data,
          children: [...dataSources.data.children, ...arrays],
        },
      });
    } else {
      openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
    }
  }
};
