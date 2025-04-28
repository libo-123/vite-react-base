import { useState, useRef } from 'react';
import { ColorPicker } from 'antd';
import styles from './index.module.scss';
import { useDraggable } from '../../hooks/useDraggable';

interface IDraggableColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

/**
 * 可拖拽的颜色选择器组件
 * @param defaultColor - 默认颜色值
 * @param onChange - 颜色变化回调函数
 */
const DraggableColorPicker: React.FC<IDraggableColorPickerProps> = ({ defaultColor = '#ff553c', onChange }) => {
  const [color, setColor] = useState(defaultColor);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  
  // 使用自定义hook处理拖拽逻辑
  const { position, isDragging, handleMouseDown } = useDraggable<HTMLDivElement, HTMLDivElement>(
    containerRef, 
    dragRef, 
    {
      width: '130px'
    }
  );

  const handleColorChange = (color: any) => {
    const hexColor = color.toHexString();
    setColor(hexColor);
    onChange?.(hexColor);
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
      <div ref={dragRef} className={styles.dragHandle} />
      <ColorPicker showText value={color} onChange={handleColorChange} />
    </div>
  );
};

export default DraggableColorPicker; 