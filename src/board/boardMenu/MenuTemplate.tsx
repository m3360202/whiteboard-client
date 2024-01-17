//**Import React */
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//**Import Mui */
import { Theme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

//**Import Service */
import { BoardService } from '../../services';

//**Import Others */
import MenuTemplateDetail from './MenuTemplateDetail';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { changeMode } from '../../store/mode';
import { handleSetTemplateDetail } from '../../store/resource';
const PREFIX = 'MenuTemplate';

const classes = {
  typography: `${PREFIX}-typography`,
  dashboardButton: `${PREFIX}-dashboardButton`,
  root: `${PREFIX}-root`,
  gridList: `${PREFIX}-gridList`,
  padding: `${PREFIX}-padding`,
  demo1: `${PREFIX}-demo1`,
  range2: `${PREFIX}-range2`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.typography}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.dashboardButton}`]: {
    padding: 14
  },

  [`& .${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },

  [`& .${classes.gridList}`]: {
    width: 500,
    height: 450
  },

  [`& .${classes.padding}`]: {
    padding: theme.spacing(3)
  },

  [`& .${classes.demo1}`]: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%'
  },

}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  width: '90%',
  maxWidth: '1164px',
  height: '700px',
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  alignItems: 'center',
  boxShadow: '0px 1px 3px 2px #00000014',
  borderRadius: '8px'
}));

export default function SimpleCard() {
  //init useHooks


  //hooks
  const [open, setOpen] = useState(false);
  const id = open ? 'template-popover' : undefined;
  const dispatch = useDispatch();
  const templateDetail = useSelector((state: RootState) => state.resource.templateDetail);
  const currentTemplate = useSelector((state: RootState) => state.resource.currentTemplate);
  const openTemplate = useSelector((state: RootState) => state.resource.openTempalte);
  const handleClose = () => {
    store.dispatch(handleSetTemplateDetail(false));
    dispatch(changeMode('default'));
    setOpen(false);
  };

  useEffect(() => {
    if (openTemplate) {
      setOpen(true);
    }
  }, [openTemplate])
  return (
    <Root>
      <StyledDialog
        id={id}
        open={templateDetail}
        fullScreen
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <MenuTemplateDetail
          handleClose={handleClose}
          currentTemplate={currentTemplate}
        />
      </StyledDialog>
      {/* {templateDetail ? (
        <Dialog
          id={id}
          open={templateDetail}
          fullScreen
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{ root: classes.range2 }}
        >
          <MenuTemplateDetail
            handleClose={handleClose}
            currentTemplate={currentTemplate}
          />
        </Dialog>
      ) : (
        <Dialog
          id={id}
          open={open}
          fullScreen
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{ root: classes.range2 }}
        >
          <MenuTemplatePage handleClose={handleClose} />
        </Dialog>
      )} */}
    </Root>
  );
}