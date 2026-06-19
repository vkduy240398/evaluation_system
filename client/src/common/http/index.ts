import { AxiosRequestConfig } from 'axios';
import api from './instance';
import { handlingError } from './HandlingError';

// Hàm để lấy headers
const getHeaders = (config?: AxiosRequestConfig<any>) => {
  const path = window.location.pathname; // Lấy đường dẫn từ URL
  const parts = path.split('/'); // Tách đường dẫn thành các phần
  const companyCode = parts?.length > 2 ? parts[2] : '';

  const headers = {
    ...config?.headers,
    'X-Company-Group-Code': parts?.length > 1 && parts[1] === 'company' ? companyCode : '', // Thêm header mới
  };

  return {
    ...config,
    headers,
  };
};

class HttpAxios {
  async Get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    try {
      return await api.get(url, getHeaders(config)).then(
        (res) => {
          if (res.status === 203) {
            return api.get('/api/v1/auth/refresh-token', getHeaders(config)).then(() => {
              return api.request(res.config);
            });
          } else {
            return res;
          }
        },
        (error) => handlingError(error),
      );
    } catch (error: any) {
      return handlingError(error);
    }
  }
  async Post(url: string, data?: any | undefined, config?: AxiosRequestConfig<any> | undefined) {
    try {
      return await api.post(url, data, getHeaders(config)).then(
        (res) => {
          if (res.status === 203) {
            return api.get('/api/v1/auth/refresh-token', getHeaders(config)).then(() => {
              return api.request(res.config);
            });
          } else {
            return res;
          }
        },
        (error) => handlingError(error),
      );
    } catch (error: any) {
      return handlingError(error);
    }
  }

  async Put(url: string, data?: any | undefined, config?: AxiosRequestConfig<any> | undefined) {
    try {
      return await api.put(url, data, getHeaders(config)).then(
        (res) => {
          if (res.status === 203) {
            return api.get('/api/v1/auth/refresh-token', getHeaders(config)).then(() => {
              return api.request(res.config);
            });
          } else {
            return res;
          }
        },
        (error) => handlingError(error),
      );
    } catch (error: any) {
      return handlingError(error);
    }
  }

  async Patch(url: string, data?: any | undefined, config?: AxiosRequestConfig<any> | undefined) {
    try {
      return await api.patch(url, data, getHeaders(config)).then(
        (res) => {
          if (res.status === 203) {
            return api.get('/api/v1/auth/refresh-token', getHeaders(config)).then(() => {
              return api.request(res.config);
            });
          } else {
            return res;
          }
        },
        (error) => handlingError(error),
      );
    } catch (error: any) {
      return handlingError(error);
    }
  }

  async Delete(url: string, config?: AxiosRequestConfig<any> | undefined) {
    try {
      return await api.delete(url, getHeaders(config)).then(
        (res) => {
          if (res.status === 203) {
            return api.get('/api/v1/auth/refresh-token', getHeaders(config)).then(() => {
              return api.request(res.config);
            });
          } else {
            return res;
          }
        },
        (error) => handlingError(error),
      );
    } catch (error: any) {
      return handlingError(error);
    }
  }
}
const httpAxios = new HttpAxios();
export default httpAxios;
