import { createRoot } from 'react-dom/client';
import './reset.scss';
import App from './App.tsx';
// 解决Antd兼容React19问题
import '@ant-design/v5-patch-for-react-19';
// 导入i18n配置
import './i18n';

createRoot(document.getElementById('root')!).render(<App />);

console.log('当前环境', import.meta.env.MODE)
