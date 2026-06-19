import BasicComponent from './basic';
import BehaviorComponent from './behavior';
import ProSkillComponent from './proskill';

interface Props {
  type: string;
}
const EvaluationReference = (props: Props) => {
  const { type } = props;

  return (
    <>
      {type === 'basic' && <BasicComponent />}
      {type === 'behavior' && <BehaviorComponent />}
      {type === 'pro' && <ProSkillComponent />}
    </>
  );
};

export default EvaluationReference;
