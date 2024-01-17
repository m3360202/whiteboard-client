//** Import react
import React, { useState, useEffect } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetAiAllCustomStyleCommandQuery,
  useAddCustomizeImgCommandMutation,
  useUpdateCustomizeImgCommandMutation,
  useGetUserCustomizeImgCommandQuery
} from '../../../../redux/AiAssistApiSlice';

//** Import Mui
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

//** Import Explore Styles */
import ArtistsCommandTabPanel from '../ExploreStylesCommandType/ArtistsCommandTabPanel';
import StylesCommandTabPanel from '../ExploreStylesCommandType/StylesCommandTabPanel';
import MediumCommandTabPanel from '../ExploreStylesCommandType/MediumCommandTabPanel';

//** Import Icon */
import CloseCustomImgaeStyleDialogIcon from '../../../../mui/icons/CloseCustomImgaeStyleDialogIcon';
import AIAdvancedSettingArrowRightIcon from '../../../../mui/icons/AIAdvancedSettingArrowRightIcon';
import AIAdvancedSettingDownloadIcon from '../../../../mui/icons/AIAdvancedSettingDownloadIcon';

const PREFIX = 'CustomizeImageCommand';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox: `${PREFIX}-contentBox`,
  dialogHeader: `${PREFIX}-dialogHeader`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogSubtitle: `${PREFIX}-dialogSubtitle`,
  closeDialogButton: `${PREFIX}-closeDialogButton`,
  dialogContent: `${PREFIX}-dialogContent`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabTextButton: `${PREFIX}-tabTextButton`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  advancedSettingBox: `${PREFIX}-advancedSettingBox`,
  advancedSettingButton: `${PREFIX}-advancedSettingButton`,
  imageStyleTitle: `${PREFIX}-imageStyleTitle`,
  imagesListBox: `${PREFIX}-imagesListBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`,
  imagesCommandBox: `${PREFIX}-imagesCommandBox`,
  customCommandName: `${PREFIX}-customCommandName`,
  customizeStyleButton: `${PREFIX}-customizeStyleButton`,
  customizeImageInput: `${PREFIX}-customizeImageInput`,
  customizeStyleName: `${PREFIX}-customizeStyleName`,
  previewBox: `${PREFIX}-previewBox`,
  previewButton: `${PREFIX}-previewButton`,
  saveImageButton: `${PREFIX}-saveImageButton`,
  previewImageBox: `${PREFIX}-previewImageBox`,
  saveStyleButton: `${PREFIX}-saveStyleButton`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 'unset',
    borderRadius: '6px'
  },

  [`& .${classes.contentBox}`]: {
    width: '660px',
    height: 'auto',
    padding: '0 24px 24px',
    boxSizing: 'border-box'
  },

  //** Title Style */
  [`& .${classes.dialogHeader}`]: {
    paddingTop: '40px',
    width: '100%',
    position: 'relative',
    marginBottom: '26px'
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

  [`& .${classes.closeDialogButton}`]: {
    position: 'absolute',
    top: '8px',
    right: '-18px',
    padding: '0'
  },

  //** Content Style */
  [`& .${classes.dialogContent}`]: {
    padding: 0,
    overflow: 'hidden'
  },

  [`& .${classes.tabRoot}`]: {
    minHeight: '21px',
    paddingBottom: '14px'
  },

  [`& .${classes.tabTextButton}`]: {
    minWidth: 'unset',
    minHeight: 'unset',
    textTransform: 'unset',
    color: 'rgba(35, 41, 48, 0.65)',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '21px',
    padding: '0 10px'
  },

  [`& .${classes.tabPanelRoot}`]: {
    height: '290px',
    padding: 0,
    overflow: 'hidden',
    overflowY: 'scroll'
  },

  [`& .${classes.advancedSettingBox}`]: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },

  [`& .${classes.advancedSettingButton}`]: {
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: 500,
    padding: 0,
    color: '#232930 !important',
    height: '18px',
    marginRight: '24px'
  },

  [`& .${classes.imageStyleTitle}`]: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px',
    color: 'rgba(35, 41, 48, 0.65)',
    marginBottom: '8px'
  },

  [`& .${classes.imagesListBox}`]: {
    display: 'flex',
    height: '90px',
    float: 'left'
  },

  [`& .${classes.cardRoot}`]: {
    width: '120px',
    cursor: 'pointer',
    marginRight: '5px',
    position: 'relative'
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

  [`& .${classes.imagesCommandBox}`]: {
    height: '120px',
    overflow: 'hidden',
    overflowX: 'scroll',
    marginTop: '8px'
  },

  [`& .${classes.customCommandName}`]: {
    position: 'absolute',
    bottom: '9px',
    textAlign: 'center',
    width: '120px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#FFFFFF'
  },

  [`& .${classes.customizeStyleButton}`]: {
    minWidth: 'unset',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0.15px',
    height: 'unset',
    padding: '10px',
    border: '1px solid #F21D6B',
    borderRadius: '4px',
    background: 'transparent !important'
  },

  [`& .${classes.customizeImageInput}`]: {
    '& input': {
      fontSize: '12px',
      padding: '12px',
      color: 'rgba(0, 0, 0, 0.48)'
    }
  },

  [`& .${classes.customizeStyleName}`]: {
    '& input': {
      fontSize: '12px'
    }
  },

  [`& .${classes.previewBox}`]: {
    display: 'flex',
    marginTop: '24px'
  },

  [`& .${classes.previewButton}`]: {
    height: '32px',
    color: 'rgba(35, 41, 48, 0.65)',
    border: '1px solid rgba(0, 0, 0, 0.16) !important',
    borderRadius: '4px',
    padding: '6px 10px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    backgroundColor: '#FFFFFF !important',
    letterSpacing: '0.15px',
    '&:hover': {
      color: '#F21D6B',
      border: '1px solid #F21D6B !important',
      '& path': {
        fill: '#F21D6B'
      }
    }
  },

  [`& .${classes.saveImageButton}`]: {
    padding: '6px 10px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    height: '32px',
    borderRadius: '4px',
    marginTop: '8px'
  },

  [`& .${classes.previewImageBox}`]: {
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '3px',
    width: '148px',
    height: '111px',
    overflow: 'hidden',
    backgroundColor: '#F5F8F6',
    marginLeft: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },

  [`& .${classes.saveStyleButton}`]: {
    height: 'unset',
    padding: '8px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px'
  }
}));

