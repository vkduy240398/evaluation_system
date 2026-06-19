import TokenBlot from './TokenBlot';
import { TOKEN_MODULE_NAME } from './TokenDrop';

const CONFIG = {
  formats: [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'color',
    'align',
    'background',
    'script',
    'bullet',
    'link',
    TokenBlot.blotName,
  ],
  modules: {
    magicUrl: true,
    toolbar: [
      [{ size: ['0.75em', false, '1.5em', '2.5em'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['clean'],
    ],
    [TOKEN_MODULE_NAME]: true,
  },
  theme: 'snow',
};

export default CONFIG;
