import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Row, Select, Table, Tooltip, Typography, notification } from 'antd';
import type { TableProps } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import { useAuth } from '../../../../../hooks/useAuth';

interface RecordMaillCCProps {
  id: string;
  id_user: number;
  user: string;
  evaluator: string;
}
interface DataCCMailProps {
  id?: number;
  user: string;
  evaluators: string[];
}

interface Props {
  isOpenMailCCList: boolean;
  setOpenMailCCList: (data: boolean) => void;
  toUserList: string[];
  dataMailCCs: DataCCMailProps[];
  setDataMailCCs: (value: { user: string; evaluators: string[] }[]) => void;
  handleFormValue: (data: string[]) => void;
  handleGetListUserAndEvaluatorsEmails(data: { user: string; evaluators: string[] }[]): string[];
  isDisabled?: boolean;
  emailEmployeeMap?: Record<string, string>;
}

export default function ShowMoreMailCCPopUp(props: Props) {
  const {
    isOpenMailCCList,
    setOpenMailCCList,
    toUserList,
    dataMailCCs,
    setDataMailCCs,
    handleFormValue,
    handleGetListUserAndEvaluatorsEmails,
    isDisabled,
    emailEmployeeMap,
  } = props;

  const [currentForm] = Form.useForm();

  const { Option } = Select;

  const { user } = useAuth();

  const adminMail = user?.emailHR;

  const [api, contextHolder] = notification.useNotification();

  const [selectedMailList, setSelectedMailList] = useState<string[]>([]);

  const [mailOptionList, setMailOptionList] = useState<
    {
      id: number;
      user: string;
      evaluatorMailList: any[];
    }[]
  >([] as any[]);

  const [processedDatas, setProcessedDatas] = useState<RecordMaillCCProps[]>([]);

  const [listEvaluators, setListEvaluators] = useState<{ id: number; email: string }[]>([]);

  const init = (resData: { id: number; email: string }[]) => {
    const allUserMailList: any = [];
    let filteredMailList: any = [];
    dataMailCCs.forEach((item: any) => {
      const { id, user, evaluators } = item;
      filteredMailList = resData
        ?.filter((mail: { id: number; email: string }) => {
          return !evaluators.includes(mail.email);
        })
        .map((mail: { id: number; email: string }) => {
          return (
            <Option value={mail.email} key={mail.id}>
              {mail.email}
            </Option>
          );
        });
      allUserMailList.push({
        id: id,
        user: user,
        evaluatorMailList: filteredMailList,
      });
    });
    setListEvaluators(resData);
    setMailOptionList([...allUserMailList]);
  };

  const handleChange = (values: any) => {
    setSelectedMailList(values);
  };

  const handleGetEvaluatorsList = async () => {
    await evaluationPeriodServices.getUsersMailList(init, JSON.stringify(toUserList));
  };

  const handleAddEvaluator = (record: RecordMaillCCProps) => {
    const wrongFormatList: string[] = [];

    // const checkMailExisteds: any = [];
    // let existedMail: string = '';
    selectedMailList.forEach((item: any) => {
      const selectMail = (item ?? '').replace(/\s/g, '');
      const last13characters = selectMail.substring(selectMail.length - 13);
      if (last13characters != '@geonet.co.jp') {
        wrongFormatList.push(selectMail);
      }

      // const mailExisteds = dataMailCCs.find((data: DataCCMailProps) => {
      //   return data.user === record.user && data.evaluators.includes(item)
      // })
      // if(mailExisteds !== undefined) {
      //   checkMailExisteds.push(mailExisteds);
      //   existedMail = item;
      // }
    });
    if (wrongFormatList.length) {
      const message = t('MESSAGE.COMMON.IDM_WRONG_EMAIL_FORMAT');
      openNotification(message);
    }

    // else if(checkMailExisteds.length > 0) {
    //     selectedMailList.filter((item: any) => !checkMailExisteds.includes(item));
    //     const message = `The email: ${existedMail} has already existed`;
    //     openNotification(message);
    //     // currentForm.setFieldValue(`inputedMails${record.user}`, []);
    // }
    else {
      const formVal = currentForm.getFieldValue(`inputedMails${record.id}`);
      const tempProcessedDatas = [...processedDatas] as any;
      formVal.forEach((mail: string) => {
        const userRecordLastIndex = tempProcessedDatas.findLastIndex((item: RecordMaillCCProps) => {
          return item.user === record.user && item.id_user === record.id_user;
        });

        const tempAddData = {
          id: `${record.user}_${record.id_user}_${userRecordLastIndex + 1}`,
          id_user: record.id_user,
          user: record.user,
          evaluator: mail,
        };
        tempProcessedDatas.splice(userRecordLastIndex + 1, 0, tempAddData);
      });

      setProcessedDatas(tempProcessedDatas);
      const newAddEvaluators = dataMailCCs.map((item: any) => {
        if (item.user === record.user && item.id === record.id_user) {
          item = {
            ...item,
            evaluators: [...item.evaluators, ...formVal],
          };
        }

        return item;
      });
      setDataMailCCs(newAddEvaluators);
      const newListUserAndEvaluatorEmails = handleGetListUserAndEvaluatorsEmails(newAddEvaluators);
      handleFormValue(Array.from(new Set([...(adminMail ? [adminMail] : []), ...newListUserAndEvaluatorEmails])));
      currentForm.setFieldValue(`inputedMails${record.id}`, []);
      setSelectedMailList([]);
    }
  };

  const handleDeleteCC = (record: RecordMaillCCProps) => {
    const tempProcessedDatas = processedDatas.filter((item: RecordMaillCCProps) => {
      return item.id !== record.id;
    });
    setProcessedDatas(tempProcessedDatas);
    const newDeleteEvaluators = dataMailCCs.map((item: any) => {
      if (item.user === record.user && item.id === record.id_user) {
        item = {
          ...item,
          evaluators: item.evaluators.filter((e: any) => e !== record.evaluator),
        };
      }

      return item;
    });
    setDataMailCCs(newDeleteEvaluators);
    const newListUserAndEvaluatorEmails = handleGetListUserAndEvaluatorsEmails(newDeleteEvaluators);
    handleFormValue(Array.from(new Set([...(adminMail ? [adminMail] : []), ...newListUserAndEvaluatorEmails])));
  };

  const handleCancel = () => {
    // reset fields when close popup
    setSelectedMailList([]);
    const fieldName = currentForm.getFieldsValue();
    currentForm.resetFields(Object.keys(fieldName));
  };

  const openNotification = (msg: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: msg,
      placement: 'bottomRight',
      duration: 4,
    });
  };

  const handleClosePopup = () => {
    handleCancel();
    setOpenMailCCList(false);
  };

  const handleDeleteAllDefaultCC = () => {
    if (!adminMail) return;
    const newDataMailCCs = dataMailCCs.map((item) => ({
      ...item,
      evaluators: item.evaluators.filter((e) => e !== adminMail),
    }));
    setDataMailCCs(newDataMailCCs);
    const newEmailList = handleGetListUserAndEvaluatorsEmails(newDataMailCCs);
    handleFormValue(Array.from(new Set(newEmailList)));
  };

  const handleDataMailCC = (data: DataCCMailProps[]): void => {
    const tempArrs: any = [];
    data.forEach((item: DataCCMailProps, index: number) => {
      const { user, evaluators } = item;
      if (!evaluators || evaluators?.length === 0) {
        const emptyEvaluatorObj = { id: `${user}_${item.id}_${index}`, id_user: item.id, user: user, evaluator: '' };
        tempArrs.push(emptyEvaluatorObj);
      } else {
        evaluators.forEach((e: string, i: number) => {
          const newObj = { id: `${user}_${item.id}_${i}`, id_user: item.id, user: user, evaluator: e };
          tempArrs.push(newObj);
        });
      }
    });

    setProcessedDatas(tempArrs);
  };

  const checkDisableDeleteButton = (record: RecordMaillCCProps): boolean => {
    return !record.evaluator;
  };

  useEffect(() => {
    init(listEvaluators);
    handleDataMailCC(dataMailCCs);
  }, [dataMailCCs]);

  useEffect(() => {
    handleGetEvaluatorsList();
  }, [isOpenMailCCList]);

  const listMailRecipients: TableProps<any>['columns'] = [
    {
      title: t('IDS_MAIL_TO'),
      key: 'user',
      dataIndex: 'user',
      width: '25%',
      align: 'left',
      onCell: (record: RecordMaillCCProps) => {
        const recordEvaluatorsLength = dataMailCCs.find((e) => e.user === record.user && e.id === record.id_user)
          ?.evaluators.length;
        const recordEvaluatorIndex = dataMailCCs
          .find((e) => e.user === record.user && e.id === record.id_user)
          ?.evaluators.findIndex((e) => e === record.evaluator);
        if (
          record &&
          recordEvaluatorIndex !== undefined &&
          recordEvaluatorIndex !== -1 &&
          recordEvaluatorsLength !== 0 &&
          recordEvaluatorsLength !== undefined
        ) {
          return { rowSpan: recordEvaluatorIndex % recordEvaluatorsLength === 0 ? recordEvaluatorsLength : 0 };
        } else {
          return { rowSpan: 1 };
        }
      },
      render: (text) => {
        const empNum = emailEmployeeMap?.[text];
        const display = text != null ? text.replace(/,\s*/g, '\n') : '';
        return <div style={{ wordBreak: 'break-all' }}>{empNum ? `${empNum}: ${display}` : display}</div>;
      },
    },
    {
      title: 'CC',
      key: 'evaluator',
      dataIndex: 'evaluator',
      width: '20%',
      align: 'center',
      render: (text) => <div>{text}</div>,
    },
    {
      title: t('IDS_CC_DELETE'),
      key: 'delete',
      dataIndex: '',
      width: '10%',
      align: 'center',
      render: (__, record) => (
        <div>
          <Button
            icon={<DeleteOutlined />}
            style={{ color: '#007240 ' }}
            onClick={() => handleDeleteCC(record)}
            disabled={checkDisableDeleteButton(record)}
          />
        </div>
      ),
    },
    {
      title: t('IDS_CC_ADD'),
      key: 'add',
      dataIndex: '',
      width: '25%',
      align: 'center',
      onCell: (record: RecordMaillCCProps) => {
        const recordEvaluatorsLength = dataMailCCs.find((e) => e.user === record.user && e.id === record.id_user)
          ?.evaluators.length;
        const recordEvaluatorIndex = dataMailCCs
          .find((e) => e.user === record.user && e.id === record.id_user)
          ?.evaluators.findIndex((e) => e === record.evaluator);
        if (
          record &&
          recordEvaluatorIndex !== undefined &&
          recordEvaluatorIndex !== -1 &&
          recordEvaluatorsLength !== 0 &&
          recordEvaluatorsLength !== undefined
        ) {
          return { rowSpan: recordEvaluatorIndex % recordEvaluatorsLength === 0 ? recordEvaluatorsLength : 0 };
        } else {
          return { rowSpan: 1 };
        }
      },
      render: (__, record: RecordMaillCCProps) => (
        <div>
          <Form
            form={currentForm}
            style={{ width: '100%' }}
            labelCol={{ span: 3 }}
            labelAlign="left"
            requiredMark={false}
            colon={false}
            name="ccMail"
          >
            <Row style={{ justifyContent: 'center' }}>
              <Form.Item
                name={`inputedMails${record.id}`}
                initialValue={[]}
                style={{
                  width: '250px',
                  marginTop: '5px',
                }}
              >
                <Select mode="tags" onChange={handleChange}>
                  {mailOptionList.find((e) => e.user === record.user && e.id === record.id_user)?.evaluatorMailList}
                </Select>
              </Form.Item>
              <div>
                <CheckCircleOutlined
                  style={{
                    fontSize: '20px',
                    color: '#1b871b',
                    margin: '12px 0px 0px 12px',
                  }}
                  onClick={() => handleAddEvaluator(record)}
                />
              </div>
            </Row>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Modal
        title={<Typography.Title level={3}>{t('IDS_LIST_MAIL_TO')}</Typography.Title>}
        width={1000}
        destroyOnClose={true}
        maskClosable={false}
        open={isOpenMailCCList}
        onCancel={() => handleClosePopup()}
        footer={null}
        centered
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 50px)' }}
      >
        {!isDisabled && adminMail && processedDatas.some((r) => r.evaluator === adminMail) && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <Tooltip title={`デフォルトメール（${adminMail}）を全行から一括削除します`}>
              <Button danger size="small" icon={<DeleteOutlined />} onClick={handleDeleteAllDefaultCC}>
                デフォルト全削除
              </Button>
            </Tooltip>
          </div>
        )}
        <Table
          rowKey={(record) => record.id}
          dataSource={processedDatas}
          columns={isDisabled ? listMailRecipients.slice(0, -2) : listMailRecipients}
          pagination={false}
          bordered
        />
        <Row>
          <Button onClick={() => handleClosePopup()} className="cancel_button" style={{ marginTop: 10, marginLeft: 5 }}>
            {t('IDS_BUTTON_CLOSE')}
          </Button>
        </Row>
      </Modal>
    </div>
  );
}
