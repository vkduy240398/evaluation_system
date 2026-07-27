import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Modal, Popover, Row, Select, Table, Typography, notification } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import ModalCustomComponent from '../../../../../@core/components/modal-custom';
import MailListColumn from './MailListColumn';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useAuth } from '../../../../../hooks/useAuth';

type MailItem = { label: string; value: string; key: string };

interface Props {
  isOpenMailList: boolean;
  setOpenMailList: (data: boolean) => void;
  toUserList: string[];
  setToUserList: (data: string[]) => void;
  form: any;
  isDisabled: boolean;
  dataSourceList: MailItem[];
  setDataSource: (data: MailItem[]) => void;
}
export default function ShowMoreMailPopUp(props: Props) {
  const {
    isOpenMailList,
    setOpenMailList,
    toUserList,
    setToUserList,
    form,
    isDisabled,
    dataSourceList,
    setDataSource,
  } = props;

  const [curentForm] = Form.useForm();

  const { Option } = Select;

  const { user } = useAuth();

  const adminMail = user?.emailHR;

  const [api, contextHolder] = notification.useNotification();

  const [selectedMailList, setSelectedMailList] = useState<{ label: string; value: string; key: string }[]>([]);

  const [mailOptionList, setMailOptionList] = useState([] as any[]);

  const [deletedMailList, setDeletedMailList] = useState<any[]>([]);

  // const [searchValue, setSearchValue] = useState<string>('');

  const [isAdd, setAddNew] = useState(false);

  const [isOpen, setOpen] = useState(false);

  const [isIndeterminate, setIndeterminate] = useState(false);

  const [isCheckAll, setCheckAll] = useState(false);

  const init = (resData: { id: number; email: string }[]) => {
    const allUserMailList = resData?.map((mail: { id: number; email: string }) => {
      return (
        <Option value={mail.email} key={mail.id}>
          {mail.email}
        </Option>
      );
    });
    setMailOptionList(allUserMailList);
  };

  const handleChange = (values: any) => {
    const tempList: any[] = [];
    if (values) {
      values.forEach((mail: any) => {
        tempList.push({ label: mail, value: mail, key: mail });
      });
      setSelectedMailList(tempList);
    }
  };

  const handleAdd = async () => {
    setDataSource([...dataSourceList]);
    setAddNew(true);
    await evaluationPeriodServices.getUsersMailList(init, JSON.stringify(toUserList));

    // const newRecord = document.getElementById('scrollTo')!;
    // newRecord.scrollIntoView();
  };

  const handleSaveNew = async () => {
    if (selectedMailList.length) {
      let tempMailList = [...toUserList];
      let displayMailList = [...dataSourceList];
      tempMailList = tempMailList.filter((item: string) => {
        return item !== adminMail;
      });
      displayMailList = displayMailList.filter((item: any) => {
        return item.value !== adminMail;
      });
      const wrongFormatList: string[] = [];
      selectedMailList.forEach((item: any) => {
        const selectMail = (item?.value ?? '').replace(/\s/g, '');
        const last13characters = selectMail.substring(selectMail.length - 13);
        if (last13characters != '@geonet.co.jp') {
          wrongFormatList.push(selectMail);
        } else {
          const isInList = displayMailList.some((itemList) => itemList.value.trim() === item.value.trim());

          if (!isInList) {
            tempMailList.unshift(selectMail);
            displayMailList.unshift(item);
          }
        }
      });
      if (wrongFormatList.length) {
        const message = t('MESSAGE.COMMON.IDM_WRONG_EMAIL_FORMAT');
        openNotification(message);
      } else {
        setAddNew(false);
        setIndeterminate(!!deletedMailList.length && deletedMailList.length < displayMailList.length);
        setCheckAll(deletedMailList.length === displayMailList.length);
        adminMail && tempMailList.unshift(adminMail);
        setToUserList(tempMailList);
        const defaultValueList: string[] = [];
        tempMailList.forEach((item: any) => {
          defaultValueList.push(item.split(','));
        });

        //kiem tra neu dang co dieu kien search thi mail hien thi phai theo dieu kien search
        adminMail && displayMailList.unshift({ value: adminMail, label: adminMail, key: adminMail });
        if (curentForm.getFieldValue('searchValue') && curentForm.getFieldValue('searchValue') !== '') {
          displayMailList = displayMailList.filter((item: any) => {
            return item.value.includes(curentForm.getFieldValue('searchValue'));
          });
        }
        setDataSource(displayMailList);

        //
        form.setFieldsValue({ toMail: defaultValueList });
        curentForm.setFieldsValue({ inputedMails: [] });
        setSelectedMailList([]);
      }
    } else setAddNew(false);
  };

  const handleCancel = () => {
    // reset fields when close popup
    setSelectedMailList([]);
    setIndeterminate(false);
    setCheckAll(false);
    curentForm.setFieldsValue({ inputedMails: [] });
    setAddNew(false);
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
    // reset fields when close popup
    curentForm.setFieldsValue({ searchValue: null });
    const tempList: MailItem[] = [];
    toUserList.forEach((item: string) => {
      tempList.push({ value: item, label: item, key: item });
    });
    setDataSource([...tempList]);
    handleCancel();
    setDeletedMailList([]);
    setOpenMailList(false);
  };

  const actionDetele = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    // delete selected mails out of list of send mail
    let tempMailList = [...toUserList];
    tempMailList = tempMailList.filter((item: string) => {
      return (!deletedMailList.includes(item) && item !== '') || item == adminMail;
    });
    setToUserList(tempMailList);

    const defaultValueList: string[] = [];
    tempMailList.forEach((item: any) => {
      defaultValueList.push(item.split(','));
    });
    form.setFieldsValue({ toMail: defaultValueList });
    curentForm.setFieldsValue({ inputedMails: [] });

    //delete selected mails out of list of display mail
    let displayMailList = [...dataSourceList];
    displayMailList = displayMailList.filter((item: any) => {
      return (!deletedMailList.includes(item.value) && item.value !== '') || item.value == adminMail;
    });
    setDataSource(displayMailList);
    setDeletedMailList([]);
    setIndeterminate(false);
    setCheckAll(false);
    setOpen(false);
  };

  const handleSearch = () => {
    const searchValue = curentForm.getFieldValue('searchValue');
    const tempList: MailItem[] = [];
    toUserList.forEach((mail: string) => {
      if (mail.includes(searchValue) || !searchValue) {
        tempList.push({ label: mail, value: mail, key: mail });
      }
    });
    setDataSource(tempList);
    setDeletedMailList([]);
    setIndeterminate(false);
    setCheckAll(false);
  };
  const rowSelection = {
    onChange: (selectedRowKeys: any[]) => {
      const tempList = dataSourceList.filter((item: any) => {
        return item.value !== adminMail;
      });
      setIndeterminate(!!selectedRowKeys.length && selectedRowKeys.length < tempList.length);
      setCheckAll(selectedRowKeys.length === tempList.length);
      setDeletedMailList(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return { disabled: record.value == adminMail || isDisabled, name: record.value };
    },
  };
  const searchField = () => {
    return (
      <Form.Item name="searchValue" style={{ marginBottom: -1 }}>
        <Input
          style={{ width: '70%' }}
          onChange={handleSearch}
          suffix={<SearchOutlined />}
          placeholder={`${t('IDS_LIST_MAIL_TO')}`}
        ></Input>
      </Form.Item>
    );
  };

  const checkboxColumnTitle = () => {
    return (
      <Popover
        placement="left"
        title={''}
        content={t('IDS_BUTTON_DELETE_MULTIPLE')}
        style={{ backgroundColor: 'black', color: 'white' }}
      >
        <Checkbox
          indeterminate={isIndeterminate}
          onChange={onCheckAllChange}
          checked={isCheckAll}
          disabled={isDisabled}
        ></Checkbox>
      </Popover>
    );
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      let tempDatas = dataSourceList.filter((item: any) => {
        return item.value !== adminMail;
      });
      tempDatas = tempDatas.map((item: any) => {
        return item.value;
      });
      setDeletedMailList(tempDatas);
    } else setDeletedMailList([]);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title={<Typography.Title level={3}>{t('IDS_LIST_MAIL_TO')} </Typography.Title>}
        width={500}
        destroyOnClose={true}
        maskClosable={false}
        open={isOpenMailList}
        onCancel={() => handleClosePopup()}
        footer={null}
        centered
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 50px)' }}
      >
        <Form
          form={curentForm}
          style={{ width: '100%' }}
          labelCol={{ span: 3 }}
          labelAlign="left"
          requiredMark={false}
          colon={false}
        >
          <Button
            type="primary"
            style={{ marginBottom: 10, marginTop: 5, marginLeft: 5 }}
            onClick={() => handleAdd()}
            disabled={isDisabled || isAdd}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
          <Row style={{ marginLeft: 5 }}>
            <Form.Item
              name={'inputedMails'}
              initialValue={[]}
              style={{
                width: '340px',
                display: isAdd ? 'inline-block' : 'none',
                marginBottom: 20,
              }}
            >
              <Select mode="tags" onChange={handleChange}>
                {mailOptionList}
              </Select>
            </Form.Item>
            <div>
              <CheckCircleOutlined
                style={{
                  fontSize: '20px',
                  color: '#1b871b',
                  margin: '6px 0px 0px 12px',
                  display: isAdd ? 'inline-block' : 'none',
                }}
                onClick={() => handleSaveNew()}
              />
            </div>

            <div>
              <CloseCircleOutlined
                style={{
                  fontSize: '20px',
                  color: '#cb5d5d',
                  margin: '6px 5px 0px 10px',
                  display: isAdd ? 'inline-block' : 'none',
                }}
                onClick={() => handleCancel()}
              />
            </div>
          </Row>

          <Button
            type="primary"
            style={{ marginBottom: 10, marginLeft: 5 }}
            onClick={actionDetele}
            disabled={isAdd || isDisabled || !deletedMailList.length}
          >
            {t('IDS_BUTTON_DELETE_MULTIPLE')}
          </Button>
          <Table
            id="customTable"
            bordered
            style={{ marginLeft: 5, marginRight: 5 }}
            rowSelection={{
              type: 'checkbox',
              columnWidth: '10%',
              columnTitle: checkboxColumnTitle(),
              selectedRowKeys: deletedMailList,
              ...rowSelection,
            }}
            columns={MailListColumn({ searchField: searchField })}
            dataSource={dataSourceList}
            pagination={false}
          />
        </Form>
        <Row>
          <Button onClick={() => handleClosePopup()} className="cancel_button" style={{ marginTop: 10, marginLeft: 5 }}>
            {t('IDS_BUTTON_CLOSE')}
          </Button>
        </Row>
      </Modal>
      <ModalCustomComponent
        isOpen={isOpen}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_EMAIL')}
        fnHandleOk={handleDelete}
        fnHandleCancel={() => setOpen(false)}
        okText={t('IDS_DELETE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={false}
      />
    </div>
  );
}
