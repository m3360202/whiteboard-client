//** Import react
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCommandData } from '../../../../store/AIAssist';
import {
  useFavoriteAICommandMutation,
  useGetAiAllCustomStyleCommandQuery,
  useGetUserCustomizeImgCommandQuery
} from '../../../../redux/AiAssistApiSlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import CustomizeImageCommand from './CustomizeImageCommand';

//** Svg Icon */
import SelectArrrow from '../../../../mui/icons/SelectArrrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PREFIX = 'ImageCommand';

const classes = {
  titleTypography: `${PREFIX}-titleTypography`,
  subtitleTypography: `${PREFIX}-subtitleTypography`,
  imageCommandDataBox: `${PREFIX}-imageCommandDataBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardRoot2: `${PREFIX}-cardRoot2`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`,
  commandName: `${PREFIX}-commandName`,
  imagesDimensionBox: `${PREFIX}-imagesDimensionBox`,
  selecIcon: `${PREFIX}-selecIcon`,
  imageSizeSelect: `${PREFIX}-imageSizeSelect`,
  createImgBox: `${PREFIX}-createImgBox`,
  createImgButton: `${PREFIX}-createImgButton`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.titleTypography}`]: {
    fontSize: '12px',
    lineHeight: '15px'
  },

  [`& .${classes.subtitleTypography}`]: {
    marginTop: '4px',
    marginBottom: '8px',
    fontSize: '12px',
    lineHeight: '15px',
    color: 'rgba(35, 41, 48, 0.65)'
  },

  [`& .${classes.imageCommandDataBox}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: '100px'
  },

  [`& .${classes.cardRoot}`]: {
    width: '92px',
    marginBottom: '14px',
    cursor: 'pointer',
    position: 'relative'
  },

  [`& .${classes.cardRoot2}`]: {
    width: '92px',
    opacity: 0,
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

  [`& .${classes.commandName}`]: {
    position: 'absolute',
    textAlign: 'center',
    width: '86px',
    left: '3px',
    bottom: '3px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#FFFFFF',
    background: 'rgba(32, 32, 32, 0.5)',
    borderRadius: '0px 0px 2px 2px'
  },

  [`& .${classes.imagesDimensionBox}`]: {
    position: 'absolute',
    bottom: '0px',
    width: '420px',
    backgroundColor: '#FFFFFF',
    padding: '6px 0px'
  },

  [`& .${classes.selecIcon}`]: {
    color: '#150D33'
  },

  [`& .${classes.imageSizeSelect}`]: {
    padding: '3px 10px',
    fontSize: '12px',
    border: '1px solid #908EA5',
    display: 'flex',
    justifyContent: 'space-between'
  },

  [`& .${classes.createImgBox}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px'
  },

  [`& .${classes.createImgButton}`]: {
    height: '23px',
    minWidth: 'unset',
    fontWeight: 400
  }
}));

export default function ImageCommand({ handleCommand }) {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  //AIAssist
  // 收藏Command
  const [
    favoriteAICommand,
    {
      isLoading: favoriteAICommandIsLoading,
      isError: favoriteAICommandIsError,
      isSuccess: favoriteAICommandIsSuccess
    }
  ] = useFavoriteAICommandMutation();

  // 获取所有的AI Custom Style Command
  let {
    data: customStyleCommandData = [],
    isError: getAiAllCustomStyleCommandIsError,
    isSuccess: getAiAllCustomStyleCommandIsSuccess,
    isLoading: getAiAllCustomStyleCommandIsLoading
  } = useGetAiAllCustomStyleCommandQuery(undefined);

  customStyleCommandData = customStyleCommandData.filter(
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

  let imageCommandData = [
    ...userCustomizeImgCommand,
    ...customStyleCommandData
  ];

  const [imageCommand, setImageCommand] = useState<any>(NoPresets);
  const generateImageSize = [
    'Square 1:1',
    'Landscape 16:9',
    'Landscape 4:3',
    'Protrait 9:16',
    'Protrait 3:4',
    'Twitter post',
    'Twitter header',
    'Facebook post',
    'Facebook cover',
    'Instagram post',
    'Instagram story',
    'Linkedin cover'
  ];

  const generateImageResolution = [
    '512x512',
    '1024x576',
    '512x384',
    '576x1024',
    '384x512',
    '1152x640',
    '1536x512',
    '1216x640',
    '832x320',
    '1024x1024',
    '1024x576',
    '1600x384'
  ];

  const generateImageNum = ['1 Image', '2 Images', '3 Images', '4 Images'];
  const [imageSizeSelect, setImageSizeSelect] = useState('0');
  const [imageNumSelect, setImageNumSelect] = useState('0');

  const [openCustomImageStylesDialog, setOpenCustomImageStylesDialog] =
    useState(false);

  useEffect(() => {
    if (localStorage.getItem('AiCreateImgSize')) {
      setImageSizeSelect(
        String(
          generateImageSize.indexOf(localStorage.getItem('AiCreateImgSize'))
        )
      );
    }
    if (localStorage.getItem('AiCreateImgNum')) {
      setImageNumSelect(
        String(generateImageNum.indexOf(localStorage.getItem('AiCreateImgNum')))
      );
    }
  }, []);

  const handleSelectChangeImageSize = (event: SelectChangeEvent) => {
    setImageSizeSelect(event.target.value);
    localStorage.setItem(
      'AiCreateImgSize',
      generateImageSize[event.target.value]
    );
  };

  const handleSelectChangeImageNum = (event: SelectChangeEvent) => {
    setImageNumSelect(event.target.value);
    localStorage.setItem(
      'AiCreateImgNum',
      generateImageNum[event.target.value]
    );
  };

  const handleCreateImage = () => {
    let imgSize = generateImageResolution[imageSizeSelect].trim();
    let imgNum = generateImageNum[imageNumSelect].trim();

    const CreateImageData = {
      ...imageCommand,
      width: imgSize.slice(0, imgSize.indexOf('x')),
      height: imgSize.slice(imgSize.indexOf('x') + 1),
      num: imgNum.slice(0, 1)
    };
    handleCommand(CreateImageData);
  };

  const handleFavoriteCommand = async (event, favorite) => {
    event.stopPropagation();
    await favoriteAICommand({
      commandId: imageCommand._id,
      userId: userInfo.userId,
      favorite: favorite,
      type: 'imageCommand'
    });
    Boardx.Util.Msg.success(t('widgetAi.favoritesSuccessfully'));
  };

  return (
    <StyledBox sx={{ pl: '6px', pr: '16px' }}>
      <Typography className={classes.titleTypography} sx={{ mt: '16px' }}>
        {t('widgetAi.style')}
      </Typography>
      <Typography className={classes.subtitleTypography}>
        {t('widgetAi.addASpecificStyleToYourImage')}
      </Typography>
      <Box className={classes.imageCommandDataBox}>
        <Card
          classes={{ root: classes.cardRoot }}
          onClick={() => setOpenCustomImageStylesDialog(true)}
        >
          <CardMedia
            classes={{ root: classes.cardMediaRoot }}
            component="img"
            width="92"
            height="90"
            image="/images/createNewStyle.svg"
          />
        </Card>
        <Card
          classes={{ root: classes.cardRoot }}
          onClick={() => setImageCommand(NoPresets)}
        >
          <CardMedia
            classes={{ root: classes.cardMediaRoot }}
            component="img"
            width="92"
            height="90"
            image={NoPresets.backgroundUrl}
            className={
              imageCommand.name === NoPresets.name
                ? classes.cardMediaActive
                : ''
            }
          />
          <Typography className={classes.commandName}>
            {NoPresets.name}
          </Typography>
        </Card>
        {imageCommandData?.map((data, index) => {
          if (!data) return null;
          return (
            <Card
              classes={{ root: classes.cardRoot }}
              onClick={() => setImageCommand(data)}
              key={index}
            >
              <CardMedia
                classes={{ root: classes.cardMediaRoot }}
                className={
                  imageCommand._id &&
                  imageCommand._id === data._id &&
                  imageCommand.name === data.name
                    ? classes.cardMediaActive
                    : ''
                }
                component="img"
                width="92"
                height="90"
                image={
                  data.backgroundUrl
                    ? data.backgroundUrl
                    : '/images/ImageCommandBackgroundImg.png'
                }
                alt={data.name}
              />
              <Typography className={classes.commandName}>
                {data.name}
              </Typography>
            </Card>
          );
        })}

        {imageCommandData && (imageCommandData.length + 2) % 3 === 2 && (
          <Card classes={{ root: classes.cardRoot2 }}></Card>
        )}
      </Box>
      <CustomizeImageCommand
        openCustomImageStylesDialog={openCustomImageStylesDialog}
        setOpenCustomImageStylesDialog={setOpenCustomImageStylesDialog}
      />
      <Box className={classes.imagesDimensionBox}>
        <Box>
          <Typography className={classes.titleTypography} sx={{ mb: '8px' }}>
            {t('widgetAi.dimension')}
          </Typography>
          <Select
            sx={{ width: '100%' }}
            id="command-imageSizeSelect"
            onChange={handleSelectChangeImageSize}
            value={imageSizeSelect}
            classes={{
              select: classes.imageSizeSelect,
              icon: classes.selecIcon
            }}
            IconComponent={ExpandMoreIcon}
          >
            {generateImageSize.map((imageSize, index) => {
              return (
                <MenuItem
                  key={index}
                  sx={{
                    fontSize: '12px',
                    justifyContent: 'space-between',
                    borderBottom:
                      index === 4 ? '1px solid rgba(0, 0, 0, 0.16)' : 'unset'
                  }}
                  value={index}
                >
                  <span>{imageSize}</span>
                  <span style={{ color: 'rgba(35, 41, 48, 0.65)' }}>
                    {generateImageResolution[index]}
                  </span>
                </MenuItem>
              );
            })}
          </Select>
          <Select
            sx={{ width: '100%', mt: '8px' }}
            id="command-imageNumSelect"
            onChange={handleSelectChangeImageNum}
            value={imageNumSelect}
            classes={{
              select: classes.imageSizeSelect,
              icon: classes.selecIcon
            }}
            IconComponent={ExpandMoreIcon}
          >
            {generateImageNum.map((imageNum, index) => {
              return (
                <MenuItem key={index} sx={{ fontSize: '12px' }} value={index}>
                  {imageNum}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        <Box className={classes.createImgBox}>
          <Button
            className={classes.createImgButton}
            sx={{ fontSize: '10px !important', p: 0 }}
            onClick={e => handleFavoriteCommand(e, true)}
          >
            {t('widgetAi.addToFavorite')}
          </Button>
          <Button
            className={classes.createImgButton}
            sx={{ fontSize: '12px', ml: '16px', p: '4px' }}
            variant="contained"
            onClick={handleCreateImage}
          >
            {t('widgetAi.run')}
          </Button>
        </Box>
      </Box>
    </StyledBox>
  );
}

const NoPresets = {
  backgroundUrl: window.location.origin + '/images/customImageStyleBjImg/NoPresets.png',
  category: 'image',
  command: '{input}',
  description: '',
  height: '',
  icon: window.location.origin + '/images/customImageStyleBjImg/NoPresets.png',
  isFeatured: false,
  name: 'No Presets',
  section: '',
  usedTimes: 32,
  weight: '',
  width: ''
};