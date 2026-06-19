import { StringMap } from 'quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value?: string;
  onChange?: (content: string) => void;
}
const EmailEditor = (props: Props) => {
  // ** Props
  const { value, onChange } = props;

  // ** Var
  const modules: StringMap = {
    toolbar: [
      [{ size: ['0.75em', '1em', '1.5em', '2.5em'] }],
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['clean'],
      ['bold', 'italic', 'underline', 'strike'],
      ['link'],
      [{ align: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  //   ** Functional

  const reactQuillProps = { modules, formats };

  return <ReactQuill {...reactQuillProps} theme="snow" value={value} onChange={onChange} />;
};

export default EmailEditor;
