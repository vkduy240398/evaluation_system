import { t } from "i18next";

const ColumnComponent = () => {
  return [
    {
      title: t('IDS_ITEM'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      align: 'center' as const,
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
  ];
};

export default ColumnComponent;
