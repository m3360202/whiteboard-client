import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SwipeableViews from 'react-swipeable-views';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MobileStepper from '../../../mui/components/MobileStepper';
import { BoardService } from '../../../services';
//** Import Redux toolkit
import store from '../../../store';
import {handleSetShowMoreMenu,handleSetShowTutorial} from '../../../store/board'

export default function Tutorial({ setSelectMore }) {
  const [open, setOpen] = React.useState(false);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [];
  const { t } = useTranslation();
  steps.push({
    name: 'step2',
    title: t('board.tutorial.interactingwiththeBoard'),
    description: t('board.tutorial.interactingwiththeBoardContent'),
  });
  steps.push({
    name: 'step3',
    title: t('board.tutorial.stickyNotes'),
    description: t('board.tutorial.stickyNotesContent'),
  });
  steps.push({
    name: 'step4',
    title: t('board.tutorial.drawingontheBoard'),
    description: t('board.tutorial.drawingontheBoardContent'),
  });
  steps.push({
    name: 'step5',
    title: t('board.tutorial.imageSearch'),
    description: t('board.tutorial.imageSearchContent'),
  });
  steps.push({
    name: 'step6',
    title: t('board.tutorial.iconSearch'),
    description: t('board.tutorial.iconSearchContent'),
  });
  steps.push({
    name: 'step7',
    title: t('board.tutorial.arrows'),
    description: t('board.tutorial.arrowsContent'),
  });
  steps.push({
    name: 'step8',
    title: t('board.tutorial.templates'),
    description: t('board.tutorial.templatesContent'),
  });

  const maxSteps = steps.length;
  const handleClickOpen = () => {
    setSelectMore(false);
    store.dispatch(handleSetShowTutorial(true));
    store.dispatch(handleSetShowMoreMenu(false));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStart = () => {
    if (openWelcome === true) {
      setOpenWelcome(false);
      setOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div>
      <MenuItem
        sx={{ '.gutter':{paddingTop: '8px',
        paddingBottom: '8px',}}}
        classes={{ gutters: 'gutters' }}

        onClick={() => handleClickOpen()}
      >
        {t('board.header.moreTutorial')}
      </MenuItem>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        sx={{
          width: '56%',
          minWidth: '600px',
          maxWidth: '630px',
          maxHeight: '610px',
          minHeight: '577px',
          height: '65%',
          left: '30%',
          top: '15%',
          boxShadow: '0px 1px 3px 2px #00000014',
          borderRadius: '8px',
          '& .MuiDialog-paperFullScreen': {
            borderRadius: 8,
        }
      }}
        fullScreen
        onClose={handleClose}
        open={false} // temporarily disabled   open
        sx={{ '.img':{  display: 'block',
        overflow: 'hidden',
        width: '100%',
        height: '100%',}}}
      >
        <MobileStepper
          LinearProgressProps={{ style: { color: 'secondary' } }}
          activeStep={activeStep}
          position="static"
          steps={maxSteps}
          variant="progress"
        />
        <div>
          <Typography sx={{ marginLeft: '24px',
    marginTop: '24px',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '30px',
    lineHeight: '44px',
    color: '#232930',
    float: 'left',}}>
            {steps[activeStep].title}
          </Typography>
          <Typography sx={{  marginRight: '24px',
    marginTop: '38px',
    height: '24px',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(35, 41, 48, 0.65)',
    width: '30%',
    float: 'right',
    textAlign: 'right',}}>
            {' '}
            {activeStep + 1}
            /7
          </Typography>
        </div>

        <DialogContent sx={{  overflow: 'hidden',}}>
          <Paper sx={{  display: 'flex',
    alignItems: 'center',
    height: 92,
    fontSize: '16px',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
   
    }} elevation={0} square>
            <Typography>{steps[activeStep].description}</Typography>
          </Paper>
          <div className={'img'}>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              enableMouseEvents
              index={activeStep}
              onChangeIndex={handleStepChange}
            >
              {steps.map((step, index) => (
                <div key={step.description}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <img
                      alt={step.description}
                      className={'img'}
                      src={`/gif/${step.name}.gif`}
                    />
                  ) : null}
                </div>
              ))}
            </SwipeableViews>
          </div>
        </DialogContent>
        <DialogActions>
          {activeStep < 6 && (
            <Button
              color="primary"
              data-cy="skip"
              onClick={handleClose}
              variant="text"
            >
              {t('board.tutorial.skip')}
            </Button>
          )}
          <Button
            color="primary"
            disabled={activeStep === 0}
            onClick={handleBack}
            size="small"
            variant="text"
          >
            {t('board.tutorial.previous')}
          </Button>
          {activeStep < 6 && (
            <Button
              sx={{    width: 'auto',}}
              color="primary"
              onClick={handleNext}
              size="small"
              variant="contained"
            >
              {t('board.tutorial.nextTip')}
            </Button>
          )}

          {activeStep === 6 && (
            <Button
              color="primary"
              onClick={handleClose}
              size="small"
              variant="contained"
            >
              {t('board.tutorial.done')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
