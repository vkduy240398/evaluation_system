import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import { Grid } from 'antd/lib';
import { FC, startTransition, useEffect, useMemo, useState } from 'react';

// ** Store & Actions Imports
import { NotificationPlacement } from 'antd/es/notification/interface';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  ProSkillPublicType,
  UserEvaluationToProSkillType,
} from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { evaluationOrder, statusEvaluationType } from '../../../../common/status';
import { userEvaluationCalculatorProSkill } from '../../../../store/userEvaluation';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import TableRowSelectedCustomComponent from '../../../../@core/components/table-custom/TableRowSelectedCustomComponent';
import proSkillColumnPublic from '../../evaluation/data/ColumnProSkillPublic';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { AppDispatch, RootState } from '../../../../store';
import proSkillColumn810 from '../data/ColumnProSkill810';
import { FormInstance } from 'antd';
interface Props {
  keyPassProSkill: React.Key[];
  isHiddenButtonUserCreateContent?: boolean;
  isHiddenButtonEvaluator: boolean;
  isDisplayUserEvaluator?: boolean;
  isEditUserEvaluation: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  // ** is user created
  isEvaluatorUser: boolean;

  // ** F6
  isF5?: boolean;

  statusEvaluation: statusEvaluationType;

  evaluationId: number | undefined;
  isEvaluationDate: boolean;

  openNotification: (placement: NotificationPlacement, mesage: string) => void;

  dataList: UserEvaluationToProSkillType[];
  setDataSource: React.Dispatch<React.SetStateAction<UserEvaluationToProSkillType[]>>;

  // point total
  pointUser: number | null;
  pointEvaluator05: number | null;
  pointEvaluator1: number | null;
  pointEvaluator2: number | null;

  //
  evaluatorOrder: string | undefined;

  isHiddenAddProSkillInCreateAndEvaluateGoal: boolean;

  form: FormInstance;
}
interface ProSkillType {
  handleSave: (data: any[]) => void;
  handleOpenModel: () => void;
  disableKeys?: React.Key[];
  setDisableKey?: (str: React.Key[]) => void;
}
const { useBreakpoint } = Grid;
let dataOlds: any[] = [];
type HandleTotalType = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';

