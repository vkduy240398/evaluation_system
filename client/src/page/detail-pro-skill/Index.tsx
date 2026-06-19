import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditProSkill from './edit/EditProSkill';
import DetailProSkillScreenNotPublic from './detail/DetailProSkillScreenNotPublic';
import { decrypt, urlCompanyCode } from '../../common/util';
import { useEffect } from 'react';
import proSetting from '../../common/api/pro-setting';

const IndexProSkillComponents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const setNavigate = (pathName: string, state: { [x: string]: any }, replace: boolean) => {
    navigate(pathName, {
      state: state,
      replace: replace,
    });
  };

  const dataCallback = (data: any) => {
    if (!data.status) {
      navigate(urlCompanyCode() + '/pro-setting/list-pro-skill');
    }

    if (id && !location.state) {
      navigate(`${window.location.pathname}`, {
        state: {
          id: decrypt(id?.toString() || ''),
          edited:
            data.status === 1 || data.status === 5 || (data.status === 4 && data.publicStatus === 1) ? true : false,
        },
        replace: true,
      });
    } else if (location.state && location.state.id && !location.state.readOnly) {
      if (
        (location.state.edited && [2, 3, 4].includes(data.status)) ||
        (!location.state.edited && [1, 5].includes(data.status))
      ) {
        navigate(`${window.location.pathname}`, {
          state: {
            ...location.state,
            edited:
              data.status === 1 || data.status === 5 || (data.status === 4 && data.publicStatus === 1) ? true : false,
          },
          replace: true,
        });
      }
    }
  };

  const errorCallback = () => {
    navigate(urlCompanyCode() + '/pro-setting/list-pro-skill');
  };

  useEffect(() => {
    if (id && !location.state) {
      if (decrypt(id?.toString() || '') === undefined) {
        navigate(urlCompanyCode() + '/pro-setting/list-pro-skill');
      } else {
        proSetting.checkPermission(
          `/api/v1/f3/pro-setting/check-permission`,
          decrypt(id?.toString() || ''),
          dataCallback,
          errorCallback,
        );
      }
    } else if (location.state && location.state.id && !location.state.readOnly) {
      proSetting.checkPermission(
        `/api/v1/f3/pro-setting/check-permission`,
        location.state.id,
        dataCallback,
        errorCallback,
      );
    }
  }, []);

  return (
    <>
      {location.state && location.state.edited ? (
        <EditProSkill />
      ) : (
        <DetailProSkillScreenNotPublic setNavigate={setNavigate} />
      )}
    </>
  );
};

export default IndexProSkillComponents;
