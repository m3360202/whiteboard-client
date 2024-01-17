
import * as fabric  from '@boardxus/x-canvas';

//Redux Store
import store from '../../../store';

//Services
import { WidgetService } from '../../../services/index';

//Functions
import { calcControlPointOfObject,calcControlEndPointOfObject,calcControlPointOfObjectInActiveSelection } from '../../boardMenu/events/index';
import _ from 'underscore';


fabric.Canvas.prototype.drawArrowLine = function (x1, y1, x2, y2) {

  // Define 'this' to 'self' to access the Canvas instance inside callbacks
  const self = this;

  // Retrieve arrow line properties like color and size from the store
  const arrowStroke = store.getState().widgets.arrowStroke;

  const arrowStrokeWidth = store.getState().widgets.arrowSize;

  // Retrieve the current shape of the connector 
  const curShp = store.getState().widgets.connectorShape;

  // Retrieve the direction of the arrow line's tips
  let tips = store.getState().widgets.tips;
  
  // If the drawing mode is 'line', set tips as 'none'
  if (canvas.drawArrowOrLine === 'line') {
    tips = 'none';
  }

  // If connectorArrow does not exist in the current Canvas instance
  if (!self.connectorArrow) {

    // Create a new arrow object with the coordinates and properties and assign it to connectorArrow
    self.connectorArrow = new fabric.Arrow([x1, y1, x2, y2], {
      angle: 0,
      fill: null,
      scaleX: 1,
      scaleY: 1,
      tips,
      locked: false,
      lockMovementX: false,
      lockMovementY: false,
      stroke: arrowStroke,
      connectorShape: curShp,
      strokeWidth: arrowStrokeWidth,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      obj_type: 'WBArrow',
      userId: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100,
    });

    // Add the new arrow object to the Canvas and render it
    self.add(self.connectorArrow).requestRenderAll();

  } else {

    // If connectorArrow already exist, modify the coordinates with new ones
    self.connectorArrow.set({
      x1,
      y1,
      x2,
      y2,
    });

    // Request the canvas to render
    self.requestRenderAll();

  }
  
};

fabric.Canvas.prototype.onObjectModifiedUpdateArrowsSave = async function (object) {
  const self = this;

  // Call onObjectModifyUpdateArrows to update all arrows linked to the current object
  await self.onObjectModifyUpdateArrows(object);

  // If the object has lines 
  if (object && object.lines) {

    // Iterate over each line of the object
    for (let i = 0; i < object.lines.length; i++) {

      // Get the current line
      const line = object.lines[i];

      // Check if this line exists in the canvas objects array
      const lineWidget = _.where(self._objects, {

        _id: line._id,

      })[0];

      // If the line widget does not exist, break the loop
      if (!lineWidget) break;

    }

  }
  
};

fabric.Canvas.prototype.onrefreshArrowafterScale = function (arrowId) {

  const widget = WidgetService.getInstance().getWidgetFromWidgetList(arrowId);
  const rwidget = canvas.findById(arrowId);
  if(!rwidget) return;
  let sx = 1;
  let sy = 1;
  if (widget.scaleX) sx = widget.scaleX;
  if (widget.scaleY) sy = widget.scaleY;

  const lObjwidth = (widget.x1 - widget.x2) * sx;
  const lObjheight = (widget.y1 - widget.y2) * sy;

  rwidget.x1 = widget.left + 0.5 * lObjwidth;
  rwidget.y1 = widget.top + 0.5 * lObjheight;
  rwidget.x2 = widget.left - 0.5 * lObjwidth;
  rwidget.y2 = widget.top - 0.5 * lObjheight;
  rwidget.scaleX = 1;
  rwidget.scaleY = 1;
  rwidget.width = Math.abs(lObjwidth);
  rwidget.height = Math.abs(lObjheight);
  rwidget.left = widget.left;
  rwidget.top = widget.top;
  rwidget.zIndex = Date.now() * 100;
  WidgetService.getInstance().updateWidgetFromLocalWidget(arrowId,{
    x1: rwidget.x1,
    y1: rwidget.y1,
    x2: rwidget.x2,
    y2: rwidget.y2,
    scaleX: 1,
    scaleY: 1,
    width: rwidget.width,
    height: rwidget.height,
    left: rwidget.left,
    top: rwidget.top,
  }); 
  return rwidget;
};

