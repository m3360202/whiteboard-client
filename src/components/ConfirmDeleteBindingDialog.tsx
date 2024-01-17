import React,{useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WidgetService from '../services/WidgetService';
import { useState } from 'react';
import _ from 'underscore';

export default function ConfirmationDeletePanel() {
  let confirmDeletePanel;

  const handleClose = () => {
    confirmDeletePanel = false;
  };
  let objPanel = null;
  let [open, setOpen] = useState(false);;
  let canvasEl = canvas; 

  const handleDeletePanelOnly = () => {
    confirmDeletePanel = false;

    const subObjList = objPanel.subIdList() || [];
    let stateList = [];
    canvas
      .getObjects()
      .filter((o) => _.contains(subObjList, o._id))
      .forEach((obj) => {
        obj.relationship = null;
        obj.panelObj = null;

        const stateObj = obj.getUndoRedoState('MODIFIED', {
          fields: ['panelObj', 'relationship'],
        });
        stateList = stateList.concat(stateObj);
      });
    const statePanel = objPanel.getUndoRedoState('REMOVED');
    stateList = stateList.concat(statePanel);

    setTimeout(() => {
      WidgetService.getInstance().removeWidget(objPanel._id);
      canvas.updateConnectorsRemovedWidget(objPanel);
      canvas.remove(objPanel).requestRenderAll();
      canvas.pushNewState(stateList);
    }, 200);
  };

  const handleDeletePanelAndWidgets = () => {
    confirmDeletePanel = false;
    const subObjList = objPanel.subIdList() || [];
    let stateList = [];

    canvas
      .getObjects()
      .filter((o) => _.contains(subObjList, o._id))
      .forEach((obj) => {
        const state = obj.getUndoRedoState('REMOVED');
        stateList = stateList.concat(state);
        WidgetService.getInstance().removeWidget(obj._id);
      });

    const statePanel = objPanel.getUndoRedoState('REMOVED');
    stateList = stateList.concat(statePanel);

    stateList = canvas.cleanData(stateList);

    setTimeout(() => {
      WidgetService.getInstance().removeWidget(objPanel._id);
      canvas.updateConnectorsRemovedWidget(objPanel);
      canvas.remove(objPanel).requestRenderAll();
      canvas.pushNewState(stateList);
    }, 200);
  };
  useEffect(()=>{
    if (canvasEl && canvasEl.toDeletePanelConfirmation) {
      objPanel = canvas.toDeletePanelConfirmation;
      canvas.toDeletePanelConfirmation = null;
    }
    const deletePanel = confirmDeletePanel || null;
    setOpen( !!deletePanel);
  },[canvasEl])
  return (
    <div>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={handleClose}
        open={open}
      >
        <DialogTitle id="alert-dialog-title">delete panel objects?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            delete the panel only or the panel and its widgets?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleDeletePanelOnly}
            size="small"
            style={{ width: 250 }}
            variant="contained"
          >
            Delete panel only
          </Button>
          <Button
            color="primary"
            onClick={handleDeletePanelAndWidgets}
            size="small"
            style={{ width: 300 }}
          >
            Delete panel and widgets
          </Button>
          <Button
            color="primary"
            onClick={handleClose}
            size="small"
            style={{ width: 150 }}
          >
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
