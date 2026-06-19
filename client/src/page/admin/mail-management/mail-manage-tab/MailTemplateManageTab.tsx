import React, { useEffect, useState } from 'react';
import SearchFormTemplateMail from './components/SearchFormTemplateMail';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { Form } from 'antd';
import TableMailTemplate from './components/TableMailTemplate';
import { conditionsMailTemplate, listMailTemplate } from '../interfaces/interfacesProps';
import mailManagementServices from '../../../../common/api/mailManagement';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  state: any;
}

const MailTemplateManageTab: React.FC<Props> = (props: Props) => {
  const { state } = props;
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<listMailTemplate[]>();
  const [conditions, setConditions] = useState<any>(
    location.state || {
      mailTemplateName: '',
      searchManage: false,
    },
  );

  const callBack = (dataSources: any) => {
    setDataSources(dataSources);
  };

  const handleEditMailTemplate = (record: any) => {
    const id = record.id;

    navigate(urlCompanyCode() + '/' + location.pathname.split('/')[3] + '/mail-management/edit', {
      state: {
        ...conditions,
        id,
      },
    });
  };

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });
    if (conditions?.searchManage) {
      mailManagementServices.getMailTemplateList(callBack, conditions, setLoading);
      form.setFieldValue('mailTemplateName', conditions.name);
    }
  }, [conditions]);

  return (
    <>
      <SearchFormTemplateMail
        form={form}
        isLoading={isLoading}
        conditions={conditions}
        setConditions={setConditions}
        state={state}
      />
      {location.state?.searchManage && dataSources && (
        <TableMailTemplate
          dataSources={dataSources}
          isLoading={isLoading}
          handleEditMailTemplate={handleEditMailTemplate}
        />
      )}
    </>
  );
};

export default MailTemplateManageTab;
