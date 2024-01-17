//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../../store';
import {
  handleSetRecentCommandData,
  handleSetSearchCommandData,
  handleSetOpenWidgetMenuAIAssist
} from '../../../store/AIAssist';
import { useGetSubscriptionPlanMutation } from '../../../redux/PricingApiSlice';
import { useCheckCreditsIsEnoughMutation } from '../../../redux/PricingApiSlice';

//** Import Mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

//** Import CommandType */
import ContentCommand from './CommandType/ContentCommand';
import HomeCommand from './CommandType/HomeCommand';
import ImageCommand from './CommandType/ImageCommand';
import SearchCommand from './CommandType/SearchCommand';
import CommandSearchInput from './CommandSearchInput';
import SingleImageOptionCommand from './ImageWidgetSelection/SingleImageOptionCommand';
import MultipleImageOptionsCommand from './ImageWidgetSelection/MultipleImageOptionsCommand';
import SingleImageAndSingleNoteOptions from './ImageWidgetSelection/SingleImageAndSingleNoteOptions';
import MultipleImageAndSingleNoteOptions from './ImageWidgetSelection/MultipleImageAndSingleNoteOptions';
import CustomCommand from './CommandType/CustomCommand';

//** Import Icon */
import AISearchIcon from '../../../mui/icons/AISearchIcon';

//** Import Service */
import { PricingService, BoardService,UserService } from '../../../services';
import server from '../../../startup/serverConnect';

const PREFIX = 'AIAssistCommandDialogPage';

const classes = {
  tabsRoot: `${PREFIX}-tabsRoot`,
  tabsIndicator: `${PREFIX}-tabsIndicator`,
  tabsFlexContainer: `${PREFIX}-tabsFlexContainer`,
  tabStyle: `${PREFIX}-tabStyle`,
  tabStyle2: `${PREFIX}-tabStyle2`,
  popoverPaper: `${PREFIX}-popoverPaper`,
  tabPanelBox: `${PREFIX}-tabPanelBox`,
  creditsContentBox: `${PREFIX}-creditsContentBox`,
  gptModelMenuRoot: `${PREFIX}-gptModelMenuRoot`,
  gptModelMenuSelect: `${PREFIX}-gptModelMenuSelect`,
  menuItemRoot3: `${PREFIX}-menuItemRoot3`,
  gptModelMenuSelectIcon: `${PREFIX}-gptModelMenuSelectIcon`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.tabsRoot}`]: {
    minHeight: '36px',
    borderBottom: ' 1px solid rgba(0, 0, 0, 0.16)',
    position: 'relative'
  },

  [`& .${classes.tabsIndicator}`]: {
    display: 'none'
  },

  [`& .${classes.tabsFlexContainer}`]: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },

  [`& .${classes.tabStyle}`]: {
    fontSize: '12px',
    textTransform: 'none',
    minWidth: 'unset',
    minHeight: '36px',
    padding: 0
  },

  [`& .${classes.tabStyle2}`]: {
    fontSize: '12px',
    textTransform: 'none',
    minHeight: '36px',
    padding: 0,
    minWidth: '70px',
    display: 'flex',
    justifyContent: 'flex-end'
  },

  [`& .${classes.popoverPaper}`]: {
    width: '450px'
  },

  [`&.${classes.tabPanelBox}`]: {
    height: '497px',
    width: '100%',
    overflowY: 'scroll',
    paddingLeft: '10px',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },

  [`& .${classes.creditsContentBox}`]: {
    display: 'flex',
    height: '34px',
    alignItems: 'center',
    fontSize: '12px',
    justifyContent: 'space-between',
    bottom: 0,
    width: '92%',
    position: 'absolute',
    backgroundColor: '#FFF',
    fontFamily: 'Inter',
    color: 'rgba(35, 41, 48, 0.65)'
  },

  [`& .${classes.gptModelMenuRoot}`]: {
    '& .MuiOutlinedInput-notchedOutline': {
      display: 'none'
    }
  },

  [`& .${classes.gptModelMenuSelect}`]: {
    padding: 0,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '13px',
    color: 'rgba(35, 41, 48, 0.65)',
    marginLeft: '10px'
  },

  [`& .${classes.menuItemRoot3}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '13px'
  },

  [`& .${classes.gptModelMenuSelectIcon}`]: {
    color: 'rgba(35, 41, 48, 0.65)'
  }
}));

