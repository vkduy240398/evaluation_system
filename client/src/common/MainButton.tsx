import { Button } from 'antd';
import { MainButtonProps } from '../model/props/MainButtonProps';
import './css/MainButton.css';

// export const MainButton = (props: any) => {
//     return (
//         <Button {...props} className="button-normal">
//             {props.value}
//         </Button>
//     );
// };

export const MainButton = (props?: MainButtonProps) => {
  if (props?.overrideClassName) {
    return <Button {...props} />;
  }

  return <Button {...props} className="main_button" />;
};

export const CancelButton = (props?: MainButtonProps) => {
  if (props?.overrideClassName) {
    return <Button {...props} />;
  }

  return <Button {...props} className="cancel_button" />;
};
