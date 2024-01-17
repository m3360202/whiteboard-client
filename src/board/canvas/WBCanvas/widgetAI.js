import * as fabric from '@boardxus/x-canvas';

//** Import Redux toolkit
import store from '../../../store';

import {
  WidgetService,
  BoardService,
  ClipboardService,
  UtilityService
} from '../../../services/index';

import { WidgetAPI } from '../../../redux/WidgetAPISlice';
import { pricingApi } from '../../../redux/PricingApiSlice';
import { handleSetMenuFontWeight } from '../../../store/widgets';
import i18n from 'i18next';
import axios from 'axios';
import AIService from '../../../services/AIService';
import server from '../../../startup/serverConnect';
import { CLOUD_FUNCTION_URL } from '../../../startup/serverConnect';



let t = i18n.getFixedT(null, null)

/**
 * This method is used to create widget objects on the Fabric.js canvas.
 * @param {Object} note - An object representing the note with the following properties:
 * - objType {String} - The type of object
 * - objData {Object} - The data of the object
 */
fabric.Canvas.prototype.createWidgetatCurrentLocationByType = async function (
  objType,
  objData
) {
  const self = this;
  let position = null;
  let positionOfScreen = {};

  if (objData && objData.useCenterOfScreen) {
    positionOfScreen = canvas.getCenterPointOfScreen();
  } else {
    positionOfScreen = self.lastMousePosition;
  }

  if (!objData || !objData.position) {
    position = self.getPositionOnCanvas(positionOfScreen.x, positionOfScreen.y);
  } else {
    position = objData.position;
  }

  let data = {
    angle: 0,
    backgroundColor: '',
    width: 138,
    height: 138,
    scaleX: 1,
    scaleY: 1,
    fontSize: 25,
    fontFamily: 'Inter',
    fontWeight: 400,
    originX: 'center',
    originY: 'center',
    left: position.left,
    top: position.top,
    selectable: true,
    emoji: [0, 0, 0, 0, 0],
    text: '',
    textAlign: 'left',
    fill: '#000',
    obj_type: objType,
    user_id: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board._id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100,
    path: '',
    fixedStrokeWidth: 1,
    icon: 0,
    lineWidth: 0,
    shapeScaleX: 1,
    shapeScaleY: 1
  };

  if (objType === 'WBTextbox' || objType === 'WBText') {
    data.height = 25;
    data.fontSize = 24;
    if (objData && objData.clipboardContent) {
      data.text = objData.clipboardContent;
      data.width = 500;
      data.fromCopy = true;
    } else {
      data.width = objData.text ? 500 : 100;
      data.text = objData.text || '';
      data.backgroundColor = objData.backgroundColor || 'rgba(0, 0, 0, 0)';
    }
  } else if (objType === 'WBRectNotes' && !objData) {
    data.width = 230;
    data.height = 138;
    data.textAlign = 'center';
    data.backgroundColor = 'rgba(254, 245, 148, 1)';
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = ' ';
  } else if (objType === 'WBRectNotes' && objData.noteUses === 'chatAI') {
    data.width = 230;
    data.height = 138;
    data.textAlign = 'center';
    data.backgroundColor = '#d3f4f4';
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = objData.text;

  } else if (objType === 'WBRectNotes' && objData.noteType === 'square') {
    data.width = 138;
    data.height = 138;
    data.textAlign = 'center';
    data.backgroundColor = objData.color;
    data.fill = Boardx.Util.invertColor(objData.color, true);
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = ' ';
  } else if (objType === 'WBRectNotes' && objData.noteType === 'rect') {
    data.width = 230;
    data.height = 138;
    data.textAlign = 'center';
    data.backgroundColor = objData.color;
    data.fill = Boardx.Util.invertColor(objData.color, true);
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = ' ';
  } else if (objType === 'WBCircleNotes') {
    data.width = 138;
    data.textAlign = 'center';
    data.height = 138;
    data.backgroundColor = objData.color;
    data.fill = Boardx.Util.invertColor(objData.color, true);
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = ' ';
  } else if (objType === 'WBShapeNotes') {
    data.width = 138;
    data.textAlign = 'center';
    data.height = 138;
    data.backgroundColor = 'rgba(0, 0, 0, 0)';
    data.stroke = '#BDBDBD';
    data.strokeWidth = 0.2;
    data.fontSize = 26;
    data.fontWeight = 400;
    data.text = '';
    data.icon = objData.iconId;
    data.lineWidth = 2;
    data.fixedLineWidth = 2;
    data.isPanel = false;
    data.maxHeight = 138;
    data.verticalAlign =
      objData.iconId == 5 ||
        objData.iconId == 9 ||
        objData.iconId == 10 ||
        objData.iconId == 12
        ? 'bottom'
        : 'middle';
  } else if (objType === 'WBArrow' && objData.arrowType === 'line') {
    data = {
      angle: 0,
      fill: 'black',
      scaleX: 1,
      scaleY: 1,
      stroke: 'black',
      strokeWidth: 2,
      tips: 'none',
      connectorShape: store.getState().widgets.connectorShape,
      x1: position.left,
      x2: position.left + 200,
      y1: position.top + 90,
      y2: position.top + 90,
      obj_type: 'WBArrow',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100
    };
  } else if (objType === 'WBArrow' && objData.arrowType === 'lineArrow') {
    data = {
      angle: 0,
      fill: 'black',
      scaleX: 1,
      scaleY: 1,
      stroke: 'black',
      strokeWidth: 2,
      connectorShape: store.getState().widgets.connectorShape,
      tips: 'end',
      x1: position.left,
      x2: position.left + 200,
      y1: position.top + 90,
      y2: position.top + 90,
      obj_type: 'WBArrow',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100
    };
  } else if (objType === 'WBCircle') {
    data = {
      angle: 0,
      radius: 250,
      scaleX: 1,
      scaleY: 1,
      isPanel: false,
      left: position.left,
      top: position.top,
      fill: null,
      stroke: '#000',
      strokeWidth: 4,
      obj_type: 'WBCircle',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100
    };
  } else if (objType === 'WBTriangle') {
    data = {
      angle: 0,
      width: 500,
      height: 500,
      scaleX: 1,
      scaleY: 1,
      left: position.left,
      top: position.top,
      fill: null,
      stroke: '#000',
      strokeWidth: 4,
      obj_type: 'WBTriangle',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100
    };
  } else if (objType === 'WBRdRectPanel') {
    data = {
      angle: 0,
      width: 500,
      height: 500,
      scaleX: 1,
      isPanel: false,
      scaleY: 1,
      left: position.left,
      top: position.top,
      fill: null,
      stroke: '#000',
      strokeWidth: 4,
      obj_type: 'WBRdRectPanel',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100,
      rx: 40,
      ry: 40,
      hasBorders: true
    };
  } else if (objType === 'WBImage') {
    const { downloadUrl, isSticker } = objData;
    if (isSticker) {
      const widget = {
        _id: UtilityService.getInstance().generateWidgetID(),
        angle: 0,
        scaleX: 240 / 128,
        scaleY: 240 / 128,
        userId: store.getState().user.userInfo.userId,
        whiteboardId: store.getState().board.board._id,
        timestamp: Date.now(),
        obj_type: 'WBImage',
        selectable: true,
        left: position.left,
        top: position.top,
        width: 128,
        height: 128,
        src: downloadUrl,
        zIndex: Date.now() * 100
      };
      WidgetService.getInstance().insertWidget(widget);

      const newState = {
        newState: widget,
        targetId: widget._id,
        action: 'ADDED'
      };
      canvas.pushNewState([newState]);
      canvas.renderWidgetAsync(widget);
      return;
    }
    BoardService.getInstance().uploadImageByUrl({
      left: position.left,
      top: position.top,
      url: downloadUrl,
      userId: store.getState().user.userInfo.userId,
      userNo: store.getState().user.userInfo.userNo,
      whiteboardId: store.getState().board.board._id,
      obj_type: 'WBImage'
    });
    return;
  } else if (objType === 'WBUrlImage') {
    data = {
      rx: 40,
      ry: 40
    };
  }
  data._id = UtilityService.getInstance().generateWidgetID();
  const widget = await self.createWidgetAsync(data);
  // await self.checkIfBindtoPanel(widget);
  if (widget.panelObj) {
    data.panelObj = widget.panelObj;
    data.relationship = widget.relationship;
  }
  if (
    widget.obj_type === 'WBShapeNotes' ||
    widget.obj_type === 'WBRectNotes' ||
    widget.obj_type === 'WBCircleNotes'
  ) {
    store.dispatch(handleSetMenuFontWeight('normal'));
  }
  WidgetService.getInstance().insertWidget(data);

  const newState = widget.getUndoRedoState('ADDED');
  canvas.pushNewState(newState);

  self.add(widget);
  self.setActiveObject(widget);
  if (
    (widget.obj_type === 'WBShapeNotes' ||
      widget.obj_type === 'WBRectNotes' ||
      widget.obj_type === 'WBCircleNotes') &&
    Boardx.Util.getMobileOperatingSystem() !== 'ios'
  ) {
    widget.enterEditing();
  }

  if (
    (widget.obj_type === 'WBTextbox' || widget.obj_type === 'WBText') &&
    Boardx.Util.getMobileOperatingSystem() !== 'ios'
  ) {
    widget.enterEditing();
  }
  self.requestRenderAll();
};

