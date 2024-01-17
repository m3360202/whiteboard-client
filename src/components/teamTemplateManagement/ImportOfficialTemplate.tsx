//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOfficialTemplatesQuery } from '../../redux/ResourceAPISlice';
import { useBatchImportOfficialTemplatesMutation } from '../../redux/BoardAPISlice';
import { UtilityService } from '../../services';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const PREFIX = 'ImportOfficialTemplate';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox: `${PREFIX}-contentBox`,
  dialogHeader: `${PREFIX}-dialogHeader`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogSubtitle: `${PREFIX}-dialogSubtitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  imagesCommandBox: `${PREFIX}-imagesCommandBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardRoot2: `${PREFIX}-cardRoot2`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`,
  customCommandName: `${PREFIX}-customCommandName`,
  textFieldRoot: `${PREFIX}-textFieldRoot`
};

const StyledCard = styled(Card)((
  { theme }
) => ({
  [`& .${classes.dialogBox}`]: {
    maxWidth: 'unset',
    borderRadius: '6px'
  },

  [`& .${classes.contentBox}`]: {
    width: '800px',
    maxWidth: '800px',
    height: 'auto',
    padding: '0 24px 10px',
    boxSizing: 'border-box'
  },

  [`& .${classes.dialogHeader}`]: {
    position: 'relative',
    paddingTop: '40px',
    width: '100%',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  [`& .${classes.dialogTitle}`]: {
    lineHeight: '19px',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '16px',
    textTransform: 'capitalize'
  },

  [`& .${classes.dialogSubtitle}`]: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: '12px',
    color: 'rgba(35, 41, 48, 0.65)',
    lineHeight: '15px',
    marginTop: '8px',
    marginBottom: '16px'
  },

  [`& .${classes.dialogContent}`]: {
    maxHeight: '350px',
    padding: 0,
    overflow: 'hidden',
    overflowY: 'scroll'
  },

  [`& .${classes.imagesCommandBox}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  [`& .${classes.cardRoot}`]: {
    width: '174px',
    cursor: 'pointer',
    marginBottom: '10px',
    position: 'relative',
    borderRadius: '0px',
    boxShadow: 'none'
  },

  [`& .${classes.cardRoot2}`]: {
    width: '174px',
    opacity: 0
  },

  [`& .${classes.cardMediaRoot}`]: {
    boxSizing: 'border-box',
    borderRadius: '2px',
    border: '2px solid transparent',
    '&:hover': {
      boxSizing: 'border-box',
      border: '2px solid #F21D6B'
    }
  },

  [`& .${classes.cardMediaActive}`]: {
    padding: '2px',
    boxSizing: 'border-box',
    border: '2px solid #F21D6B'
  },

  [`& .${classes.customCommandName}`]: {
    color: '#232930',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    paddingTop: '4px',
    whiteSpace: 'nowrap',
    paddingRight: 0,
    textOverflow: 'ellipsis',
    fontSize: '14px',
    fontWeight: 400
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '400px',
    marginBottom: '15px',
    '& .MuiOutlinedInput-root': {
      padding: 0,
      height: '38px'
    }
  }
}));

