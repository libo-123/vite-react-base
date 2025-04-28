import React, { useState } from 'react';
import styles from './index.module.scss';
// 导入图片资源
import logo_top from "@/assets/images/desk_top.png"
import logo_bottom from "@/assets/images/test.jpeg"
import gifTest from "@/assets/images/gif_test.gif"


import { CSSProperties } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  className?: string;
}

/**
 * 优化的图片组件，优先使用avif格式，自动回退到原始格式 (webp格式类似)
 */
const OptimizedImage = ({ src, alt, width, height, style, className }: OptimizedImageProps) => {
  const [avifError, setAvifError] = useState(false);
  // 处理图片路径
  // 如果src已经是字符串URL(导入的图片资源会是URL)，则直接使用
  // 如果是导入的模块，则获取其默认导出
  const imgSrc = typeof src === 'string' ? src : (src as any).default || src;

  // 构建avif图片路径 (viteImagemin插件生成的avif图片路径是原路径加.avif后缀)
  const avifSrc = `${imgSrc}.avif`;

  // 处理图片样式
  const imgStyle: CSSProperties = {
    width: width,
    height: height,
    ...style
  };

  // 开发环境中可能没有avif图片，直接返回原图片
  if (import.meta.env.DEV || avifError) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        style={imgStyle}
        className={className}
      />
    );
  }

  return (
    <picture>
      <source 
        srcSet={avifSrc} 
        type="image/avif" 
        onError={() => setAvifError(true)} 
      />
      <img
        src={imgSrc}
        alt={alt}
        style={imgStyle}
        className={className}
      />
    </picture>
  );
};
/**
 * OptimizedImage组件的示例展示
 */
const ImageDemo: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>图片优化组件示例</h2>

      <div className={styles.imageWrapper}>
        <OptimizedImage
          src={logo_bottom}
          alt="底部Logo"
          width={100}
          height={100}
        />
        <OptimizedImage
          src={logo_top}
          alt="顶部Logo"
          width={100}
          height={100}
        />
        <OptimizedImage
          src={gifTest}
          alt="GIF测试"
          width={100}
          height={100}
        />
      </div>

      <div className={styles.description}>
        <p>OptimizedImage组件会优先尝试加载AVIF格式的图片，如果浏览器不支持则自动回退到原格式</p>
        <p>这可以显著减小图片体积，提高页面加载速度</p>
      </div>
    </div>
  );
};

export default ImageDemo; 