const ProSkillComponent810: FC<Props> = ({
  keyPassProSkill,
  isHiddenButtonUserCreateContent,
  isHiddenButtonEvaluator,
  isDisplayUserEvaluator,
  isEditUserEvaluation,

  // ** evaluator 0.5
  isDisplayEvaluator05,
  isEditEvaluation05,

  // ** evaluator 1.0
  isDisplayEvaluator1,
  isEditEvaluation1,

  // ** evaluator 2.0
  isDisplayEvaluator2,
  isEditEvaluation2,

  isEvaluatorUser,
  isF5,

  statusEvaluation,
  openNotification,
  evaluationId,

  dataList,
  setDataSource,
  isEvaluationDate,
  pointUser,
  pointEvaluator05,
  pointEvaluator1,
  pointEvaluator2,
  evaluatorOrder,
  isHiddenAddProSkillInCreateAndEvaluateGoal,
  form,
}) => {
  // ** State

  const [totalPro, setTotalPro] = useState({
    itemNo: -1,
    difficulty: '',
    content: '',
    key: 'totalPoint',
    pointUser: pointUser,
    pointEvaluator05: pointEvaluator05,
    pointEvaluator1: pointEvaluator1,
    pointEvaluator2: pointEvaluator2,
    itemTitle: t('IDS_SUB_TOTAL'),
  });

  const [isOpen, setOpen] = useState<boolean>(false);
  const [disableKeys, setDisableKey] = useState<React.Key[]>(keyPassProSkill);

  // ** Hook
  const screens = useBreakpoint();
  const dispatch = useDispatch<AppDispatch>();
  const storeLoading = useSelector((state: RootState) => state.loading);

  const store = useSelector((state: RootState) => state.userEvaluation);
  const evaluationProSkills = store.evaluationProSkills.map((v) => ({ ...v }));
  const settingProFormulas = store.settingProFormulas;
  // ** Effect
  useMemo(() => {
    if (dataList) {
      dispatch(userEvaluationCalculatorProSkill(dataList.filter((f) => f.itemTitle !== t('IDS_SUB_TOTAL'))));
    }
  }, [dataList]);

  // ** Functional
  const handleOpenModel = () => {
    setOpen(!isOpen);
  };

  const handleSave = (data: ProSkillPublicType[]) => {
    if (data.length > 0) {
      const convertDataList: UserEvaluationToProSkillType[] = data.map((v, i) => ({
        key: `evaluation-pro-skill-${v.key}`,
        itemId: v.key,
        itemNo: i,
        itemTitle: `${v.mediumClass}_${v.smallClass}`,
        content: v.content,
        difficulty: v.difficulty,
        pointEvaluator05: null,
        pointEvaluator1: null,
        pointEvaluator2: null,
        pointUser: null,
        note: v.note,
        jobType: v.jobType,
        isDisable: false,
        isEvaluateDate: isEvaluationDate,
      }));
      setDataSource((dataState) => [...dataState, ...convertDataList]);
    }
  };

  const deleteRow = (key: string) => {
    const filters = dataList.filter((f) => f.key !== key);
    const fixKey = key.replace('evaluation-pro-skill-', '');
    const disableKeyFilters = disableKeys.filter((f) => f !== fixKey);
    setDataSource(filters);
    setDisableKey(disableKeyFilters);
  };

  //
  const disableItem = (
    index: number,
    isDisable: boolean,
    userRole: boolean,
    evaluator05: boolean,
    evaluator1: boolean,
    evaluator2: boolean,
  ) => {
    evaluationProSkills[index].isDisable = !isDisable;
    const handleProSkillListDisables = evaluationProSkills.map((v, i) => {
      if (index === i) {
        return {
          ...v,
          isDisable: !isDisable,
          pointUser: !isDisable ? null : v.pointUser,
          pointEvaluator05: !isDisable ? null : v.pointEvaluator05,
          pointEvaluator1: !isDisable ? null : v.pointEvaluator1,
          pointEvaluator2: !isDisable ? null : v.pointEvaluator2,
          totalPointUser: !isDisable ? undefined : v.totalPointUser,
          totalPointEvaluator05: !isDisable ? undefined : v.totalPointEvaluator05,
          totalPointEvaluator1: !isDisable ? undefined : v.totalPointEvaluator1,
          totalPointEvaluator2: !isDisable ? undefined : v.totalPointEvaluator2,
        };
      }

      return {
        ...v,
      };
    });
    const length = handleProSkillListDisables.filter((v) => v.isDisable === false).length;

    const handleCalculators = handleProSkillListDisables.map((val) => {
      if (!val.isDisable && val.itemNo !== -1) {
        const pointOfUser = handleTotalPoint(val.pointUser, val.difficulty, length);
        const pointOfEvaluator05 = handleTotalPoint(val.pointEvaluator05, val.difficulty, length);
        const pointOfEvaluator1 = handleTotalPoint(val.pointEvaluator1, val.difficulty, length);
        const pointOfEvaluator2 = handleTotalPoint(val.pointEvaluator2, val.difficulty, length);

        return {
          ...val,
          totalPointUser: pointOfUser,
          totalPointEvaluator05: pointOfEvaluator05,
          totalPointEvaluator1: pointOfEvaluator1,
          totalPointEvaluator2: pointOfEvaluator2,
        };
      }

      return val;
    });
    setDataSource(handleCalculators);
    dispatch(userEvaluationCalculatorProSkill(handleCalculators));
  };

  useEffect(() => {
    const updatedValues: any = {};
    if (store.evaluationProSkills.length > 0) {
      store.evaluationProSkills.forEach((record) => {
        // Gán vào object với key tương ứng với name của Form.Item
        updatedValues[`evaluationUser-pro-skill-key${record.key}`] = record.pointUser;
        updatedValues[`evaluation05-pro-skill-key${record.key}`] = record.pointEvaluator05;
        updatedValues[`evaluation10-pro-skill-key${record.key}`] = record.pointEvaluator1;
        updatedValues[`evaluation20-pro-skill-key${record.key}`] = record.pointEvaluator2;
      });
    }

    form.setFieldsValue(updatedValues);
    setTotalPro((states) => {
      return {
        ...states,
        pointUser: handleTotalRow('pointUser'),
        pointEvaluator05: handleTotalRow('pointEvaluator05'),
        pointEvaluator1: handleTotalRow('pointEvaluator1'),
        pointEvaluator2: handleTotalRow('pointEvaluator2'),
      };
    });
  }, [store.evaluationProSkills]);

  const handleTotal = (record: UserEvaluationToProSkillType, index: number, key: HandleTotalType) => {
    return Math.floor(
      Number(evaluationProSkills[index]?.[key] || 0) *
        Number(record.difficulty) *
        handleSearchForluma(record.difficulty, evaluationProSkills.filter((v) => v.isDisable === false).length),
    );
  };

  const handleTotalRow = (key: HandleTotalType) => {
    if (evaluationProSkills.filter((e) => e?.[key] !== null && e?.[key] !== undefined).length <= 0) {
      return null;
    } else {
      return Math.floor(
        evaluationProSkills.reduce((pre: number, cur: UserEvaluationToProSkillType, index) => {
          return pre + (cur.isDisable === false ? handleTotal(cur, index, key) || 0 : 0);
        }, 0),
      );
    }
  };
  const handleTotalPoint = (value: any, difficulty: number, totalProSkill: number) => {
    const handleTotalPointRow = Math.floor(
      Number(value) * Number(difficulty) * handleSearchForluma(difficulty, totalProSkill),
    );

    return handleTotalPointRow;
  };
  const handleSearchForluma = (difficulty: number, maxLength: number) =>
    (settingProFormulas &&
      settingProFormulas.find((f) => f.settingProFormula?.point === difficulty && f.totalItem <= maxLength)
        ?.coefficient) ||
    1;
  const columns = proSkillColumn810({
    deleteRow,
    isHiddenButtonUserCreateContent,
    isHiddenButtonEvaluator,
    isDisplayUserEvaluator,
    isEditUserEvaluation,
    isDisplayEvaluator05,
    isEditEvaluation05,
    isDisplayEvaluator1,
    isEditEvaluation1,
    isDisplayEvaluator2,
    isEditEvaluation2,
    openNotification,
    disableItem,
    evaluatorOrder: Number(evaluatorOrder),
    isLoading: storeLoading.isLoading,
  });

  const renderProSkill: FC<ProSkillType> = ({ handleSave, handleOpenModel, disableKeys, setDisableKey }) => {
    // ** State
    const [proSkills, setProSkill] = useState<ProSkillPublicType[]>([]);
    const [selectedRows, setSelectedRow] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const isDisable = !(selectedRows.length > 0);

    const [jobTypes, setJobType] = useState<{ value: string; label: string }[]>([]);

    const [mediumClasses, setMediumClass] = useState<{ value: string; label: string }[]>([]);

    const [smallClasses, setSmallClass] = useState<{ value: string; label: string }[]>([]);

    const [objSearch, setObjSearch] = useState<{
      jobType: string;
      mediumClass: string;
      smallClass: string;
    }>({
      jobType: '',
      mediumClass: '',
      smallClass: '',
    });

    // ** Effect
    useEffect(() => {
      const handleCallBack = (data: any) => {
        setProSkill(data);
        dataOlds = data.map((v: any) => ({ ...v }));

        setJobType(([...new Set(data.map((v: any) => v.jobType))] as string[]).map((v) => ({ value: v, label: v })));
        setMediumClass(
          ([...new Set(data.map((v: any) => v.mediumClass))] as string[]).map((v) => ({ value: v, label: v })),
        );
        setSmallClass(
          ([...new Set(data.map((v: any) => v.smallClass))] as string[]).map((v) => ({ value: v, label: v })),
        );

        setLoading(false);
      };

      if ([0, 1, 2, 50, 51, 52].includes(statusEvaluation))
        userEvaluationApiService.getListProSkillPublic({
          callback: handleCallBack,
          isEvaluatorUser,
          isF5: isF5,
          evaluationId: evaluationId,
        });
    }, []);

    useEffect(() => {
      return () => {
        setSelectedRow([]);
        setProSkill(dataOlds.map((v) => ({ ...v })));
        setObjSearch({ jobType: '', mediumClass: '', smallClass: '' });
      };
    }, [isOpen]);

    // ** Functional
    const handleAdd = () => {
      handleSave(selectedRows);
      disableKeys && setDisableKey && setDisableKey([...selectedRows.map((v) => v.key), ...disableKeys]);
      handleOpenModel();
      setSelectedRow([]);
    };

    const onHandleSearch = (value: string, name: string) => {
      startTransition(() => {
        const { jobType, mediumClass, smallClass } = { ...objSearch, [name]: value } as any;
        const ds = dataOlds.filter(
          (f: { [x: string]: any }) =>
            (jobType && jobType.length > 0 ? f.jobType === jobType : true) &&
            (mediumClass && mediumClass.length > 0 ? f.mediumClass === mediumClass : true) &&
            (smallClass && smallClass.length > 0 ? f.smallClass === smallClass : true),
        );

        setProSkill(ds);
        setObjSearch((dataState) => ({ ...dataState, [name]: value }));
      });
    };

    return (
      <>
        {/* Table */}
        <div style={{ marginBottom: 15 }}>
          <TableRowSelectedCustomComponent
            dataSources={proSkills}
            columns={proSkillColumnPublic({ onHandleSearch, jobTypes, mediumClasses, smallClasses })}
            setSelectedRow={setSelectedRow}
            size="small"
            style={{ marginBottom: 10 }}
            disableKeys={disableKeys}
            isLoading={isLoading || storeLoading.isLoading}
            pagination={{
              position: ['bottomLeft'],
              pageSize: 50,
              total: proSkills.length,
              showTotal: (total: any, range: any) =>
                `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`,
              size: 'default',
              showSizeChanger: false,
            }}
          />
        </div>

        {/* button */}
        <Space
          direction="horizontal"
          size={'middle'}
          hidden={isHiddenButtonUserCreateContent && !isHiddenAddProSkillInCreateAndEvaluateGoal}
        >
          <Button type="primary" onClick={handleAdd} disabled={isDisable}>
            {t('IDS_BUTTON_ADD')}
          </Button>

          <Button type="default" className="cancel_button" onClick={handleOpenModel}>
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </Space>
      </>
    );
  };

  return (
    <>
      {/* Header Tab */}
      <Typography.Title level={4}>{t('IDS_PRO_SKILL')}</Typography.Title>

      {/* button modal */}
      <Button
        type="primary"
        size="middle"
        style={{ marginBottom: 10 }}
        onClick={handleOpenModel}
        hidden={isHiddenButtonUserCreateContent || isHiddenButtonEvaluator}
        loading={storeLoading.isDetailLoading}
      >
        {t('IDS_BUTTON_CHOOSE')}
      </Button>

      {/* Table */}
      <TableCustomComponent
        dataSources={
          (statusEvaluation >= 50 && isEvaluationDate) || statusEvaluation >= 51 ? [...dataList, totalPro] : dataList
        }
        columns={columns}
        size="small"
        isLoading={storeLoading.isLoading || storeLoading.isDetailLoading}
        isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}

        // isScroll={screens.sm || screens.xs}
      />

      {/* Modal */}
      <ModalCustomComponent
        isOpen={isOpen}
        header={t('IDS_PRO_SKILL')}
        isDestroyOnCloseType={true}
        content={renderProSkill({ handleSave, handleOpenModel, disableKeys, setDisableKey })}
        fnHandleOk={handleOpenModel}
        fnHandleCancel={handleOpenModel}
        footer={null}
        width="calc(100vw - 100px)"
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        loading={storeLoading.isLoading}
      />
    </>
  );
};

export default ProSkillComponent810;