/**
 * This method is used to modify the properties of the default note on the Fabric.js Canvas.
 *
 * @param {Object} note - An object representing the note with the following properties:
 * - width {Number} - The width of the note
 * - height {Number} - The height of the note
 * - fontSize {Number} - The font size of the note text
 * - fontFamily {String} - The font family of the note text
 * - fontWeight {String} - The weight of the font of the note text
 * - fill {String} - The fill color of the note
 * - textAlign {String} - The alignment of the text in the note
 * - backgroundColor {String} - The background color of the note
 * - scaleX {Number} - The horizontal scaling of the note
 * - scaleY {Number} - The vertical scaling of the note
 * - obj_type {String} - The type of object
 * - isDraw {Boolean} - Whether or not the note is drawn
 * - locked {Boolean} - Whether or not the note's properties are locked and cannot be modified
 */
fabric.Canvas.prototype.changeDefaulNote = function (note) {
  const self = this;
  const defaultNote = {
    width: note.width,
    height: note.height,
    fontSize: note.fontSize,
    fontFamily: note.fontFamily,
    fontWeight: note.fontWeight,
    fill: note.fill,
    textAlign: note.textAlign,
    backgroundColor: note.backgroundColor,
    scaleX: note.scaleX,
    scaleY: note.scaleY,
    obj_type: note.obj_type,
    isDraw: note.isDraw === undefined ? self.defaultNote.isDraw : note.isDraw,
    locked: note.locked,
    lockMovementX: note.locked,
    lockMovementY: note.locked,
    lockRotation: note.locked,
    lockScalingX: note.locked,
    lockScalingY: note.locked
  };
  self.defaultNote = defaultNote;
};

