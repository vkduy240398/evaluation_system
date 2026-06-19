import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EditBasicBehaviorComponent from './edit/Index';
import DetailCriteriaComponents from './detail/Index';

const DetailEvaluationItemScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setNavigate = (pathName: string, state: { [x: string]: any }, replace: boolean) => {
    navigate(pathName, {
      state: state,
      replace: replace,
    });
  };

  return (
    <>
      {location.state && location.state.edited ? (
        <EditBasicBehaviorComponent setNavigate={setNavigate} />
      ) : (
        <DetailCriteriaComponents setNavigate={setNavigate} />
      )}
    </>
  );
};

export default DetailEvaluationItemScreen;
