import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MessageSing } from '@/request/MessageSingleton';



/**
 * 基础响应接口
 * @template T 数据类型
 */
interface IBaseResponse<T = any> {
    readonly code: number;
    readonly message: string;
    data: T;
}



const handleErrorMessage = (error: Error | string): void => {
    const message = typeof error === 'string' ? error : error.message || '请求失败';
    MessageSing.error(message);
};

/**
 * 创建请求实例
 * @returns 
 */

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 8000,
    timeoutErrorMessage: '请求超时，请稍后再试',
    withCredentials: true,
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('_&token');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error: AxiosError) => {
        MessageSing.error(error.message || '请求发送失败');
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const data = response.data || {};

        // 处理文件下载
        if (response.config.responseType === 'blob') {
            return response;
        }

        // 根据状态码处理响应，status异常状态统一走失败逻辑
        switch (data.code) {
            case 200:
                return data;
            case 401:
                localStorage.removeItem('_&token');
                MessageSing.warning('登录已失效，请重新登录');
                location.href = '/login?callback=' + encodeURIComponent(location.href);
                return;
            default:
                // 统一处理非成功状态码的响应，由后端返回
                MessageSing.error(data.message || '请求失败');
                return Promise.reject(data);
        }
    },
    error => {
        if (axios.isCancel(error)) {
            return Promise.reject('请求已取消');
        }

        if (error.message?.includes('timeout')) {
            handleErrorMessage('请求超时，请稍后再试');
        } else if (error.message === 'Network Error') {
            handleErrorMessage('网络异常，请检查您的网络连接');
        } else {
            handleErrorMessage(error);
        }

        return Promise.reject(error.message);
    }
);

// 封装HTTP请求方法
const request = {
    // 自定义请求实例
    instance,

    // 封装请求方法。说明：为了约束返回统一类型IBaseResponse，故统一封装
    get: <T = any, R = any>(url: string, params?: T, config?: AxiosRequestConfig): Promise<IBaseResponse<R>> => {
        return instance.get(url, { params, ...config });
    },

    post: <T = any, R = any>(url: string, data?: T, config?: AxiosRequestConfig): Promise<IBaseResponse<R>> => {
        return instance.post(url, data, config);
    },

    put: <T = any, R = any>(url: string, data?: T, config?: AxiosRequestConfig): Promise<IBaseResponse<R>> => {
        return instance.put(url, data, config);
    },

    delete: <T = any, R = any>(url: string, params?: T, config?: AxiosRequestConfig): Promise<IBaseResponse<R>> => {
        return instance.delete(url, { params, ...config });
    },

    // 下载文件
    downloadFile: (url: string, data: any, fileName = 'fileName.jsx') => {
        return instance({
            url,
            data,
            method: 'post',
            responseType: 'blob'
        }).then(response => {
            const blob = new Blob([response.data], {
                type: response.data.type
            });
            const name = (response.headers['file-name'] as string) || decodeURIComponent(fileName);
            const link = document.createElement('a');
            link.download = decodeURIComponent(name);
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        });
    }
};

export default request;