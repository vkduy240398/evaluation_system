import TokenBlot from "./TokenBlot";

const insertToken = (quill, tokenData, type) => {
  quill = type === 'drop' ? quill : quill.getEditor();
  let index = (quill.getSelection() || {}).index;
  index = typeof index === "number" ? index : quill.getLength();
  quill.insertEmbed(index, TokenBlot.blotName, tokenData);
  quill.insertText(index + 1, " ");
  quill.setSelection(index + 2);
};

export default insertToken;
