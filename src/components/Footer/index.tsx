import { useTranslation } from 'react-i18next';
import styles from './footer.module.scss';

/**
 * Footer 组件
 * @description 网站底部版权信息组件
 */
const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className={styles.footer}>
      <p>{t('common.copyright')}</p>
    </footer>
  );
};

export default Footer; 