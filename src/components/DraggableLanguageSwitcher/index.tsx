import { useState, useRef, useEffect, useCallback } from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

/**
 * 可拖拽的语言切换组件
 */
const DraggableLanguageSwitcher = () => {
  const { i18n} = useTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - containerRect.width - 20,
        y: (window.innerHeight - containerRect.height) / 2 - 100
      });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === dragRef.current) {
      setIsDragging(true);
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        dragOffset.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    // 限制在窗口范围内
    const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        position: 'fixed',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '130px',
      }}
      onMouseDown={handleMouseDown}
    >
      <div ref={dragRef} className={styles.dragHandle}/>
      <Select
        style={{ width: 105 }}
        onChange={handleChange}
        value={i18n.language}
        className={styles.select}
        options={[
          { value: 'zh', label: '中文' },
          { value: 'en', label: 'English' },
          { value: 'ja', label: '日本語' },
        ]}
        suffixIcon={<GlobalOutlined />}
      />
    </div>
  );
};

export default DraggableLanguageSwitcher; 