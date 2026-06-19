import React from 'react';
import 'normalize.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import 'nprogress/nprogress.css';
import ScrollToTop from './common/ScrollToTop';

/* Disabled log,debug,info,warn,error for non-development environment. */
process.env.NODE_ENV !== 'development' &&
  (console.log = () => { 
    /* do nothing. */
  });
process.env.NODE_ENV !== 'development' &&
  (console.debug = () => {
    /* do nothing. */
  });
process.env.NODE_ENV !== 'development' &&
  (console.info = () => {
    /* do nothing. */
  });
process.env.NODE_ENV !== 'development' &&
  (console.warn = () => {
    /* do nothing. */
  });
process.env.NODE_ENV !== 'development' &&
  (console.error = () => {
    /* do nothing. */
  });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <ScrollToTop />
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