/** 
 * This function is an extension method on fabric.Canvas.prototype. It updates the status of an Audio Widget and adds a new Text Widget on the Canvas. 
 * @param {Object} audioWidget - An object representing the Audio Widget with the following properties:
 * - audioWidget: An Object that represents the fabric Audio Widget on the Canvas.
   - expected to be an instance of fabric Object and contain 'left' and 'width' properties.
   - textWidget: An Object that represents a raw Text Widget. 
   - It should have 'text' and 'boardId' properties.
   - 'audioWidgetId' property is optional.
*/
fabric.Canvas.prototype.updateAudioWidgetStatusAndAddTextWidget =
  async function (audioWidget, textWidget) {
    const self = this;
    const newTextWidget = {
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      originX: 'center',
      originY: 'center',
      left: audioWidget.left + audioWidget.width + 250,
      top: audioWidget.top,
      selectable: true,
      text: textWidget.text.trim(),
      textAlign: 'left',
      fill: '#000',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: textWidget.boardId,
      timestamp: Date.now(),
      zIndex: Date.now() * 100,
      path: '',
      fixedStrokeWidth: 1,
      icon: 0,
      lineWidth: 0,
      shapeScaleX: 1,
      shapeScaleY: 1,
      editable: true,
      fixedScaleChange: false,
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 400,
      fromCopy: false,
      isPanel: false,
      lineHeight: 1.16,
      lockMovementX: false,
      lockMovementY: false,
      lockScalingFlip: true,
      backgroundColor: '#d3f4f4',
      locked: false,
      maxHeight: 138,
      width: 600,
      obj_type: 'WBText',
      lastEditedBy: 'AI',
      audioWidgetId: textWidget.audioWidgetId
    };

    const widget = await self.createWidgetAsync(newTextWidget);

    await WidgetService.getInstance().insertWidget(newTextWidget);

    const newState = widget.getUndoRedoState('ADDED');
    canvas.pushNewState(newState);

    self.add(widget);
    self.setActiveObject(widget);
  };

/**
 * This function creates a textbox at a specified location in a Fabric Interactions Widget.
 * @param {Object} textWidget - An object representing the Text Widget with the following properties:
 * - `text` (string): the text to be displayed in the textbox.
 * - `targetWidget` (object): the coordinates of the location where the text box should be created.
 */
fabric.Canvas.prototype.createTextboxByLocation = async function (
  text,
  targetWidget
) {
  const self = this;
  const { left, top } = targetWidget;
  const data = {
    left: targetWidget.aCoords.tr.x + 20 + 300,
    top: top,
    text: text?.trim(),
    angle: 0,
    editable: true,
    fill: '#000',
    fixedScaleChange: false,
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 400,
    fromCopy: false,
    isPanel: false,
    lineHeight: 1.16,
    lockMovementX: false,
    lockMovementY: false,
    lockScalingFlip: true,
    backgroundColor: '#d3f4f4',
    locked: false,
    maxHeight: 138,
    width: 600,
    obj_type: 'WBText',
    originX: 'center',
    originY: 'center',
    whiteboardId: store.getState().board.board._id,
    scaleX: 1,
    scaleY: 1,
    selectable: true,
    lastEditedBy: 'AI',
    zIndex: Date.now() * 1000,
    _id: UtilityService.getInstance().generateWidgetID()
  };

  const widget = await self.createWidgetAsync(data);

  await WidgetService.getInstance().insertWidget(data);

  const newState = widget.getUndoRedoState('ADDED');
  canvas.pushNewState(newState);

  self.add(widget);
  self.setActiveObject(widget);
};

