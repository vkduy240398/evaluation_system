import React from 'react';
import { Button } from 'antd';

import insertToken from './insertToken';
import TokenBlot from './TokenBlot';

const Token = ({ title, slug, id, quillRef }) => {
  // const [isMenuVisible, setIsMenuVisible] = useState(false);
  const tokenData = { title, slug, id };
  const onDragStart = (event) => {
    const text = `{${slug}}`;
    const json = JSON.stringify({ title, slug, id });
    event.dataTransfer.setData('text/plain', text);
    event.dataTransfer.setData('application/vnd.placeholder.token', json);
  };

  // const onClickToken = () => {
  //   setIsMenuVisible(!isMenuVisible);
  // };

  const onClickInput = (quillRef) => () => {
    const quill = quillRef && quillRef.current;
    const type = 'nor';
    if (quill) {
      insertToken(quill, tokenData, type);
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
      <Button
        className={TokenBlot.className}
        draggable="true"
        onDragStart={onDragStart}
        onClick={onClickInput(quillRef)}
      >
        {title}
      </Button>
    </div>
  );
};

export default Token;