fabric.Canvas.prototype.resetConnector = function(object){
  const connector = canvas.findById(object._id);
  if (!connector) return;
  const startObj = canvas.findById(connector.connectorStart._id);
  const endObj = canvas.findById(connector.connectorEnd._id);
  if(startObj){
    canvas.onObjectModifiedUpdateArrowsSave(startObj);
  }
  if(endObj){
    canvas.onObjectModifiedUpdateArrowsSave(endObj);
  }
  canvas.requestRenderAll();
}

fabric.Canvas.prototype.onObjectModifyUpdateArrows = function (object) {

  const self = this;

  if (object.group) {

    if (object && object.lines && object.lines.length > 0) {

      for (let i = 0; i < object.lines.length; i++) {

        const line = object.lines[i];

        let lineWidget;

        let scale = 1.0;

        const lineObj = WidgetService.getInstance().getWidgetFromWidgetList(line._id);
    
        if (Math.abs(scale - 1) > 0.01) {

          lineWidget = self.onrefreshArrowafterScale(line._id);

        } else {

          lineWidget = self.findById(line._id);

        }
        if (!lineWidget){
          continue;
        }
        if (lineObj){
          scale = lineObj.scaleX; 

          if (lineWidget.group) {

            if (lineWidget.connectorStart) {

              const startObj = canvas.findById(lineWidget?.connectorStart?._id);

              const endObj = canvas.findById(lineWidget?.connectorEnd?._id);

              if (startObj) {

                if (startObj.group) {

                  const sPoint = startObj.convertRCoordToACoord(
                    lineWidget.connectorStart.rx,
                    lineWidget.connectorStart.ry,
                  );

                  const finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);

                  lineWidget.set({
                    x1: finalPoint.x,
                    y1: finalPoint.y,
                  });

                } else {

                  const sPoint = startObj.convertRCoordToACoord(
                    lineWidget.connectorStart.rx,
                    lineWidget.connectorStart.ry,
                  );

                  const finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);

                  lineWidget.set({
                    x1: finalPoint.x - object.group.left,
                    y1: finalPoint.y - object.group.top,
                  });

                }

              }
              if (endObj) {

                if (endObj.group) {

                  const ePoint = endObj.convertRCoordToACoord(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry,
                  );

                  const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);

                  lineWidget.set({
                    x2: finalPoint.x,
                    y2: finalPoint.y,
                  });

                } else {

                  const ePoint = endObj.convertRCoordToACoord(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry,
                  );

                  const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);
                  lineWidget.set({
                    x2: finalPoint.x - object.group.left,
                    y2: finalPoint.y - object.group.top,
                  });

                }

              }

              
            } else {
              // arrow no startObj, but arrow and its end connectobj in AS
              const endObj = canvas.findById(lineWidget?.connectorEnd?._id);
              if (!endObj) return;
              const ePoint = endObj.convertRCoordToACoordPartialAS(
                lineWidget.connectorEnd.rx,
                lineWidget.connectorEnd.ry,
              );
              const currentObject=WidgetService.getInstance().getWidgetFromWidgetList(line._id);
              const lx1 = currentObject.x1;
              const ly1 = currentObject.y1;
              const lx2 = currentObject.x2;
              const ly2 = currentObject.y2;
              lineWidget.set({
                x1: lx1 - object.group.left + ePoint.x - lx2,
                y1: ly1 - object.group.top + ePoint.y - ly2,
              });
            }
            if (lineWidget.connectorEnd) {
              const endObj = canvas.findById(lineWidget?.connectorEnd?._id);
              if (endObj) {
                if (endObj.group) {
                  const ePoint = endObj.convertRCoordToACoord(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry,
                  );
                  const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);
                  lineWidget.set({
                    x2: finalPoint.x,
                    y2: finalPoint.y,
                  });
                } else {
                  const ePoint = endObj.convertRCoordToACoord(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry,
                  );
                  const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);
                  lineWidget.set({
                    x2: finalPoint.x - object.group.left,
                    y2: finalPoint.y - object.group.top,
                  });
                }
              }
            } else {
              // arrow no endObj, but arrow and its start connectobj in AS
              const startObj = canvas.findById(lineWidget?.connectorStart?._id);
              if (!startObj) return;
              const sPoint = startObj.convertRCoordToACoordPartialAS(
                lineWidget.connectorStart.rx,
                lineWidget.connectorStart.ry,
              );
              const currentObject=WidgetService.getInstance().getWidgetFromWidgetList(line._id);
              const lx1 = currentObject.x1;
              const ly1 = currentObject.y1;
              const lx2 = currentObject.x2;
              const ly2 = currentObject.y2;
              lineWidget.set({
                x2: lx2 - object.group.left + sPoint.x - lx1,
                y2: ly2 - object.group.top + sPoint.y - ly1,
              });
            }
          } 
          else if (
            lineWidget.connectorStart &&
            lineWidget?.connectorStart?._id === object._id
          ) {
          
            const startObj = canvas.findById(lineWidget?.connectorStart?._id);
            
            if (!startObj) return;

            const sPoint = startObj.convertRCoordToACoordPartialAS(
              lineWidget.connectorStart.rx,
              lineWidget.connectorStart.ry,
            );

            let finalPoint;

            if(canvas.getActiveSelection() && canvas.getActiveSelection()._objects && canvas.getActiveSelection()._objects.length > 0){
              finalPoint = calcControlPointOfObjectInActiveSelection({x1:sPoint.x,y1:sPoint.y}, startObj);
            }
            else{
              finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);
            }

            lineWidget.set({
              x1: finalPoint.x,
              y1: finalPoint.y,
            });
  
            if (lineWidget.connectorEnd) {

              const endObj = canvas.findById(lineWidget?.connectorEnd?._id);

              if (!endObj) return;

              if (endObj.group) {

                const ePoint = endObj.convertRCoordToACoordPartialAS(
                  lineWidget.connectorEnd.rx,
                  lineWidget.connectorEnd.ry,
                );

                const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);

                lineWidget.set({
                  x2: finalPoint.x,
                  y2: finalPoint.y,
                });
                
              } else {
                const ePoint = endObj.convertRCoordToACoord(
                  lineWidget.connectorEnd.rx,
                  lineWidget.connectorEnd.ry,
                );
                const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);
                lineWidget.set({
                  x2: finalPoint.x,
                  y2: finalPoint.y,
                });
              }
            }
          } 
          else {

            const endObj = canvas.findById(lineWidget?.connectorEnd?._id);

            if (!endObj) continue;

            const ePoint = endObj.convertRCoordToACoordPartialAS(
              lineWidget.connectorEnd.rx,
              lineWidget.connectorEnd.ry,
            );

            if( ePoint && ePoint.x){
              const finalPoint = calcControlPointOfObjectInActiveSelection({x1:ePoint.x,y1:ePoint.y}, endObj);
          
              lineWidget.set({
                x2: finalPoint.x,
                y2: finalPoint.y,
              });
            }  
  
            if (lineWidget.connectorStart) {

              const startObj = canvas.findById(lineWidget?.connectorStart?._id);

              if (!startObj) continue;

              if (startObj.group) {

                const sPoint = startObj.convertRCoordToACoordPartialAS(
                  lineWidget.connectorStart.rx,
                  lineWidget.connectorStart.ry,
                );

                if( sPoint && sPoint.x){
                  const finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);
        
                  lineWidget.set({
                    x1: finalPoint.x,
                    y1: finalPoint.y,
                  });
                }               

              } else {

                const sPoint = startObj.convertRCoordToACoord(
                  lineWidget.connectorStart.rx,
                  lineWidget.connectorStart.ry,
                );
              
                const finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);

                lineWidget.set({
                  x1: finalPoint.x,
                  y1: finalPoint.y,
                });
              }
            }
          }
          self.syncObjectChangeToRemote(line._id, {
            x1: lineWidget.x1,
            y1: lineWidget.y1,
            x2: lineWidget.x2,
            y2: lineWidget.y2,
          });
          self.requestRenderAll();
        }
        
      }
    }
  } 
  else if (object && object.lines && object.lines.length > 0) {

    for (let i = 0; i < object.lines.length; i++) {

      const line = object.lines[i];

      let lineWidget;

      const loclineWidget = WidgetService.getInstance().getWidgetFromWidgetList(line._id);

      if (loclineWidget){

        lineWidget = self.onrefreshArrowafterScale(line._id);

        if (!lineWidget) {
          break;
        }
        
        if (lineWidget.connectorStart) {

          const startObj = canvas.findById(lineWidget?.connectorStart?._id);

            if (startObj) {

              const sPoint = startObj.convertRCoordToACoord(
                lineWidget.connectorStart.rx,
                lineWidget.connectorStart.ry,
              );
  
              const finalPoint = calcControlPointOfObject({x1:sPoint.x,y1:sPoint.y}, startObj);
              lineWidget.set({
                x1: finalPoint.x,
                y1: finalPoint.y,
              });
              
            }
          
        }

        if (lineWidget.connectorEnd) {

          const endObj = canvas.findById(lineWidget?.connectorEnd?._id);

          if (endObj) {

            const ePoint = endObj.convertRCoordToACoord(
              lineWidget.connectorEnd.rx,
              lineWidget.connectorEnd.ry,
            );

            const finalPoint = calcControlEndPointOfObject({x2:ePoint.x,y2:ePoint.y}, endObj);

            lineWidget.set({
              x2: finalPoint.x,
              y2: finalPoint.y,
            });

          }

        }
  
        self.syncObjectChangeToRemote(line._id, {
            x1: lineWidget.x1,
            y1: lineWidget.y1,
            x2: lineWidget.x2,
            y2: lineWidget.y2,
          });
      }
      
    }
    self.requestRenderAll();
  }
};

