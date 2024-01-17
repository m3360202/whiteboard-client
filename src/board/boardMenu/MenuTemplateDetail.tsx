//**Import React */
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//**Import i18n */
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { handleSetOpenResources } from '../../store/sideBar';
import { changeMode } from '../../store/mode';
import {
  useGetOrgAdminQuery,
  useGetOwnTemplatesByTypeQuery,
  useGetOrgTemplatesByTypeQuery,
  useAddWhiteboardMutation
} from '../../redux/BoardAPISlice';
import {
  useEditTemplateMutation,
  useDelTemplateMutation
} from '../../redux/TemplateApiSlice';
import { handleSetTemplateDetail } from '../../store/resource';

import ClipboardService from '../../services/ClipboardService';
import { Typography, Box, Chip, Card, CardMedia, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { WidgetAPI } from '../../redux/WidgetAPISlice';
import CloseIcon from '@mui/icons-material/Close';
import { BoardService } from '../../services';

import store from '../../store';
const PREFIX = 'MenuTemplateDetail';

const classes = {
  saveButton: `${PREFIX}-saveButton`,
  templateHeader: `${PREFIX}-templateHeader`,
  templateName: `${PREFIX}-templateName`,
  templateNameHeader: `${PREFIX}-templateNameHeader`,
  templateNameTitle: `${PREFIX}-templateNameTitle`,
  templateShare: `${PREFIX}-templateShare`,
  templateShareHeader: `${PREFIX}-templateShareHeader`,
  templateCreate: `${PREFIX}-templateCreate`,
  root: `${PREFIX}-root`,
  rootBox: `${PREFIX}-rootBox`,
  closeDialogBtn: `${PREFIX}-closeDialogBtn`,
  rootBoxLeft: `${PREFIX}-rootBoxLeft`,
  rootBoxRight: `${PREFIX}-rootBoxRight`,
  chip: `${PREFIX}-chip`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  backBox: `${PREFIX}-backBox`,
  backTypo: `${PREFIX}-backTypo`,
  endAdornment: `${PREFIX}-endAdornment`,
  autocompleteRoot: `${PREFIX}-autocompleteRoot`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`,
  autocompleteEndAdornment: `${PREFIX}-autocompleteEndAdornment`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.saveButton}`]: {
    color: '#F21D6B',
    fontSize: '12px',
    border: '1px solid #F21D6B',
    right: '10px',
    '&:hover': {
      color: '#ffffff'
    }
  },

  [`& .${classes.templateHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px',
    justifyContent: 'space-between',
    width: '480px'
  },

  [`& .${classes.templateName}`]: {
    color: '#232930',
    fontSize: '28px'
  },

  [`& .${classes.templateNameHeader}`]: {
    width: '100%',
    textAlign: 'left',
    padding: '24px 32px 0 32px'
  },

  [`& .${classes.templateNameTitle}`]: {
    color: '#232930',
    fontSize: '16px',
    width: '360px',
    marginBottom: '24px'
  },

  [`& .${classes.templateShare}`]: {
    color: '#232930',
    fontSize: '16px'
  },

  [`& .${classes.templateShareHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px'
  },

  [`& .${classes.templateCreate}`]: {
    textAlign: 'right',
    padding: '32px 32px 32px 0px'
  },

  [`&.${classes.root}`]: {
    overflowX: 'hidden',
    position: 'relative'
  },

  [`& .${classes.rootBox}`]: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '24px',
    width: '100%',
    marginTop: '94px',
    paddingLeft: '60px',
    flexDirection: 'row'
  },

  [`& .${classes.closeDialogBtn}`]: {
    position: 'absolute',
    right: '20px',
    top: '20px'
  },

  [`& .${classes.rootBoxLeft}`]: {
    width: '320px',
    height: '550px',
    display: 'flex',
    rowGap: '24px',
    flexDirection: 'column'
  },

  [`& .${classes.rootBoxRight}`]: {
    width: '640px',
    maxHeight: '500px',
    marginTop: '-120px',
    objectFit: 'contain'
  },

  [`& .${classes.chip}`]: {
    color: '#f21d6b',
    marginTop: '8px',
    marginRight: '8px',
    fontSize: '12px',
    backgroundColor: '#F2F2F3',
    fontWeight: 500
  },

  [`& .${classes.title}`]: {
    fontSize: '28px',
    fontWeight: 500
  },

  [`& .${classes.description}`]: {
    fontSize: '16px',
    height: 'auto',
    width: '312px',
    margin: '20px 0',
    overflow: 'auto'
  },

  [`& .${classes.backBox}`]: {
    display: 'flex',
    position: 'absolute',
    marginTop: '28px',
    marginLeft: '28px'
  },

  [`& .${classes.backTypo}`]: {
    fontSize: '16px',
    fontWeight: 500,
    marginLeft: '12px',
    marginTop: '2px'
  },

  [`& .${classes.endAdornment}`]: {
    top: 0
  },

  [`& .${classes.autocompleteRoot}`]: {
    width: '450px'
  },

  [`& .${classes.autocompleteInputRoot}`]: {
    minHeight: '45px',
    padding: '0px !important'
  },

  [`& .${classes.autocompleteInput}`]: {
    paddingLeft: '15px !important'
  },

  [`& .${classes.autocompleteFocused}`]: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B !important'
    }
  },

  [`& .${classes.autocompleteEndAdornment}`]: {
    top: 'unset !important'
  }
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  [`& .${classes.templateHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px',
    justifyContent: 'space-between',
    width: '480px'
  },

  [`& .${classes.templateName}`]: {
    color: '#232930',
    fontSize: '28px'
  },

  [`& .${classes.templateNameHeader}`]: {
    width: '100%',
    textAlign: 'left',
    padding: '24px 32px 0 32px'
  },

  [`& .${classes.templateNameTitle}`]: {
    color: '#232930',
    fontSize: '16px',
    width: '360px',
    marginBottom: '24px'
  },

  [`& .${classes.templateShare}`]: {
    color: '#232930',
    fontSize: '16px'
  },

  [`& .${classes.templateShareHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px'
  },

  [`& .${classes.templateCreate}`]: {
    textAlign: 'right',
    padding: '32px 32px 32px 0px'
  },

  [`&.${classes.root}`]: {
    overflowX: 'hidden',
    position: 'relative'
  },

  [`& .${classes.title}`]: {
    fontSize: '28px',
    fontWeight: 500
  },

  [`& .${classes.endAdornment}`]: {
    top: 0
  },

  [`& .${classes.autocompleteRoot}`]: {
    width: '450px'
  },

  [`& .${classes.autocompleteInputRoot}`]: {
    minHeight: '45px',
    padding: '0px !important'
  },

  [`& .${classes.autocompleteInput}`]: {
    paddingLeft: '15px !important'
  },

  [`& .${classes.autocompleteFocused}`]: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B !important'
    }
  },

  [`& .${classes.autocompleteEndAdornment}`]: {
    top: 'unset !important'
  }
}));

