import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import { Grid } from 'antd/lib';
import { FC, startTransition, useEffect, useMemo, useState } from 'react';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import TableRowSelectedCustomComponent from '../../../@core/components/table-custom/TableRowSelectedCustomComponent';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import {
  ProSkillPublicType,
  UserEvaluationToProSkillType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';
import proSkillColumn from './data/ColumnProSkill';
import proSkillColumnPublic from './data/ColumnProSkillPublic';

// ** Store & Actions Imports
import { NotificationPlacement } from 'antd/es/notification/interface';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { statusEvaluationType } from '../../../common/status';
import { AppDispatch, RootState } from '../../../store';
import { userEvaluationCalculatorProSkill } from '../../../store/userEvaluation';
interface Props {
  dataSources: UserEvaluationToProSkillType[];
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
  typeReview?: number;
  isReview?: boolean;

  openNotification: (placement: NotificationPlacement, mesage: string) => void;

  evaluatorOrder: number;

  isEvaluationDate: boolean;
  isHiddenAddProSkillInCreateAndEvaluateGoal: boolean;
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

const ProSkillComponent: FC<Props> = ({
  dataSources,
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
  typeReview,
  isReview,

  evaluatorOrder,
  isHiddenAddProSkillInCreateAndEvaluateGoal,

  isEvaluationDate,
}) => {
  // ** State
  const [dataList, setDataSource] = useState<UserEvaluationToProSkillType[]>([]);
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
    setDataSource(dataSources);
  }, [storeLoading.isReloadComponent]);
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
        lastestInput: evaluatorOrder,
      }));
      setDataSource((dataState) => {
        const length = dataState.length;

        // 2. Xử lý trường hợp mảng rỗng hoặc chỉ có 1 phần tử
        if (length === 0) {
          return convertDataList; // Nếu rỗng, chỉ cần trả về mảng mới
        }

        // 3. Chèn mảng mới vào vị trí áp chót:
        //    - dataState.slice(0, length - 1): Các phần tử từ đầu đến (trước) phần tử cuối cùng.
        //    - ...convertDataList: Mảng mới được chèn vào.
        //    - dataState.slice(length - 1): Phần tử cuối cùng của mảng cũ.
        return [...dataState.slice(0, length - 1), ...convertDataList, ...dataState.slice(length - 1)];
      });
    }
  };

  const deleteRow = (key: string) => {
    const filters = dataList.filter((f) => f.key !== key);
    const fixKey = key.replace('evaluation-pro-skill-', '');
    const disableKeyFilters = disableKeys.filter((f) => f !== fixKey);
    setDataSource(filters);
    setDisableKey(disableKeyFilters);
  };
  const disableItem = (
    index: number,
    isDisable: boolean,
    userRole: boolean,
    evaluator05: boolean,
    evaluator1: boolean,
    evaluator2: boolean,
  ) => {
    evaluationProSkills[index].isDisable = !isDisable;

    const defaultValues = dataList
      .map((v, i) => {
        if (i === index) {
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

        return v;
      })
      .map((val) => {
        if (!val.isDisable && val.itemNo !== -1) {
          const pointOfUser = handleTotalPoint(val.pointUser, val.difficulty);
          const pointOfEvaluator05 = handleTotalPoint(val.pointEvaluator05, val.difficulty);
          const pointOfEvaluator1 = handleTotalPoint(val.pointEvaluator1, val.difficulty);
          const pointOfEvaluator2 = handleTotalPoint(val.pointEvaluator2, val.difficulty);

          return {
            ...val,
            totalPointUser: pointOfUser,
            totalPointEvaluator05: pointOfEvaluator05,
            totalPointEvaluator1: pointOfEvaluator1,
            totalPointEvaluator2: pointOfEvaluator2,
          };
        }
        if (val.itemNo === -1) {
          return {
            ...val,
            pointUser: handleTotalRow('pointUser'),
            pointEvaluator05: handleTotalRow('pointEvaluator05'),
            pointEvaluator1: handleTotalRow('pointEvaluator1'),
            pointEvaluator2: handleTotalRow('pointEvaluator2'),
          };
        }

        return {
          ...val,
          totalPointUser: val.pointUser ? val.totalPointUser : undefined,
          totalPointEvaluator05: val.pointEvaluator05 ? val.totalPointEvaluator05 : undefined,
          totalPointEvaluator1: val.pointEvaluator1 ? val.totalPointEvaluator1 : undefined,
          totalPointEvaluator2: val.pointEvaluator2 ? val.totalPointEvaluator2 : undefined,
        };
      });
    setDataSource(defaultValues);
    dispatch(userEvaluationCalculatorProSkill(defaultValues));
  };

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
  const handleTotalPoint = (value: any, difficulty: number) => {
    const handleTotalPointRow = Math.floor(
      Number(value) *
        Number(difficulty) *
        handleSearchForluma(difficulty, evaluationProSkills.filter((e) => e.isDisable === false).length),
    );

    return handleTotalPointRow;
  };

  const handleSearchForluma = (difficulty: number, maxLength: number) =>
    (settingProFormulas &&
      settingProFormulas.find((f) => f.settingProFormula?.point === difficulty && f.totalItem <= maxLength)
        ?.coefficient) ||
    1;

  const columns = proSkillColumn({
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
    setDataSource,
    dataList: dataSources,
    evaluatorOrder,
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
            // scrollY={390}
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
        <Space direction="horizontal" size={'middle'} hidden={!isHiddenAddProSkillInCreateAndEvaluateGoal}>
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
          !(typeReview && isReview && typeReview < 3) ? dataList : dataList.filter((v) => v.itemTitle !== '小計')
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

export default ProSkillComponent;
