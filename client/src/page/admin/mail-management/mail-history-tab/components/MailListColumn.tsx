const MailListColumn = (props: any) => {
    const { searchField } = props;
  
    return [
      {
        title: searchField,
        dataIndex: 'value',
        key: 'value',
        align: 'left' as const,
        width: '15rem',
      },
    ];
  };
  export default MailListColumn;
  