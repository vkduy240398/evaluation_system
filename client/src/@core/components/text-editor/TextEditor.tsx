// @ts-nocheck
import { t } from 'i18next';

import editorSetting from './setting';
import { createEditorSetting } from './setting';
import JoditEditor from 'jodit-react';
import { startTransition } from 'react';

type TextEditorProps = {
  contentLength: number;
  setContentLength: any;
  content: string;
  setContent?: any;
  isReadonly?: boolean;
  isScrSettingGuide?: boolean;
};

//maxlength = 50000
const editorSettingMaxChar = createEditorSetting(-1);
const TextEditor = (props: TextEditorProps) => {
  const { contentLength, setContentLength, content, setContent, isReadonly, isScrSettingGuide } = props;
  const { lengthLimit, editorConfig } = isScrSettingGuide ? editorSettingMaxChar : editorSetting;
  const onChange = (content: string) => {
    const plainContent = content.replace(/<(.|\n)*?>/g, '').replaceAll('　', '').trim();
    startTransition(() => {
      setContent(content);
    });
    setContentLength(plainContent.length);
  };

  return (
    <>
      <JoditEditor
        value={content}
        config={isReadonly ? { ...editorConfig, readonly: true } : editorConfig}
        onChange={onChange}
      />
      {contentLength > lengthLimit && lengthLimit > -1 && (
        <div style={{ color: 'red', marginTop: '3px' }}>
          {t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${lengthLimit}`)}
        </div>
      )}
      {contentLength === 0 && (
        <div style={{ color: 'red', marginTop: '3px' }}>{t('MESSAGE.COMMON.IDM_BLANK_ITEM')}</div>
      )}
    </>
  );
};

export default TextEditor;
