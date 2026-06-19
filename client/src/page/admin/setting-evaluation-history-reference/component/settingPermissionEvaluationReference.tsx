import { Form, Typography } from 'antd';
import { t } from 'i18next';
import { MainButton } from '../../../../common/MainButton';
import EvaluationReferenceSearchForm from './evaluationReferenceSearchForm';
import EvaluationReferenceTable from './evaluationReferenceTable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import settingReview from '../../../../common/api/setting-evaluation-history-reference';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SettingPermissionEvaluationReference: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [listDepartments, setListDepartment] = useState([]);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);
  const [dataSources, setDataSource] = useState<{
    data: any[];
    counts: number;
    pageSize: number;
  }>({
    data: [],
    counts: 0,
    pageSize: 0,
  });

  // Handle tìm kiếm theo condition
  const callBackFC = (data: { data: any[]; counts: number; pageSize: number }) => {
    setDataSource(data);
    setSelectedRowKeys([]);
  };
  const errorCallBack = (isLoading: boolean) => {
    props.setIsLoading(isLoading);
  };
  const handleSearchForm = () => {
    form
      .validateFields()
      .then(async () => {
        navigate('', {
          state: {
            ...form.getFieldsValue(),
            page: 1,
          },
          replace: true,
        });
        await effectListDatas(
          {
            ...form.getFieldsValue(),
            page: 1,
          },
          callBackFC,
          errorCallBack,
        );
      })
      .catch(() => {});
  };

  // Click to page
  const moveToPages = async (page: number) => {
    navigate('', {
      state: {
        ...form.getFieldsValue(),
        page: page,
      },
      replace: true,
    });
    props.setIsLoading(true);
    effectListDatas(
      {
        ...form.getFieldsValue(),
        page: page,
      },
      callBackFC,
      errorCallBack,
    );
  };
  const callBackEffect = (data: any) => {
    setListDepartment(data);
  };
  const effectListDatas = async (
    condition: {
      depDivAudience: number | string;
      depDivViewer: number | string;
      matchDepartment: number | string;
      targetAudience?: string;
      viewer?: string;
      page: number;
    },
    callBack: (data: { data: any[]; counts: number; pageSize: number }) => void,
    errorCallBackFc: (isLoading: boolean) => void,
  ) => {
    return await settingReview.handleSearchSettingReviewHistory(
      {
        ...condition,
      },
      callBack,
      errorCallBackFc,
    );
  };
  const errorCallBackDe = (isLoading: boolean) => {
    setIsLoadingDepartment(isLoading);
  };
  useEffect(() => {
    settingReview.getAllListDepartment(callBackEffect, errorCallBackDe);
    if (location.state) {
      effectListDatas(
        {
          ...location.state,
        },
        callBackFC,
        errorCallBack,
      );
      form.setFieldsValue({
        targetAudience: location.state.targetAudience,
        depDivAudience: location.state.depDivAudience,
        depDivViewer: location.state.depDivViewer,
        viewer: location.state.viewer,
        matchDepartment: location.state.matchDepartment,
      });
    }
  }, []);

  return (
    <div>
      <Typography.Title level={5}>{t('IDS_SETTING_PERMISSION_EVALUATION')}</Typography.Title>
      <MainButton
        type="primary"
        name="Search"
        value="txt_evaluation_search"
        style={{ marginBottom: 20 }}
        onClick={() => {
          navigate(
            urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/add-user-evaluation-history-reference',
          );
        }}
        loading={props.isLoading}
      >
        {t('IDS_ADD_PERMISSION_EVALUATION')}
      </MainButton>

      <EvaluationReferenceSearchForm
        form={form}
        listDepartments={listDepartments}
        isLoading={props.isLoading || isLoadingDepartment}
        handleSearchForm={handleSearchForm}
      />
      <EvaluationReferenceTable
        condition={location.state}
        dataSources={dataSources}
        selectedRowKeys={selectedRowKeys}
        handleSearchForm={handleSearchForm}
        isLoading={props.isLoading}
        moveToPages={moveToPages}
        setSelectedRowKeys={setSelectedRowKeys}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        setIsLoadingTable={props.setIsLoading}
        setDataSource={setDataSource}
        callBackFC={callBackFC}
      />
    </div>
  );
};
export default SettingPermissionEvaluationReference;
