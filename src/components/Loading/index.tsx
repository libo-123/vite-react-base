/**
 * 懒加载页面的加载中组件
 */
import { Spin } from 'antd';
import styles from './index.module.scss';

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p className={styles.loadingText}>页面加载中...</p>
        </div>
    );
};

export default Loading; 