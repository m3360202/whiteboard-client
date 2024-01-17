import React from 'react';
import { styled } from '@mui/material/styles';
import { useDrag } from 'react-dnd';



export default function MenuImageDragItem({
  objType,
  isSticker,
  previewUrl,
  downloadUrl,
  width,
  handleClose,
  handleShowClose,
  margin,
}) {


  const handlePopoverClose = () => {
    handleShowClose();
  };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      item: { objType,isSticker, type: 'widget' },
      end: (item, monitor) => {
        
        canvas.createWidgetatCurrentLocationByType(item.objType, {
          previewUrl,
          downloadUrl,
        });
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [previewUrl, downloadUrl],
  );

  const onClickItem = (e) => {
    canvas.createWidgetatCurrentLocationByType(objType, {
      useCenterOfScreen: true,
      previewUrl,
      downloadUrl,
      isSticker
    });
    handlePopoverClose();
    handleClose();
  };

  return (
    <img
      draggable="true"
      onClick={onClickItem}
      ref={drag}
      role="widget"
      src={previewUrl}
      style={{ width, margin,  cursor: 'pointer',}}
    />
  );
}