/**
 * This method of fabric.Canvas prototype is used to create multiple sticky notes by location.
 * It takes an array of sticky notes text and a target widget as parameters.
 * The method creates new notes with settings like zIndex, text, backgroundColor, fill, lastEditedBy, width, height, emoji, textAlign, obj_type, left, _id, originX, and originY.
 * After creating each note, it adds this new note to the canvas and to an array newNotes.
 * After all notes have been created, it pushes all states to canvas's newState array and inserts new notes to the database via WidgetService.
 * If array stickyNotes is not empty, it adds all sticky notes to the active selection and sets it as the active object on the canvas.
 *
 * @param {Array<String>} stickyNotsArray - Array of strings, each representing the text of a sticky note.
 * @param {Object} targetWidget - Target widget object in which new sticky notes will be added.
 * @async
 * @function
 * @returns {Array} Returns an array of stickyNotes.
 */
fabric.Canvas.prototype.createMutipleStickyNotesByLocation = async function (
  stickyNotsArray,
  targetWidget
) {
  const self = this;
  const canvas = self;
  const stickyNotes = [];

  if (targetWidget.isEditing) targetWidget.exitEditing();

  let newState = [];
  let newNotes = [];
  for (let i = 0; i < stickyNotsArray.length; i++) {
    const textOfNote = stickyNotsArray[i];
    const newNote = targetWidget.getObject();
    newNote.zIndex = Date.now() * 100;
    newNote.text = textOfNote;
    newNote.backgroundColor = '#d3f4f4';
    newNote.fill = '#000';
    newNote.lastEditedBy = 'AI';
    newNote.width = 230;
    newNote.height = 138;
    newNote.emoji = [0, 0, 0, 0, 0];
    newNote.textAlign = 'center';
    newNote.obj_type = 'WBRectNotes';
    newNote.left =
      newNote.left +
      (i + 1) *
      (targetWidget.obj_type === 'WBText'
        ? 240
        : targetWidget.getScaledWidth() + 30);
    newNote._id = UtilityService.getInstance().generateWidgetID();
    newNote.originX = 'center';
    newNote.originY = 'center';

    const widget = await self.createWidgetAsync(newNote);

    newState = newState.concat(widget.getUndoRedoState('ADDED'));

    self.add(widget);

    stickyNotes.push(widget);
    newNotes.push(newNote);
  }
  canvas.pushNewState(newState);
  await WidgetService.getInstance().insertWidgetArr(newNotes);

  if (stickyNotes && stickyNotes.length > 0) {
    const selectedObject = canvas.getActiveSelection();
    selectedObject.add(...stickyNotes);
    canvas.requestRenderAll();
    canvas.setActiveObject(selectedObject);
  }
  return stickyNotes;
};

/**
 * Function to create a sticky note widget object, updating its properties
 * such as zIndex, text, last edited by, type, associated whiteboard id,
 * origin coordinate, and position on the board.
 *
 * @param {Object} stickyNoteWidgetObj - The object representing the sticky note widget.
 * @param {string} textOfNote - The text content of the sticky note.
 * @param {number} i - An index used to calculate the position of the sticky note.
 *
 * @returns {Object} The updated sticky note widget object.
 */
const createStickyNoteWidget = (stickyNoteWidgetObj, textOfNote, i) => {
  const newNote = { ...stickyNoteWidgetObj };
  newNote.zIndex = Date.now() * 100;
  newNote.text = textOfNote;
  newNote._id = UtilityService.getInstance().generateWidgetID();
  newNote.lastEditedBy = 'AI';
  newNote.obj_type = 'WBRectNotes';
  newNote.whiteboardId = store.getState().board.board._id;
  newNote.boardId = store.getState().board.board._id;
  newNote.originX = 'center';
  newNote.originY = 'center';
  newNote.left =
    stickyNoteWidgetObj.left + (stickyNoteWidgetObj.width + 30) * (i % 3);
  newNote.top =
    stickyNoteWidgetObj.top +
    (stickyNoteWidgetObj.height + 30) * (Math.ceil((i + 1) / 3) - 1);

  return newNote;
};

/**
 * Function to create a WBText widget object, updating its properties
 * such as zIndex, text, last edited by, type, associated whiteboard id,
 * origin coordinate, and position on the board.
 *
 * @param {Object} WBText - The object representing the WBText widget.
 * @param {string} textOfNote - The text content of the WBText.
 * @param {number} i - An index used to calculate the position of the WBText.
 *
 * @returns {Object} The updated WBText widget object.
 */
const createWBTextWidget = (WBText, textOfNote, i) => {
  const newWBText = { ...WBText };
  newWBText.zIndex = Date.now() * 100;
  newWBText.text = textOfNote;
  newWBText._id = UtilityService.getInstance().generateWidgetID();
  newWBText.lastEditedBy = 'AI';
  newWBText.whiteboardId = store.getState().board.board._id;
  newWBText.boardId = store.getState().board.board._id;
  newWBText.originX = 'center';
  newWBText.originY = 'center';
  newWBText.left = WBText.left + (WBText.width + 30) * (i % 3);
  newWBText.top =
    WBText.top + (WBText.height + 30) * (Math.ceil((i + 1) / 3) - 1);

  return newWBText;
};

