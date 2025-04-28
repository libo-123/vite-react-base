import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

/**
 * 404页面组件
 * 当用户访问不存在的路由时显示
 */
const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['not-found']}>
      <h1 className={styles['not-found-title']}>{t('pages.notFound.code')}</h1>
      <h2 className={styles['not-found-subtitle']}>{t('pages.notFound.title')}</h2>
      <p className={styles['not-found-description']}>
        {t('pages.notFound.description')}
      </p>
      <button 
        className={styles['not-found-button']}
        onClick={handleGoHome}
      >
        {t('pages.notFound.button')}
      </button>
    </div>
  );
};

export default NotFound;