fabric.Canvas.prototype.onObjectMoveUpdateArrowsSave = async function (object) {
  const self = this;

  if (object && object.lines) {
    for (let i = 0; i < object.lines.length; i++) {
      const line = object.lines[i];

      const lineWidget = _.where(self._objects, {
        _id: line._id,
      })[0];
      if (!lineWidget) break;

      lineWidget.set('zIndex', Date.now() * 100);
      canvas.anyChanges = true;
      lineWidget.saveData('MODIFIED', [
        'left',
        'top',
        'x1',
        'y1',
        'x2',
        'y2',
        'zIndex',
      ]);
      self.requestRenderAll();
    }
  }

  self.requestRenderAll();
};

fabric.Canvas.prototype.getPoints = function (
  fromx,
  fromy,
  tox,
  toy,
  arrowType,
) {
  const angle = Math.atan2(toy - fromy, tox - fromx);
  let headlen = 16;
  const strokeWidth = 10;
  // calculate the points.
  if (arrowType === 'arrow') {
    tox -= headlen * Math.cos(angle);
    toy -= headlen * Math.sin(angle);
    return [
      {
        x: fromx, // start point
        y: fromy,
      },
      {
        x: fromx - (headlen / 2 + strokeWidth) * Math.cos(angle - Math.PI / 2),
        y: fromy - (headlen / 2 + strokeWidth) * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - (headlen / 2) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen / 2) * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle - Math.PI / 2),
        y: toy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox + headlen * Math.cos(angle), // tip
        y: toy + headlen * Math.sin(angle),
      },
      {
        x: tox - headlen * Math.cos(angle + Math.PI / 2),
        y: toy - headlen * Math.sin(angle + Math.PI / 2),
      },
      {
        x: tox - (headlen / 2) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 2) * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx - (headlen / 2 + strokeWidth) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 2 + strokeWidth) * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx,
        y: fromy,
      },
    ];
  }
  if (arrowType === 'basicArrow') {
    tox -= 5 * Math.cos(angle);
    toy -= 5 * Math.sin(angle);
    headlen /= 4;
    return [
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle - Math.PI / 2),
        y: toy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle + Math.PI / 2),
        y: toy - headlen * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle + Math.PI / 2),
        y: fromy - headlen * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle),
        y: fromy - headlen * Math.sin(angle),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox, // start point
        y: toy,
      },
    ];
  }
  if (arrowType === 'twoWayBasicArrow') {
    tox -= 5 * Math.cos(angle);
    toy -= 5 * Math.sin(angle);
    headlen /= 4;
    return [
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle - Math.PI / 2),
        y: toy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle + Math.PI / 2),
        y: toy - headlen * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle + Math.PI / 2),
        y: fromy - headlen * Math.sin(angle + Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle),
        y: fromy - headlen * Math.sin(angle),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: fromx - headlen * Math.cos(angle - Math.PI / 2),
        y: fromy - headlen * Math.sin(angle - Math.PI / 2),
      },
      {
        x: tox - headlen * Math.cos(angle),
        y: toy - headlen * Math.sin(angle),
      },
    ];
  }
};

