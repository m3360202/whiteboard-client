import Hammer from 'hammerjs';
import { useEffect, useState } from 'react';
// import { addTapEvent, removeTapEvent } from './onTap';
// import { add2TapEvent, remove2TapEvent } from './on2Tap';
import { addPanEvent, removePanEvent } from './onPan';
import { addPinchEvent, removePinchEvent } from './onPinch';
// import { add2PanEvent, remove2PanEvent } from './on2Pan';
// import { addPressEvent, removePressEvent } from './press';
import showMenu from '../widgetMenu/ShowMenu';
import { EventService, WidgetService } from '../../services';
import store from '../../store';
import { handleWidgetMenuDisplay } from '../../store/board';
import EventNames from '../../util/EventNames';
let canvas = window.canvas;
const useTouchEvents = () => {
  const [hammer, setHammer] = useState(null);

  const handleSelectionCleared = () => {
    store.dispatch(handleWidgetMenuDisplay(false))
  };

  useEffect(() => {
    if (!canvas) return;
    if(canvas && canvas.upperCanvasEl){
      setHammer(new Hammer.Manager(canvas.upperCanvasEl, {}));  
      EventService.getInstance().register(EventNames.CANVAS_SELECTION_CREATED, showMenu);
      EventService.getInstance().register(EventNames.CANVAS_SELECTION_UPDATED, showMenu);
      EventService.getInstance().register(EventNames.SELECTION_CLEARED, handleSelectionCleared);
      
    }

    return () => {
      EventService.getInstance().unregister(EventNames.CANVAS_SELECTION_CREATED, showMenu);
      EventService.getInstance().unregister(EventNames.CANVAS_SELECTION_UPDATED, showMenu);
      EventService.getInstance().unregister(EventNames.SELECTION_CLEARED, handleSelectionCleared);
    };
  }, [canvas]);

  const addTouchEvents = () => {
    // addTapEvent(hammer);
    addPinchEvent(hammer);
    addPanEvent(hammer);
    // add2PanEvent(hammer);
    // add2TapEvent(hammer);
    // addPressEvent(hammer);
  };

  const removeTouchEvents = () => {
    // removeTapEvent(hammer);
    removePinchEvent(hammer);
    removePanEvent(hammer);
    // remove2PanEvent(hammer);
    // remove2TapEvent(hammer);
    // removePressEvent(hammer);
  };

  return {
    hammer,
    addTouchEvents,
    removeTouchEvents
  };
};

export default useTouchEvents;
