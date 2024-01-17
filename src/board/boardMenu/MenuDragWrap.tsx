import React from 'react';
import { useDrag } from 'react-dnd';
import { styled } from '@mui/material/styles';

export default props => {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { noteType: 'sticknote', type: 'widget' },
    end: () => {
      props.onDragEnd();
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }));

  return (
    <MenuDragWrap draggable ref={drag} role="widget">
      {props.children}
    </MenuDragWrap>
  );
};

const MenuDragWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;