export default function CustomizeImageCommand({
  openCustomImageStylesDialog,
  setOpenCustomImageStylesDialog
}) {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.user.userInfo);

  // 所有的自定义样式
  const {
    data: customStyleCommandData = [],
    isError: getAiAllCustomStyleCommandIsError,
    isSuccess: getAiAllCustomStyleCommandIsSuccess,
    isLoading: getAiAllCustomStyleCommandIsLoading
  } = useGetAiAllCustomStyleCommandQuery(undefined);

  let userCustomStyleCommandData = customStyleCommandData.filter(
    item => item.isFeatured
  );

  // 获取用户自定义的图片Command
  const {
    data: userCustomizeImgCommand = [],
    isLoading: useGetUserCustomizeImgCommandQueryIsLoading,
    isError: useGetUserCustomizeImgCommandQueryIsError,
    isSuccess: useGetUserCustomizeImgCommandQueryIsSuccess
  } = useGetUserCustomizeImgCommandQuery({
    userId: userInfo.userId
  });

  let newUserCustomizeImgCommandData = [
    ...userCustomizeImgCommand,
    ...userCustomStyleCommandData
  ];

  // 添加自定义样式
  const [addCustomizeImgCommand, { isError, isSuccess, isLoading }] =
    useAddCustomizeImgCommandMutation();

  // 更新自定义样式
  const [
    updateCustomizeImgCommand,
    {
      isError: updateCustomizeImgCommandIsError,
      isSuccess: updateCustomizeImgCommandIsSuccess,
      isLoading: updateCustomizeImgCommandIsLoading
    }
  ] = useUpdateCustomizeImgCommandMutation();

  // loading button
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [previewLoadingButton, setPreviewLoadingButton] = useState(false);
  const [saveImageLoadingButton, setSaveImageLoadingButton] = useState(false);

  // 显示更改自定义样式
  const [showCustomizeStyle, setShowCustomizeStyle] = useState(false);
  const [showSaveImageButton, setShowSaveImageButton] = useState(false);
  // 当前选中的 command
  const [currentSelectImgCommand, setCurrentSelectImgCommand] = useState({});
  // 定义自定义样式名字
  const [customizeStyleName, setCustomizeStyleName] =
    useState('Custom Style 1');
  1;

  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const [tabValue, setTabValue] = useState('1');

  const handleChangeTabValue = (
    event,
    newValue
  ) => {
    setTabValue(newValue);
  };

  //   关闭弹窗
  const handleCloseDialog = () => {
    setOpenCustomImageStylesDialog(false);
    setShowCustomizeStyle(false);
  };

  // 显示自定义样式
  const handleClickShowCustomStyle = () => {
    if (Object.getOwnPropertyNames(currentSelectImgCommand).length > 0) {
      setShowCustomizeStyle(!showCustomizeStyle);
      return;
    }
    Boardx.Util.Msg.info(
      t('components.aiAssist.aiCreateContent.selectAnArtistStyleMedium')
    );
  };

  //   更改command
  const handleChangeCustomizeStyleCommand = e => {
    const newCommand = e.target.value;
    if (newCommand === currentSelectImgCommand.command) return;
    setCurrentSelectImgCommand({
      ...currentSelectImgCommand,
      command: newCommand
    });
  };

  //   更改自定义样式名字
  const handleChangeCustomizeStyleName = e => {
    const newCustomizeStyleName = e.target.value;
    setCustomizeStyleName(newCustomizeStyleName);
    setCurrentSelectImgCommand({
      ...currentSelectImgCommand,
      name: newCustomizeStyleName
    });
  };

  const handleClickCreatePreviewImg = () => {
    const currentNote = canvas.getActiveObject();
  };

  //   保存所有更改
  const handleClickSaveCustomStyle = async () => {
    setSaveButtonLoading(true);
    handleCloseDialog();
    if (
      newUserCustomizeImgCommandData.some(
        item => item && item._id === currentSelectImgCommand._id
      )
    ) {
      // 更新
      await updateCustomizeImgCommand({
        commandId: currentSelectImgCommand._id,
        newImgCommandData: currentSelectImgCommand
      });
      setSaveButtonLoading(false);
      Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
      return;
    }

    await addCustomizeImgCommand({
      currentSelectImgCommand: currentSelectImgCommand,
      showCustomizeStyle: showCustomizeStyle,
      customizeStyleName: customizeStyleName
    });
    Boardx.Util.Msg.success(t('adminPage.saveSuccessfully'));
    setSaveButtonLoading(false);
  };

  return (
    <StyledDialog
      open={openCustomImageStylesDialog}
      onClose={handleCloseDialog}
    >
      <Box className={classes.contentBox}>
        {/* Title */}
        <Box className={classes.dialogHeader}>
          <Typography className={classes.dialogTitle} variant="h4">
            {t('widgetAi.exploreStyles')}
          </Typography>
          <Typography className={classes.dialogSubtitle} variant="h4">
            {t('widgetAi.pleaseChooseOnlyOneArtistStyleMedium')}
            <br />
            {t('widgetAi.atATimeForABetterResult')}
          </Typography>
          <Divider />
          <IconButton
            onClick={handleCloseDialog}
            className={classes.closeDialogButton}
          >
            <CloseCustomImgaeStyleDialogIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent classes={{ root: classes.dialogContent }}>
          <TabContext value={tabValue}>
            <TabList
              classes={{ root: classes.tabRoot }}
              onChange={handleChangeTabValue}
            >
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('widgetAi.artists')}
                value="1"
              />
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('widgetAi.styles')}
                value="2"
              />
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('widgetAi.mediums')}
                value="3"
              />
            </TabList>

            <TabPanel classes={{ root: classes.tabPanelRoot }} value="1">
              <ArtistsCommandTabPanel
                customStyleCommandData={customStyleCommandData}
                currentSelectImgCommand={currentSelectImgCommand}
                setCurrentSelectImgCommand={setCurrentSelectImgCommand}
                setShowCustomizeStyle={setShowCustomizeStyle}
              />
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
              <StylesCommandTabPanel
                customStyleCommandData={customStyleCommandData}
                currentSelectImgCommand={currentSelectImgCommand}
                setCurrentSelectImgCommand={setCurrentSelectImgCommand}
                setShowCustomizeStyle={setShowCustomizeStyle}
              />
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="3">
              <MediumCommandTabPanel
                customStyleCommandData={customStyleCommandData}
                currentSelectImgCommand={currentSelectImgCommand}
                setCurrentSelectImgCommand={setCurrentSelectImgCommand}
                setShowCustomizeStyle={setShowCustomizeStyle}
              />
            </TabPanel>
          </TabContext>

          {/* CustomizeStyle */}
          {showCustomizeStyle ? (
            <Box sx={{ mt: '15px', mr: '22px' }}>
              <Box sx={{ mb: '16px' }}>
                <TextField
                  autoFocus
                  onChange={handleChangeCustomizeStyleCommand}
                  className={classes.customizeImageInput}
                  fullWidth={true}
                  value={currentSelectImgCommand.command}
                  placeholder="Type an artist name or style (e.g. Dark Soul, concept art, smooth, highly detailed)"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: '14px' }}>
                <Typography className={classes.imageStyleTitle}>
                  Name the style
                </Typography>
                <TextField
                  className={classes.customizeStyleName}
                  id="customImageName"
                  placeholder={customizeStyleName}
                  value={customizeStyleName}
                  onChange={handleChangeCustomizeStyleName}
                  variant="standard"
                />
              </Box>

              <Box className={classes.previewBox}>
                <Box>
                  <LoadingButton
                    loading={previewLoadingButton}
                    onClick={handleClickCreatePreviewImg}
                    className={classes.previewButton}
                    variant="outlined"
                    endIcon={<AIAdvancedSettingArrowRightIcon />}
                    disabled={
                      Object.getOwnPropertyNames(currentSelectImgCommand)
                        .length === 0
                        ? true
                        : false
                    }
                  >
                    Preview
                  </LoadingButton>
                  {showSaveImageButton ? (
                    <LoadingButton
                      loading={saveImageLoadingButton}
                      className={classes.saveImageButton}
                      endIcon={<AIAdvancedSettingDownloadIcon />}
                    >
                      Save Image
                    </LoadingButton>
                  ) : null}
                </Box>
                <Box
                  className={classes.previewImageBox}
                  style={{
                    backgroundImage: `url(${previewImageUrl})`
                  }}
                ></Box>
              </Box>
            </Box>
          ) : null}

          {/* Save Style Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '16px' }}>
            <LoadingButton
              loading={saveButtonLoading}
              className={classes.saveStyleButton}
              variant="contained"
              onClick={handleClickSaveCustomStyle}
              disabled={
                Object.getOwnPropertyNames(currentSelectImgCommand).length === 0
                  ? true
                  : false
              }
            >
              {t('widgetAi.add')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Box>
    </StyledDialog>
  );
}
