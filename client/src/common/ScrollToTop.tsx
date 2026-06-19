import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // ** Hook
  const { pathname } = useLocation();

  // ** Effect
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }, 300);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
