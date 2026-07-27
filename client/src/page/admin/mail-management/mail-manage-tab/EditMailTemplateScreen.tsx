import { Button, Form, Input, Radio, Select, Skeleton, Space, Typography } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mailManagementServices from '../../../../common/api/mailManagement';
import { itemMailTemplate } from '../interfaces/interfacesProps';
import { CancelButton } from '../../../../common/MainButton';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import TokenBlot from './quill/TokenBlot';
import TokenDrop, { TOKEN_MODULE_NAME } from './quill/TokenDrop';
import EditorQuill from './quill/EditorQuill';
import Token from './quill/Token';
import './quill/token.css';
import { DefaultOptionType } from 'antd/es/select';
import { TemplateMailId } from '../../send-email/TemplateMailId';
import { TOKENS } from './mailTokens';

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['0.75em', '1em', '1.5em', '2.5em'];
Quill.register(Size, true);
Quill.register('modules/magicUrl', MagicUrl);
Quill.register(TokenBlot);
Quill.register(`modules/${TOKEN_MODULE_NAME}`, TokenDrop);

const EditMailTemplateScreen: React.FC = () => {
  const [form] = Form.useForm();
  const Location = useLocation();
  const navigates = useNavigate();
  const lengthLimit = 5000;

  const id = Location.state?.id;
  const state = Location.state;

  const listOptions: DefaultOptionType[] = [
    {
      label: t('IDS_SET_DAY_OPTIONS.0_DAY'),
      value: 0,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '1'),
      value: 1,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '2'),
      value: 2,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '3'),
      value: 3,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '4'),
      value: 4,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '5'),
      value: 5,
    },
    {
      label: t('IDS_SET_DAY_OPTIONS.NUM_DAY').replace('{day}', '6'),
      value: 6,
    },
  ];

  /** State  */
  const [templateInfo, setTemplateInfo] = useState<itemMailTemplate>();
  const [isPageLoading, setPageLoading] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [contentLength, setContentLength] = useState<number>(-1);
  const [mailContent, setMailContent] = useState<string>('メッセージの内容を読み込んでいます...');
  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);
  const [isTitleFocus, setTitleFocus] = useState<boolean>(false);
  const [isEditorFocus, setEditorFocus] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [contentPreview, setContentPreview] = useState<string>('');

  const quillRef = useRef(null);
  const titleRef = useRef(null) as any;

  const tokensById = {} as any;
  TOKENS.forEach((token) => {
    tokensById[token.slug] = token;
  });

  /** Handler func */
  const callBack = (res: any) => {
    let result = res;
    if (idIsTemplateSetting(result.id)) {
      const objectSetting: {
        active: number;
        days: number[];
      } = JSON.parse(result.setting);

      result = { ...result, active: objectSetting?.active ? objectSetting.active : 0, days: objectSetting?.days };
    }
    setTemplateInfo(result);
    setMailContent(res.content);

    // navigates(Location.pathname, {
    //   state: res.name,
    // });
  };

  const idIsTemplateSetting = (id: number | undefined): boolean => {
    if (id === TemplateMailId.SEND_MAIL_REMIND_GOAL || id === TemplateMailId.SEND_MAIL_REMIND_EVAL) {
      return true;
    } else {
      return false;
    }
  };

  const getMailTemplateInfo = async () => {
    if (id) {
      await mailManagementServices.getMailTemplateListById(callBack, { id }, setPageLoading);
    } else {
      navigates('/404page');
    }
  };

  const handleEditTemplate = async (value: {
    name: string;
    note: string;
    subject: string;
    editor: string;
    activeRemind: number;
    daysRemind: number[];
  }) => {
    const name = templateInfo?.name;
    const subject = templateInfo?.subject;
    const note = templateInfo?.note;
    const contentMail = templateInfo?.content;
    const listDays = templateInfo?.days;
    const active = templateInfo?.active;

    if (
      name === value.name &&
      subject === value.subject &&
      note === value.note &&
      contentMail === mailContent &&
      active === value.activeRemind &&
      listDays === value.daysRemind
    ) {
      setIsOpenPopUpConfirm(false);
      setPageLoading(true);
      setTimeout(() => {
        setPageLoading(false);
      }, 500);

      return;
    }

    let dataEdit: any = {
      id,
      name: value.name,
      subject: value.subject,
      note: value.note,
      content: mailContent,
    };

    if (idIsTemplateSetting(templateInfo?.id)) {
      dataEdit = {
        ...dataEdit,
        setting: {
          active: value.activeRemind,
          days: value.daysRemind,
        },
      };
    }
    await mailManagementServices.editMailTemplate(callBack, dataEdit, setLoading, setIsOpenPopUpConfirm);
    getMailTemplateInfo();
  };

  const handleInsertText = (tokenData: any) => {
    const inputElement = document.getElementById('subject') as HTMLInputElement;
    const cursorPosition = inputElement.selectionStart as any;
    const inputContent = form.getFieldValue('subject') as string;
    const insertString = `{{${tokenData.slug}}}`;
    const message = inputContent.substring(0, cursorPosition) + insertString + inputContent.substring(cursorPosition);
    if (message.length <= 200) {
      const output = message;
      form.setFieldValue('subject', output);
      handleReplacePreview(output, 'title');
      setTimeout(() => {
        inputElement.setSelectionRange(cursorPosition + insertString.length, cursorPosition + insertString.length);
      }, 1);
    }
    titleRef.current.focus();
  };

  const handleReplacePreview = (string: string, type: string) => {
    let repContent = string;
    TOKENS.filter((el) => el.listTemplate.includes(id)).map((token) => {
      const replaceString = token.note.split(`例）`)[1];
      const regexPattern = new RegExp(`{{${token.slug}}}`, 'gi');
      repContent = repContent.replace(regexPattern, replaceString);
    });
    if (type === 'title') form.setFieldValue('titlePreview', repContent);
    else setContentPreview(repContent);
  };

  const onTitleFocus = () => {
    setTitleFocus(true);
    setEditorFocus(false);
  };

  const onEditorFocus = () => {
    setEditorFocus(true);
    setTitleFocus(false);
  };

  const onOtherFocus = () => {
    setEditorFocus(false);
    setTitleFocus(false);
  };

  useEffect(() => {
    getMailTemplateInfo();
  }, []);

  useEffect(() => {
    if (templateInfo) {
      setMailContent(templateInfo.content);
      handleReplacePreview(templateInfo.subject, 'title');
      handleReplacePreview(templateInfo.content, 'editor');
      form.setFieldValue('name', templateInfo.name);
      form.setFieldValue('subject', templateInfo.subject);
      form.setFieldValue('note', templateInfo.note);
      if (idIsTemplateSetting(templateInfo.id)) {
        form.setFieldValue('daysRemind', templateInfo.days);
        form.setFieldValue('activeRemind', templateInfo.active);
      }
    }
  }, [templateInfo]);

  return (
    <>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F7', { returnObjects: true }) as any)[2]}</Typography.Title>
      {/* <Card> */}

      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <Form
          onFinish={handleEditTemplate}
          style={{ width: '100%', padding: '10px' }}
          labelCol={{ span: 1 }}
          labelAlign="left"
          requiredMark={false}
          colon={false}
          form={form}
        >
          <Form.Item style={{ marginBottom: 10 }} name="name" label={t('IDS_TEMPLATE_NAME')} colon={false}>
            <Input disabled={true} onFocus={onOtherFocus} style={{ width: '90%' }} maxLength={31} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 10 }}
            name="note"
            label={t('IDS_EXPLANATION')}
            colon={false}
            rules={[
              // { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
              },
            ]}
          >
            <Input.TextArea
              ref={titleRef}
              onFocus={onOtherFocus}
              style={{ width: '90%' }}
              maxLength={201}
              autoSize={{ minRows: 0, maxRows: 2 }}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 10 }}
            name="subject"
            label={t('IDS_MAIL_SUBJECT')}
            colon={false}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
              },
            ]}
          >
            <Input
              ref={titleRef}
              onFocus={onTitleFocus}
              style={{ width: '90%' }}
              maxLength={201}
              onChange={(e) => {
                handleReplacePreview(e.target.value, 'title');
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 10 }} name="items" label={t('IDS_ITEM')} colon={false}>
            <div style={{ width: '90%' }}>
              <Space size={'middle'} wrap>
                {TOKENS.filter((el) => el.listTemplate.includes(id)).map((tokenProps) => (
                  <Token
                    {...tokenProps}
                    key={tokenProps.id}
                    quillRef={quillRef}
                    titleRef={titleRef}
                    isEditorFocus={isEditorFocus}
                    isTitleFocus={isTitleFocus}
                    handleInsertText={handleInsertText}
                    mailContent={mailContent}
                  />
                ))}
              </Space>
            </div>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 10 }}
            name="editor"
            label={t('IDS_TEXT_EDITOR')}
            colon={false}
            initialValue={templateInfo?.content}
            rules={[
              // { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                validator() {
                  if (contentLength > lengthLimit || contentLength === 0) {
                    return Promise.reject();
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <div style={{ width: '90%' }}>
              <EditorQuill
                value={templateInfo?.content}
                lengthLimit={lengthLimit}
                onChange={setMailContent}
                handleReplacePreview={handleReplacePreview}
                quillRef={quillRef}
                tokensById={tokensById}
                onEditorFocus={onEditorFocus}
                contentLength={contentLength}
                setContentLength={setContentLength}
              />
            </div>
          </Form.Item>
          {idIsTemplateSetting(id) && (
            <>
              <Form.Item
                label={t('IDS_SET_DAY')}
                name="daysRemind"
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
                style={{ marginBottom: 10 }}
              >
                <Select style={{ width: '90%' }} options={listOptions} mode="multiple" />
              </Form.Item>
              <Form.Item
                label={t('IDS_SET_ACTIVE')}
                name="activeRemind"
                colon={false}
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
              >
                <Radio.Group defaultValue={0}>
                  <Radio value={1}>{t('IDS_SET_ACTIVE_OPTIONS.IDS_ACTIVE')}</Radio>
                  <Radio value={0}>{t('IDS_SET_ACTIVE_OPTIONS.IDS_INACTIVE')}</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          )}
          <Form.Item label=" ">
            <Button
              style={{ marginBottom: 10 }}
              onClick={() => {
                setIsPreview(!isPreview);
              }}
            >
              {t('IDS_PREVIEW')}
            </Button>
          </Form.Item>
          {isPreview && (
            <>
              <Form.Item label={t('IDS_MAIL_SUBJECT')} name="titlePreview">
                <Input style={{ width: '90%', marginBottom: 15 }} readOnly />
              </Form.Item>
              <Form.Item label={t('IDS_TEXT_EDITOR')} name="editorPreview">
                <div
                  style={{
                    width: '90%',
                    height: 250,
                    overflowY: 'auto',
                    border: '1px solid #BABABA',
                    backgroundColor: 'white',
                  }}
                >
                  <div style={{ margin: 10 }}>
                    {parse(!contentPreview ? t('MESSAGE.COMMON.IDM_EMPTY_DATA').toString() : contentPreview)}
                  </div>
                </div>
              </Form.Item>
            </>
          )}
          <Space
            size={'middle'}
            style={{
              marginTop: 10,
            }}
          >
            <Form.Item style={{ margin: 0 }}>
              <Button
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                loading={isLoading}
                onClick={() => {
                  form
                    .validateFields()
                    .then(async (status: any) => {
                      if (!status.errorFields) setIsOpenPopUpConfirm(true);
                    })
                    .catch((_err) => {});
                }}
              >
                {t('IDS_BUTTON_SAVE')}
              </Button>
            </Form.Item>
            <CancelButton
              onClick={() => {
                navigates(Location.pathname.split('/').slice(0, -1).join('/'), { state: state });
              }}
            >
              {t('IDS_BUTTON_CANCEL')}
            </CancelButton>
          </Space>
        </Form>
      )}
      <ModalCustomComponent
        isOpen={isOpenPopUpConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={form.submit}
        fnHandleCancel={() => setIsOpenPopUpConfirm(false)}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
      {/* </Card> */}
    </>
  );
};

export default EditMailTemplateScreen;
