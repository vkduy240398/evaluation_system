import {
  AddProSkillProps,
  CreateGroupProps,
  DeleteAdminEvaluationSkillType,
  DeleteGroupProps,
  DepartmentResType,
  EditProSkillProps,
  GetAdminEvaluationProByDivisionIdType,
  GetAdminEvaluationProType,
  GetAdminEvaluationSkillType,
  GetGroupProps,
  GetUserActiveType,
  UpdateDepartmentRole,
  UpdateDepartmentRoleMultiple,
  UpdateGroupProps,
  UpdateSubDivisionType,
  getAllDepartmentsWithSubClassProps,
} from '../../../types/api/adminEvaluationPro';
import httpAxios from '../../http';

const getDivisions = async (props: DepartmentResType) => {
  const { callback, errorCallback } = props;

  return await httpAxios.Get('/api/v1/common/get-all-department-type-division').then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else {
      //
      errorCallback && errorCallback(res?.data);
    }
  });
};

const getDepartments = async (props: DepartmentResType) => {
  const { callback, errorCallback } = props;

  return await httpAxios.Get('/api/v1/common/get-all-department').then((res) => {
    if (res && res.status === 200) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callback(arrays);
    } else {
      //
      errorCallback && errorCallback(res?.data);
    }
  });
};

const getAdminEvalutionPro = async (props: GetAdminEvaluationProType) => {
  const { departmentId, limit, offset, callback, errorCallback } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/setting-evaluation-pro', { params: { departmentId, limit, offset } })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback();
    });
};

const getAdminEvalutionSkills = async (props: GetAdminEvaluationSkillType) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { skillId, limit, offset, callback, errorCallback, detailed } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/setting-evaluation-skills', { params: { skillId, limit, offset, detailed } })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback();
    });
};

const deleteAdminEvalutionSkill = async (props: DeleteAdminEvaluationSkillType) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { skillId, callback, errorCallback } = props;

  return await httpAxios
    .Delete(`/api/v1/f6/management-evaluation/setting-evaluation-skills/${skillId}`)
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
    })
    .catch((err) => {
      errorCallback && errorCallback(err);
    });
};

const getAdminEvalutionProByDivisionId = async (props: GetAdminEvaluationProByDivisionIdType) => {
  const { divisionId, limit, offset, callback, errorCallback } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/setting-evaluation-pro-by-division-id', {
      params: { divisionId, limit, offset },
    })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback();
    });
};

const getUserActive = async (props: GetUserActiveType) => {
  const { callback, errorCallback } = props;

  return await httpAxios.Get('/api/v1/f6/management-evaluation/get-user-active').then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};

const updateDepartmentRole = async (props: UpdateDepartmentRole) => {
  const {
    departmentId,
    skillSetters,
    skillApprovers,
    divisionId,
    isCheckedDep,
    isCheckedDiv,
    isCheckedGroup,
    group,
    groups,
    callback,
    errorCallback,
  } = props;

  return await httpAxios
    .Put(`/api/v1/f6/management-evaluation/setting-evaluation-pro/${departmentId}`, {
      skillSetters,
      skillApprovers,
      divisionId,
      isCheckedDep,
      isCheckedDiv,
      isCheckedGroup,
      group,
      groups,
    })
    .then((res) => {
      if (res && res.status === 200) {
        httpAxios
          .Put(
            `/api/v1/f6/management-evaluation/setting-evaluation-pro-by-division-id/update/division/${divisionId}/${isCheckedGroup}`,
          )
          .then(() => {
            callback(res.data);
          });
      } else errorCallback && errorCallback(res?.data);
    });
};

const updateDepartmentRoleMultiple = async (props: UpdateDepartmentRoleMultiple) => {
  const {
    departmentIds,
    divisionId,
    skillSetters,
    skillApprovers,
    isCheckedDep,
    isCheckedDiv,
    isCheckedGroup,
    group,
    groups,
    callback,
    errorCallback,
  } = props;

  return await httpAxios
    .Put(`/api/v1/f6/management-evaluation/setting-evaluation-pro/update/multiple`, {
      departmentIds,
      skillSetters,
      skillApprovers,
      divisionId,
      isCheckedDep,
      isCheckedDiv,
      isCheckedGroup,
      groups,
      group,
    })
    .then((res) => {
      if (res && res.status === 200) {
        callback(res.data);

        httpAxios.Put(
          `/api/v1/f6/management-evaluation/setting-evaluation-pro-by-division-id/update/division/${divisionId}/${isCheckedGroup}`,
        );
      } else errorCallback && errorCallback(res?.data);
    });
};