/**
 * Function to create a WBShapeNotes widget object, updating its properties
 * such as zIndex, text, last edited by, type, associated whiteboard id,
 * origin coordinate, and position on the board.
 *
 * @param {Object} WBShapeNotes - The object representing the WBShapeNotes widget.
 * @param {string} textOfNote - The text content of the WBShapeNotes.
 * @param {number} i - An index used to calculate the position of the WBShapeNotes.
 *
 * @returns {Object} The updated WBShapeNotes widget object.
 */
const createWBShapeNotesWidget = (WBShapeNotes, textOfNote, i) => {
  const newWBShapeNotes = { ...WBShapeNotes };
  newWBShapeNotes.zIndex = Date.now() * 100;
  newWBShapeNotes.text = textOfNote;
  newWBShapeNotes._id = UtilityService.getInstance().generateWidgetID();
  newWBShapeNotes.lastEditedBy = 'AI';
  newWBShapeNotes.whiteboardId = store.getState().board.board._id;
  newWBShapeNotes.boardId = store.getState().board.board._id;
  newWBShapeNotes.originX = 'center';
  newWBShapeNotes.originY = 'center';
  newWBShapeNotes.left =
    WBShapeNotes.left + (WBShapeNotes.width + 30) * (i % 3);
  newWBShapeNotes.top =
    WBShapeNotes.top +
    (WBShapeNotes.height + 30) * (Math.ceil((i + 1) / 3) - 1);

  return newWBShapeNotes;
};

/**
 * Function named textClassification which classifies given text into categories.
 * @param {Object} text - It accepts one parameter text which is expected to be an object.
 */
const textClassification = text => {
  // Declaring an empty array 'categorizedData' to store the categorized result.
  const categorizedData = [];

  // Looping over each property in the provided text object.
  for (const key in text) {
    categorizedData.push({ title: key, content: text[key] });
  }

  // The function returns the 'categorizedData' array.
  return categorizedData;
};

/**
 * This function is used to create sticky notes on a canvas using a specified template.
 * It classifies the input text, fetches the widgets from the database,
 * then creates and displays the new widgets on the canvas.
 *
 * @param {string} text - The input text to be added to the sticky notes.
 * @param {Object} commandData - The command data containing the template ID.
 * @param {Object} targetWidget - The widget that is the target of the sticky notes.
 */
fabric.Canvas.prototype.createStickyNotesByTemplate = async function (
  text,
  commandData,
  position
) {
  // Text are classified (sorted) into different categories.
  const textContentAfterSorting = textClassification(text);

  // Get the widget template details and append the new widgets.
  const templateDetail = await store.dispatch(
    WidgetAPI.endpoints.getWidgetsByTemplateId.initiate(commandData.templateId)
  );


  console.log('templateDetail', templateDetail)
  // Wrap the DDP in a Promise for better async handling
  const widgets = templateDetail.data?.reduce((acc, widget) => {
    if (['WBRectNotes', 'WBShapeNotes', 'WBText'].includes(widget.obj_type) && widget.text?.match(/\{\{.*?\}\}/)) {
      acc.push(widget);
    }
    return acc;
  }, []);

  // await server.call('getStickyNotesWidgetsByBoardId', commandData.templateId, [
  //       'WBRectNotes',
  //       'WBShapeNotes',
  //       'WBText'
  //     ]);

  // Mapping through the widgets and create new widgets.
  const newWidgets = widgets.flatMap(widgetItem => {

    const regex = /\{\{(.*?)\}\}/;



    const widgetItemText = widgetItem.text
      .match(regex)[1]
      .toLowerCase();

    // Filter once for text matching
    const matchingTexts = textContentAfterSorting.filter(
      text => text.title.toLowerCase() === widgetItemText
    );

    return matchingTexts.flatMap(text => {
      // Filter once for non-empty content identifiers
      const contents = text.content
        .map(textOfNote =>
          typeof textOfNote === 'string' ? textOfNote.trim() : textOfNote
        )
        .filter(textOfNote => textOfNote.length > 0);

      if (widgetItem.obj_type === 'WBText') {
        return contents.map((content, i) =>
          createWBTextWidget(widgetItem, content, i)
        );
      }

      if (widgetItem.obj_type === 'WBShapeNotes') {
        return contents.map((content, i) =>
          createWBShapeNotesWidget(widgetItem, content, i)
        );
      }

      if (widgetItem.obj_type === 'WBRectNotes') {
        return contents.map((content, i) =>
          createStickyNoteWidget(widgetItem, content, i)
        );
      }
    });
  });



  // Exclude the widgets that includes '[template-' in their text.
  const newTemplateDetailData = [...templateDetail.data, ...newWidgets].filter(
    item => !item.text?.match(/\{\{.*?\}\}/)
  );

  const boardId = store.getState().board.board._id;
  const userId = store.getState().user.userInfo.userId;
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  // Paste the new widgets to the canvas using the clipboard's paste callback.
  await ClipboardService.getInstance().pasteCallback(
    [],
    JSON.stringify({ data: newTemplateDetailData, type: 'whiteboard' }), position, boardId, userId
  );

  // // Position the template widgets correctly on the canvas
  // const templateWidgets = canvas.getActiveObject();
  // templateWidgets.left = targetWidget.left + targetWidget.width * 2 + 500;
  // templateWidgets.top = targetWidget.top;
  // templateWidgets.dirty = true;

  // Request to render all objects on the canvas.
  canvas.requestRenderAll();

  // //TODO: Save the data to the database.
  // setTimeout(() => {
  //   templateWidgets.saveData('MOVED');
  // }, 500);
};

