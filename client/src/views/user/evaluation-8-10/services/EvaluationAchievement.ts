import { message } from "antd";
import { EvaluationAdditionalAchievementNew } from "../interfaces/response.interface";
import { t } from "i18next";
import { evaluationListAchievementAdditionals } from "../../../../store/total";
import { FormInstance } from 'antd/lib';

type Action = 
  | { type: 'ADD'; payload: EvaluationAdditionalAchievementNew, oldData: EvaluationAdditionalAchievementNew[] }
  | { type: 'DELETE'; index: number; payload: EvaluationAdditionalAchievementNew[]}
  | {type: 'INITIAL_VALUE'; payload: EvaluationAdditionalAchievementNew[]};
interface Props {
    startTransition: any;
    dispatchAddPersonal: React.Dispatch<Action>; // set state
    form: FormInstance; // get data all fields of form
    dispatch: any // dispatch of redux
    dataSources: EvaluationAdditionalAchievementNew[];
    store: any;
    evaluationId: number;
}

export const handleDataForm = (props:Props) => {
    const{form,dispatchAddPersonal,startTransition, dataSources, store, dispatch, evaluationId} = props;
    
    const filterPersonalForms = (form.getFieldsValue(['achivement_personal']) && form.getFieldsValue(['achivement_personal']).achivement_personal !== undefined) && form.getFieldsValue(['achivement_personal']).achivement_personal.filter((v : any) => v !== undefined);
    const dataList = [...dataSources];
    
    const dataListNews = dataList.map((v, i) => {
        
    return {
        ...v,
        titleAdditional: filterPersonalForms[i].titleAdditional !== undefined ? filterPersonalForms[i].titleAdditional : v.titleAdditional,
        achievementStatus: filterPersonalForms[i].achievement_status !== undefined ? filterPersonalForms[i].achievement_status : v.achievementStatus,
        reasonComment: filterPersonalForms[i].reasonComment !== undefined ? filterPersonalForms[i].reasonComment : v.reasonComment,
        pointUser: filterPersonalForms[i].pointUser !== undefined ? filterPersonalForms[i].pointUser : v.pointUser,
        pointEvaluator05: filterPersonalForms[i].pointEvaluator05 !== undefined ? filterPersonalForms[i].pointEvaluator05 : v.pointEvaluator05,
        pointEvaluator1: filterPersonalForms[i].pointEvaluator1 !== undefined ? filterPersonalForms[i].pointEvaluator1 : v.pointEvaluator1,
        pointEvaluator2: filterPersonalForms[i].pointEvaluator2 !== undefined ? filterPersonalForms[i].pointEvaluator2 : v.pointEvaluator2,
        
    };
    }) as EvaluationAdditionalAchievementNew[];
    if (dataList.length < 50) {
        const newsData = {
            achievementStatus: '',
            evaluationId: evaluationId,
            itemNo: dataListNews.length + 1,
            pointEvaluator1: undefined,
            pointEvaluator2: undefined,
            pointEvaluator05: undefined,
            pointUser: undefined,
            reasonComment: '',
            titleAdditional: '',
            key: dataListNews.length + 1,
            evaluationOrder: Number(store.maxOrder),
            type: 2,
          };
          
          dataListNews.push(newsData);
        
        startTransition(() => {
            dispatchAddPersonal({type: 'ADD', payload: newsData, oldData: filterPersonalForms});
            dispatch(evaluationListAchievementAdditionals(dataListNews));
        });
    }
    else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', `${50}`)); 
};

export const changeValuePoint = ({
    setAchievementAdditionalGoals, //set state
    form, // get data all fields of form

}: {
    setAchievementAdditionalGoals: React.Dispatch<Action>;
    form: any;
}) => {
    const filterPersonalForms = (form.getFieldsValue(['achivement_personal']) && form.getFieldsValue(['achivement_personal']).achivement_personal !== undefined) && form.getFieldsValue(['achivement_personal']).achivement_personal.filter((v : any) => v !== undefined);
    
    setAchievementAdditionalGoals({
        type: 'INITIAL_VALUE',
        payload: filterPersonalForms
    });
};  