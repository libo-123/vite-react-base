import { useState, useRef, useEffect, useCallback, RefObject } from 'react';

interface IPosition {
  x: number;
  y: number;
}

interface IDraggableOptions {
  /** 初始位置 */
  initialPosition?: IPosition;
  /** 容器宽度 */
  width?: number | string;
  /** 拖拽边界限制 */
  boundaryCheck?: boolean;
}

/**
 * 可拖拽元素hook
 * @param containerRef - 容器元素的引用
 * @param dragHandleRef - 拖拽把手的引用
 * @param options - 配置选项
 * @returns 拖拽相关的状态和处理函数
 */
export const useDraggable = <T extends HTMLElement, D extends HTMLElement>(
  containerRef: RefObject<T | null>,
  dragHandleRef: RefObject<D | null>,
  options: IDraggableOptions = {}
) => {
  const { 
    initialPosition,
    width = 'auto',
    boundaryCheck = true
  } = options;
  
  const [position, setPosition] = useState<IPosition>(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<IPosition>({ x: 0, y: 0 });

  // 初始化位置
  useEffect(() => {
    if (containerRef.current && !initialPosition) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - containerRect.width - 20,
        y: (window.innerHeight - containerRect.height) / 2
      });
    }
  }, [containerRef, initialPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 确保只有点击拖拽把手才能拖动
    if (dragHandleRef.current && dragHandleRef.current.contains(e.target as Node)) {
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
  }, [containerRef, dragHandleRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    if (boundaryCheck) {
      // 限制在窗口范围内
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    } else {
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, containerRef, boundaryCheck]);

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

  return {
    position,
    isDragging,
    width,
    handleMouseDown,
    // 提供一个手动设置位置的方法
    setPosition
  };
}; 