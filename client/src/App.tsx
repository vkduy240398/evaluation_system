/* eslint-disable @typescript-eslint/naming-convention */
import './page/dashboard/components/Dashboard.css';
import './common/css/Typography.css';
import './common/css/Input.css';
import './common/css/FormItem.css';
import './common/css/Button.css';
import './common/css/Table.css';
import './common/css/Combobox.css';
import './common/css/RadioButton.css';
import './common/css/Card.css';
import './common/css/RangePicker.css';
import './common/css/Pagination.css';
import './common/css/Description.css';
import './common/css/Checkbox.css';
import './common/css/Evaluation.css';
import './common/css/Quill.css';
import { routers } from './routes/routers';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { ConfigProvider, Layout } from 'antd';
import DashboardFooter from './page/dashboard/DashboardFooter';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import DashboardHeader from './page/dashboard/DashboardHeader';
import { useEffect, useState, createElement } from 'react';

// ** Antd Imports
import jaJP from 'antd/locale/ja_JP';

// ** Loader Import
import NProgress from 'nprogress';

// ** Config Imports
import './config/i18n';
import MenuComponent from './@core/layouts/MenuComponent';
import GlobalStyled from './@core/styled/global';
import ProgressBarExcel from './page/progress-bar/progressBarExcel';

const App = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [notification, setNotification] = useState<undefined | string>(undefined);

  // ** Hook
  const location = useLocation();

  // ** Effect
  useEffect(() => {
    if (
      window.location.pathname.includes(`/home`) ||
      window.location.pathname.includes(`/404page`) ||
      window.location.pathname.includes(`/login`)
    ) {
      setCollapsed(true);
    }
    NProgress.start();
    NProgress.done();
  }, [location.pathname]);

  const handleOpenDraw = () => {
    setCollapsed(!collapsed);
  };
  const Elements = () => {
    return createElement('div', {
      className: `${!collapsed ? '' : 'hidden'}overlayOpenMenu`,
      onClick: () => {
        setCollapsed(!collapsed);
      },
    });
  };

  return (
    <Provider store={store}>
      <ConfigProvider locale={jaJP}>
        <AuthProvider>
          <GlobalStyled>
            <Layout
              className="root-layout"
              style={{
                position: 'relative',
              }}
            >
              <Layout hasSider style={{ overflowY: 'hidden' }} id="layout-main">
                {!window.location.pathname.includes(`/home`) &&
                  !window.location.pathname.includes(`/404page`) &&
                  !window.location.pathname.includes(`/login`) && (
                    <MenuComponent
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                      handleOpenDraw={handleOpenDraw}
                      notification={notification}
                    />
                  )}
                <Layout>
                  {!window.location.pathname.includes(`/login`) && window.location.pathname !== '/' && (
                    <DashboardHeader notification={notification} setNotification={setNotification} />
                  )}{' '}
                  <Content
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: 15,
                      paddingBottom: 10,
                      position: 'relative',
                    }}
                  >
                    <Routes>
                      {routers.map((router, _: number) => (
                        <Route key={router.path} path={router.path} element={router.component}>
                          {router.routers &&
                            router.routers.map((item, key) => (
                              <Route key={item.path + key} path={item.path} element={item.component} />
                            ))}
                        </Route>
                      ))}
                    </Routes>
                  </Content>
                  <ProgressBarExcel/>
                  <DashboardFooter />
                  {<Elements />}
                </Layout>
              </Layout>
            </Layout>
          </GlobalStyled>
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
