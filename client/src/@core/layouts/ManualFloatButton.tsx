import { Dropdown, MenuProps, Tooltip } from 'antd';
import { GoQuestion } from 'react-icons/go';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Roles } from '../../constant/Roles';
import { useTranslation } from 'react-i18next';

const ManualFloatButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const location = useLocation();

  const isHiddenPage =
    location.pathname.includes('/home') ||
    location.pathname.includes('/404page') ||
    location.pathname.includes('/login');

  if (isHiddenPage || !auth.user) return null;

  const hasRole = (role: Roles) => auth.user?.roles.includes(role);
  const urlCompanyCode = `/company/${auth.user.companyGroupCode}`;

  const items: MenuProps['items'] = [];

  if (hasRole(Roles.F1) || hasRole(Roles.F2)) {
    items.push({
      key: '/manual/1',
      label: (
        <a href={`${urlCompanyCode}/manual?type=1`} target="_blank" rel="noreferrer">
          {t('IDS_MANUAL_USER_EVALUATOR')}
        </a>
      ),
    });
  }
  if (hasRole(Roles.F3) || hasRole(Roles.F4)) {
    items.push({
      key: '/manual/2',
      label: (
        <a href={`${urlCompanyCode}/manual?type=2`} target="_blank" rel="noreferrer">
          {t('IDS_MANUAL_PRO_SKILL_SETTING_APPROVE')}
        </a>
      ),
    });
  }
  if (hasRole(Roles.F5) || hasRole(Roles.F6) || hasRole(Roles.F7) || hasRole(Roles.F8)) {
    items.push({
      key: '/manual/3',
      label: (
        <a href={`${urlCompanyCode}/manual?type=3`} target="_blank" rel="noreferrer">
          {t('IDS_MANUAL_ADMIN')}
        </a>
      ),
    });
  }

  if (items.length === 0) return null;

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Tooltip title={t('IDS_MANUAL')} placement="left">
        <div
          style={{
            position: 'fixed',
            top: 32,
            right: 24,
            zIndex: 1000,
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#375054',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <GoQuestion size={22} color="white" />
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export default ManualFloatButton;
