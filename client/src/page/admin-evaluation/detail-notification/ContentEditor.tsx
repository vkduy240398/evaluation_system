/* eslint-disable lines-around-comment */
import { useEffect, useState } from 'react';
import { Card } from 'antd';
import TextEditor from '../../../@core/components/text-editor/TextEditor';
import { DetailNotificationModel } from '../../../model/version-notification/DetailNotificationModel';

interface Props {
  dataSource: DetailNotificationModel;
  setDataSource: any;
  isReadonly: boolean;
  form: any;
  contentLength: number;
  setContentLength: any;
}

/**
 * Setting notification in detail screen
 *
 * @author tran.le.ha.nam
 */
const ContentEditor = (props: Props) => {
  // const [contentLength, setContentLength] = useState<number>(-1);
  const [contentEditor] = useState<string>(props.dataSource.content || '');

  const setContent = (value: any) => {
    props.setDataSource({ ...props.dataSource, content: value });
  };

  useEffect(() => {
    props.setDataSource({ ...props.dataSource, content: contentEditor });
  }, [contentEditor]);

  return (
    <>
      <div>
        <Card style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
          <TextEditor
            contentLength={props.contentLength}
            setContentLength={props.setContentLength}
            content={contentEditor}
            setContent={setContent}
            isReadonly={props.isReadonly}
          />
        </Card>
      </div>
    </>
  );
};

export default ContentEditor;