/**
 * This function is used to clean up a text data by removing new line characters and leading numbers related to ordering usually found in lists.
 * It first splits the passed data into an array of strings, then removes any new line characters and list ordering numbers.
 * It also removes any empty strings within the array, leaving only meaningful string data.
 *
 * @param {Object} data - The object containing text data to be cleaned. The text data is found within the 'content' property of this object.
 */
const getDivergeResult = function (data) {
  let result = data.content;
  let arr = result.split('\n');

  arr = arr.map(obj =>
    obj
      .replace('\n', '')
      .replace('1. ', '')
      .replace('2. ', '')
      .replace('3. ', '')
      .replace('4. ', '')
      .replace('5. ', '')
      .replace('6. ', '')
      .replace('7. ', '')
      .replace('8. ', '')
      .replace('9. ', '')
      .replace('10. ', '')
  );

  arr = arr.filter(obj => obj.trim().length > 0);
  return arr;
};

// Function to handle text retrieval based on type of object
const getObjectType = (obj_type, widget) => {
  switch (obj_type) {
    case 'WBText':
    case 'WBRectNotes':
    case 'WBCircleNotes':
      return widget.text; // Return text for the Widget
    case 'WBImage':
      return ' '; // For WBImage type return an empty string
    default:
      return null; // If object type not found return null
  }
};

// Function to get widget text if the widget has 'WBRectNotes' objects
const getWidgetText = widget => {
  return widget._objects?.filter(
    ({ obj_type }) => obj_type === 'WBRectNotes'
  )[0]?.text;
};

// Function to get an array of objects sorted based on top and left values
const getObjectArray = widget => {
  let objectArray = [];
  if (widget.getObjects) {
    objectArray = widget.getObjects().sort(function (a, b) {
      return a.top - b.top || a.left - b.left;
    });
  } else {
    objectArray = widget._objects;
  }
  return objectArray;
};

// // Main function to handle text retrieval in the interface
// const getText = () => {
//   // Initializing an empty array to store text values
//   const textArray = [];
//   const currentWidget = canvas.getActiveObject();

//   const t = i18n.getFixedT(null, null)
//   // Getting the text value based on the type of the Widget
//   const widgetText = getObjectType(currentWidget.obj_type, currentWidget);
//   if (widgetText) return widgetText;

//   // If the widget has objects and contains WBImage, retrieve the text of 'WBRectNotes'
//   if (currentWidget._objects && currentWidget._objects.length === 2) {
//     if (currentWidget._objects.some(({ obj_type }) => obj_type === 'WBImage')) {
//       return getWidgetText(currentWidget);
//     }
//   }

//   // Sorting the objects in the Widget on the basis of their top and left properties
//   const objectArray = getObjectArray(currentWidget);

//   // Traversing the objects to fetch their text based on their type
//   for (let i = 0; i < objectArray.length; i++) {
//     const { obj_type, text } = objectArray[i];

//     // If object type isn't one of WBText, WBRectNotes, WBCircleNotes and WBShapeNotes,
//     // display a message and stop processing the objects
//     if (
//       !['WBText', 'WBRectNotes', 'WBCircleNotes', 'WBShapeNotes'].includes(
//         obj_type
//       )
//     ) {
//       if (typeof Boardx !== 'undefined' && Boardx.Util.Msg.info) {
//         Boardx.Util.Msg.info(t('widgetAi.selectTextOrStickyNotes'));
//       }
//       return;
//     }

//     // For other objects, push their text to textArray
//     textArray.push(' - ' + text);
//   }

//   // Join the array elements to form a string and return
//   return textArray.join('\n').trim();
// };

/**
 * This function is used to generate a new command prompt by replacing a placeholder in the original command with a processed text. 
 * It fetches the text to process first, and if there isn't any text, it returns and ends the function.
 *
 * @param {Object} commandData - The command data containing the original command with a placeholder ('{input}}').
 */
const generatePrompt = async commandData => {
  // Get the text to process
  const text = canvas.getActiveObject().getText();
  if (!text) return;


  const systemPrompt = "You are a great prompt engineer, please generate a prompt for visualizing the following content(the response text should not longer then 50 words, and return in english): ========" + text;

  const refinedPrompt = await AIService.getInstance().requestGPT3Process(systemPrompt, 0.3)


  const command = commandData.command.replace('{input}', refinedPrompt);
  return command;
};


