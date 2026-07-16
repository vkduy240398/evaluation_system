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

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const TOKENS = [
    {
      title: '評価年度',
      slug: 'evaluationYear',
      id: 1,
      listTemplate: [5, 12, 6, 13, 7, 8, 9, 14, 15, 16, 10, 17, 11, 18, 19, 20],
      note: `キーワード：{{evaluationYear}}\nフォーマット：YYYY\n例）2024`,
    },
    {
      title: '上期 or 下期',
      slug: 'evaluationPeriod',
      id: 2,
      listTemplate: [7, 8, 9, 14, 15, 16, 10, 17, 11, 18, 19, 20, 5, 6, 12, 13],
      note: `キーワード：{{evaluationPeriod}}\nフォーマット：上期または下期\n例）上期`,
    },
    {
      title: '被評価者の氏名',
      slug: 'evaluateeName',
      id: 3,
      listTemplate: [10, 17, 11],
      note: `キーワード：{{evaluateeName}}\n例）山田 太郎`,
    },
    {
      title: '目標 or 評価',
      slug: 'evaluationType',
      id: 4,
      listTemplate: [11],
      note: `キーワード：{{evaluationType}}\nフォーマット：目標または評価\n例）目標`,
    },
    {
      title: '所属部署',
      slug: 'departmentName',
      id: 5,
      listTemplate: [10, 17, 11, 21],
      note: `キーワード：{{departmentName}}\n例）コーポレート部`,
    },
    {
      title: '差戻元の氏名',
      slug: 'rejecter',
      id: 6,
      listTemplate: [11],
      note: `キーワード：{{rejecter}}\n例）山田 太郎`,
    },
    { title: '差戻先', slug: 'rejectee', id: 7, listTemplate: [11], note: `キーワード：{{rejectee}}\n例）山田 太郎` },
    {
      title: '評価期間の開始月',
      slug: 'periodStartMonth',
      id: 8,
      listTemplate: [10, 17, 11],
      note: `キーワード：{{periodStartMonth}}\nフォーマット：YYYY/M\n例）2024/4`,
    },
    {
      title: '評価期間の終了月',
      slug: 'periodEndMonth',
      id: 9,
      listTemplate: [10, 17, 11],
      note: `キーワード：{{periodEndMonth}}\nフォーマット：YYYY/M\n例）2024/9`,
    },
    {
      title: 'ログイン画面URL',
      slug: 'loginUrl',
      id: 10,
      listTemplate: [5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20],
      note: `キーワード：{{loginUrl}}\n例）https://10.0.0.0/login`,
    },
    {
      title: '該当詳細画面URL',
      slug: 'detailUrl',
      id: 11,
      listTemplate: [8, 10, 17, 11, 18, 1, 3, 4, 2, 21, 22, 23, 24, 15, 19, 20],
      note: `キーワード：{{detailUrl}}\n例）https://10.0.0.0/evaluation/`,
    },
    {
      title: '評価者の氏名',
      slug: 'evaluatorName',
      id: 20,
      listTemplate: [10, 17],
      note: `キーワード：{{evaluatorName}}\n例）山田 太郎`,
    },
    {
      title: '専門スキルのテンプレート名',
      slug: 'proskillName',
      id: 21,
      listTemplate: [1, 3, 4, 2],
      note: `キーワード：{{proskillName}}\n例）情報システム部共通`,
    },
    {
      title: '専門スキルのバージョン',
      slug: 'versionProskill',
      id: 22,
      listTemplate: [1, 3, 4, 2],
      note: `キーワード：{{versionProskill}}\n例）1.0`,
    },
    {
      title: '専門スキル設定者の氏名',
      slug: 'proskillCreatorName',
      id: 23,
      listTemplate: [1],
      note: `キーワード：{{proskillCreatorName}}\n例）山田 太郎`,
    },
    {
      title: '評価期間の1日',
      slug: 'periodFirstDate',
      id: 24,
      listTemplate: [5, 12, 6, 13],
      note: `キーワード：{{periodFirstDate}}\nフォーマット：\n上期：YYYY年4月1日\n下期：YYYY年10月1日\n例）2024年4月1日`,
    },
    {
      title: '今期の終了月',
      slug: 'periodMonth',
      id: 25,
      listTemplate: [5, 12, 6, 13],
      note: `キーワード：{{periodMonth}}\nフォーマット：\n上期：YYYY年9月\n下期：YYYY年3月\n例）2024年9月`,
    },
    {
      title: '評価期間の2日',
      slug: 'periodSecondDate',
      id: 26,
      listTemplate: [5, 6],
      note: `キーワード：{{periodSecondDate}}\nフォーマット：\n上期：YYYY年10月2日\n下期：YYYY年4月2日\n例）2024年10月2日`,
    },
    {
      title: '前期の終了月',
      slug: 'secondPeriodMonth',
      id: 27,
      listTemplate: [5, 6],
      note: `キーワード：{{secondPeriodMonth}}\nフォーマット：\n上期：YYYY年3月\n下期：YYYY年9月\n例）2024年3月`,
    },
    {
      title: '目標設定開始日',
      slug: 'goalCreateStartDate',
      id: 28,
      listTemplate: [9],
      note: `キーワード：{{goalCreateStartDate}}\nフォーマット：YYYY/M/D\n例）2024/4/1`,
    },
    {
      title: '目標設定終了日',
      slug: 'goalCreateEndDate',
      id: 29,
      listTemplate: [7, 8, 9, 19],
      note: `キーワード：{{goalCreateEndDate}}\nフォーマット：YYYY/M/D\n例）2024/4/15`,
    },
    {
      title: '評価開始日',
      slug: 'evaluationStartDate',
      id: 30,
      listTemplate: [16],
      note: `キーワード：{{evaluationStartDate}}\nフォーマット：YYYY/M/D\n例）2024/4/1`,
    },
    {
      title: '評価終了日',
      slug: 'evaluationEndDate',
      id: 31,
      listTemplate: [14, 15, 16, 20],
      note: `キーワード：{{evaluationEndDate}}\nフォーマット：YYYY/M/D\n例）2024/4/15`,
    },
    {
      title: '日作成目標開始',
      slug: 'dayCreationGoalStart',
      id: 32,
      listTemplate: [9],
      note: `キーワード：{{dayCreationGoalStart}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)`,
    },
    {
      title: '日作成目標終了',
      slug: 'dayCreationGoalEnd',
      id: 33,
      listTemplate: [7, 8, 9, 19],
      note: `キーワード：{{dayCreationGoalEnd}}\nフォーマット：M月D日 (曜日)\n例）4月15日 (月)`,
    },
    {
      title: '日評価開始',
      slug: 'dayEvaluationStart',
      id: 34,
      listTemplate: [16],
      note: `キーワード：{{dayEvaluationStart}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)`,
    },
    {
      title: '日評価終了',
      slug: 'dayEvaluationEnd',
      id: 35,
      listTemplate: [14, 15, 16, 20],
      note: `キーワード：{{dayEvaluationEnd}}\nフォーマット：M月D日 (曜日)\n例）4月1日 (月)`,
    },
    {
      title: '被評価者へ',
      slug: 'toUser',
      id: 36,
      listTemplate: [6, 13, 7, 8, 14, 15, 19, 20, 21, 22, 23, 24],
      note: `キーワード：{{toUser}}\nフォーマット：{{toUser}}さん\n例）長谷川さん`,
    },
    {
      title: '評価者へ',
      slug: 'ccEvaluator',
      id: 37,
      listTemplate: [6, 13, 7, 14],
      note: `キーワード：{{ccEvaluator}}\nフォーマット：{{ccEvaluator}}さん\n例）後藤さん、桑原さん`,
    },
    {
      title: '会社名',
      slug: 'companyName',
      id: 39,
      listTemplate: [21],
      note: `キーワード：{{companyName}}\n例）GEO Holdings`,
    },
    {
      title: 'フィードバックタイプ',
      slug: 'typeFeedback',
      id: 40,
      listTemplate: [21, 23, 24],
      note: `キーワード：{{typeFeedback}}\n例）その他`,
    },
    {
      title: 'ステータス', // chưa dịch
      slug: 'status',
      id: 41,
      listTemplate: [22],
      note: `キーワード：{{status}}\n例）対応不要`,
    },
    {
      title: '課題概要',
      slug: 'overview',
      id: 42,
      listTemplate: [21],
      note: `キーワード：{{overview}}\n例）目標設定プロセスに関する質問`,
    },
    {
      title: 'No.Issue',
      slug: 'NO.',
      id: 42,
      listTemplate: [21, 22, 23, 24],
      note: `キーワード：{{NO.}}\n例）12345`,
    },
    {
      title: '被評価者',
      slug: 'userName',
      id: 43,
      listTemplate: [8, 15, 19, 20],
      note: `キーワード：{{userName}}\n例）手嶋 兼次`,
    },
    {
      title: '部署',
      slug: 'divisionName',
      id: 44,
      listTemplate: [8, 15, 19, 20],
      note: `キーワード：{{divisionName}}\n例）グローバルシステム管理部`,
    },
    {
      title: '等級',
      slug: 'level',
      id: 45,
      listTemplate: [8, 15, 19, 20],
      note: `キーワード：{{level}}\n例）2`,
    },
  ];

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
