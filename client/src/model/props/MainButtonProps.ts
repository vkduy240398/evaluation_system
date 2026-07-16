import { ButtonProps } from 'antd';

type MainButtonPropsType = ButtonProps & React.RefAttributes<HTMLElement>;

export interface MainButtonProps extends MainButtonPropsType {
    overrideClassName?: boolean;
}