/**
 * This function is used to check whether the credits of the user is sufficient. 
 * It fetches the orgId from the store state, then initiates a call to the pricingApi 
 * which checks if the users credits are sufficient.
 * 
 * It does not directly take in any parameters as it fetches the necessary orgId 
 * from the current state of the Redux store.
 * 
 * @returns {Promise} Promise for checking whether the credit is enough from pricingApi's endpoint.
 */
const checkCreditsIsEnough = async () => {
  const orgId = store.getState().org.orgInfo.orgId;
  const user = store.getState().user.userInfo;

  const data = await store.dispatch(
    pricingApi.endpoints.checkCreditsIsEnough.initiate({ orgId, user })
  );
  return data;
};

/**
 * This function is used to get all the selected widgets on a canvas. 
 * If the selected object on the canvas contains multiple objects, 
 * it will loop through and collect all these objects into an array. 
 * If the selected object on the canvas is a single object, it will directly add this single object into the array. 
 * The function returns this array of selected objects (or widgets).
 */
const GetSelectedWidgets = () => {
  const selectedWidgets = [];
  const selectedObject = canvas.getActiveObject();
  if (selectedObject) {
    if (selectedObject.getObjects) {
      const objects = selectedObject.getObjects();
      for (let i = 0; i < objects.length; i++) {
        selectedWidgets.push(objects[i]);
      }
    } else {
      selectedWidgets.push(selectedObject);
    }
  }
  return selectedWidgets;
};

/**
 * This function is used to "lock" or disable interaction on certain widgets present on a canvas, changing their opacity to signify this status. 
 * It iterates through the passed list of widgets, disabling the 'evented' property to stop further interaction and modifying the 'opacity' property for visual change.
 *
 * @param {Array} currentWidgets - The list of widgets that need to be locked. It's an array of Objects, where each object represents a widget with certain properties.
 */
const lockWidget = currentWidgets => {
  const selectedWidgets = currentWidgets;
  for (let i = 0; i < selectedWidgets.length; i++) {
    selectedWidgets[i].evented = false;
    selectedWidgets[i].opacity = 0.5;
  }
  canvas.requestRenderAll();
};

/**
 * This function is used to "unlock" or enable interaction on certain widgets present on a canvas, changing their opacity to signify this status. 
 * It iterates through the passed list of widgets, enabling the 'evented' property to allow interaction and modifying the 'opacity' property for visual change.
 *
 * @param {Array} currentWidgets - The list of widgets that need to be unlocked. It's an array of Objects, where each object represents a widget with certain properties.
 */
const unlockWidget = currentWidgets => {
  const selectedWidgets = currentWidgets;
  for (let i = 0; i < selectedWidgets.length; i++) {
    selectedWidgets[i].evented = true;
    selectedWidgets[i].opacity = 1;
  }
};

fabric.Canvas.prototype.AIDiverge = async function (commandData) {
  const currentNote = this.getActiveObject();
  const self = this;
  // const prompt = generateDivergePrompt(commandData);

  try {

    const currentWidgetsTextContent = currentNote.getText();
    // TODO: i18n

    if (currentNote._objects) {
      Boardx.Util.Msg.info(t('widgetAi.selectASingleStickyNotes'));
      return;
    }

    if (currentWidgetsTextContent.trim() === "") {
      Boardx.Util.Msg.info(t('widgetAi.theSelectedTextIsEmpty'));
      return;
    }

    const currentWidgets = GetSelectedWidgets();
    lockWidget(currentWidgets);

    const messageTips = Boardx.Util.Msg.info(
      t('widgetAi.generatingResults'),
      commandData.name,
      {
        timeOut: 0,
        extendedTimeOut: 0
      }
    );

    const response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, currentWidgetsTextContent, commandData.temperature, commandData.customizedContentOutputFormat);

    unlockWidget(currentWidgets);
    const result = getDivergeResult(response.data);

    self.createMutipleStickyNotesByLocation(result, currentNote);

    messageTips.remove();


    // const orgId = store.getState().org.orgInfo.orgId;
    // const userInfo = store.getState().user.userInfo;
    // const AIAssistData = {
    //   prompt,
    //   promptId: commandData._id,
    //   createdTime: new Date().getTime(),
    //   response: response.data,
    //   totalTokens: totalTokens,
    //   orgId: orgId,
    //   user: userInfo
    // };

    // const response  = server.call('saveAIAssistLogAndReduceCredit', AIAssistData)


    //   console.log(res);

    //   store.dispatch(
    //     handleSetUserInfo({ ...userInfo, credits: res.credits })
    //   );




  } catch (error) {
    if (response.data.error) {
      unlockWidget(currentWidgets);
      Boardx.Util.Msg.clear();
      Boardx.Util.Msg.warning(error);
      return;
    }

  }



};

