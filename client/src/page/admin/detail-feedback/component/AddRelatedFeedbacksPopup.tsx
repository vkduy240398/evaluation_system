import { message, Modal, Typography } from 'antd';
import { t } from 'i18next';
import React, { Key, useState } from 'react';
import useForm from 'antd/es/form/hooks/useForm';
import NonRelatedFeedbackSearchForm from './NonRelatedFeedbackSearchForm';
import { Feedback, INonRelatedFeedbackSearchForm } from '../../../../model/Feedback';
import NonRelatedFeedbackTable from './NonRelatedFeedbackTable';
import feedbackApiService from '../../../../common/api/feedback';

interface Props {
  originalFeedbackId: number;
  isOpen: boolean;
  onCancel: () => void;
  onAddSuccess: () => void;
}

export default function AddRelatedFeedbacksPopup(props: Props) {
  const [form] = useForm<INonRelatedFeedbackSearchForm>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[] | undefined>();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetStates = () => {
    setSelectedRowKeys([]);
    setCurrentPage(1);
    setFeedbacks(undefined);
    setIsLoading(false);
  };

  const handleSearch = async (values: INonRelatedFeedbackSearchForm) => {
    setIsLoading(true);
    await feedbackApiService.getNonRelatedFeedbacks(
      props.originalFeedbackId,
      { ...values, limit: 20, offset: 0 },
      (data) => {
        setFeedbacks(data.rows);
        setTotal(data.count);
        setCurrentPage(1);
        setSelectedRowKeys([]);
      },
      () => {},
    );
    setIsLoading(false);
  };

  const handleChangePage = async (limit: number, offset: number) => {
    setIsLoading(true);
    await feedbackApiService.getNonRelatedFeedbacks(
      props.originalFeedbackId,
      { ...form.getFieldsValue(), limit, offset },
      (data) => {
        setFeedbacks(data.rows);
        setTotal(data.count);
        setSelectedRowKeys([]);
      },
      () => {},
    );
    setIsLoading(false);
  };

  const handleAdd = async () => {
    setIsLoading(true);
    await feedbackApiService.addRelatedFeedback(
      props.originalFeedbackId,
      selectedRowKeys as number[],
      () => {
        message.success(t('MESSAGE.COMMON.IDM_ADD_RELATED_FEEDBACKS_SUCCESS'));
        props.onAddSuccess();
      },
      () => {
        setIsLoading(false);
      },
    );
  };

  return (
    <>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('IDS_ADD_RELATED_FEEDBACK')}</Typography.Title>}
        open={props.isOpen}
        footer={null}
        style={{ top: 20 }}
        width="90%"
        maskClosable={false}
        onCancel={props.onCancel}
        destroyOnClose={true}
        afterClose={resetStates}
      >
        <NonRelatedFeedbackSearchForm form={form} onSearch={handleSearch} isLoading={isLoading} />
        {feedbacks && (
          <NonRelatedFeedbackTable
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            feedbacks={feedbacks}
            total={total}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onChangePage={handleChangePage}
            onAdd={handleAdd}
          />
        )}
      </Modal>
    </>
  );
}
