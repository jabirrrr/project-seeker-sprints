
import { useState, useRef } from 'react';

interface DragItem {
  id: string;
  type: 'task';
  data: any;
}

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (item: DragItem) => {
    setIsDragging(true);
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDrop = (callback: (item: DragItem) => void) => {
    if (draggedItem) {
      callback(draggedItem);
    }
    handleDragEnd();
  };

  return {
    isDragging,
    draggedItem,
    dragRef,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};
