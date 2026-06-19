import '../../views/navigation/Card.css';
import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { t } from 'i18next';
import { Radio, RadioChangeEvent, Space, Spin, Typography } from 'antd';
import { FaRegBuilding } from 'react-icons/fa';

const NavigationScreen: FC = () => {
  // ** Hook
  const auth = useAuth();

  const companyGroups =
    auth.user?.companyGroups?.sort((c1, c2) => c1.name.toUpperCase().localeCompare(c2.name.toUpperCase())) ?? [];

  const handleSelect = async (e: RadioChangeEvent) => {
    await auth.selectCompany(e.target.value);
  };

  if (companyGroups.length === 1 && companyGroups[0].roleCount > 0) {
    auth.selectCompany(companyGroups[0].code);
  }

  return (
    <>
      {companyGroups.length === 1 ? (
        !companyGroups[0].roleCount ? (
          <div>{t('MESSAGE.COMMON.IDM_NO_ROLE')}</div>
        ) : (
          <Spin
            size="large"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        )
      ) : (
        <>
          <Typography.Title level={3}>{t('IDS_LIST_COMPANY_GROUP')}</Typography.Title>
          <Typography style={{ color: 'red', fontSize: 12, paddingBottom: 8 }}>
            {t('IDS_LIST_COMPANY_GROUP_NOTE')}
          </Typography>
          <Radio.Group onChange={handleSelect}>
            <Space direction="vertical" size={'middle'}>
              {companyGroups?.length > 1 &&
                companyGroups.map((c) => (
                  <Radio.Button
                    value={c.code}
                    key={c.code}
                    disabled={!c.roleCount}
                    style={{ display: 'inline-block' }}
                  >
                    <FaRegBuilding style={{ marginRight: 7 }} />
                    {c.name}
                    {!c.roleCount && <div>{t('MESSAGE.COMMON.IDM_NO_ROLE')}</div>}
                  </Radio.Button>
                ))}
            </Space>
          </Radio.Group>
        </>
      )}
    </>
  );
};

export default NavigationScreen;