fabric.Canvas.prototype.updateConnectorsRemovedWidget = function (obj) {
  const self = this;
  const currentObjId = obj._id;
  /**
   * - what is the type of the obj
   * --if this is a connectorline
   * ---delete this line
   * --- delete the line in the start object and end object
   * --if this is a object
   * ---delete the connectors lines connect to this object
   * ---delete the connector lines of this object
   * ---delete the connector lines of the connected object
   */

  if (obj.obj_type === 'WBArrow') {
    if (obj.connectorStart) {
      const connectorStartId = obj.connectorStart._id;
      const objStart = canvas.findById(connectorStartId)||{};
        // WidgetService.getInstance().getWidgetFromWidgetList(connectorStartId) || {};

      if (objStart && objStart.lines) {
        const linesInStartObj = objStart.lines;

        linesInStartObj.forEach((e, i, arr) => {
          if (e._id === currentObjId) {
            arr.splice(i, 1);
          }
        });

        const id = objStart._id;
        const data = {
          lines: linesInStartObj,
        };

        const startObjinCavnas = self
          .getObjects()
          .filter((_obj) => _obj._id === id)[0];
        if (startObjinCavnas) {
          startObjinCavnas.set(data); // set the data in canvas,
          canvas.requestRenderAll();
        }
      }
    }

    if (obj.connectorEnd) {
      const connectorEndId = obj.connectorEnd._id;
      const objEnd = canvas.findById(connectorEndId)||{};
        // WidgetService.getInstance().getWidgetFromWidgetList(connectorEndId) || {};

      if (objEnd && objEnd.lines) {
        const linesInEndObj = objEnd.lines;

        linesInEndObj.forEach((e, i, arr) => {
          if (e._id === currentObjId) {
            arr.splice(i, 1);
          }
        });

        const idEnd = objEnd._id;
        const dataEnd = {
          lines: linesInEndObj,
        };

        const endObjinCavnas = self
          .getObjects()
          .filter((_obj) => _obj._id === idEnd)[0];
        if (endObjinCavnas) {
          endObjinCavnas.set(dataEnd);
          canvas.requestRenderAll();
        }
      }
    }
  } else {
    const { lines } = obj;
    if (!lines || lines.length === 0) return;

    lines.forEach((r) => {
      const lineId = r._id;
      const lineObjCanvas = canvas.findById(lineId);
      let pairObjId = '';
      if (!lineObjCanvas) return;
      if (!lineObjCanvas.connectorEnd || !lineObjCanvas.connectorStart) return;
      if (lineObjCanvas.connectorEnd._id === currentObjId) {
        pairObjId = lineObjCanvas.connectorStart._id;
      } else {
        pairObjId = lineObjCanvas.connectorEnd._id;
      }

      const pairObj =
        WidgetService.getInstance().getWidgetFromWidgetList(pairObjId) || {};

      const linesInPairObj = pairObj.lines || [];

      linesInPairObj.forEach((e, i, arr) => {
        if (e._id === lineId) {
          arr.splice(i, 1);
        }
      });

      const id = pairObj._id;
      const data = {
        lines: linesInPairObj,
      };

      const pairObjinCavnas = self
        .getObjects()
        .filter((_obj) => _obj._id === id)[0];
      if (pairObjinCavnas) {
        pairObjinCavnas.set(data);
        pairObjinCavnas.saveData('MODIFIED', ['lines']);
        canvas.requestRenderAll();
      }
    });
  }
};

const objInActiveSelection = (obj) =>{

  let result = false;

  const activeSelection = canvas.getActiveSelection();

  if(obj && obj._id && activeSelection && activeSelection._objects && activeSelection._objects.length > 0){
    
    activeSelection._objects.map(o=>{

      if(o._id === obj._id){

        result = true; //obj In ActiveSelection

      }

    })
  }

  return result;
}