function transformJsonToTargetString(jsonArray) {
  let targetObject = "";

  jsonArray.forEach(function (item) {

    if(typeof parseInt('item.description', 10) === 'number'){
    targetObject+=item.title + ": please generate " + item.description  + " value items according to the context for this field;\n";
    }else{
      targetObject+=item.title + ": please generate value items according to the context for this field;\n";
    }
    // let descriptionLength = parseInt(item.description, 10);
    // targetObject[item.title] = new Array(descriptionLength).fill("");
  });

  return targetObject;
}


fabric.Canvas.prototype.AIConverge = async function (commandDataOriginal) {
  const currentNote = this.getActiveObject();
  const position = this.getNewPositionNextToActiveObject('right');
  const self = this;
  const currentWidgetsTextContent = currentNote.getText();
  const commandData = JSON.parse(JSON.stringify(commandDataOriginal));

  if (commandData.bindingTemplates && commandData.customizedContentOutputFormat && commandData.customizedContentOutputFormat.length > 0) {
    commandData.command += '/n please generate the JSON format, the field list and how many value items to generate(if specify): ' + transformJsonToTargetString(commandData.customizedContentOutputFormat);
  }

  const currentWidgets = GetSelectedWidgets();
  lockWidget(currentWidgets);

  const messageTips = Boardx.Util.Msg.info(
    t('widgetAi.generatingResults'),
    commandData.name,
    {
      timeOut: 0,
      extendedTimeOut: 0
    }
  );

  if (commandData?.name?.indexOf("Translate") > -1) {
    unlockWidget(currentWidgets);
    const language = commandData.name.split("to")[1].trim();
    await canvas.translateWidget(language);
    Boardx.Util.Msg.clear();
    return;
  }

  try {

    const response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, currentWidgetsTextContent, commandData.temperature, commandData.customizedContentOutputFormat);

    unlockWidget(currentWidgets);
    if (response.data.error) {
      Boardx.Util.Msg.clear();
      Boardx.Util.Msg.warning(response.data.error);
      return;
    }

    const content = commandData.bindingTemplates ? JSON.parse(response.data.content) : response.data.content;

    if (
      commandData.bindingTemplates &&
      commandData.templateId &&
      commandData.templateId.length > 0
      &&
      commandData.customizedContentOutputFormat &&
      commandData.customizedContentOutputFormat.length > 0
    ) {
      self.createStickyNotesByTemplate(content, commandData, position);
    } else {
      self.createTextboxByLocation(content, currentNote);
    }

    messageTips.remove();
  } catch (error) {
    unlockWidget(currentWidgets);
    Boardx.Util.Msg.clear();
    Boardx.Util.Msg.warning(error);
  }
};

// base64 转 blob
function dataURItoBlob(dataURI) {
  // 将 base64 数据去除开头部分，只保留数据部分
  const byteString = atob(dataURI);
  // 构造 Uint8Array 数组，将每个字符转为 ASCII 码对应的数字
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  // 返回 Blob 对象
  return new Blob([ab], { type: 'image/png' });
}

fabric.Canvas.prototype.AITextToImage = async function (
  commandData,
  imageBase64
) {
  const self = this;
  const currentNote = this.getActiveObject();


  const messageTips = Boardx.Util.Msg.info(
    t('widgetAi.generatingResults'),
    commandData.name,
    {
      timeOut: 0,
      extendedTimeOut: 0
    }
  );

  const prompt = await generatePrompt(commandData);

  if (currentNote.isEditing) {
    currentNote.exitEditing(); //has to exit editing mode to paste the image to the board
  }
  const currentWidgets = GetSelectedWidgets();
  lockWidget(currentWidgets);
  let positionLeft = currentNote.left;
  let positionTop = currentNote.top;


  // const checkCreditsIsEnoughResult = await checkCreditsIsEnough();
  // if (checkCreditsIsEnoughResult?.data.statue !== 1) {
  //   Boardx.Util.Msg.clear();
  //   Boardx.Util.Msg.info(t('widgetAi.noCredits'));
  //   unlockWidget(currentWidgets);
  //   return;
  // }
  const user = store.getState().user.userInfo;
  server.call('ai.textToImage', commandData, prompt, imageBase64, user).then(data => {
    unlockWidget(currentWidgets);

    data.image.forEach((image, index) => {
      const file = new File([dataURItoBlob(image.base64)], 'image.png', { type: 'image/png' });

      let left = window.innerWidth / 2;
      let top = window.innerHeight / 2;
      const positionOnCanvas = canvas.getPositionOnCanvas(left, top);

      canvas.uploadFilesToWhiteboard([file], positionLeft + commandData.width * (index + 1), positionTop);
    });
    messageTips.remove();
    // Boardx.Util.sMsg.info(t('widgetAi.youHaveConsumedCredits') + data.credit);
  }).catch(e => {
    unlockWidget(currentWidgets);
    Boardx.Util.Msg.clear();
    Boardx.Util.Msg.warning(e.error);
  });
};