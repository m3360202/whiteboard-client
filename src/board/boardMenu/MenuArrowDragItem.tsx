import React, { ReactNode } from 'react';
import { FC } from 'react';
import { useDrag } from 'react-dnd';
interface MenuArrowDragItemProps {
  onSelected: Function;
  type: string;
  children: ReactNode;
}

const MenuArrowDragItem: FC<MenuArrowDragItemProps> = ({onSelected, type, children}) =>  {
  const [, drag] = useDrag(() => ({
    item: { type },
    end: () =>  onSelected(type),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div style={{height: '48px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} ref={drag}>
      { children }
    </div>
  );
}

export default MenuArrowDragItem;