export default function AIAssistCommandDialogPage(props) {
  const {open, currentWidgetType, type } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const [isVistor, setIsVistor] = React.useState(false);
  const [gptModel, setGptModel] = React.useState('gpt-3.5-turbo');
  const [checkCreditsIsEnough] = useCheckCreditsIsEnoughMutation();
  const [openCommandSearch, setOpenCommandSearch] = React.useState(false);
  const onlyImages = currentWidgetType.filter(item => item === 'WBImage');
  const onlyStickNote = currentWidgetType.filter(
    item => item === 'WBRectNotes'
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  // ** subscriptionInfo
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] =
    React.useState(null);
  const [subscriptionPlan] = useGetSubscriptionPlanMutation();

  const handleSetSubscriptionPlan = async orgId => {
    let user = store.getState().user.userInfo;
    let result:any = await subscriptionPlan({ orgId, user });

    setCurrentSubscriptionPlan(result?.data);
  };

  
  const allCommandData = useSelector(
    (state: RootState) => state.AIAssist.allCommandData
  );

  const teamsCommandData = useSelector(
    (state: RootState) => state.AIAssist.teamsCommandData
  );

  const allCustomStyleCommand = useSelector(
    (state: RootState) => state.AIAssist.allCustomStyleCommand
  );

const   [allCommandDataInTheTeams, setAllCommandDataInTheTeams] = React.useState([]);
 

useEffect(() => {
  const data = processCommandData(allCommandData, teamsCommandData, allCustomStyleCommand);
  setAllCommandDataInTheTeams(data);

}, [allCommandData, teamsCommandData, allCustomStyleCommand]); 
  // get all command data (admin all command, teams all command  custom style command-img)

useEffect(() => {
  loadLatestCommands();
},[allCommandDataInTheTeams]);
  function processCommandData(allCommandData, teamsCommandData, allCustomStyleCommand) {
 
    const uniqueCommands = new Map();
  
    // Priority is given to teamsCommandData, so process it last to overwrite duplicates
    [...allCustomStyleCommand, ...allCommandData, ...teamsCommandData].forEach(command => {
      uniqueCommands.set(command.name, command);
    });
  
    return Array.from(uniqueCommands.values());
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [credits, setCredits] = React.useState(userInfo.credits);

  useEffect(() => {
    setCredits(userInfo?.credits ? userInfo.credits : 0);
  }, [userInfo]);

  const loadLatestCommands = () => {
    const storedCommandsJson = localStorage.getItem('latestCommands');
    if (storedCommandsJson) {
      const storedCommands = JSON.parse(storedCommandsJson);
      const recentCommands = getRecentlyUsedCommands(storedCommands);
      dispatch(handleSetRecentCommandData(recentCommands));
    }
  };
  
  const getRecentlyUsedCommands = (storedCommands) => {
    const filteredCommands = storedCommands.filter(item => item !== null);
    const uniqueIds = new Set();
    const recentCommands = [];
  
    filteredCommands.forEach(commandId => {
      if (!uniqueIds.has(commandId)) {
        uniqueIds.add(commandId);
        const matchingCommands = allCommandDataInTheTeams.filter(teamCommand => teamCommand._id === commandId);
        recentCommands.push(...matchingCommands);
      }
    });
  
    return recentCommands;
  };
  
  

  useEffect(() => {
    handleSetSubscriptionPlan(orgId);
  }, [orgId]);

  useEffect(() => {
    // loadLatestCommands();
    const storedGptModel = localStorage.getItem('gptModel');
    if (storedGptModel) {
      setGptModel(userInfo?.status === 'free' ? 'gpt-3.5-turbo' : storedGptModel);
    } else {
      setGptModel('gpt-3.5-turbo');
    }
  }, []);

  const saveCommandToLocalStorage = (command: { _id: string }) => {
    try {
      let commands = JSON.parse(localStorage.getItem('latestCommands')) || [];
      if (!Array.isArray(commands)) {
        console.error('Invalid latestCommands format in localStorage');
        commands = [];
      }
  
      if (!commands.some((item: string) => item === command._id)) {
        if (commands.length >= 10) {
          commands.pop(); // Remove the oldest command
        }
        commands.unshift(command._id); // Add new command at the beginning
  
        localStorage.setItem('latestCommands', JSON.stringify(commands));
        dispatch(handleSetRecentCommandData(getRecentlyUsedCommands(commands)));
      }
    } catch (error) {
      console.error('Error handling localStorage in saveCommandToLocalStorage:', error);
    }
  };
  
 

  const getCurrentSelectionText = () => {

    if(canvas.getActiveObjects().length===1  ){
      return canvas.getActiveObject().getText();
    }

    if(canvas.getActiveObjects().length>1  ){
      const textsArray = canvas.getActiveObjects().map(item=>item.getText());
      return textsArray.join('/n').trim();
    }
  
  };

  //** note widget selection */
  const handleCommand = async data => {
    const commandData = { ...data, orgId: orgInfo.orgId, gptModel: gptModel};
    const currentNote = canvas.getActiveObject();
    if(!currentNote) {
      Boardx.Util.Msg.info(
        t('components.aiAssist.aiCreateContent.selectTheStickyNote')
      );
      return;
    }
    const currentNoteText = currentNote.getText();
    if (currentNoteText.trim() === '') {
      Boardx.Util.Msg.info(
        t('components.aiAssist.aiCreateContent.tipContent')
      );
      return;
    }

   
    saveCommandToLocalStorage(commandData);
    // loadLatestCommands();
    dispatch(handleSetOpenWidgetMenuAIAssist(false));

    if (commandData.category === 'image' || commandData.category === 'Image') {
      if (commandData.name === 'Design image') {
        canvas.AIDiverge(commandData);
        return;
      }
      const imageBase64 = '';
      canvas.AITextToImage(commandData, imageBase64);
      return;
    }

    if (commandData.type) {
      if (commandData.type.toLocaleLowerCase() === 'diverge') {
        canvas.AIDiverge(commandData);
      } else {
        canvas.AIConverge(commandData);
      }
    } else {
      if (commandData.category == 'ideate') {
        canvas.AIDiverge(commandData);
      } else {
        canvas.AIConverge(commandData);
      }
    }
  };

  //** image widget selection */
  const handleClickImageSelectionCommand = imageCommandData => {
    dispatch(handleSetOpenWidgetMenuAIAssist(false));
    let imageSrc = '';
    const currentWidget = canvas.getActiveObject();
    if (currentWidget.src) {
      imageSrc = currentWidget.src;
    } else {
      let WBImage = currentWidget._objects.filter(
        item => item.obj_type === 'WBImage'
      );
      if (WBImage.length !== 1) {
        Boardx.Util.Msg.info(
          t('components.aiAssist.aiCreateContent.selectImage')
        );
        return;
      }
      imageSrc = WBImage[0].src;
    }

    if (
      imageCommandData.category === 'image' &&
      imageCommandData.name === 'Create image'
    ) {
      getImageFileFromUrl(imageSrc, 'fileName')
        .then(response => {
          // response 返回的是base64格式的图片
          canvas.AITextToImage(imageCommandData, response);
        })
        .catch(e => {
          console.error(e);
        });
      return;
    }
    if (
      imageCommandData.category === 'image' &&
      imageCommandData.name === 'Replicate image'
    ) {
      getImageFileFromUrl(imageSrc, 'fileName')
        .then(response => {
          // response 返回的是base64格式的图片
          canvas.AITextToImage(imageCommandData, response);
        })
        .catch(e => {
          console.error(e);
        });
      return;
    }
  };

  //** 将图片下载并转为 base64 格式 */
  const getImageFileFromUrl = (url, imageName) => {
    return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'image/png');
      xhr.responseType = 'blob';
      // 加载时处理
      xhr.onload = () => {
        // 获取返回结果
        blob = xhr.response;
        let imgFile = new File([blob], imageName, { type: 'image/png' });
        let oFileReader = new FileReader();
        // 转为base64
        oFileReader.onloadend = function (e) {
          resolve(e.target.result);
        };
        oFileReader.readAsDataURL(imgFile);
      };
      xhr.onerror = e => {
        reject(e);
      };
      // 发送
      xhr.send();
    });
  };

  // const goPurchase = () => {
  //   window.open('/purchaseItem'); //real link
  //   startListenCallBack();
  // };

  let checkPruchaseHandle = null;

  // const startListenCallBack = () => {
  //   if (checkPruchaseHandle) {
  //     clearInterval(checkPruchaseHandle); //结束之前的轮询
  //   }
  //   //轮询订单
  //   checkPruchaseHandle = setInterval(() => {
  //     let mode =
  //       location.host.indexOf('app.boardx.us') > -1 ? 'livemode' : 'testmode';
  //       server.call('purchaseCallback', { mode: mode, currentPlan: currentSubscriptionPlan,user:store.getState().user.userInfo }).then(async(res) => {
  //         console.log('startListenCallBack', res);
  //         if(res.data.length > 0){
  //           clearInterval(checkPruchaseHandle);
  //           Boardx.Util.Msg.success(t('chatAi.purchaseSuccessfully'));
  //           let user = await server.call('getUserInfo');
  //           UserService.getInstance().saveStore(user);
  //         }
  //       }).catch(err => {
  //         console.log(err)
  //       });
  //   }, 10000);
  //   setTimeout(() => {
  //     clearInterval(checkPruchaseHandle);
  //   }, 300000); //5分钟后过期，关闭轮询
  // };
  
  const handleChangeGptModel = async e => {
    setGptModel(e.target.value);
    localStorage.setItem('gptModel', e.target.value);
    Boardx.Util.Msg.success(t('chatAi.changeGPTModelSuccessfully'));
  };

  return (
    <Root>
      {/* {currentWidgetType.length === 1 &&
      currentWidgetType[0] === 'WBImage' &&
      type === 'WidgetMenuAI' ? (
        <SingleImageOptionCommand
          handleClickImageSelectionCommand={handleClickImageSelectionCommand}
        />
      ) : null} */}

      {/* 暂时隐藏---zzw */}
      {/* {onlyImages.length > 1 &&
      currentWidgetType.length === onlyImages.length ? (
        <MultipleImageOptionsCommand handleCommand={handleCommand} />
      ) : null} */}

      {/* {onlyImages.length === 1 &&
      onlyStickNote.length === 1 &&
      type === 'WidgetMenuAI' ? (
        <SingleImageAndSingleNoteOptions
          handleClickImageSelectionCommand={handleClickImageSelectionCommand}
        />
      ) : null} */}

      {/* 暂时隐藏---zzw */}
      {/* {onlyImages.length > 1 && onlyStickNote.length > 1 ? (
        <MultipleImageAndSingleNoteOptions handleCommand={handleCommand} />
      ) : null} */}

      {(
        <Box sx={{ position: 'relative' }}>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            scrollButtons={false}
            // onMouseEnter={handleChange}
            classes={{
              root: classes.tabsRoot,
              flexContainer: classes.tabsFlexContainer,
              indicator: classes.tabsIndicator
            }}
          >
            <Tab
              label={t('widgetAi.home')}
              onMouseEnter={() => setValue(0)}
              aria-label="Brainstorm"
              {...a11yProps(0)}
              className={classes.tabStyle}
            />
            <Tab
              label={t('widgetAi.content')}
              aria-label="Summarize"
              onMouseEnter={() => setValue(1)}
              {...a11yProps(1)}
              className={classes.tabStyle}
            />
            <Tab
              label={t('widgetAi.image')}
              onMouseEnter={() => setValue(2)}
              aria-label="Storytelling"
              {...a11yProps(2)}
              className={classes.tabStyle}
            />
            <Tab
              label={t('widgetAi.custom')}
              onMouseEnter={() => setValue(3)}
              aria-label="edit"
              {...a11yProps(3)}
              className={classes.tabStyle}
            />
            <Tab
              icon={
                <AISearchIcon color={value === 4 ? '#F21D6B' : '#707478'} />
              }
              onClick={() => {
                setValue(4);
                setOpenCommandSearch(true);
                dispatch(handleSetSearchCommandData([]));
              }}
              aria-label="edit"
              {...a11yProps(3)}
              className={classes.tabStyle2}
            />
          </Tabs>
          {openCommandSearch ? (
            <CommandSearchInput
              openCommandSearch={openCommandSearch}
              setOpenCommandSearch={setOpenCommandSearch}
              setValue={setValue}
            />
          ) : null}

          <Box
            // className={classes.tabPanelBox}
            sx={{
              height: '497px',
              width: '100%',
              overflowY: 'scroll',
              paddingLeft: '10px',
              boxSizing: 'border-box',
              overflowX: 'hidden'
            }}
          >
            <TabPanel
              key={0}
              value={value}
              index={0}
              style={{ width: '100%', marginBottom: '40px' }}
            >
              <HomeCommand handleCommand={handleCommand} />
            </TabPanel>

            <TabPanel
              key={1}
              value={value}
              index={1}
              style={{ width: '100%', marginBottom: '40px' }}
            >
              <ContentCommand handleCommand={handleCommand} />
            </TabPanel>

            <TabPanel
              key={2}
              value={value}
              index={2}
              style={{ width: '100%', marginBottom: '40px' }}
            >
              <ImageCommand handleCommand={handleCommand} />
            </TabPanel>

            <TabPanel
              key={3}
              value={value}
              index={3}
              style={{ width: '100%', height: '95%' }}
            >
              <CustomCommand
                gptModel={gptModel}
                setGptModel={setGptModel}
                handleCommand={handleCommand}
              />
            </TabPanel>

            <TabPanel
              key={4}
              value={value}
              index={4}
              style={{ width: '100%', marginBottom: '40px' }}
            >
              <SearchCommand handleCommand={handleCommand} />
            </TabPanel>

            {value !== 2 && value !== 3 ? (
              <Box className={classes.creditsContentBox}>
                {/* {credits ? credits.toLocaleString('en-US') : 0} AI credits left */}
                <Select
                  id="changeGPTModelBtn"
                  IconComponent={KeyboardArrowDownIcon}
                  value={gptModel}
                  onChange={handleChangeGptModel}
                  classes={{
                    select: classes.gptModelMenuSelect,
                    icon: classes.gptModelMenuSelectIcon
                  }}
                  className={classes.gptModelMenuRoot}
                >
                  <MenuItem
                    // classes={{ root: classes.menuItemRoot3 }}
                    sx={{
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '13px'
                    }}
                    value="gpt-3.5-turbo"
                  >
                    gpt-3.5
                  </MenuItem>
                  {userInfo?.status == 'free' ?  null : (
                    <MenuItem
                      // classes={{ root: classes.menuItemRoot3 }}
                      sx={{
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '13px'
                      }}
                      value="gpt-4"
                    >
                      gpt-4
                    </MenuItem>
                  )}
                 
                </Select>
                {/* {!isVistor && (
                  <Button
                    variant="text"
                    onClick={goPurchase}
                    sx={{ cursor: 'pointer', fontSize: '12px' }}
                  >
                    {t('components.billing.purchase')}
                  </Button>
                )} */}
              </Box>
            ) : null}
          </Box>
        </Box>
      )  }
    </Root>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: React.CSSProperties;
}
