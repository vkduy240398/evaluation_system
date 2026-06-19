/* eslint-disable @typescript-eslint/no-unused-vars */
import { Affix, Grid, Spin } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataState } from '../../model/DataState';
import useForm from 'antd/es/form/hooks/useForm';
import { decrypt, urlCompanyCode } from '../../common/util';
import CommonInformationDetailProSkillApprove from './components/CommonInformationDetailProSkillApprove';
import TableDetailProSkillApproval from './components/TableDetailProSkillApproval';
import ButtonFooterComponentProSkillApprove from './components/ButtonFooterComponentProSkillApprove';
import { handleApprovedProSkill, handleRejectedProSkill, loadData } from './handle-data/handleDataApproveProSkill';
const defaultDataState: DataState<any> = {
  dataSource: {},
  dataTable: [], // dùng cho search trên column header
};
const InputProSkillEvaluator = () => {
  const breaks = Grid.useBreakpoint();
  const [isOpenApprovateGoal, setOpenApprovateGoal] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams();
  const [form] = useForm();
  const [dataState, setDataState] = useState(defaultDataState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const state = location?.state;
  const [isAffixed, setIsAffixed] = useState<boolean>();

  const skillId = location?.state?.skillId;
  const id = location?.state?.id;
  const hostName = window.location.origin;

  const dataCallback = (data: any) => {
    let i = 1;
    data.children.forEach((e: any) => {
      e.key = i++;
    });
    setDataState({
      ...dataState,
      dataSource: data,
      dataTable: data.children,
    });
  };

  const errorCallback = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  useEffect(() => {
    if (!state) {
      if (
        decrypt(params.id?.toString() || '') === undefined ||
        decrypt(params.skillId?.toString() || '') === undefined
      ) {
        navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-approve-pro-skill');
      } else {
        navigate(`${window.location.pathname}`, {
          state: {
            id: Number(decrypt(params.id?.toString() || '')),
            skillId: Number(decrypt(params.skillId?.toString() || '')),
          },
        });
      }
    } else handleData();
  }, [state]);

  const handleData = async () => {
    setLoading(true);
    loadData(skillId, id, dataCallback, errorCallback, navigate);
  };

  const handleOk = async () => {
    await handleRejected(false).then(() => setOpen(false));
  };

  const handleRejected = async (_isRejectEvaluator?: boolean) => {
    await handleRejectedProSkill(form, dataState, id, skillId, hostName, dataCallback, errorCallback, navigate);
  };

  const handleOpen = () => setOpen(!isOpen);

  const handleProcessApproved = async () => {
    await handleApprovedProSkill(
      form,
      isOpenApprovateGoal,
      dataState,
      hostName,
      id,
      skillId,
      setOpenApprovateGoal,
      dataCallback,
      errorCallback,
      navigate,
    );
  };

  const handleProcessApprovedClose = () => {
    setOpenApprovateGoal(false);
  };

  return (
    <>
      {!isLoading ? (
        <div className="container">
          <CommonInformationDetailProSkillApprove dataState={dataState} />
          <TableDetailProSkillApproval dataState={dataState} setDataState={setDataState} />
          <Affix
            offsetBottom={0}
            style={{ paddingBottom: 10 }}
            onChange={(affixed) => {
              setIsAffixed(affixed);
            }}
          >
            <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
              <ButtonFooterComponentProSkillApprove
                form={form}
                dataState={dataState}
                isLoading={isLoading}
                setOpenApprovateGoal={setOpenApprovateGoal}
                setOpen={setOpen}
                isOpen={isOpen}
                skillId={skillId}
                id={id}
                handleOk={handleOk}
                handleOpen={handleOpen}
                isOpenApprovateGoal={isOpenApprovateGoal}
                handleProcessApproved={handleProcessApproved}
                handleProcessApprovedClose={handleProcessApprovedClose}
                breaks={breaks}
              />
            </div>
          </Affix>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default InputProSkillEvaluator;
