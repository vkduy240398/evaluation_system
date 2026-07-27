/* eslint-disable @typescript-eslint/naming-convention */
import Menu, { MenuProps } from 'antd/es/menu';
import { t } from 'i18next';
import { memo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './css/header-style.css';
import { Button } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Roles } from '../../constant/Roles';
import { FaUser, FaUserCog, FaUserTie } from 'react-icons/fa';
import { GoBellFill, GoChecklist, GoCrossReference, GoQuestion } from 'react-icons/go';
import { TbAddressBook, TbMailCog, TbServerCog, TbSettingsCheck, TbSettingsPlus } from 'react-icons/tb';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Tooltip from 'antd/lib/tooltip';
import { MdOutlineFeedback } from 'react-icons/md';
import PopupNewFeature from './PopupNewFeature';

interface Props {
  collapsed: any;
  setCollapsed: any;
  handleOpenDraw: any;
  notification: any;
}

type MenuItem = Required<MenuProps>['items'][number];
const MenuComponent = (props: Props) => {
  const navigate = useNavigate();

  // ** State
  const location = useLocation();
  const [current, setCurrent] = useState('');
  const [, setLinks] = useState('');

  // ** Hook

  const auth = useAuth();

  // const handleChildrens = (arrays: any) => {
  //   if (arrays.length > 0) {
  //     return arrays.find((s: any) =>
  //       s.children.some((s: any) => s.key.includes(links.split('/')[1] || current.split('/')[1])),
  //     )?.children;
  //   }

  //   return arrays;
  // };
  const [openKeys, setOpenKeys] = useState(['']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setIsDisableButton] = useState<boolean>(false);
  const urlCompanyCode = `/company/${auth.user?.companyGroupCode}`;
  const handleMenu = () => {
    if (window.innerWidth <= 475) {
      if (props.collapsed === false) {
        props.setCollapsed(true);
      }
      setIsDisableButton(true);
    } else setIsDisableButton(false);
  };
  window.onresize = handleMenu;
  useEffect(() => {
    handleMenu();
  }, []);

  const removeCompanySegment = (url: string) => {
    // Biểu thức chính quy để tìm '/company/:companyCode'
    const regex = /\/company\/[^/]+/; // Tìm '/company/' theo sau là bất kỳ ký tự nào không phải '/'

    // Thay thế phần tìm thấy bằng một chuỗi rỗng
    return url.replace(regex, '');
  };

  // ** useEffect
  useEffect(() => {
    setCurrent(removeCompanySegment(location.pathname));
    setLinks(location.pathname);
    props.setCollapsed(true);
    if (location.pathname.includes('/evaluator/detail-pro-skill')) {
      setCurrent('/evaluator/list-pro-skill-public-department');
    } else if (location.pathname.includes('/evaluator/evaluation-8-10/')) {
      setCurrent('/evaluator/list-user-evaluation');
    } else if (location.pathname.includes('/user/evaluation/')) {
      setCurrent('/user/list-evaluation');
    } else if (location.pathname.includes('/admin-user/user-list/detail')) {
      setCurrent('/admin-user/user-list');
    } else if (
      location.pathname.includes('/user/evaluation-8-10/') ||
      location.pathname.includes('/user/evaluation/') ||
      location.pathname.includes('/user/evaluation-description/')
    ) {
      setCurrent('/user/list-evaluation');
    } else if (
      location.pathname.includes('/evaluator/evaluation-8-10/') ||
      location.pathname.includes('/evaluator/evaluation/') ||
      location.pathname.includes('/evaluator/department-goal') ||
      location.pathname.includes('/evaluator/evaluation-description')
    ) {
      setCurrent('/evaluator/list-user-evaluation');
    } else if (location.pathname.includes('/evaluator/export-history-evaluation-evaluator')) {
      setCurrent('/evaluator/export-history-evaluation-evaluator');
    } else if (location.pathname.includes('/evaluator/pro-skill/history'))
      setCurrent('/evaluator/list-pro-skill-public-department');
    else if (
      location.pathname.includes('/pro-setting/detail-pro-skill/') ||
      location.pathname.includes('/pro-setting/create') ||
      location.pathname.includes('/pro-setting/pro-skill/history')
    ) {
      setCurrent('/pro-setting/list-pro-skill');
    } else if (location.pathname.includes('/pro-setting/detail-pro-skill-public')) {
      setCurrent('/pro-setting/list-pro-skill-public-department');
    } else if (
      location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') ||
      location.pathname.includes('/pro-skill-approval/pro-skill/history') ||
      location.pathname.includes('/pro-skill-approval/detail-pro-skill-public/department')
    ) {
      setCurrent('/pro-skill-approval/list-approve-pro-skill');
    } else if (
      location.pathname.includes('/pro-skill-approval/detail-pro-skill-public') &&
      !location.pathname.includes('/pro-skill-approval/detail-pro-skill-public/department')
    ) {
      setCurrent('/pro-skill-approval/list-approve-pro-skill-public');
    } else if (
      location.pathname.includes('/admin-evaluation/evaluation/') ||
      location.pathname.includes('/admin-evaluation/evaluation-8-10/') ||
      location.pathname.includes('/admin-evaluation/department-goal') ||
      location.pathname.includes('/admin-evaluation/evaluation-description/')
    ) {
      setCurrent('/admin-evaluation/list-user-evaluation');
    } else if (location.pathname.includes('/admin-evaluation/detail-evaluation-item/')) {
      setCurrent('/admin-evaluation/list-evaluation-item');
    } else if (
      location.pathname.includes('/admin-evaluation/detail-pro-skill/') ||
      location.pathname.includes('/admin-evaluation/pro-skill/history/')
    ) {
      setCurrent('/admin-evaluation/list-criteria-history');
    } else if (
      location.pathname.includes('/admin-evaluation/criteria-evaluation/detail/') ||
      location.pathname.includes('/admin-evaluation/criteria-evaluation/edit')
    ) {
      setCurrent('/admin-evaluation/list-criteria-evaluation');
    } else if (
      location.pathname.includes('/admin-evaluation/setting-evaluation-pro') ||
      location.pathname.includes('/admin-evaluation/detail-setting-evaluation-pro')
    ) {
      setCurrent('/admin-evaluation/setting-evaluation-pro');
    } else if (
      location.pathname.includes('/admin-evaluation/list-version-notification') ||
      location.pathname.includes('/admin-evaluation/notification-detail')
    ) {
      setCurrent('/admin-evaluation/list-version-notification');
    } else if (
      location.pathname.includes('/admin-evaluation/period-evaluation-detail') ||
      location.pathname.includes('/admin-evaluation/exception-period-evaluation') ||
      location.pathname.includes('/admin-evaluation/detail-evaluation-fixed')
    ) {
      setCurrent('/admin-evaluation/list-period-evaluation');
    } else if (
      location.pathname.includes('/admin-evaluation/evaluation-calculator-detail-8-10') ||
      location.pathname.includes('/admin-evaluation/evaluation-calculator-detail')
    ) {
      setCurrent('/admin-evaluation/list-evaluation-calculation-history');
    } else if (location.pathname.includes('/admin-user/list-sub-department')) {
      setCurrent('/admin-user/list-division');
    } else if (location.pathname.includes('/admin-period/detail-goal-evaluaton-fixed')) {
      setCurrent('/admin-period/fix-goal-evaluation');
    } else if (location.pathname.includes('/admin-evaluation/mail-management/edit')) {
      setCurrent('/admin-evaluation/mail-management');
    } else if (location.pathname.includes('/admin-evaluation/list-feedback/detail')) {
      setCurrent('/admin-evaluation/list-feedback');
    } else if (
      location.pathname.includes('/user/user-view-evaluation') ||
      location.pathname.includes('/user/user-view-evaluation-8-10')
    ) {
      setCurrent('/user/user-view-evaluation');
    } else if (location.pathname.includes('/evaluator/setting-user-view-evaluation')) {
      setCurrent('/evaluator/list-user-setting-view-evaluation');
    } else if (location.pathname.includes('/feedback/detail')) {
      setCurrent('/feedback');
    } else if (location.pathname.includes('/user/department-goal')) {
      if (searchParams.get('id')) setCurrent('/user/list-evaluation');
      else setCurrent('/user/department-goal');
    } else if (location.pathname.includes('/reference-review')) {
      setCurrent('/reference-review');
    } else if (location.pathname.includes('/admin-evaluation/add-user-evaluation-history-reference')) {
      setCurrent('/admin-evaluation/setting-evaluation-history-reference');
    } else if (location.pathname.includes('/admin-evaluation/edit-user-evaluation-history-reference')) {
      setCurrent('/admin-evaluation/setting-evaluation-history-reference');
    } else if (location.pathname.includes('/system-admin/list-feedback/detail')) {
      setCurrent('/system-admin/list-feedback');
    } else if (location.pathname.includes('/evaluator/development-professional-expertise/detail')) {
      setCurrent('/evaluator/development-professional-expertise');
    }
  }, [location.pathname, searchParams.get('id')]);

  // ** Functional
  const handleClickMenu = (currents: string, _navigates: string, _role: string) => {
    // if (!(current.split('/')[1] === role)) {
    // navigate(navigates);

    setLinks(currents);
    props.setCollapsed(false);
  };

  //
  const hasRole = (role: Roles) => {
    return auth && auth.user && auth.user.roles.includes(role);
  };

  const hasflagSkill = () => {
    return auth && auth.user && auth.user.flagSkill === 1;
  };

  const getChildrenF1 = () => {
    const listLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const childrenF1 = [
      {
        key: '/user/list-evaluation',
        label: <Link to={`${urlCompanyCode}/user/list-evaluation`}>{t('IDS_LIST_EVALUATION')}</Link>,
      },
    ];

    const levelUser = auth.user?.level;
    if (levelUser && listLevel.includes(levelUser)) {
      childrenF1.push({
        key: '/user/evaluation-reference-behavior',
        label: <Link to={`${urlCompanyCode}/user/evaluation-reference-behavior`}>{t('IDS_REFERENCE_BEHAVIOR')}</Link>,
      });

      if (hasflagSkill()) {
        childrenF1.push({
          key: '/user/evaluation-reference-basic',
          label: <Link to={`${urlCompanyCode}/user/evaluation-reference-basic`}>{t('IDS_REFERENCE_BASIC')}</Link>,
        });
        childrenF1.push({
          key: '/user/evaluation-reference-pro',
          label: <Link to={`${urlCompanyCode}/user/evaluation-reference-pro`}>{t('IDS_REFERENCE_PRO')}</Link>,
        });
      }
    }

    if (auth && auth.user && auth.user.level <= 7) {
      childrenF1.push({
        key: '/user/department-goal',
        label: <Link to={`${urlCompanyCode}/user/department-goal?role=1`}>{t('IDS_GOAL_DEPARTMENT')}</Link>,
      });
    }

    childrenF1.push(
      ...[
        {
          key: '/user/evaluation-description',
          label: <Link to={`${urlCompanyCode}/user/evaluation-description`}>{t('IDS_EVALUATION_CRITERIA')}</Link>,
        },

        // {
        //   key: '/user/department-goal',
        //   label: <Link to="/user/department-goal?role=1">{t('IDS_GOAL_DEPARTMENT')}</Link>,
        // },
      ],
    );

    return childrenF1;
  };

  const menuRoleF1: MenuProps['items'] = [
    {
      key: '/role/f1',
      icon: (
        <Tooltip
          placement="right"
          title={(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1]}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <FaUser size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
      onTitleClick: (_e) => {
        handleClickMenu('/user/list-evaluation', `/user/list-evaluation`, 'user');
      },
      children: getChildrenF1(),
      style: {
        padding: 0,
        borderRadius: 'unset',
      },

      // popupClassName: current.split('/')[1] === 'user' && !props.collapsed ? 'hidden__sub' : '',
      popupClassName: 'hidden__sub',

      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // ======== F2 =============================
  const childrenF2 = [
    {
      key: '/evaluator/list-user-evaluation',
      label: <Link to={`${urlCompanyCode}/evaluator/list-user-evaluation`}>{t('IDS_LIST_EVALUATION')}</Link>,
    },
    {
      key: '/evaluator/list-pro-skill-public-department',
      label: (
        <Link to={`${urlCompanyCode}/evaluator/list-pro-skill-public-department`}>
          {t('IDS_LIST_PRO_SKILL_PUBLIC')}
        </Link>
      ),
    },
    {
      key: '/evaluator/export-history-evaluation-evaluator',
      label: (
        <Link to={`${urlCompanyCode}/evaluator/export-history-evaluation-evaluator`}>
          {t('IDS_EXPORT_HISTORY_EVALUATION')}
        </Link>
      ),
    },
    {
      key: '/evaluator/development-professional-expertise',
      label: (
        <Link to={`${urlCompanyCode}/evaluator/development-professional-expertise`}>
          {t('IDS_DEVELOP_PRO_SKILL_EXPERTISE')}
        </Link>
      ),
    },
  ];

  const menuRoleF2: MenuProps['items'] = [
    {
      key: '/role/f2',
      icon: (
        <Tooltip
          placement="right"
          title={(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2]}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <FaUserTie size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
      onTitleClick: (_e) => {
        handleClickMenu('/evaluator/list-user-evaluation', `/evaluator/list-user-evaluation`, 'evaluator');
      },
      children: childrenF2,
      style: {
        padding: 0,
        borderRadius: 'unset',
      },

      // popupClassName: current.split('/')[1] === 'evaluator' && !props.collapsed ? 'hidden__sub' : '',
      popupClassName: 'hidden__sub',

      // className: props.collapsed ? 'visible_icon' : links.includes('/evaluator/') ? 'visible-arrow' : '',
      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // =========== F3 ===================
  const childrenF3 = [
    {
      key: '/pro-setting/list-pro-skill',
      label: <Link to={`${urlCompanyCode}/pro-setting/list-pro-skill`}>{t('IDS_MENU_HISTORY_PRO_SKILL')}</Link>,
    },

    {
      key: '/pro-setting/list-pro-skill-public-department',
      label: (
        <Link to={`${urlCompanyCode}/pro-setting/list-pro-skill-public-department`}>
          {t('IDS_LIST_PRO_SKILL_PUBLIC')}
        </Link>
      ),
    },
    {
      key: '/pro-setting/export-pro-skill',
      label: <Link to={`${urlCompanyCode}/pro-setting/export-pro-skill`}>{t('IDS_EXPORT_PRO_SKILL')}</Link>,
    },
  ];

  const menuRoleF3: MenuProps['items'] = [
    {
      key: '/role/f3',
      icon: (
        <Tooltip
          placement="right"
          title={(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3]}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <TbSettingsPlus size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
      onTitleClick: (_e) => {
        handleClickMenu('/pro-setting/list-pro-skill', `/pro-setting/list-pro-skill`, 'pro-setting');
      },
      children: childrenF3,

      // popupClassName: current.split('/')[1] === 'pro-setting' && !props.collapsed ? 'hidden__sub' : '',
      popupClassName: 'hidden__sub',

      // className: props.collapsed ? 'visible_icon' : links.includes('/pro-setting/') ? 'visible-arrow' : '',
      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // ============ F4 =========================
  const childrenF4 = [
    {
      key: '/pro-skill-approval/list-approve-pro-skill',
      label: (
        <Link to={`${urlCompanyCode}/pro-skill-approval/list-approve-pro-skill`}>
          {t('IDS_LIST_APPROVE_PRO_SKILL')}
        </Link>
      ),
    },
    {
      key: '/pro-skill-approval/list-approve-pro-skill-public',
      label: (
        <Link to={`${urlCompanyCode}/pro-skill-approval/list-approve-pro-skill-public`}>
          {t('IDS_LIST_PRO_SKILL_PUBLIC')}
        </Link>
      ),
    },
    {
      key: '/pro-skill-approval/export-pro-skill',
      label: <Link to={`${urlCompanyCode}/pro-skill-approval/export-pro-skill`}>{t('IDS_EXPORT_PRO_SKILL')}</Link>,
    },
  ];

  const menuRoleF4: MenuProps['items'] = [
    {
      key: '/role/f4',
      icon: (
        <Tooltip
          placement="right"
          title={(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4]}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <TbSettingsCheck size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
      onTitleClick: (_e) => {
        handleClickMenu(
          '/pro-skill-approval/list-approve-pro-skill',
          `/pro-skill-approval/list-approve-pro-skill`,
          'pro-skill-approval',
        );
      },
      children: childrenF4,

      // popupClassName: current.split('/')[1] === 'pro-skill-approval' && !props.collapsed ? 'hidden__sub' : '',
      // popupClassName: !props.collapsed ? 'hidden__sub' : '',
      popupClassName: 'hidden__sub',

      // className: props.collapsed ? 'visible_icon' : links.includes('/pro-skill-approval/') ? 'visible-arrow' : '',
      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];
  const childrenF5 = [
    {
      key: '/admin-evaluation/list-user-evaluation',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-user-evaluation`}>
          {(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[1]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-period-evaluation',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-period-evaluation`}>
          {(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[2]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/export-history-evaluation',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/export-history-evaluation`}>
          {(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[3]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-feedback',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-feedback`}>
          {(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[4]}
        </Link>
      ),
    },
  ];

  const menuRoleF5: MenuProps['items'] = [
    {
      key: '/role/f5',
      icon: (
        <Tooltip
          placement="right"
          title={t('IDS_EVALUATION_MANAGEMENT')}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <TbAddressBook size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: t('IDS_EVALUATION_MANAGEMENT'),
      onTitleClick: (_e) => {
        handleClickMenu(
          '/admin-evaluation/list-user-evaluation',
          `/admin-evaluation/list-user-evaluation`,
          'admin-evaluation',
        );
      },
      children: childrenF5,

      popupClassName: 'hidden__sub',

      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // =================== F5, F6, F7 =======================

  const childrenF6 = [
    {
      key: '/admin-evaluation/list-evaluation-item',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-evaluation-item`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[1]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-criteria-history',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-criteria-history`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[2]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-evaluation-calculation-history',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-evaluation-calculation-history`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[3]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-criteria-evaluation',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-criteria-evaluation`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[4]}
        </Link>
      ),
    },

    // {
    //   key: '/admin-evaluation/setting-evaluation-pro',
    //   label: (
    //     <Link to="/admin-evaluation/setting-evaluation-pro">
    //       {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[5]}
    //     </Link>
    //   ),
    // },
    {
      key: '/admin-evaluation/setting-evaluation-pro',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/setting-evaluation-pro`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[5]}
        </Link>
      ),
    },
    {
      key: '/admin-evaluation/list-version-notification',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/list-version-notification`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[6]}
        </Link>
      ),
    },

    // {
    //   key: '/admin-evaluation/setting-evaluator',
    //   label: t('IDS_EVALUATOR_SETTING'),
    //   onClick(_e: any) {
    //     navigate(_e.key);
    //     props.setCollapsed(true);
    //   },
    // },
    {
      key: '/admin-evaluation/export-pro-skill',
      label: <Link to={`${urlCompanyCode}/admin-evaluation/export-pro-skill`}>{t('IDS_EXPORT_PRO_SKILL')}</Link>,
    },
    {
      key: '/admin-evaluation/setting-evaluation-history-reference',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/setting-evaluation-history-reference`}>
          {(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[7]}
        </Link>
      ),
    },
  ];
  const menuRoleF6: MenuProps['items'] = [
    {
      key: '/role/f6',
      icon: (
        <Tooltip placement="right" title={t('IDS_SETTING_OTHER')} overlayClassName={props.collapsed ? '' : 'hidden'}>
          <GoChecklist size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: t('IDS_SETTING_OTHER'),
      onTitleClick: (_e) => {
        handleClickMenu(
          '/admin-evaluation/list-evaluation-item',
          `/admin-evaluation/list-evaluation-item`,
          'admin-evaluation',
        );
      },
      children: childrenF6,

      popupClassName: 'hidden__sub',

      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  const childrenF7 = [
    // {
    //   key: '/admin-evaluation/list-period-evaluation',
    //   label: (
    //     <Link to="/admin-evaluation/list-period-evaluation">
    //       {(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7]}
    //     </Link>
    //   ),
    // },
    {
      key: '/admin-evaluation/mail-management',
      label: (
        <Link to={`${urlCompanyCode}/admin-evaluation/mail-management`}>
          {(t('IDL_LIST_MENU_F7', { returnObjects: true }) as any)[1]}
        </Link>
      ),
    },
  ];
  const menuRoleF7: MenuProps['items'] = [
    {
      key: '/role/f7',
      icon: (
        <Tooltip placement="right" title={t('IDS_MAIL_MANAGEMENT')} overlayClassName={props.collapsed ? '' : 'hidden'}>
          <TbMailCog size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: t('IDS_MAIL_MANAGEMENT'),
      onTitleClick: (_e) => {
        handleClickMenu('/admin-evaluation/mail-management', ``, '');
      },
      children: childrenF7,

      popupClassName: 'hidden__sub',

      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // const childrenF5orF7 = [
  //   {
  //     key: '/admin-evaluation/export-history-evaluation',
  //     label: (
  //       <Link to="/admin-evaluation/export-history-evaluation">
  //         {(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[2]}
  //       </Link>
  //     ),
  //   },
  // ];

  // const getChildrenF567 = () => {
  //   const results: any[] = [];
  //   // if (hasRole(Roles.F5)) {
  //   //   results.push(...childrenF5);
  //   // }
  //   if (hasRole(Roles.F6)) {
  //     results.push(...childrenF6);
  //   }
  //   if (hasRole(Roles.F7)) {
  //     results.push(...childrenF7);
  //   }
  //   // if (hasRole(Roles.F7) || hasRole(Roles.F5)) results.push(...childrenF5orF7);

  //   return results;
  // };

  // const menuRoleF567: MenuProps['items'] = [
  //   {
  //     key: '/role/f567',
  //     icon: (
  //       <Tooltip
  //         placement="right"
  //         overlayClassName={props.collapsed ? '' : 'hidden'}
  //         title={t('IDS_EVALUATION_MANAGEMENT')}
  //       >
  //         <GoChecklist size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
  //       </Tooltip>
  //     ),
  //     label: t('IDS_EVALUATION_MANAGEMENT'),
  //     onTitleClick: (_e) => {
  //       if (hasRole(Roles.F5)) {
  //         handleClickMenu(
  //           '/admin-evaluation/list-user-evaluation',
  //           `/admin-evaluation/list-user-evaluation`,
  //           'admin-evaluation',
  //         );
  //       } else if (hasRole(Roles.F6)) {
  //         handleClickMenu(
  //           '/admin-evaluation/list-evaluation-item',
  //           `/admin-evaluation/list-evaluation-item`,
  //           'admin-evaluation',
  //         );
  //       } else if (hasRole(Roles.F7)) {
  //         handleClickMenu(
  //           '/admin-evaluation/list-period-evaluation',
  //           `/admin-evaluation/list-period-evaluation`,
  //           'admin-evaluation',
  //         );
  //       }
  //     },
  //     children: getChildrenF567(),

  //     // popupClassName: current.split('/')[1] === 'criterion-management' && !props.collapsed ? 'hidden__sub' : '',
  //     // popupClassName: !props.collapsed ? 'hidden__sub' : '',
  //     popupClassName: 'hidden__sub',

  //     // className: props.collapsed ? 'visible_icon' : links.includes('/admin-evaluation/') ? 'visible-arrow' : '',
  //     className: props.collapsed ? 'transition' : 'Untransition',
  //   },
  // ];

  // =============== F8 ================
  const childrenF8 = [
    {
      key: '/admin-user/list-division',
      label: <Link to={`${urlCompanyCode}/admin-user/list-division`}>{t('IDS_LIST_DIVISION')}</Link>,
    },
    {
      key: '/admin-user/add-department',
      label: <Link to={`${urlCompanyCode}/admin-user/add-department`}>{t('IDS_ADD_DEPARTMENT')}</Link>,
    },
    {
      key: '/admin-user/user-list',
      label: <Link to={`${urlCompanyCode}/admin-user/user-list`}>{t('IDS_LIST_USER')}</Link>,
    },
    {
      key: '/admin-user/add-user',
      label: <Link to={`${urlCompanyCode}/admin-user/add-user`}>{t('IDS_ADD_USER')}</Link>,
    },
  ];
  const menuRoleF8: MenuProps['items'] = [
    {
      key: '/role/f8',
      icon: (
        <Tooltip
          placement="right"
          title={(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8]}
          overlayClassName={props.collapsed ? '' : 'hidden'}
        >
          <FaUserCog size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
      onTitleClick: (_e: any) => {
        handleClickMenu('/admin-user/user-list', `/admin-user/user-list`, 'admin-user');
      },
      style: {
        textAlign: 'left',
      },
      children: childrenF8,
      popupClassName: 'hidden__sub',
      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];
  const childrenF9 = [
    {
      key: '/system-admin/list-feedback',
      label: <Link to={`${urlCompanyCode}/system-admin/list-feedback`}>{t('IDS_FEEDBACK_MANAGEMENT')}</Link>,
    },
  ];
  const menuRoleF9: MenuProps['items'] = [
    {
      key: '/role/F9',
      icon: (
        <Tooltip placement="right" title={t('IDS_SYSTEM_ADMIN')} overlayClassName={props.collapsed ? '' : 'hidden'}>
          <TbServerCog size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: t('IDS_SYSTEM_ADMIN'),
      onTitleClick: (_e: any) => {
        handleClickMenu('/system-admin/list-feedback', ``, ``);
      },
      children: childrenF9,

      popupClassName: 'hidden__sub',

      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  // =============== F8 ================
  const getChildrenManual = () => {
    const results = [];
    if (hasRole(Roles.F1) || hasRole(Roles.F2)) {
      const typeF12 = 1;
      results.push({
        key: '/manual/1',
        label: (
          <Link to={{ pathname: `${urlCompanyCode}/manual`, search: `?type=${typeF12}` }} target="_blank">
            {t('IDS_MANUAL_USER_EVALUATOR')}
          </Link>
        ),
        onClick: () => {
          props.setCollapsed(true);
        },
      });
    }
    if (hasRole(Roles.F3) || hasRole(Roles.F4)) {
      const typeF34 = 2;
      results.push({
        key: '/manual/2',
        label: (
          <Link to={{ pathname: `${urlCompanyCode}/manual`, search: `?type=${typeF34}` }} target="_blank">
            {t('IDS_MANUAL_PRO_SKILL_SETTING_APPROVE')}
          </Link>
        ),
        onClick: () => {
          props.setCollapsed(true);
        },
      });
    }
    if (hasRole(Roles.F5) || hasRole(Roles.F6) || hasRole(Roles.F7) || hasRole(Roles.F8)) {
      const typeF5678 = 3;
      results.push({
        key: '/manual/3',
        label: (
          <Link to={{ pathname: `${urlCompanyCode}/manual`, search: `?type=${typeF5678}` }} target="_blank">
            {t('IDS_MANUAL_ADMIN')}
          </Link>
        ),
        onClick: () => {
          props.setCollapsed(true);
        },
      });
    }

    return results;
  };

  const menuManual: MenuProps['items'] = [
    {
      key: '/manual',

      // label: 'Manual',
      icon: (
        <Tooltip placement="right" title={t('IDS_MANUAL')} overlayClassName={props.collapsed ? '' : 'hidden'}>
          <GoQuestion size={'20px'} style={{ overflow: 'visible', verticalAlign: 'sub' }} />
        </Tooltip>
      ),
      label: t('IDS_MANUAL'),
      onTitleClick: (_e) => {
        handleClickMenu('/manual', '', '');
      },
      style: {
        textAlign: 'left',
      },
      children: getChildrenManual(),
      popupClassName: 'hidden__sub',

      // className: props.collapsed ? 'visible_icon' : links.includes('/manual') ? 'visible-arrow' : '',
      className: props.collapsed ? 'transition' : 'Untransition',
    },
  ];

  const menuNotification: MenuItem = {
    key: '/notification',
    icon: (
      <GoBellFill
        size={'20px'}
        style={{ overflow: 'visible', verticalAlign: 'sub' }}
        className={current.includes('/notification') ? 'custom-menu-selected' : ''}
        onClick={() => {
          navigate(`${urlCompanyCode}/notification`);
          handleClickMenu('/notification', '', '');
        }}
      />
    ),
    label: t('IDS_TITLE_NOTIFICATION'),
    onTitleClick: (_e: any) => {
      handleClickMenu('/notification', '', '');
    },
    onClick: () => {
      navigate(`${urlCompanyCode}/notification`);
    },
    style: {
      textAlign: 'left',
    },
    popupClassName: 'hidden__sub',

    className: current.includes('/notification') ? 'custom-menu' : '',
  };

  const menuFeedback: MenuItem = {
    key: '/feedback',
    icon: (
      <div style={{ display: 'inline-block' }}>
        <MdOutlineFeedback
          size={'20px'}
          style={{ overflow: 'visible', verticalAlign: 'sub' }}
          className={current.includes('/feedback') ? 'custom-menu-selected' : ''}
        />
      </div>
    ),
    label: t('IDS_REQUEST_REGARDING'),
    onTitleClick: (_e: any) => {
      handleClickMenu('/feedback', '', '');
    },
    onClick: () => {
      navigate(`${urlCompanyCode}/feedback`);
    },
    style: {
      textAlign: 'left',
    },
    popupClassName: 'hidden__sub',
    className: current.includes('/feedback') ? 'custom-menu' : '',
  };

  const menuReferenceReview: MenuItem = {
    key: '/reference-review',
    icon: (
      <GoCrossReference
        size={'20px'}
        style={{ overflow: 'visible', verticalAlign: 'sub' }}
        className={current.includes('/reference-review') ? 'custom-menu-selected' : ''}
      />
    ),
    label: t('IDS_LIST_REFERENCE_REVIEW'),
    onTitleClick: (_e: any) => {
      handleClickMenu('/reference-review', '', '');
    },
    onClick: () => {
      navigate(`${urlCompanyCode}/reference-review`);
    },
    style: {
      textAlign: 'left',
    },
    popupClassName: 'hidden__sub',
    className: current.includes('/reference-review') ? 'custom-menu' : '',
  };

  const items: MenuProps['items'] = [];
  items.push(menuNotification);
  if (hasRole(Roles.F1)) items.push(...menuRoleF1);
  if (hasRole(Roles.F2)) items.push(...menuRoleF2);
  if (hasRole(Roles.F3)) items.push(...menuRoleF3);
  if (hasRole(Roles.F4)) items.push(...menuRoleF4);
  if (hasRole(Roles.F5)) items.push(...menuRoleF5);
  if (hasRole(Roles.F7)) items.push(...menuRoleF7);

  if (hasRole(Roles.F6)) items.push(...menuRoleF6);

  // if (hasRole(Roles.F5) || hasRole(Roles.F6) || hasRole(Roles.F7)) items.push(...menuRoleF567);
  if (hasRole(Roles.F8)) items.push(...menuRoleF8);
  if (hasRole(Roles.F9)) items.push(...menuRoleF9);
  items.push(menuFeedback);
  items.push(menuReferenceReview);

  // const handleHoverChange = (open: boolean) => {
  //   props.handleOpenDraw();
  // };
  const rootSubmenuKeys = [
    '/role/f1',
    '/role/f2',
    '/role/f3',
    '/role/f4',
    '/role/f5',
    '/role/f6',
    '/role/f7',
    '/role/f8',
  ];

  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find((key: string) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <>
      {/* <Sider
        width={0}
        trigger={null}
        collapsible
        collapsed={true}
        style={{
          backgroundColor: 'white',
          position: props.collapsed ? `relative` : 'initial',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        <div className="btn-menu" style={{ textAlign: 'center' }}>
          <Button
            icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              props.handleOpenDraw();
            }}
            style={{
              fontSize: '16px',
              width: '100%',
              backgroundColor: 'transparent',
              color: 'white',
              borderColor: 'transparent',
              height: 45,
            }}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[current]}
          onClick={handleOnClick}
          className="ant-menu-custom"
          items={items}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ height: '100%' }}
          // triggerSubMenuAction={'click'}
          // subMenuOpenDelay={0}
        />
      </Sider>
      
      <Sider
        className={props.collapsed ? `hidden__sider` : 'hidden__sider_visible'}
        trigger={null}
        collapsible
        width={'235px'}
        collapsed={false}
        style={{
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <div className="btn-menu-children" style={{ textAlign: 'center' }}>
          <Button
            style={{
              background: 'transparent',
              border: 'unset',
              pointerEvents: 'none',
              height: 45,
            }}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[current]}
          onClick={handleOnClick}
          className="ant-menu-custom-children"
          items={handleChildrens(items)}
          style={{ height: '100%', width: '236px' }}
          subMenuOpenDelay={0}
        />
      </Sider> */}
      <Sider
        collapsed={props.collapsed}
        collapsible={true}
        style={{
          overflowY: !props.collapsed ? 'auto' : 'hidden',
          background: '#375054',
          transition: 'min-width 0.3s, max-width 0.3s ',
          zIndex: 100,
        }}
        width={245}
        trigger={null}
      >
        <Button
          icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            props.handleOpenDraw();
          }}
          style={{
            fontSize: '16px',
            width: '100%',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'unset',
            height: 45,
            boxShadow: 'unset',
            outline: 'unset !important',
          }}
          className="button-sider"
        />
        <Menu
          selectedKeys={[current]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          mode="inline"
          inlineCollapsed={true}
          items={items}
          forceSubMenuRender={false}
          style={{
            borderInlineEnd: 'unset',
            height: 400,
          }}
          className="heightMenu"

          // triggerSubMenuAction="hover"
        />
      </Sider>

      <PopupNewFeature />
    </>
  );
};

export default memo(MenuComponent, (pre, next) => {
  return pre.collapsed === next.collapsed;
});
{
  /* Style { overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' } */
}
