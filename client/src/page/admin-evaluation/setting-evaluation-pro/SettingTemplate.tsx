// Library imports
import { Typography, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Grid } from 'antd/lib';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// File imports
import ModalCustomComponent from '../../../@core/components/modal-custom';
import PaginationCustom from '../../../@core/components/pagination-custom';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import adminEvaluationApiService from '../../../common/api/adminEvaluationPro';
import AddSkillButton from '../../../views/admin-evaluation/setting-evaluation-pro/AddSkillButton';
import SearchFieldSkill from '../../../views/admin-evaluation/setting-evaluation-pro/SearchFieldSkill';
import adminEvaluationSkillsColumn from '../../../views/admin-evaluation/setting-evaluation-pro/columns/adminEvaluationPro';
const { useBreakpoint } = Grid;

export type SkillOptions = {
  label: string;
  value: any;
};

const SettingTemplate = () => {
  // ** State
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [skillOptions, setSkillOptions] = useState<SkillOptions[]>([{ label: t('IDS_ALL'), value: -1 }]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [shouldTableShow, setShouldTableShow] = useState<boolean>(false);
  const [skillList, setSkillList] = useState<any[]>([]);

  const [condition, setCondition] = useState<{ skillId: number | undefined } | undefined>();

  const [total, setTotal] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [skillBeingDeleted, setSkillBeingDeleted] = useState<null | number>(null);

  // ** Hook
  const [form] = useForm();
  const location = useLocation();
  const navigation = useNavigate();

  const pageState = location.state;

  // ** Effect
  useEffect(() => {
    setLoading(true);

    const initScreen = () => {
      if (pageState) {
        form.setFieldValue('skillId', pageState.skillId);
        handleSearch({ ...pageState });
      }
    };

    const callback = (props: { dataList: any[]; count: number }) => {
      const { dataList } = props;
      if (dataList.length > 0) {
        const options: { label: string; value: any }[] = dataList.map((v) => ({
          label: `${v.skillName}`,
          value: v.skillId,
        }));
        setSkillOptions([{ label: t('IDS_ALL'), value: -1 }, ...options]);
        setAllSkills(dataList);
      }
      setLoading(false);
    };

    adminEvaluationApiService.getAdminEvalutionSkills({
      skillId: -1,
      limit: undefined,
      offset: 0,
      callback,
      errorCallback,
      detailed: false,
    });

    initScreen();
  }, []);

  // ** Functional
  const errorCallback = () => setLoading(false);

  const handleSearchCallback = (props: { dataList: any[]; count: number }) => {
    const { dataList, count } = props;

    setSkillList(dataList);
    setTotal(count);
  };

  const handleSearch = async (args: { limit?: number; offset?: number; skillId?: number; currentPage?: number }) => {
    const { limit, offset, skillId } = args;
    const currentPageReturn = args.currentPage || 1;

    if (skillId) {
      setLoading(true);
      await adminEvaluationApiService
        .getAdminEvalutionSkills({
          skillId,
          limit,
          offset,
          callback: handleSearchCallback,
          errorCallback,
          detailed: true,
        })
        .then(() => {
          setCurrentPage(currentPageReturn || 1);
          setLoading(false);

          setCondition({ skillId });
          setShouldTableShow(true);

          navigation(location.pathname, {
            replace: true,
            state: { skillId, currentPage: currentPageReturn, limit, offset },
          });
        });
    }
  };

  const handleDeleteCallback = ({ code, reason }: { code: number; reason: null | any }) => {
    setLoading(false);

    if (code === 400) {
      message.error(t('MESSAGE.COMMON.IDM_DELETED_SKILL_FAILED'));
    } else {
      message.success(t('MESSAGE.COMMON.IDM_DELETE_SKILL_SUCCESS'));
      setSkillOptions((prev) => prev.filter((x) => x.value !== skillBeingDeleted));

      // * Fix if deleted item is the last item of page
      let page = location.state.currentPage;
      const mod = total % 20;
      if (mod === 1 && page > 1) {
        page = page - 1;
      }

      // * Search with correct parameters after delete
      const skillId = skillBeingDeleted === location.state.skillId ? -1 : location.state.skillId;
      handleSearch({ ...location.state, offset: (page - 1) * 20, currentPage: page, skillId: skillId });
      form.setFieldValue('skillId', -1);
    }

    setSkillBeingDeleted(null);
  };

  const handleDeleteSkill = (skillId: number) => {
    setSkillBeingDeleted(skillId);
  };

  const handleConfirmDelete = () => {
    setLoading(true);

    adminEvaluationApiService.deleteAdminEvalutionSkill({
      skillId: skillBeingDeleted!,
      callback: handleDeleteCallback,
      errorCallback,
    });
  };

  const handleCancelDelete = () => {
    setSkillBeingDeleted(null);
  };

  const screens = useBreakpoint();

  const columns = adminEvaluationSkillsColumn({
    onEditCallback: () => handleSearch({ ...location.state }),
    handleDeleteSkill,
    skillList: allSkills,
    setSkillOptions,
  });

  return (
    <div>
      {/* Title */}
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[5]}</Typography.Title>
      <AddSkillButton
        onAddCallback={() => handleSearch({ ...location.state })}
        isLoading={isLoading}
        skillList={allSkills}
      />

      {/* Search field */}
      <SearchFieldSkill skills={skillOptions} form={form} isLoading={isLoading} handleSearch={handleSearch} />

      {shouldTableShow ? (
        <>
          {/* Table */}
          <TableCustomComponent
            dataSources={skillList}
            columns={columns}
            isLoading={isLoading}
            isScroll={screens.sm || screens.xs}
            size="small"
            style={{ wordBreak: 'break-word', verticalAlign: 'top' }}
          />

          {/* Pagination */}
          {skillList.length > 0 && (
            <PaginationCustom
              fnOnchange={handleSearch}
              total={total}
              condition={condition}
              fnGetCurrentPage={setCurrentPage}
              currentPage={currentPage}
              isLoading={isLoading}
            />
          )}
        </>
      ) : null}

      <ModalCustomComponent
        isOpen={skillBeingDeleted !== null}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_SKILL')}
        fnHandleOk={handleConfirmDelete}
        fnHandleCancel={handleCancelDelete}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};

export default SettingTemplate;
