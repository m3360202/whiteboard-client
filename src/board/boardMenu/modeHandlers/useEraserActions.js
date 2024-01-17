//**React */
import { useCallback } from 'react';

//**Utils */
import { getEraserCursor } from './utils';

const useEraserActions = () => {

  const handleEraseBefore = useCallback(() => {

    if (!canvas) return;

    // 1.设置选择框为false
    canvas.selection = false;

    // 3.关闭画笔模式

    // 4.设置鼠标样式为橡皮擦
    canvas.hoverCursor = getEraserCursor();

    canvas.defaultCursor = getEraserCursor();

    canvas.isDrawingMode = false;

    // 4.设置鼠标样式为橡皮擦
    canvas.hoverCursor = getEraserCursor();

    canvas.defaultCursor = getEraserCursor();
    let objs = canvas.getObjects();
    if(objs && objs.length > 0){
      objs.forEach((obj) => {
        if(obj.obj_type !== 'WBPath'){
          obj.selectable = false;
          if(obj.obj_type === 'WBArrow'){
            obj.hasControls = false;
          }
        }else{
          obj.hasControls = false;
          obj.hasBorders = false;
        }
      })

    }
    canvas.requestRenderAll();

  }, [canvas]);

  const handleEraseAfter = useCallback(() => {

    if (!canvas) return;
    let objs = canvas.getObjects();
    if(objs && objs.length > 0){
      objs.forEach((obj) => {
        if(obj.obj_type !== 'WBPath'){
          obj.selectable = true;
          if(obj.obj_type === 'WBArrow'){
            obj.hasControls = false;
          }
        }else{
          obj.hasControls = true;
          obj.hasBorders = true;
        }
      })

    }
    canvas.requestRenderAll();
  }, [canvas]);

  const handleClearPath = useCallback( (e) => {

      if (!(e.target && e.target.obj_type === 'WBPath')){
        canvas.discardActiveObject();
        return;
      } 

      canvas.removeWidget(e.target);

    },[canvas]
  );

  return {
    handleClearPath,
    handleEraseBefore,
    handleEraseAfter
  };
};

export default useEraserActions;
