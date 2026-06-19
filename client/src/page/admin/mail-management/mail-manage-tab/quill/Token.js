import { Button, Tooltip } from 'antd';

import insertToken from './insertToken';

const Token = ({ title, slug, id, quillRef, titleRef, isEditorFocus, isTitleFocus, handleInsertText, note, mailContent }) => {
  // const [isMenuVisible, setIsMenuVisible] = useState(false);
  const tokenData = { title, slug, id };

  // const onClickToken = () => {
  //   setIsMenuVisible(!isMenuVisible);
  // };

  const onClickInput = (quillRef) => () => {
    const quill = quillRef && quillRef.current;
    const type = 'nor';

    if (quill && isEditorFocus && !isTitleFocus) {
      insertToken(quill, tokenData, type);
    } else if (titleRef && isTitleFocus && !isEditorFocus) {
      handleInsertText(tokenData);
    }
  };

  // const onMount = (node) => {
  //   node &&
  //     node.addEventListener('focusout', (event) => {
  //       if (!node.contains(event.relatedTarget)) {
  //         setIsMenuVisible(false);
  //       }
  //     });
  // };

  return (
    <div>
      <Tooltip title={note}>
        <Button

          // className={TokenBlot.className}
          type="primary"

          // disabled={tokenData.id === 36 && mailContent.includes('{{sendUserCCEvaluator}}')}

          // draggable="true"
          // onDragStart={onDragStart}
          onClick={onClickInput(quillRef)}
        >
          {title}
        </Button>
      </Tooltip>
    </div>
  );
};

export default Token;
