//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux toolkit
import store from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTour } from '../../store/sideBar';

//** Import i18n
import { useTranslation } from 'react-i18next';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';


export default function UserRoleInterestSelections() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isShowRoleContents, setIsShowRoleContents] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [isShowBUtton, setIsShowBUtton] = useState(false);
  const [noviceCardStyle, setNoviceCardStyle] = useState(false);
  const [intermediateCardStyle, setIntermediateCardStyle] = useState(false);
  const [expertCardStyle, setExpertCardStyle] = useState(false);
  const [newUserRoleInterestInfo, setNewUserRoleInterestInfo] = useState({
    userId: store.getState().user.userInfo.userId,
    role: undefined,
    lnterest: undefined,
  })

  useEffect(() => {
    if (localStorage.getItem('is_onboard') === 'true' && !localStorage.getItem('newUserRoleInterestInfo')) {
      setIsOpenDialog(true);
    }
  }, []);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    dispatch(handleSetOpenTour(true));
  };

  const handleClickChip = (e) => {
    setNewUserRoleInterestInfo({ ...newUserRoleInterestInfo, 'role': e.target.innerText });
    setIsShowRoleContents(false);
    setPageNum(2);
  };

  const handleClickShowButton = (e) => {
    e.stopPropagation();
    setNewUserRoleInterestInfo({ ...newUserRoleInterestInfo, 'lnterest': e.target.id });
    if (e.target.id === 'novice') {
      setNoviceCardStyle(true);
      setIntermediateCardStyle(false);
      setExpertCardStyle(false);
      setIsShowBUtton(true);
      return;
    }
    if (e.target.id === 'intermediate') {
      setNoviceCardStyle(false);
      setIntermediateCardStyle(true);
      setExpertCardStyle(false);
      setIsShowBUtton(true);
      return;
    }
    if (e.target.id === 'expert') {
      setNoviceCardStyle(false);
      setIntermediateCardStyle(false);
      setExpertCardStyle(true);
      setIsShowBUtton(true);
      return;
    }
  };

  const handleGetStarted = () => {
    setIsOpenDialog(false);
    dispatch(handleSetOpenTour(true));
    localStorage.setItem('newUserRoleInterestInfo', JSON.stringify(newUserRoleInterestInfo));
  }

  const handleRoleContentsDOM = () => {
    return (
      <Box
        id="roleContents"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ mb: '8px', fontSize: '34px' }} variant="h2">
          {t(
            'components.boardTutorial.userRoleInterestSelections.pageOneTitle',
          )}
        </Typography>
        <Typography sx={{ fontSize: '14px' }} variant="body1">
          {t(
            'components.boardTutorial.userRoleInterestSelections.pageOneInfo',
          )}
        </Typography>
        <Box sx={{
          mt: '48px', width: '440px', height: '300px', 
          '.rootChip': {
            '&:hover': {
              border: '1px solid #F21D6B',
              backgroundColor: '#f2ebff !important'
            }
          }
        }}
        >
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.design',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.research',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.productManagement',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.marketing',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.development',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.consultationStrategy',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.education',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
          <Chip
            sx={{ mr: '24px', mb: '16px' }}
            onClick={handleClickChip}
            label={t(
              'components.boardTutorial.userRoleInterestSelections.other',
            )}
            variant="outlined"
            classes={{ root: 'rootChip' }}
          />
        </Box>
        <Typography
          sx={{ fontSize: '14px', mb: '30px', cursor: 'pointer' }}
          onClick={handleCloseDialog}
          variant="body1"
        >
          {t(
            'components.boardTutorial.userRoleInterestSelections.chooseThisLater',
          )}
        </Typography>
        <Typography sx={{ fontSize: '14px' }} variant="body1">
          {pageNum}/2
        </Typography>
      </Box>
    );
  };

  const handleSelectionContentsDOM = () => {
    return (
      <Box
        id="selectionContents"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: '60px 40px 0',
        }}
      >
        <Typography
          sx={{ mb: '8px', fontSize: '34px', textAlign: 'center' }}
          variant="h2"
        >
          {t(
            'components.boardTutorial.userRoleInterestSelections.pageTwoTitle',
          )}
        </Typography>
        <Typography sx={{ fontSize: '14px' }} variant="body1">
          {t(
            'components.boardTutorial.userRoleInterestSelections.pageOneInfo',
          )}
        </Typography>
        <Box
          sx={{
            mt: '48px',
            width: '500px',
            height: '250px',
            display: 'flex',
            justifyContent: 'space-between',
            '.rootCard': {
              width: '154px',
              height: '164px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(58, 53, 65, 0.23)',
              borderRadius: '8px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid #F21D6B',
                backgroundColor: '#f2ebff',
              }
            },
            '.cardActive': {
              border: '1px solid #F21D6B',
              backgroundColor: '#f2ebff',
            },
            'rootCardContent': {
              fontSize: '12px',
              textAlign: 'center'
            }
          }}
        >
          <Card
            id="novice"
            onClick={handleClickShowButton}
            classes={{ root: 'rootCard' }}
            className={noviceCardStyle ? 'cardActive' : ''}
          >
            <CardActions id="novice" sx={{ p: 0 }}>
              <Typography id="novice" variant="body1">
                {t(
                  'components.boardTutorial.userRoleInterestSelections.novice',
                )}
              </Typography>
            </CardActions>
            <CardContent
              id="novice"
              classes={{ root: 'rootCardContent' }}
            >
              {t(
                'components.boardTutorial.userRoleInterestSelections.noviceContent',
              )}
            </CardContent>
          </Card>
          <Card
            id="intermediate"
            onClick={handleClickShowButton}
            classes={{ root: 'rootCard' }}
            className={intermediateCardStyle ? 'cardActive' : ''}
          >
            <CardActions id="intermediate" sx={{ p: 0 }}>
              <Typography id="intermediate" variant="body1">
                {t(
                  'components.boardTutorial.userRoleInterestSelections.intermediate',
                )}
              </Typography>
            </CardActions>
            <CardContent
              id="intermediate"
              classes={{ root: 'rootCardContent' }}
            >
              {t(
                'components.boardTutorial.userRoleInterestSelections.intermediateContent',
              )}
            </CardContent>
          </Card>
          <Card
            id="expert"
            onClick={handleClickShowButton}
            classes={{ root: 'rootCard' }}
            className={expertCardStyle ? 'cardActive' : ''}
          >
            <CardActions id="expert" sx={{ p: 0 }}>
              <Typography id="expert" variant="body1">
                {t(
                  'components.boardTutorial.userRoleInterestSelections.expert',
                )}
              </Typography>
            </CardActions>
            <CardContent
              id="expert"
              classes={{ root: 'rootCardContent' }}
            >
              {t(
                'components.boardTutorial.userRoleInterestSelections.expertContent',
              )}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ height: '56px', width: '500px' }}>
          <Button
            onClick={handleGetStarted}
            style={{ display: isShowBUtton ? 'block' : 'none' }}
            sx={{
              color: '#FFFFFF',
              width: '100%',
              height: '56px',
            }}
            color="primary"
            variant="contained"
          >
            {t(
              'components.boardTutorial.userRoleInterestSelections.getStarted',
            )}
          </Button>
        </Box>
        <Typography
          sx={{ mt: '22px', fontSize: '14px', mb: '30px', cursor: 'pointer' }}
          onClick={handleCloseDialog}
          variant="body1"
        >
          {t(
            'components.boardTutorial.userRoleInterestSelections.chooseThisLater',
          )}
        </Typography>
        <Typography sx={{ fontSize: '14px' }} variant="body1">
          {pageNum}/2
        </Typography>
      </Box >
    );
  };

  return (
    <Dialog sx={{
      '.paperDialog': {
        width: '684px',
        height: '640px',
        background: '#FFFFFF',
        boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
        borderRadius: '6px',
        margin: 0,
        maxWidth: 'unset',
        color: 'rgba(58, 53, 65, 0.38) !important',
      },
      '.rootDialogTitle': {
        fontSize: '32px',
        color: '#F21D6B',
        textAlign: 'center',
        marginTop: '35px',
      },
    }} classes={{ paper: 'paperDialog' }}
      open={isOpenDialog}>
      <DialogTitle
        style={{ display: isShowRoleContents ? 'block' : 'none' }}
        classes={{ root: 'rootDialogTitle' }}
      >
        {/* <Typed strings={['Welcome!']} typeSpeed={100} loop={true} /> */}
        {t('components.boardTutorial.userRoleInterestSelections.welcome')}
      </DialogTitle>
      <DialogContent>
        {isShowRoleContents
          ? handleRoleContentsDOM()
          : handleSelectionContentsDOM()}
      </DialogContent>
    </Dialog>
  );
}
