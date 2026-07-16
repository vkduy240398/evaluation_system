const lengthLimit = 2000;

const buttons = [
  'bold',
  'strikethrough',
  'underline',
  'italic',
  '|',
  'superscript',
  'subscript',
  '|',
  'align',
  'lineHeight',
  '|',

  // 'ul',
  // 'ol',
  'outdent',
  'indent',
  '|',
  'font',
  'fontsize',
  'brush',
  '|',
  'image',
  'link',
  'table',
  '|',
  'hr',
  'eraser',
  'copyformat',
];
const editorConfig = {
  askBeforePasteHTML: false,
  limitChars: 2001,
  askBeforePasteFromExcel: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_only_text',
  defaultActionOnPasteFromWord: 'insert_only_text',
  language: 'ja_jp',
  buttons: buttons,
  height: 200,
  minHeight: 200,
  maxHeight: 500,
  statusbar: false,
  enter: 'br',
  showPlaceholder: false
} as any;

export const createEditorSetting = (lengthLimit = 2000) => {
  const editorConfig =
    lengthLimit === -1
      ? {
          askBeforePasteHTML: false,
          askBeforePasteFromExcel: false,
          askBeforePasteFromWord: false,
          defaultActionOnPaste: 'insert_as_html',
          defaultActionOnPasteFromWord: 'insert_as_html',
          language: 'ja_jp',
          buttons: buttons,
          height: 200,
          minHeight: 200,
          maxHeight: 500,
          statusbar: false,
          enter: 'br',
        }
      : {
          askBeforePasteHTML: false,
          limitChars: lengthLimit + 1,
          askBeforePasteFromExcel: false,
          askBeforePasteFromWord: false,
          defaultActionOnPaste: 'insert_as_html',
          defaultActionOnPasteFromWord: 'insert_as_html',
          language: 'ja_jp',
          buttons: buttons,
          height: 200,
          minHeight: 200,
          maxHeight: 500,
          statusbar: false,
          enter: 'br',
        };

  return { lengthLimit, editorConfig };
};

const settings = { lengthLimit, editorConfig };
export default settings;