const ImportOfficialTemplate = props => {
  const {
    openImportOfficialTemplateDialog,
    setOpenImportOfficialTemplateDialog
  } = props;

  const { t } = useTranslation();
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const [currentTemplateData, setCurrentTemplateData] = React.useState(null);
  const [importTemplateData, setImportTemplateData] = React.useState([]);
  const [loadingBtn, setLoadingBtn] = React.useState(false);

  const { data: offTemplateList = [] } = useGetOfficialTemplatesQuery(orgId);
  const [batchImportOfficialTemplates] =
    useBatchImportOfficialTemplatesMutation();

  useEffect(() => {
    if (offTemplateList) {
      setCurrentTemplateData(offTemplateList);
    }
  }, [offTemplateList]);

  const handleClosesDialog = () => {
    setOpenImportOfficialTemplateDialog(false);
  };

  const handleClickSave = async () => {
    setLoadingBtn(true);
    let newImportTemplateData = importTemplateData.map(item => ({
      isTeamsTemplate: true,
      orgId: orgId,
      roomId: 'none',
      name: item.name,
      userId: store.getState().user.userInfo.userId,
      createdByName: store.getState().user.userInfo.userName,
      allowAnonymous: true,
      thumbnail: item.thumbnail,
      thumbnail2: item.thumbnail2,
      createdBy: store.getState().user.userInfo.userId,
      lastUpdateBy: store.getState().user.userInfo.userId,
      lastUpdateTime: Date.now(),
      timestamp: Date.now(),
      users: [],
      createtime: Date.now(),
      _id: UtilityService.getInstance().generateWidgetID()
    }));

    await batchImportOfficialTemplates({
      templatesData: newImportTemplateData
    });
    Boardx.Util.Msg.success(
      t('teamsManagement.importOfficialTemplateSuccess')
    );
    setLoadingBtn(false);
    handleClosesDialog();
  };

  const handleEnterSearchTemplate = value => {
    if (value.trim() !== '') {
      const result = (offTemplateList as any).filter(item => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      setCurrentTemplateData(result);
    }
    handleChangeSearchValue(value);
  };

  const handleChangeSearchValue = value => {
    if (value.trim() === '') {
      setCurrentTemplateData(offTemplateList);
    }
  };

  return (
    <Dialog
      open={openImportOfficialTemplateDialog}
      onClose={handleClosesDialog}
      id="bindingTemplatesDialog"
      classes={{ paper: classes.dialogBox }}
    >
      <Box className={classes.contentBox}>
        {/* Title */}
        <Box className={classes.dialogHeader}>
          <TextField
            onContextMenu={e => {
              e.stopPropagation();
            }}
            onPaste={e => {
              e.stopPropagation();
            }}
            onChange={event => handleChangeSearchValue(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter')
                handleEnterSearchTemplate((event as any).target.value);
            }}
            classes={{ root: classes.textFieldRoot }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ ml: '-10px' }} size="large">
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            placeholder="Search for templates, enter to confirm"
            variant="outlined"
          />
          <Typography className={classes.dialogTitle} variant="h4">
            Please select a template
          </Typography>
          <Typography className={classes.dialogSubtitle} variant="h4">
            Mouse click to select, double click to deselect!
          </Typography>
          <Divider sx={{ width: '100%' }} />
        </Box>

        <DialogContent classes={{ root: classes.dialogContent }}>
          <Box className={classes.imagesCommandBox}>
            {currentTemplateData &&
              currentTemplateData.map((item, index) => (
                <TemplatesCard
                  key={index}
                  item={item}
                  index={index}
                  importTemplateData={importTemplateData}
                  setImportTemplateData={setImportTemplateData}
                  classes={classes}
                />
              ))}

            {currentTemplateData &&
              currentTemplateData.length % 4 === 2 &&
              currentTemplateData
                .slice(0, 2)
                .map((item, index) => (
                  <StyledCard
                    classes={{ root: classes.cardRoot2 }}
                    key={index}
                  ></StyledCard>
                ))}

            {currentTemplateData &&
              currentTemplateData.length % 4 === 3 &&
              currentTemplateData
                .slice(0, 2)
                .map((item, index) => (
                  <Card
                    classes={{ root: classes.cardRoot2 }}
                    key={index}
                  ></Card>
                ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={handleClosesDialog}>
            Cancel
          </Button>
          <LoadingButton
            loading={loadingBtn}
            disabled={!importTemplateData}
            variant="contained"
            onClick={handleClickSave}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const TemplatesCard = ({
  item,
  index,
  importTemplateData,
  setImportTemplateData,
  classes
}) => {
  const handleClickCard = () => {
    const result = importTemplateData.filter(
      template => template._id !== item._id
    );
    setImportTemplateData([...result, item]);
  };

  const handleClickRemoveCard = () => {
    const result = importTemplateData.filter(
      template => template._id !== item._id
    );
    setImportTemplateData(result);
  };

  return (
    <Card
      classes={{ root: classes.cardRoot }}
      onClick={handleClickCard}
      onDoubleClick={handleClickRemoveCard}
      key={index}
    >
      <CardMedia
        classes={{ root: classes.cardMediaRoot }}
        className={
          importTemplateData && importTemplateData.includes(item)
            ? classes.cardMediaActive
            : ''
        }
        component="img"
        width="174"
        height="108"
        image={
          item.thumbnail2
            ? item.thumbnail2
            : item.thumbnail
            ? item.thumbnail
            : '/images/abbdgor.png'
        }
      />
      <Typography className={classes.customCommandName}>{item.name}</Typography>
    </Card>
  );
};

export default ImportOfficialTemplate;
