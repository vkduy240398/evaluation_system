import React, { useState } from 'react';
import Quill from 'quill';
import TokenBlot from './TokenBlot';
import { t } from 'i18next';
import CONFIG from './editor_config';

// const TOKEN_MATCHER = /\{\{(\w*)\|(\w*)\}\}/gi;
const TOKEN_MATCHER = /\{\{(\w*)\}\}/gi;

// Replace the token embeds from the Quill output with placeholder syntax.
const htmlToTokens = (htmlString: any) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, 'text/html');
  dom.querySelectorAll(`.${TokenBlot.className}`).forEach((token) => {
    const {
      dataset: { id, slug },
    } = token as any;
    token.replaceWith(`{{${slug}}}`);
  });
  const text = dom.body.innerHTML
    .replaceAll('</p><p><br></p><p>', '<br><br>')
    .replace(/<\/p><p>/g, '<br>')
    .replace(/<\/?p>/g, '');

  // return dom.body.innerHTML;
  return text;
};

const tokensToHtml = (tokenizedString: any, tokensById: any) => {
  return tokenizedString.replace(TOKEN_MATCHER, (match: any, slug: any, id: any) => {
    const token = tokensById[slug];

    // Ignore matches that aren't for a real token.
    if (!token) {
      return match;
    }
    const { title } = token;

    return `<${TokenBlot.tagName} class="${TokenBlot.className}" contenteditable="false" data-title="{{${slug}}}" data-slug="${slug}" data-id="${id}">{{${slug}}}</${TokenBlot.tagName}>`;
  });
};

interface Props {
  value: any;
  lengthLimit: number;
  onChange: (data: any) => void;
  handleReplacePreview: (data: string, type: string) => void;
  quillRef: any;
  tokensById: any;
  onEditorFocus: any;
  contentLength: number;
  setContentLength: (length: number) => void;
}

const EditorQuill = (props: Props) => {
  const { value, lengthLimit, onChange, handleReplacePreview, quillRef, tokensById, onEditorFocus, contentLength, setContentLength } = props;
  const [editor, setEditor] = useState(null);
  const [editorLength, setEditorLength] = useState<number>(contentLength);

  const onValueChange = (html: any, quill: any) => {
    const textLength = quill.getText().trim().length;
    const editorLength = quill.getLength();
    setContentLength(textLength);
    setEditorLength(editorLength);
    if (editorLength > lengthLimit) {
      quill.deleteText(lengthLimit, editorLength);
    }
    onChange(htmlToTokens(html));
    handleReplacePreview(htmlToTokens(html), 'editor');
  };

  // When the containing div is mounted, initialize the Quill instance.
  // Don't mount if an instance already exists!
  const onMount = (container: any) => {
    if (!editor && container) {
      // Set the innerHTML once so that Quill is initialized with the starting value.
      if (value) container.innerHTML = tokensToHtml(value, tokensById);
      const quill = new Quill(container, CONFIG) as any;
      quill.on('text-change', () => onValueChange(quill.root.innerHTML, quill));
      setEditor(quill);
      quillRef.current = quill;
    }
  };

  return (
    <div>
      <div onFocus={onEditorFocus} ref={onMount} style={{ height: 250 }} />
      {editorLength > lengthLimit && (
        <div
          style={{
            color: 'red',
            marginTop: '3px',
          }}
        >
          {t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${lengthLimit}`)}
        </div>
      )}
      {(contentLength === 0 || editorLength === 0) && (
        <div style={{ color: 'red', marginTop: '3px' }}>{t('MESSAGE.COMMON.IDM_BLANK_ITEM')}</div>
      )}
    </div>
  );
};

export default EditorQuill;
