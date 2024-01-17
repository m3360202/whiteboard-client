import React, {FC } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';



const Box = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} role="Widget" data-testid={`widget-${name}`}>
      {name}
    </div>
  );
};