import { useUserStore } from "@/store"
import { useTranslation } from "react-i18next"
import styles from "./index.module.scss"



// 导入react logo
import ReactLogo from "@/assets/images/react.svg?react";
// 导入图片演示组件
import ImageDemo from "@/components/ImageDemo"

const Home = () => {
  const { t } = useTranslation()
  const info = useUserStore().getUserInfo()

  // 模拟一些统计数据
  const statsData = [
    { title: t('pages.home.stats.projects'), value: '12' },
    { title: t('pages.home.stats.tasks'), value: '36' },
    { title: t('pages.home.stats.completed'), value: '28' },
    { title: t('pages.home.stats.performance'), value: '92%' }
  ]

  return (
    <div className={styles["home-container"]}>
      <div className={styles.header}>
        <h2>{t('pages.home.title')}</h2>
        <p className={styles.description}>{t('pages.home.description')}</p>
      </div>

      {Object.keys(info).length > 0 ? (
        <>
          <div className={styles["user-card"]}>
            <div className={styles["avatar-section"]}>
              <div className={styles.avatar}>
                {info.avatar ? (
                  <img src={info.avatar} alt={info.name} />
                ) : (
                  <span>{info.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className={styles["user-basic"]}>
                <h3>{info.name}</h3>
                <span className={styles.role}>{info.role}</span>
              </div>
            </div>

            <div className={styles["info-grid"]}>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.id')}：</span>
                <span className={styles.value}>{info.id}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.email')}：</span>
                <span className={styles.value}>{info.email}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.phone')}：</span>
                <span className={styles.value}>{info.phone}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.department')}：</span>
                <span className={styles.value}>{info.department}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.position')}：</span>
                <span className={styles.value}>{info.position}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.createTime')}：</span>
                <span className={styles.value}>{info.createTime}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.lastLoginTime')}：</span>
                <span className={styles.value}>{info.lastLoginTime}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles.label}>{t('pages.home.permissions')}：</span>
                <span className={styles.value}>{info.permissions?.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className={styles["stats-section"]}>
            <div className={styles["stats-grid"]}>
              {statsData.map((stat, index) => (
                <div key={index} className={styles["stat-card"]}>
                  <div className={styles["stat-title"]}>{stat.title}</div>
                  <div className={styles["stat-value"]}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles["empty-state"]}>
          <div className={styles["empty-icon"]}>📋</div>
          <p className={styles["empty-text"]}>{t('pages.home.noData')}</p>
        </div>
      )}

      <div className={styles.logo}>
        <div className={styles.logo_top}>
          <img src="@/assets/images/desk_top.png" alt="" />
        </div>
        <div className={styles.logo_bottom}>
          <img src="@/assets/images/desk_bottom.png" alt="" />
        </div>
        <div className={styles.logo_react}>
          <ReactLogo />
          <ImageDemo />
        </div>
      </div>
    </div>
  )
}

export default Home