const updateSubDivision = async (props: UpdateSubDivisionType) => {
  const { divisionId, setting, callback, errorCallback } = props;

  return await httpAxios
    .Put(`/api/v1/f6/management-evaluation/setting-evaluation-pro-by-division-id/${divisionId}`, { setting })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback(res?.data);
    });
};

const getGroup = async (props: GetGroupProps) => {
  const { divisionId, limit, offset, callback, errorCallback } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/setting-evaluation-pro/tab/group', { params: { divisionId, limit, offset } })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback(res?.data);
    });
};

const createGroup = async (props: CreateGroupProps) => {
  const { divisionId, groupName, departmentIds, callback, errorCallback } = props;

  return await httpAxios
    .Post('/api/v1/f6/management-evaluation/setting-evaluation-pro/tab/group', {
      divisionId,
      groupName,
      departmentIds,
    })
    .then((res) => {
      if (res && res.status === 201) callback();
      else errorCallback && errorCallback(res?.data);
    });
};

const deleteGroup = async (props: DeleteGroupProps) => {
  const { groupId, callback, errorCallback } = props;

  return await httpAxios
    .Delete(`/api/v1/f6/management-evaluation/setting-evaluation-pro/tab/group/${groupId}`)
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback(res?.data);
    });
};

const updateGroup = async (props: UpdateGroupProps) => {
  const { groupId, groupName, departmentIds, callback, errorCallback } = props;

  return await httpAxios
    .Put(`/api/v1/f6/management-evaluation/setting-evaluation-pro/tab/group/${groupId}`, { groupName, departmentIds })
    .then((res) => {
      if (res && res.status === 200) callback();
      else errorCallback && errorCallback(res?.data);
    });
};

const getOptionDepartmentByDivisionId = async (props: {
  divisionId: number | string | undefined;
  callback: (data: any) => void;
  errorCallback?: () => void;
}) => {
  const { divisionId, callback, errorCallback } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/get-option-setting-evaluation-pro-by-division-id', {
      params: { divisionId },
    })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback();
    });
};

const getGroupOptions = async (props: GetGroupProps) => {
  const { divisionId, callback, errorCallback } = props;

  return await httpAxios
    .Get('/api/v1/f6/management-evaluation/setting-evaluation-pro/tab/group-options', { params: { divisionId } })
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback(res?.data);
    });
};

const getAllDepartmentsWithSubClass = async ({ callback, errorCallback }: getAllDepartmentsWithSubClassProps) => {
  return await httpAxios.Post('/api/v1/f6/management-evaluation/get-all-departments-with-subclass').then((res) => {
    if (res && res.status === 201) callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};

const addProSkill = async ({ callback, errorCallback, payload }: AddProSkillProps) => {
  return await httpAxios.Post('/api/v1/f6/management-evaluation/add-pro-skill', payload).then((res) => {
    if (res && res.status === 201) callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};

const updateProSkill = async ({ callback, errorCallback, payload, id }: EditProSkillProps) => {
  return await httpAxios
    .Put(`/api/v1/f6/management-evaluation/setting-evaluation-skills/${id}`, payload)
    .then((res) => {
      if (res && res.status === 200) callback(res.data);
      else errorCallback && errorCallback(res?.data);
    });
};

const adminEvaluationApiService = {
  getDivisions,
  getDepartments,
  getAdminEvalutionPro,
  getAdminEvalutionSkills,
  deleteAdminEvalutionSkill,
  getAdminEvalutionProByDivisionId,
  getUserActive,
  updateDepartmentRole,
  updateDepartmentRoleMultiple,
  updateSubDivision,
  getGroup,
  createGroup,
  deleteGroup,
  updateGroup,
  getOptionDepartmentByDivisionId,
  getGroupOptions,
  getAllDepartmentsWithSubClass,
  addProSkill,
  updateProSkill,
};

export default adminEvaluationApiService;
