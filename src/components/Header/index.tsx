import { NavLink } from "react-router-dom";
import { theme } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from "./styles.module.scss";

const Header = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  
  return (
    <header className={styles.header} style={{ background: `linear-gradient(90deg, ${token.colorPrimary}, ${token.colorPrimaryHover})` }}>
      <div className={styles.logo}>
        <h1>{t('header.logo')}</h1>
      </div>
      <nav className={styles.nav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          {t('header.home')}
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          {t('header.about')}
        </NavLink>
      </nav>
    </header>
  );
};

export default Header; 