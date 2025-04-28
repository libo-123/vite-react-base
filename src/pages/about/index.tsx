import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const About = () => {
  const { t } = useTranslation();
  
  // 获取发展历程数据
  const historyItems = t('pages.about.historyItems', { returnObjects: true }) as Array<{year: string, event: string}>;
  
  return (
    <div className={styles["about-container"]}>
      <div className={styles["page-header"]}>
        <h1>{t('pages.about.title')}</h1>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t('pages.about.introduction')}</h2>
        <div className={styles["intro-section"]}>
          <div className={styles["intro-content"]}>
            <div className={styles["section-content"]}>
              <p>{t('pages.about.introText')}</p>
            </div>
          </div>
          <div className={styles["intro-image"]}>
            <img 
              src="https://img.xmcdn.com/storages/5a5b-audiofreehighqps/18/FF/CKwRIJELPuaSACAAAAKpwPuf.png" 
              alt="喜马拉雅" 
            />
          </div>
        </div>
      </div>
      
      <div className={styles["vision-mission"]}>
        <div className={styles.card}>
          <h3 className={styles["card-title"]}>{t('pages.about.vision')}</h3>
          <div className={styles["card-content"]}>
            <p>{t('pages.about.visionText')}</p>
          </div>
        </div>
        <div className={styles.card}>
          <h3 className={styles["card-title"]}>{t('pages.about.mission')}</h3>
          <div className={styles["card-content"]}>
            <p>{t('pages.about.missionText')}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t('pages.about.history')}</h2>
        <div className={styles["history-timeline"]}>
          {historyItems.map((item, index) => (
            <div key={index} className={styles["timeline-item"]}>
              <div className={styles.year}>{item.year}</div>
              <div className={styles.event}>{item.event}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t('pages.about.team')}</h2>
        <div className={styles["section-content"]}>
          <p>{t('pages.about.teamText')}</p>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>{t('pages.about.contact')}</h2>
        <div className={styles["contact-section"]}>
          <div className={styles["contact-grid"]}>
            <div className={styles["contact-item"]}>
              <div className={styles["contact-icon"]}>📍</div>
              <div className={styles["contact-title"]}>地址</div>
              <div className={styles["contact-text"]}>{t('pages.about.address')}</div>
            </div>
            <div className={styles["contact-item"]}>
              <div className={styles["contact-icon"]}>✉️</div>
              <div className={styles["contact-title"]}>邮箱</div>
              <div className={styles["contact-text"]}>{t('pages.about.email')}</div>
            </div>
            <div className={styles["contact-item"]}>
              <div className={styles["contact-icon"]}>📞</div>
              <div className={styles["contact-title"]}>电话</div>
              <div className={styles["contact-text"]}>{t('pages.about.phone')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About