/**
 * DOM相关操作工具
 */
export const domUtils = {
  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   * @returns 成功返回true，失败返回false
   */
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 回退方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  },

  /**
   * 获取元素相对于窗口的位置
   * @param el 元素
   * @returns 位置信息
   */
  getElementPosition: (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  },

  /**
   * 检测元素是否在视口中可见
   * @param el 元素
   * @param partiallyVisible 是否部分可见即可
   * @returns 是否可见
   */
  isElementInViewport: (el: HTMLElement, partiallyVisible = false): boolean => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = partiallyVisible
      ? rect.top <= windowHeight && rect.bottom >= 0
      : rect.top >= 0 && rect.bottom <= windowHeight;
      
    const horInView = partiallyVisible
      ? rect.left <= windowWidth && rect.right >= 0
      : rect.left >= 0 && rect.right <= windowWidth;
      
    return vertInView && horInView;
  }
};

/**
 * 校验相关工具
 */
export const validators = {
  /**
   * 是否为有效的中国大陆手机号
   * @param phone 手机号
   * @returns 是否有效
   */
  isValidChinesePhone: (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  /**
   * 是否为有效的邮箱地址
   * @param email 邮箱地址
   * @returns 是否有效
   */
  isValidEmail: (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },

  /**
   * 是否为有效的身份证号（中国大陆）
   * @param idCard 身份证号
   * @returns 是否有效
   */
  isValidChineseIdCard: (idCard: string): boolean => {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
  },

  /**
   * 是否为有效URL
   * @param url URL字符串
   * @returns 是否有效
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
};

/**
 * 设备和环境检测工具
 */
export const deviceUtils = {
  /**
   * 获取浏览器信息
   * @returns 浏览器信息对象
   */
  getBrowser: () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    // 浏览器检测
    if (ua.indexOf('Edge') > -1) {
      browser = 'Microsoft Edge';
      version = ua.match(/Edge\/([\d.]+)/)?.[1] || version;
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Mozilla Firefox';
      version = ua.match(/Firefox\/([\d.]+)/)?.[1] || version;
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Google Chrome';
      version = ua.match(/Chrome\/([\d.]+)/)?.[1] || version;
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Apple Safari';
      version = ua.match(/Version\/([\d.]+)/)?.[1] || version;
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
      version = ua.match(/(?:MSIE |rv:)([\d.]+)/)?.[1] || version;
    }
    
    return { browser, version };
  },

  /**
   * 检测是否为移动设备
   * @returns 是否为移动设备
   */
  isMobileDevice: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * 检测是否为iOS设备
   * @returns 是否为iOS设备
   */
  isIOS: (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  },

  /**
   * 检测是否为Android设备
   * @returns 是否为Android设备
   */
  isAndroid: (): boolean => {
    return /Android/.test(navigator.userAgent);
  },

  /**
   * 获取操作系统信息
   * @returns 操作系统信息
   */
  getOS: () => {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    let version = '';
    
    if (/Windows/.test(ua)) {
      os = 'Windows';
      if (/Windows NT 10.0/.test(ua)) version = '10';
      else if (/Windows NT 6.3/.test(ua)) version = '8.1';
      else if (/Windows NT 6.2/.test(ua)) version = '8';
      else if (/Windows NT 6.1/.test(ua)) version = '7';
    } else if (/Macintosh|Mac OS X/.test(ua)) {
      os = 'macOS';
      version = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (/Android/.test(ua)) {
      os = 'Android';
      version = ua.match(/Android ([0-9.]+)/)?.[1] || '';
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      os = 'iOS';
      version = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (/Linux/.test(ua)) {
      os = 'Linux';
    }
    
    return { os, version };
  }
};

/**
 * 加密和安全相关工具
 */
export const securityUtils = {
  /**
   * 简单的数据脱敏处理
   * @param value 要脱敏的值
   * @param startVisible 开头可见字符数
   * @param endVisible 结尾可见字符数
   * @returns 脱敏后的字符串
   */
  maskString: (value: string, startVisible = 3, endVisible = 4): string => {
    if (!value) return '';
    if (value.length <= startVisible + endVisible) return value;
    
    const start = value.substring(0, startVisible);
    const end = value.substring(value.length - endVisible);
    const mask = '*'.repeat(value.length - startVisible - endVisible);
    
    return `${start}${mask}${end}`;
  }
};

/**
 * 导出所有工具函数
 */
export default {
  domUtils,
  validators,
  deviceUtils,
  securityUtils
};