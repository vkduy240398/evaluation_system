import React, { useEffect, useState } from 'react';
import userEvaluationApiService from '../../../common/api/userEvaluation';

export default function useDepartmentEvaluation({ period, setIsLoading }: any, setDepartmentList: any) {
  const [departments, setDepartments] = useState([]);

  const callBack = (data: any) => {
    setDepartments(data);
    setDepartmentList(data);
  };

  const errorCallBack = (bool: boolean | undefined) => {
    setIsLoading(bool || false);
  };

  useEffect(() => {
    // call API to get department and update department options
    userEvaluationApiService.getAllDepartmentEvaluation(period, { callBack, errorCallBack });
  }, [period]);

  return departments;
}
