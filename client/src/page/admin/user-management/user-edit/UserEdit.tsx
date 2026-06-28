import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Spin,
  Form,
  message,
  Modal,
  Steps,
  Table,
  Space,
  Tooltip,
  ConfigProvider,
} from 'antd';
import { useTranslation } from 'react-i18next';
import httpAxios from '../../../../common/http';
import { useNavigate, useParams } from 'react-router-dom';
import {
  changeRole1,
  changeRole2,
  changeRole3,
  changeRole4,
  compareArrayNumber,
  getDataList,
} from '../../user-detail/processes';
import EditForm from '../../../../views/admin/user-management/user-edit/EditForm';
import { CompanyProps, DepartmentProps, DivisionProps, LevelProps } from '../interfaces';
import { compareDatePeriod } from '../../../../common/util';
import PreviewIntegration from '../../../../views/admin/user-management/user-edit/PreviewIntegration';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
const { Title } = Typography;

// 1. Định nghĩa kiểu dữ liệu cho props của InfoField
// Component hiển thị nút gạt (Switch)
interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}
type StateType = {
  departmentId: number;
  department: { id: number; name: string; code: string };
  companyId: number;
  company: { id: number; name: string; code: string };
  divisionId: number;
  division: { id: number; name: string; code: string };
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  level: number;
  flagSkill: number;
  roles: RoleProps[];
  updatedTime: string | undefined;
};
interface DataChange {
  employeeNumber: number;
  fullName: string;
  userEvaluationChange: string;
  userInforChange: string;
}
// Component chính
const UserEdit: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState<StateType>(); // Khởi tạo undefin
  const [listDepartmentTypeDepartments, setListDepartmentTypeDepartment] = useState<DepartmentProps[]>([]);
  const [levelList, setListLevel] = useState<LevelProps[]>([]);
  const [listDepartmentTypeDivisions, setListDepartmentTypeDivision] = useState<DivisionProps[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [listCompanys, setListCompany] = useState<CompanyProps[]>([]);
  const [form] = Form.useForm();
  const [typeEvaluation, setTypeEvaluation] = useState(-1);
  const [textNotify, setTextNotify] = useState('');
  const [isVisableNotify, setIsVisibleNotify] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormChangedAll, setIsFormChangedAll] = useState(false);
  const levelValue = Form.useWatch('level', form);
  const department = Form.useWatch('department', form);
  const currentRadioValue = Form.useWatch('radioLevelvalue', form);
  const fullnameChange = Form.useWatch('fullName', form);
  const [dataChanges, setDataChanges] = useState<DataChange[]>([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const changeDivision = (e: number) => {
    // Data gốc => const [data, setData] = useState<StateType>(); // Khởi tạo undefined
    // Nếu chọn lại division cũ sẽ set value cho department cũ theo data gốc
    const departmentList = listDepartmentTypeDivisions.find((v) => v.divisionId === e);
    setListDepartmentTypeDepartment(departmentList?.childrens || []);

    // 2. Logic xử lý giá trị Department theo data gốc
    if (data && e === data.divisionId) {
      // Nếu chọn lại đúng division cũ => Set lại department cũ từ data gốc
      // Lưu ý: Thay 'departmentId' bằng đúng tên trường phòng ban trong object data của bạn (ví dụ: data.departmentId hoặc data.department)
      form.setFieldValue('department', data.departmentId);
    } else {
      // Nếu chọn division mới => Xóa trắng giá trị phòng ban cũ
      // Mẹo: Nên dùng `undefined` thay vì `''` để Antd Select hiện lại chữ Placeholder (ví dụ: "Chọn phòng ban")
      form.setFieldValue('department', undefined);
      form.setFieldValue('radioLevelvalue', -1);
    }
  };
  useEffect(() => {
    if (department) {
      form.setFieldValue('radioLevelvalue', -1);
    }
  }, [department]);

  useEffect(() => {
    const controller = new AbortController();

    const handleFetchData = async () => {
      if (!id) return;

      // 1. Chạy hàm lấy thông tin User trước
      setLoading(true);
      try {
        const res = await httpAxios.Get('/api/v1/f8/management-user/get-user-detail-by-id', {
          params: { id },
          // signal: controller.signal, // Bỏ comment để AbortController thực sự hoạt động
        });

        if (res && res.status === 200 && res.data) {
          setData(res.data); // Vẫn set state cho UI dùng

          // TUẦN TỰ: Gọi tiếp hàm này và truyền TRỰC TIẾP divisionId từ API trả về
          getDataList(
            setListDepartmentTypeDepartment,
            setListDepartmentTypeDivision,
            setListCompany,
            res.data?.divisionId, // Lấy trực tiếp từ đây, không sợ bị undefined
          );
        } else {
          navigate('');

          return; // Dừng lại nếu lỗi dữ liệu
        }
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          // Xử lý lỗi nếu cần
        }
      } finally {
        setLoading(false);
      }

      // 2. Chạy hàm lấy chu kỳ đánh giá (Hàm này chỉ cần 'id', có thể chạy sau hoặc song song)
      try {
        const resEvaluation = await httpAxios.Get('/api/v1/f8/management-user/get-evaluation-by-user', {
          params: { id },
          // signal: controller.signal, // Thêm signal để hủy nếu user chuyển trang
        });

        if (resEvaluation && resEvaluation.status === 200) {
          const evalData = resEvaluation?.data;
          if (evalData?.length > 0) {
            const firstEval = evalData[0];
            const isCompareDatePeriod = compareDatePeriod(
              firstEval.level <= 7
                ? firstEval.evaluationPeriod.dateCreationGoalStart
                : firstEval.evaluationPeriod.dateCreationGoalDepartmentStart,
              firstEval.level <= 7
                ? firstEval.evaluationPeriod.dateCreationGoalEnd
                : firstEval.evaluationPeriod.dateCreationGoalDepartmentEnd,
            );
            setTypeEvaluation(isCompareDatePeriod ? 0 : 1);
          } else {
            setTypeEvaluation(2);
          }
        }
      } catch (error) {
        // Handle error
      }
    };

    // Khởi chạy chuỗi API
    handleFetchData();

    // 3. Khởi tạo danh sách Level (Logic này chạy đồng bộ, viết gọn lại bằng Array.from)
    const temps: LevelProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      level: i + 1,
    }));
    setListLevel(temps);

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [id]); // NÊN thêm 'id' vào đây để nếu id thay đổi, nó sẽ fetch lại data mới
  // 2. Hàm logic dùng để kiểm tra Form hiện tại có khác dữ liệu gốc (data) không
  const checkFormChanges = () => {
    if (!data) return false;

    const companyValue = form.getFieldValue('company');
    const division = form.getFieldValue('division');
    const department = form.getFieldValue('department');
    const levelValue = form.getFieldValue('level');
    const fullName = form.getFieldValue('fullName');
    const flagSkillValue =
      form.getFieldValue('hasSkill') === undefined ? data?.flagSkill : form.getFieldValue('hasSkill');

    // So sánh dữ liệu cơ bản
    const isCompanyChanged = companyValue !== data?.companyId;
    const isDivisionChanged = division !== data?.divisionId;
    const isDepartmentChanged = department !== data?.departmentId;
    const isLevelChanged = levelValue !== data?.level;
    const isSkillChanged = flagSkillValue !== data?.flagSkill;
    const isFullNameChanged = fullName !== data?.fullName;

    // So sánh dữ liệu phân quyền (Roles)
    const rolesForm = form.getFieldValue('roles') || [];
    const checkedList = rolesForm.reduce((acc: any[], currentItem: { role?: boolean }, index: number) => {
      const roleKey = index + 1;
      if (currentItem && currentItem.role === true) {
        acc.push(roleKey);
      }

      return acc;
    }, []);
    const defaultRoleLists = (data?.roles || []).map((v) => v.id) as number[];
    const isRolesChanged = !compareArrayNumber(defaultRoleLists, checkedList);

    // Trả về true nếu CÓ ÍT NHẤT một trường thay đổi thông tin
    return (
      isCompanyChanged ||
      isDivisionChanged ||
      isDepartmentChanged ||
      isLevelChanged ||
      isSkillChanged ||
      isRolesChanged ||
      isFullNameChanged
    );
  };

  const checkFormChangesIntegration = () => {
    if (!data) return false;

    const companyValue = form.getFieldValue('company');
    const division = form.getFieldValue('division');
    const department = form.getFieldValue('department');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue =
      form.getFieldValue('hasSkill') === undefined ? data?.flagSkill : form.getFieldValue('hasSkill');

    // So sánh dữ liệu cơ bản
    const isCompanyChanged = companyValue !== data?.companyId;
    const isDivisionChanged = division !== data?.divisionId;
    const isDepartmentChanged = department !== data?.departmentId;
    const isLevelChanged = levelValue !== data?.level;
    const isSkillChanged = flagSkillValue !== data?.flagSkill;

    // So sánh dữ liệu phân quyền (Roles)

    // Trả về true nếu CÓ ÍT NHẤT một trường thay đổi thông tin
    return isCompanyChanged || isDivisionChanged || isDepartmentChanged || isLevelChanged || isSkillChanged;
  };
  const checkHas17Level = () => {
    let isSame = false;
    if (data && Number(data.level) < 8) {
      isSame = true;
    }

    return isSame;
  };
  const handleOpenPopupConfirm = () => {
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'flagSkill'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    form
      .validateFields(
        (checkHas17Level() && levelValue == '-1') || (levelValue < 8 && levelValue !== '-1')
          ? validateFieldsNames
          : validateFieldsName810s,
      )
      .then(() => {
        setIsConfirm(true);
      })
      .catch((err) => {});
  };
  const handleSubmit = async () => {
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'flagSkill'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    form
      .validateFields(
        (checkHas17Level() && levelValue == '-1') || (levelValue < 8 && levelValue !== '-1')
          ? validateFieldsNames
          : validateFieldsName810s,
      )
      .then(async () => {
        const userId = Number(id);
        const companyValue = form.getFieldValue('company');
        const levelValue = form.getFieldValue('level');
        const flagSkillValue =
          form.getFieldValue('hasSkill') === undefined ? data?.flagSkill : form.getFieldValue('hasSkill');

        const company = data?.companyId === companyValue ? undefined : listCompanys.find((f) => f.id === companyValue);

        const divisionValue = form.getFieldValue('division');
        const departmentValue = form.getFieldValue('department');
        //user 8~10 co the de trong department
        const listDepartmentTypeDepartments = listDepartmentTypeDivisions.find((v) => v.divisionId === divisionValue);
        const department =
          departmentValue && departmentValue
            ? data?.departmentId === departmentValue
              ? undefined
              : listDepartmentTypeDepartments?.childrens.find((val) => val.id === departmentValue)
            : null;

        const division =
          divisionValue && divisionValue
            ? data?.divisionId === divisionValue
              ? undefined
              : listDepartmentTypeDivisions.find((v) => v.divisionId === divisionValue)
            : undefined;

        const level = data?.level === levelValue ? undefined : levelValue;

        const roleName = {
          1: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
          2: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
          3: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
          4: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
          5: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
          6: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
          7: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
          8: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
          9: t('IDS_SYSTEM_ADMIN'),
        } as any;
        const rolesForm = form.getFieldValue('roles');
        const checkedList = rolesForm.reduce((acc: any[], currentItem: { role?: boolean }, index: number) => {
          const roleKey = index + 1; // Index 0 tương ứng với key 1

          if (currentItem && currentItem.role === true) {
            acc.push(roleKey);
          }

          return acc;
        }, []);

        const defaultRoleLists = data?.roles.map((v) => v.id) as number[];
        const roles = compareArrayNumber(defaultRoleLists, checkedList)
          ? undefined
          : checkedList.filter((item: any) => item !== 0);
        const isChangeRoleF2 = changeRole2(defaultRoleLists, checkedList);
        const isChangeRoleF3 = changeRole3(defaultRoleLists, checkedList);
        const isChangeRoleF4 = changeRole4(defaultRoleLists, checkedList);
        const typeChangeRoleF1 = changeRole1(defaultRoleLists, checkedList);

        const levelOld = data?.level;
        const oldFlagSkill = data?.flagSkill;

        setLoading(true);
        await httpAxios
          .Put('/api/v1/f8/management-user/edit-user', {
            userId,
            company,
            department,
            division,
            level,
            roles,
            isChangeRoleF2,
            isChangeRoleF3,
            isChangeRoleF4,
            typeChangeRoleF1,
            levelOld,
            updatedTime: data?.updatedTime,
            radioLevelvalue: currentRadioValue || 2,
            oldFlagSkill,
            flagSkillValue,
            fullName: form.getFieldValue('fullName'),
          })
          .then((res: any) => {
            if (res && res.status === 200) {
              const errorList = res.data;
              const error05 = errorList.role05 ? 'nguoi danh gia 0.5' : '';
              const error1 = errorList.role1 ? 'nguoi danh gia 1' : '';
              const error2 = errorList.role2 ? 'nguoi danh gia 2' : '';
              if (changeRole2(defaultRoleLists, checkedList) && (error05 || error1 || error2)) {
                let text = t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_1') + '\n';
                text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_2');
                text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
                text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4');
                text += '\n';
                text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_3');
                setTextNotify(text.replace(/\n/g, '<br />'));
                /**Set notify open */
              } else {
                message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
              }
              navigate(-1);
            }
            setLoading(false);
          });
      })
      .catch((err) => {});
  };
  const gotoSteps = () => {
    // Kiểm tra đã thay đổi thông tin nào để thể hiện radio box
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'flagSkill'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    form
      .validateFields(
        (checkHas17Level() && levelValue == '-1') || (levelValue < 8 && levelValue !== '-1')
          ? validateFieldsNames
          : validateFieldsName810s,
      )
      .then(() => {
        setCurrentStep((state) => state + 1);
        form.setFieldValue('radioLevelvalue', -1);
      })
      .catch((error) => {});
  };

  const handlePreview = async () => {
    const getDataChange = () => {
      let datas;
      const userId = id;

      const companyValue = form.getFieldValue('company');
      const levelValue = form.getFieldValue('level');
      const flagSkillValue =
        form.getFieldValue('hasSkill') === undefined ? data?.flagSkill : form.getFieldValue('hasSkill');

      const company = data?.companyId === companyValue ? undefined : listCompanys.find((f) => f.id === companyValue);
      const divisionValue = form.getFieldValue('division');
      const departmentValue = form.getFieldValue('department');
      //user 8~10 co the de trong department
      const listDepartmentTypeDepartments = listDepartmentTypeDivisions.find((v) => v.divisionId === data?.divisionId);
      const department =
        departmentValue && departmentValue
          ? data?.departmentId === departmentValue
            ? undefined
            : listDepartmentTypeDepartments?.childrens.find((val) => val.id === departmentValue)
          : undefined;
      const division =
        divisionValue && divisionValue
          ? data?.departmentId === divisionValue
            ? undefined
            : listDepartmentTypeDivisions.find((v) => v.divisionId === divisionValue)
          : undefined;
      const level = data?.level === levelValue ? undefined : levelValue;

      //
      const roleName = {
        1: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
        2: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
        3: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
        4: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
        5: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
        6: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
        7: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
        8: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
        9: t('IDS_SYSTEM_ADMIN'),
      } as any;
      const rolesForm = form.getFieldValue('roles');
      const roles = rolesForm
        .reduce((acc: any[], currentItem: { role?: boolean }, index: number) => {
          const roleKey = index + 1; // Index 0 tương ứng với key 1

          if (currentItem && currentItem.role === true) {
            acc.push({
              id: roleKey,
              name: roleName[roleKey],
            });
          }

          return acc;
        }, [])
        .map((v: any) => v.id);
      const oldRoles = data ? data?.roles.map((v) => v.id) : [];
      const addedRoles = roles.filter((r: number) => !oldRoles.includes(r));

      const levelOld = data?.level;
      const oldFlagSkill = data?.flagSkill;

      return (datas = {
        userId: userId,
        company: company,
        department: department,
        division: division,
        level: level,
        roles: addedRoles && addedRoles.length <= 0 ? undefined : addedRoles,
        flagSkillValue: flagSkillValue,
        radioLevelvalue: currentRadioValue || 2,
        oldFlagSkill: oldFlagSkill,
        levelOld: levelOld,
      });
    };
    setCurrentStep((state) => state + 1);
    getDataChange();
    setLoading(true);
    await httpAxios
      .Put('/api/v1/f8/management-user/confirm-edit-one-user', {
        dataChange: getDataChange(),
      })
      .then((res) => {
        setLoading(false);
        setDataChanges(res?.data || []);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  // Truyền Generic Type <ImpactRecord> vào ColumnsType để TS gợi ý code ở param `record`
  const columns: ColumnsType<DataChange> = [
    {
      title: t('IDS_FULLNAME'),
      width: '20%',
      render: (_: any, user: DataChange) => (
        <div>
          <div>{user.fullName}</div>
          {/* <div style={{ fontSize: '10px', color: '#9ca3af' }}>{user.dept}</div> */}
        </div>
      ),
    },
    {
      title: (
        <>
          {t('IDS_USER_INFOR_CHANGE')}
          <Tooltip title={t('IDS_TOOLTIP_USER_INFOR_CHANGE')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'userInforChange',
      key: 'userInforChange',
      width: '30%',
      render: (text: any) => {
        return (
          <div>
            {text
              .replaceAll('companyLabel', t('IDS_COMPANY'))
              .replaceAll('textNoChange', t('IDS_NO_UPDATE'))
              .replaceAll('textUnSetting', t('IDS_HAVE_NOT_SET'))
              .replaceAll('divisonLabel', t('IDS_TYPE_DIVISION_NAME'))
              .replaceAll('departmentLabel', t('IDS_TYPE_DEPARTMENT_NAME'))
              .replaceAll('textDeleteDepartment', t('MESSAGE.IDS_TEXT_DELETE_DEPARTMENT'))
              .replaceAll('levelLabel', t('IDS_LEVEL'))
              .replaceAll('skillLabel', t('IDS_EVALUATION_SKILL'))
              .replaceAll('haveLabel', t('IDS_HAVE'))
              .replaceAll('notHaveLabel', t('IDS_NOT_HAVE'))}
          </div>
        );
      },
    },
    {
      title: t('IDS_USER_EVALUATION_CHANGE'),
      dataIndex: 'userEvaluationChange',
      key: 'userEvaluationChange',
      render: (text: any, user: DataChange) => (
        <div>
          {
            text
              .replaceAll('onlyResetBehavior17', t('MESSAGE.IDS_TEXT_ONLY_RESET_BEHAVIOR_17'))
              .replaceAll('onlyResetBehavior810', t('MESSAGE.IDS_TEXT_ONLY_RESET_BEHAVIOR_810'))
              .replaceAll('onlyChangeLevel17', t('MESSAGE.IDS_TEXT_ONLY_CHANGE_LEVEL_17'))
              .replaceAll('onlyChangeLevel810', t('MESSAGE.IDS_TEXT_ONLY_CHANGE_LEVEL_810'))
              .replaceAll('onlyChangelevel17And810', t('MESSAGE.IDS_TEXT_ONLY_CHANGE_LEVEL_17_TO_810'))
              .replaceAll('changeDepartment', t('MESSAGE.IDS_TEXT_CHANGE_DEP_DIV'))
              .replaceAll('changeHaveSkillToNoSkill', t('MESSAGE.IDS_TEXT_CHANGE_HAVE_SKILL_TO_NO_SKILL'))
              .replaceAll('changeNoSkillToHaveSkill', t('MESSAGE.IDS_TEXT_CHANGE_NO_SKILL_TO_HAVE_SKILL'))
              .replaceAll(
                'optional2OnlyChangeLevel17BeforeFix',
                t('MESSAGE.IDS_TEXT_OPTION2_ONLY_CHANGE_LEVEL17_BEFORE_FIX'),
              )
              .replaceAll(
                'optional2OnlyChangeLevel810BeforeFix',
                t('MESSAGE.IDS_TEXT_OPTION2_ONLY_CHANGE_LEVEL810_BEFORE_FIX'),
              )
              .replaceAll('optional1ChangeAnyThingBeforeFix', t('MESSAGE.IDS_TEXT_OPTION1_CHANGE_ANYTHING_BEFORE_FIX'))
              .replaceAll('noChangeUserEvaluation', t('MESSAGE.IDS_TEXT_NO_CHANGE_USER_EVALUATION'))
              .replaceAll('optional1ChangeAnyThingAfterFix', t('MESSAGE.IDS_TEXT_OPTION1_CHANGE_ANYTHING_AFTER_FIX'))
              .replaceAll('textItemChange', t('MESSAGE.IDS_TEXT_TITLE_ITEM_CHANGED'))
            // .replaceAll('', t(''))
          }
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        closable={false}
        maskClosable={false}
        footer={[
          // eslint-disable-next-line react/jsx-key
          <div style={{ textAlign: 'left' }}>
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_OK')}
            </Button>
          </div>,
        ]}
      >
        <p dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>
      <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        {/* Header Title */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Căn giữa theo chiều dọc cho Search & Button
            marginBottom: '20px',
            gap: '16px',
          }}
        >
          <Title
            level={3}
            style={{
              marginTop: 0,
              paddingBottom: 0,
            }}
          >
            ユーザ編集
          </Title>
        </div>
        {currentStep >= 2 && (
          <ConfigProvider
            theme={{
              components: {
                Steps: {
                  colorPrimary: '#007240', // Màu của bước đang chạy và đường line kích hoạt
                  navArrowColor: '#007240',
                  // Bạn có thể chỉnh thêm màu text, màu icon tại đây nếu muốn
                },
              },
            }}
          >
            <Steps
              current={currentStep - 1} // Vì component Steps của Antd tính từ số 0
              style={{ marginBottom: '20px', padding: '0 16px' }}
              items={[
                { title: t('IDS_POPUP_EIDT_USER.IDS_INFORMATION') },
                { title: t('IDS_POPUP_EIDT_USER.IDS_TARGET_TITLE') },
                { title: t('IDS_POPUP_EIDT_USER.IDS_STEP_CONFIRM') },
              ]}
            />
          </ConfigProvider>
        )}

        {/* Main Card Container */}
        <Form
          form={form}
          onValuesChange={() =>
            setTimeout(() => {
              setIsFormChanged(checkFormChanges());
              const bool = checkFormChangesIntegration();
              if (bool) form.setFieldValue('radioLevelvalue', 2);
              setIsFormChangedAll(bool);
            }, 0)
          }
        >
          {/* Profile Section */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <EditForm
              data={data}
              t={t}
              listDepartmentTypeDivisions={listDepartmentTypeDivisions}
              listDepartmentTypeDepartments={listDepartmentTypeDepartments}
              listCompanys={listCompanys}
              levelList={levelList}
              form={form}
              changeDivision={changeDivision}
            />
          </div>
          <Card style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <div>
              <PreviewIntegration
                t={t}
                id={id}
                recordInfo={data!}
                form={form}
                levelList={levelList}
                listCompanys={listCompanys}
                listDepartmentTypeDivisions={listDepartmentTypeDivisions}
              />
            </div>
          </Card>
          {!isLoading ? (
            <Card style={{ display: currentStep === 3 ? 'block' : 'none' }}>
              <div>
                <div
                  style={{
                    overflow: 'hidden',
                    paddingBottom: 10,
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={dataChanges}
                    pagination={false}
                    bordered
                    size="small"
                    loading={isLoading}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Spin size="large" />
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            {currentStep < 2 ? (
              <>
                <Button
                  type="primary"
                  size="middle"
                  htmlType="submit"
                  disabled={!isFormChangedAll}
                  onClick={gotoSteps}
                  loading={isLoading}
                >
                  {t('IDS_CHECK_BUTTON')}
                </Button>
              </>
            ) : (
              <>
                {currentStep === 3 && (
                  <Button type="primary" size="middle" htmlType="submit" onClick={handleOpenPopupConfirm}>
                    {t('IDS_BUTTON_SAVE')}
                  </Button>
                )}

                <Space size="middle" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handlePreview}
                    loading={isLoading}
                    disabled={typeEvaluation !== 2 && currentRadioValue === -1}
                  >
                    {t('IDS_POPUP_EIDT_USER.IDS_NEXT_BUTTON')}
                  </Button>
                </Space>
              </>
            )}

            <Button
              size="middle"
              loading={isLoading}
              onClick={() => {
                if (currentStep <= 3 && currentStep > 1) {
                  setCurrentStep((state) => state - 1);
                } else {
                  navigate(-1);
                }
              }}
              type="default"
            >
              {currentStep < 2 ? t('IDS_BUTTON_CANCEL') : t('IDS_POPUP_EIDT_USER.IDS_BACK_BUTTON')}
            </Button>
          </div>
        </Form>
        {/* <div className="loading-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
          </div> */}
      </div>

      <ModalCustomComponent
        isOpen={isConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSubmit}
        fnHandleCancel={() => setIsConfirm(false)}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};

export default UserEdit;