const boardCategoryList = [
  'AI',
  'Featured',
  'Basics',
  'Workshop & Meeting',
  'Project Management',
  'Design Thinking',
  'Strategy & Planning',
  'Lean Manufacturing',
  'Storytelling',
  'Education',
  'Games'
];

export default function MenuTemplateDetail(props) {
  //init use react hooks
  const dispatch = useDispatch();

  const { t } = useTranslation();
  //init props
  const { currentTemplate, handleClose } = props;
  const [anchorEl, setanchorEl] = useState(null);
  const [createTemplateBtnLoading, setCreateTemplateBtnLoading] =
    useState(false);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);

  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId); //org
  //boardList
  const boardList = useSelector(
    (state: RootState) => state.boardList.boardList
  );
  const orgAdmin = useGetOrgAdminQuery(orgId);
  const imgSource = currentTemplate.thumbnail
    ? currentTemplate.thumbnail
    : '/images/boardbg.png';
  const backText = t('board.menu.templates.back');
  const [saveTemplatePop, setSaveTemplatePop] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [description, setDescription] = useState(null);
  const [shareToTeam, setShareToTeam] = useState(false);
  const [open, setOpen] = React.useState(false);

  const [editTemplate] = useEditTemplateMutation();
  const [delTemplate] = useDelTemplateMutation();
  const [addWhiteboard, { error }] = useAddWhiteboardMutation();
  const { data: myTemplateList = [] } = useGetOwnTemplatesByTypeQuery({ orgId: orgId });

  const { data: orgTemplateList = [] } = useGetOrgTemplatesByTypeQuery({ orgId: orgId });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentTemplate) {
      setTemplateName(currentTemplate.name);
      setDescription(currentTemplate.description);
      if (currentTemplate.onlyMe && currentTemplate.onlyMe === 1) {
        setShareToTeam(false);
      }
      if (currentTemplate.onlyMe && currentTemplate.onlyMe === 2) {
        setShareToTeam(true);
      }
    }
  }, [currentTemplate]);

  const handleBack = e => {
    store.dispatch(handleSetTemplateDetail(false));
  };

  const handleOpenTemplate = async e => {
    setCreateTemplateBtnLoading(true);
    if (location.pathname === '/recent') {
      let currentRoomId = 'none';
      let boardName = t('components.board.defaultBoardName');
      localStorage.setItem('pageFrom', 'recent');
      const boardData = {
        name: boardName,
        userId: store.getState().user.userInfo.userId,
        roomId: currentRoomId,
        createdByName: store.getState().user.userInfo.userName,
        allowAnonymous: true,
        orgId: orgId
      };

      const response: any = await addWhiteboard({ boardData: boardData });
      if (error) {
        Boardx.Util.Msg.warning(t('pages.listPage.createFailed'));
      }
      window.location.href =
        window.location.origin + `board/${response.data._id}?${currentTemplate._id}`;
      setCreateTemplateBtnLoading(false);

      return;
    }
    loadTemplate(currentTemplate);
    setCreateTemplateBtnLoading(false);
    handleClose();
    dispatch(handleSetOpenResources(false));
  };

  const loadTemplate = async (currentTemplate) => {

    const templateDetail = await store.dispatch(WidgetAPI.endpoints.getWidgetsByTemplateId.initiate(currentTemplate._id));
    const jsonObj = { data: templateDetail.data, type: 'whiteboard' };
    const stringUrl = JSON.stringify(jsonObj);
    const newPosition = canvas.getVpCenter();
    const boardId= store.getState().board.board._id;
    const userId= store.getState().user.userInfo.userId;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    ClipboardService.getInstance().pasteCallback([], stringUrl, newPosition, boardId, userId);
    setCreateTemplateBtnLoading(false);
  }

  const handleOpenSavePop = e => {
    setanchorEl(e.currentTarget);
    setSaveTemplatePop(true);
  };

  const handleDelTemplate = async boardId => {
    await delTemplate({ boardId: boardId });
    handleClose();
    Boardx.Util.Msg.info(t('board.contextMenu.delTemplate'));

    // WidgetService.getInstance().delTemplate(boardId, (error, result) => {
    //   handleClose();
    //   dispatch(handleSetOpenResources(false));
    //   Boardx.Util.Msg.info(t('board.contextMenu.delTemplate'));
    // });
  };

  const handleSetTemplateName = e => {
    e.preventDefault();
    e.stopPropagation();
    setTemplateName(e.target.value);
  };

  const handleSetTemplateDes = e => {
    e.preventDefault();
    e.stopPropagation();
    setDescription(e.target.value);
  };

  const handleCloseTemplatePop = () => {
    setSaveTemplatePop(false);
    setDescription(null);
    setTemplateName(null);
    setSelectedCategoryList([]);
    setShareToTeam(false);
    dispatch(changeMode('default'));
  };

  const handleShareToTeam = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShareToTeam(event.target.checked);
  };

  const handleSaveTemplate = async () => {
    let onlyMe = shareToTeam ? 2 : 1;
    const data = {
      boardId: currentTemplate._id,
      name: templateName,
      description: description,
      onlyMe: onlyMe
    };

    await editTemplate({
      data: data,
      currentTemplate: currentTemplate,
      templateName: templateName,
      description: description,
      onlyMe: onlyMe,
      tags: selectedCategoryList
    });

    setSaveTemplatePop(false);
    setanchorEl(null);
    setSaveTemplatePop(false);
    // getTemplateList();
    Boardx.Util.Msg.info(t('board.contextMenu.saveTemplate'));

    // WidgetService.getInstance().editMyTemplate(data, (error, result) => {
    //   let boardTemplate = currentTemplate;
    //   boardTemplate.name = templateName;
    //   boardTemplate.description = description;
    //   boardTemplate.onlyMe = onlyMe;
    //   store.dispatch(handleSetCurrentTemplate(boardTemplate));
    //   setSaveTemplatePop(false);
    //   setanchorEl(null);
    //   setSaveTemplatePop(false);
    //   getTemplateList();
    //   Boardx.Util.Msg.info(t('board.contextMenu.saveTemplate'));
    // });
  };

  // const getTemplateList = async () => {
  //   console.log('getMytemplatelist2');

  //   await BoardService.getInstance().getTemplatesByType(
  //     'own',
  //     orgId,
  //     (error, result) => {
  //       if (result) {
  //         store.dispatch(handleSetMyTemplateList(result));
  //       }
  //     }
  //   );
  //   await BoardService.getInstance().getTemplatesByType(
  //     'org',
  //     orgId,
  //     (error, result) => {
  //       if (result) {
  //         store.dispatch(handleSetOrgTemplateList(result));
  //       }
  //     }
  //   );
  // };

  const chipList =
    currentTemplate.tags && currentTemplate.tags.length > 0
      ? currentTemplate.tags.map((tag, index) => {
        return (
          <Chip key={index} label={tag} classes={{ root: classes.chip }} />
        );
      })
      : null;

  const leftBox = currentTemplate => {
    return (
      <Box className={classes.rootBoxLeft}>
        <Typography className={classes.title}>
          {currentTemplate.name}
        </Typography>
        <Box> {chipList} </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '25px',
            alignItems: 'center'
          }}
        >
          <LoadingButton
            loading={createTemplateBtnLoading}
            type="button"
            onClick={handleOpenTemplate}
            variant="contained"
            color="primary"
          >
            {t('board.menu.templates.useTemplate')}
          </LoadingButton>

          {currentTemplate.onlyMe &&
            (currentTemplate.createBy === store.getState().user.userInfo.userId || orgAdmin) && (
              <Button
                className={classes.saveButton}
                variant="outlined"
                onClick={handleOpenSavePop}
              >
                {t('board.menu.templates.editTemplate')}
              </Button>
            )}
          {currentTemplate.onlyMe &&
            (currentTemplate.createBy === store.getState().user.userInfo.userId || orgAdmin) && (
              <Button type="button" onClick={handleClickOpen} variant="text">
                {t('board.menu.templates.deleteTemplate')}
              </Button>
            )}
        </Box>
        <Typography className={classes.description}>
          {currentTemplate.description}
        </Typography>
      </Box>
    );
  };

  return (
    <Root className={classes.root}>
      {/* <Box className={classes.backBox}>
        <ArrowBackOutlinedIcon onClick={handleBack} />
        <Typography className={classes.backTypo}> {backText} </Typography>
      </Box> */}
      <Box className={classes.rootBox}>
        {leftBox(currentTemplate)}
        <Box
          component="img"
          className={classes.rootBoxRight}
          alt="Template Thumbnail"
          src={imgSource}
          sx={{ border: '1px solid #150D33', borderRadius: '8px' }}
        />
        <IconButton
          className={classes.closeDialogBtn}
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ fontWeight: 'bold', width: '300px' }}
        >
          {t('components.customTemplate.confirmDel')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('components.customTemplate.confirmContent')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleDelTemplate.bind(this, currentTemplate._id)}
          >
            {t('components.customTemplate.confirm')}
          </Button>
          <Button onClick={handleCloseDialog}>
            {t('components.customTemplate.cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <StyledPopover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        id="templatePop"
        onClose={handleCloseTemplatePop}
        open={saveTemplatePop}
      >
        <Box className={classes.templateHeader}>
          <Typography className={classes.templateName}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <svg
            onClick={handleCloseTemplatePop}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3 0.709971C12.91 0.319971 12.28 0.319971 11.89 0.709971L7 5.58997L2.11 0.699971C1.72 0.309971 1.09 0.309971 0.700001 0.699971C0.310001 1.08997 0.310001 1.71997 0.700001 2.10997L5.59 6.99997L0.700001 11.89C0.310001 12.28 0.310001 12.91 0.700001 13.3C1.09 13.69 1.72 13.69 2.11 13.3L7 8.40997L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.41 6.99997L13.3 2.10997C13.68 1.72997 13.68 1.08997 13.3 0.709971Z"
              fill="#232930"
            />
          </svg>
        </Box>
        <Box className={classes.templateNameHeader}>
          <Typography className={classes.templateNameTitle}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <TextField
            id="templateNameInput"
            style={{
              height: '40px',
              fontSize: '12px',
              width: '320px'
            }}
            type="text"
            onChange={handleSetTemplateName}
            value={templateName}
          />
        </Box>
        <Box
          className={classes.templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography className={classes.templateNameTitle}>
            {t('board.contextMenu.templateDescription')}
          </Typography>
          <TextField
            id="templateDesInput"
            style={{
              fontSize: '12px',
              width: '320px'
            }}
            multiline
            rows={4}
            type="text"
            onChange={handleSetTemplateDes}
            value={description}
          />
        </Box>
        <Box
          className={classes.templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography className={classes.templateNameTitle}>
            {t('components.board.setCategory')}
          </Typography>
          <Autocomplete
            id="tags-outlined"
            multiple
            options={boardCategoryList.map(option => option)}
            getOptionLabel={option => option}
            filterSelectedOptions
            onChange={(event, value) => {
              setSelectedCategoryList(value);
            }}
            value={selectedCategoryList}
            classes={{
              root: classes.autocompleteRoot,
              inputRoot: classes.autocompleteInputRoot,
              input: classes.autocompleteInput,
              focused: classes.autocompleteFocused,
              endAdornment: classes.autocompleteEndAdornment
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSelectedCategoryList([
                      ...selectedCategoryList,
                      event.target.value
                    ]);
                  }
                }}
                {...params}
                placeholder="Category"
              />
            )}
          />
        </Box>
        <Box
          className={classes.templateShareHeader}
          style={{ marginTop: '24px' }}
        >
          <Switch checked={shareToTeam} onChange={handleShareToTeam} />
          <Typography className={classes.templateShare}>
            {t('board.contextMenu.shareTemplate')}
          </Typography>
        </Box>
        <Box className={classes.templateCreate} style={{ marginTop: '24px' }}>
          <Button
            onClick={handleSaveTemplate}
            sx={{ fontSize: '12px' }}
            variant="contained"
            size="small"
          >
            {t('board.contextMenu.saveTemplateButton')}
          </Button>
        </Box>
      </StyledPopover>
    </Root>
  );
}
