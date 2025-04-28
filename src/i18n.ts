import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件，这里不使用require，以面太抽象，难以理解
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';
import translationJA from './locales/ja/translation.json';

// 配置资源
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  }
};

// 初始化i18n实例
i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18n
  .init({
    resources,
    fallbackLng: 'zh', // 当检测不到用户语言或用户语言不在配置项中时，回退到中文
    interpolation: {
      escapeValue: false // react已经转义，不需要i18next再转义
    },
    detection: {
      // 检测顺序: localStorage, navigator, cookie
      order: ['localStorage', 'navigator', 'cookie'],
      // 缓存用户语言到localStorage
      caches: ['localStorage'],
      // 存储在localStorage中的key
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n; 