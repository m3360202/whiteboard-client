import { useDrop } from 'react-dnd';
import React from 'react';

const style = {
  height: window.innerHeight,
  width: window.innerWidth,
  position: 'fixed',
  left: '0px',
  top: 0,
  opacity: 0,
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  zIndex: -100,
  cursor: 'drop',
};

export const MenuDragDropContainer = () => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      return { name: 'Widget' };
    },
  }));

  const isActive = canDrop && isOver;
  const backgroundColor = '#222';
  if (isActive) {
    canvas.upperCanvasEl.parentElement.style.opacity = 1;
  } else if (canDrop) {
    canvas.upperCanvasEl.parentElement.style.opacity = 0.8;
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  );
};
