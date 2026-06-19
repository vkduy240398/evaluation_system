/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import httpAxios from '../../../common/http';

import { useAuth } from '../../../hooks/useAuth';
import { decrypt, urlCompanyCode } from '../../../common/util';

import userEvaluationApiService from '../../../common/api/userEvaluation';
import Evaluation810NoSkill from './Evaluation810NoSkill';
import Evaluation810HaveSkill from './Evaluation810HaveSkill';
import { useDispatch } from 'react-redux';
import { reset } from '../../../store/userEvaluation';

const EvaluationComponent8: React.FC<any> = (props: { role: string }) => {
  const Location = useLocation();
  const navigate = useNavigate();
  const { role } = props;
  const { user } = useAuth();
  const { id } = useParams();

  const isEvaluatorUser = role === 'user';

  const state = Location.state;

  const [flagSkill, setFlahSkill] = useState<number | undefined>(undefined);

  const backToListScreen = () => {
    role === 'user'
      ? navigate(urlCompanyCode() + '/user/list-evaluation')
      : role === 'evaluator'
      ? navigate(urlCompanyCode() + '/evaluator/list-user-evaluation')
      : navigate(urlCompanyCode() + '/admin-evaluation/list-user-evaluation');
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset());
    const fetchData = async () => {
      return await userEvaluationApiService
        .evaluationHaveSkillCheck({
          evaluationId: !state ? decrypt(id?.toString() || '') : state.id,
          isEvaluatorUser,
          isF5: role === 'admin',
        })
        .then((res) => {
          if (res === null || res === undefined) backToListScreen();

          setFlahSkill(res);
        });
    };
    if (!Location.state || Location.state === null) {
      if (decrypt(id?.toString() || '') === undefined || isNaN(Number(decrypt(id?.toString() || '')))) {
        backToListScreen();
      } else {
        checkPermission().then(() => fetchData());
      }
    } else {
      fetchData();
    }
  }, [Location.state]);

  const checkPermission = async () => {
    if (role === 'user') {
      await httpAxios
        .Get(`/api/v1/f1/user/check-permission/${Number(decrypt(id?.toString() || ''))}/${Number(user?.id)}`)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: Number(decrypt(id?.toString() || '')),
                },
              });
            } else backToListScreen();
          }
        });
    }
    if (role === 'evaluator') {
      await httpAxios
        .Get(`/api/v1/f2/evaluator/check-permission/${Number(decrypt(id?.toString() || ''))}/${Number(user?.id)}`)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data && res.data.length) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: Number(decrypt(id?.toString() || '')),
                },
              });
            } else backToListScreen();
          }
        });
    }
  };
  if (flagSkill === 1) {
    return <Evaluation810HaveSkill {...{ flagSkill, ...props }} />;
  } else if (flagSkill === 0 || flagSkill === null) {
    return <Evaluation810NoSkill {...{ flagSkill, ...props }} />;
  } else return <></>;
};

export default EvaluationComponent8;
