/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Form, Typography } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import TextEditor from '../../../../../@core/components/text-editor/TextEditor';

interface Props {
  contents: string;
  notes: string;
  dataSources: any;
  setContents: any;
  setNotes: any;
  setIsChangeContent: any;
  setIsChangeNote: any;
  setContentLength: any;
  contentLength: number;
  setNoteLength: any;
  noteLength: number;
}

const ComponentNoteContentEvaluationCriteria = (props: Props) => {
  const {
    dataSources,
    contents,
    notes,
    setContents,
    setNotes,
    setIsChangeContent,
    setIsChangeNote,
    setContentLength,
    contentLength,
    setNoteLength,
    noteLength,
  } = props;
  const [content, setContent] = useState<string>(dataSources?.data.contentEvaluationCriteria);
  const [note, setNote] = useState<string>(dataSources?.data.contentNotes);

  const handleChangeEvaluationCriteria = (content: string) => {
    setIsChangeContent(true);
    setContents(content);
  };

  const handleChangeNote = (content: string) => {
    setIsChangeNote(true);
    setNotes(content);
  };

  useEffect(() => {
    setContents(dataSources?.data.contentEvaluationCriteria);
    const plainContent = dataSources?.data.contentEvaluationCriteria
      ?.replace(/<(.|\n)*?>/g, '')
      .replaceAll('　', '')
      .trim();
    setContentLength(plainContent.length);

    setNotes(dataSources?.data.contentNotes);
    const plainNote = dataSources?.data.contentNotes
      .replace(/<(.|\n)*?>/g, '')
      .replaceAll('　', '')
      .trim();
    setNoteLength(plainNote.length || -1);
  }, []);

  return (
    <>
      <Card style={{ marginTop: 15 }}>
        <div className="editor-custom-css-background-color-click">
          <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
          <Form.Item style={{ marginBottom: 0 }}>
            <TextEditor
              content={content}
              setContentLength={setContentLength}
              contentLength={contentLength}
              setContent={handleChangeEvaluationCriteria}
              isScrSettingGuide={true}
            />
          </Form.Item>
        </div>
      </Card>
      <Card style={{ marginTop: 15 }}>
        <div className="editor-custom-css-background-color-click">
          <Typography.Title level={4}>{t('IDS_NOTES')}</Typography.Title>
          <Form.Item style={{ marginBottom: 0 }}>
            <TextEditor
              content={note}
              setContentLength={setNoteLength}
              contentLength={noteLength}
              setContent={handleChangeNote}
              isScrSettingGuide={true}
            />
          </Form.Item>
        </div>
      </Card>
    </>
  );
};

export default ComponentNoteContentEvaluationCriteria;
