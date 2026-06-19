import ListDepartmentScreen from './ListDepartmentScreen';

interface Props {
  type: number;
}
const NavigateDivision: React.FC<Props> = (props: Props) => {
  const { type } = props;

  return <ListDepartmentScreen type={type} />;
};
export default NavigateDivision;
