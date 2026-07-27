import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './css/header-style.css';
import { Avatar, Dropdown, MenuProps, Tooltip, Typography } from 'antd';
import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined';
import { CaretDownOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { reset } from '../../store/userEvaluation';
import { FaRegBuilding } from 'react-icons/fa';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { resetExport } from '../../store/excel';
import { AppDispatch } from '../../store';
import { GoQuestion } from 'react-icons/go';
import { Roles } from '../../constant/Roles';
dayjs.extend(utc);
dayjs.extend(timezone);
const HeaderComponent = () => {
  const { t, i18n } = useTranslation();
  const DATE_FORMAT =
    i18n.language === 'ja' ? 'YYYY/M/D HH:mm:ss' : i18n.language === 'en' ? 'M/D/YYYY HH:mm:ss' : 'D/M/YYYY HH:mm:ss';

  // ** State
  const { Link } = Typography;

  // ** Hook
  const auth = useAuth();
  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
  const [currentTime, setCurrentTime] = useState(dayjs.tz(dayjs(), timeZone));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dispatchExcel = useDispatch<AppDispatch>();

  const logout = () => {
    dispatchExcel(resetExport());
    auth.logout();

    dispatch(reset());
  };

  const hasRole = (role: Roles) => auth.user?.roles.includes(role);
  const urlCompanyCode = `/company/${auth.user?.companyGroupCode}`;

  const manualLinks: { key: string; url: string; label: string }[] = [];
  if (hasRole(Roles.F1) || hasRole(Roles.F2)) {
    manualLinks.push({
      key: '/manual/1',
      url: `${urlCompanyCode}/manual?type=1`,
      label: t('IDS_MANUAL_USER_EVALUATOR'),
    });
  }
  if (hasRole(Roles.F3) || hasRole(Roles.F4)) {
    manualLinks.push({
      key: '/manual/2',
      url: `${urlCompanyCode}/manual?type=2`,
      label: t('IDS_MANUAL_PRO_SKILL_SETTING_APPROVE'),
    });
  }
  if (hasRole(Roles.F5) || hasRole(Roles.F6) || hasRole(Roles.F7) || hasRole(Roles.F8)) {
    manualLinks.push({ key: '/manual/3', url: `${urlCompanyCode}/manual?type=3`, label: t('IDS_MANUAL_ADMIN') });
  }

  const manualItems: MenuProps['items'] = manualLinks.map(({ key, url, label }) => ({
    key,
    label: (
      <a href={url} target="_blank" rel="noreferrer">
        {label}
      </a>
    ),
  }));

  const options: MenuProps['items'] = [];

  const isHomeOr404Page = window.location.pathname.includes('/home') || window.location.pathname.includes('/404page');

  if (
    !isHomeOr404Page &&
    (auth?.user?.companyGroups?.filter((group) => group?.code !== auth?.user?.companyGroupCode)?.length || 0) > 0
  ) {
    options.push({
      key: '1',
      label: auth.user?.companyGroupName,
      icon: <FaRegBuilding />,
      style: {
        cursor: 'default',
      },
    });
    options.push({
      key: '2',
      label: t('IDS_LIST_COMPANY_GROUP'),
      children: auth.user?.companyGroups
        ?.filter((group) => group.code !== auth?.user?.companyGroupCode)
        .map((group) => ({
          key: group.code, // Mỗi item cần có một key duy nhất
          label: group.name,
          onClick() {
            auth.selectCompany(group.code);
          },
        })),
    });
    options.push({
      type: 'divider',
    });
  }

  options.push({
    label: <a onClick={logout}>{t('IDS_BUTTON_LOGOUT')}</a>,
    key: '0',
    icon: <LogoutOutlined />,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs.tz(dayjs(), timeZone));
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function
  }, []);

  return (
    <>
      <Header
        className="ant-header-custom"
        style={{ position: 'relative', height: 45, justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            onClick={() =>
              navigate(
                auth.user?.companyGroups?.length === 1 && auth.user?.companyGroups[0].roleCount
                  ? `/company/${auth.user?.companyGroupCode}/notification`
                  : '/home',
              )
            }
          >
            {!isHomeOr404Page && (
              <img
                src={`/assets/images/logo/${auth.user?.companyIcon ? auth.user?.companyIcon : 'logo-custom-white.png'}`}
              />
            )}
          </a>
          {!isHomeOr404Page && manualLinks.length === 1 && (
            <a
              href={manualLinks[0].url}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <GoQuestion size={18} />
              <span style={{ fontSize: 13 }}>{t('IDS_MANUAL')}</span>
            </a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
          <div>
            {!isHomeOr404Page && manualLinks.length > 1 && (
              <Dropdown
                menu={{ items: manualItems }}
                trigger={['click']}
                placement="bottomRight"
                overlayStyle={{ flex: 1 }}
              >
                <span style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GoQuestion />
                  <span style={{ fontSize: 13 }}>{t('IDS_MANUAL')}</span>
                  <DownOutlined />
                </span>
              </Dropdown>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'end', paddingTop: 13 }}>
                <span style={{ color: 'white' }}>{auth.user?.email.split('@')[0]}</span>
              </div>

              <Dropdown menu={{ items: options }} trigger={['click']} placement="bottomRight">
                <Link
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: 'white',
                    marginRight: 25,
                    marginTop: 10,
                  }}
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ marginLeft: 7, backgroundColor: '#90AA86' }}
                    className="button-logout"
                  />
                  <CaretDownOutlined
                    style={{
                      top: 12,
                      right: 10,
                      position: 'absolute',
                    }}
                  />
                </Link>
              </Dropdown>
            </div>
            {!isHomeOr404Page && <div style={{ color: '#fff' }}>{currentTime.format(DATE_FORMAT)}</div>}
          </div>
        </div>
      </Header>
    </>
  );
};

export default HeaderComponent;
{
  /* Style { overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' } */
}
