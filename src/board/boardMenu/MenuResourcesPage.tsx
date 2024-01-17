//** Import react
import React, { useRef, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../store';
import { handleSetOpenResources } from '../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetTemplateList } from '../../store/resource';
import { useGetTeamsManagementTemplatesQuery } from '../../redux/BoardAPISlice';
import {
  useGetImageListByKeyQuery,
  useGetIconListByKeyQuery
} from '../../redux/BoardAPISlice';
import {
  handleSetRescourePageImageList,
  handleSetRescourePageIconList,
  handleSetMuiTabsValue,
  handleSetResourcePageStatusByTemplate,
  handleSetResourcePageStatusByImage,
  handleSetResourcePageStatusByIcon
} from '../../store/resource';

import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { MenuTemplateBoard } from './MenuTemplateBoard';
import MenuImageDragItem from './MenuImageDragItem';
import MenuMore from './MenuMore';

//**Import Services
import { useTranslation } from 'react-i18next';
import { changeMode } from '../../store/mode';
import {
  useGetMyTemplatesQuery,
  useGetOrgTemplatesQuery,
  useGetOfficialTemplatesQuery
} from '../../redux/ResourceAPISlice';
import { useGetOrgListQuery } from '../../redux/OrgAPISlice';

const PREFIX = 'MenuResourcesPage';

const classes = {
  boxStyle: `${PREFIX}-boxStyle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelBox: `${PREFIX}-tabPanelBox`,
  tabList: `${PREFIX}-tabList`,
  templateTabList: `${PREFIX}-templateTabList`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  templateTabPanelRoot: `${PREFIX}-templateTabPanelRoot`,
  listBoxStyle: `${PREFIX}-listBoxStyle`,
  imageListBox: `${PREFIX}-imageListBox`,
  titleBox: `${PREFIX}-titleBox`,
  discoverContentBox: `${PREFIX}-discoverContentBox`,
  seeAllButton: `${PREFIX}-seeAllButton`,
  tabPanelContent: `${PREFIX}-tabPanelContent`,
  noResultsText: `${PREFIX}-noResultsText`,
  showBtn: `${PREFIX}-showBtn`,
  tabsFlexContainer: `${PREFIX}-tabsFlexContainer`,
  tabsListscrollButtons: `${PREFIX}-tabsListscrollButtons`
};

const Root = styled(Box)((
  { theme }
) => ({
  [`& .${classes.boxStyle}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '410px'
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '400px',
    marginTop: '15px',
    marginBottom: '5px',
    '& .MuiOutlinedInput-root': {
      padding: 0,
      height: '38px'
    }
  },

  [`& .${classes.tabRoot}`]: {
    minWidth: 'unset',
    fontSize: '14px',
    padding: '10px 12px',
    textTransform: 'none'
  },

  [`& .${classes.tabPanelBox}`]: {
    width: '410px',
    height: '495px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },

  [`& .${classes.tabList}`]: {
    '& .MuiTabs-flexContainer': {
      display: 'flex',
      justifyContent: 'space-around',
      width: '410px'
    }
  },

  [`& .${classes.templateTabList}`]: {
    '& .MuiTabs-flexContainer': {
      display: 'flex',
      justifyContent: 'flex-start',
      width: '410px'
    }
  },

  [`& .${classes.tabPanelRoot}`]: {
    padding: '10px 0px 0px',
    width: '410px',
    height: '100%',
    boxSizing: 'border-box'
  },

  [`& .${classes.templateTabPanelRoot}`]: {
    padding: '10px 0px 0px',
    width: '410px',
    height: '440px',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },

  [`& .${classes.listBoxStyle}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  [`& .${classes.imageListBox}`]: {
    width: 'auto',
    height: '485px',
    overflow: 'auto'
  },

  [`& .${classes.titleBox}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  [`& .${classes.discoverContentBox}`]: {
    height: 'auto',
    overflow: 'hidden',
    padding: '0px 16px',
    marginBottom: '10px'
  },

  [`& .${classes.seeAllButton}`]: {
    fontSize: '16px',
    padding: 0,
    justifyContent: 'flex-end'
  },

  [`& .${classes.tabPanelContent}`]: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    boxSizing: 'border-box'
  },

  [`& .${classes.noResultsText}`]: {
    paddingTop: '10px',
    marginTop: '50%',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '12px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.48)',
    marginLeft: '50%',
    transform: 'translate(-50%, -50%)'
  },

  [`& .${classes.showBtn}`]: {
    width: '83px',
    color: '#3D79F8',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center'
  },

  [`& .${classes.tabsFlexContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '410px'
  },

  [`& .${classes.tabsListscrollButtons}`]: {
    width: '18px',
    margin: '0 8px'
  }
}));

export default function MenuResourcesPage({ handleShowClose }) {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const searchRef:any = useRef('');
  const [value, setValue] = useState('1');
  const [currentSearchValue, setCurrentSearchValue] = useState('');
  const [templateTabValue, setTemplateTabValue] = useState('0');
  const [imagesSearch, setImagesSearch] = useState('ideas');
  const [imagesPage, setImagesPage] = useState(1);
  const [iconSearch, setIconSearch] = useState('badge');
  const [iconPage, setIconPage] = useState(0);
  const [templateSearchList, setTemplateSearchList] = useState([]);
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const muiTabsValue = useSelector(
    (state: RootState) => state.resource.muiTabsValue
  );
  const resourcePageStatusByTemplate = useSelector(
    (state: RootState) => state.resource.resourcePageStatusByTemplate
  );

  const resourcePageStatusByImage = useSelector(
    (state: RootState) => state.resource.resourcePageStatusByImage
  );

  const resourcePageStatusByIcon = useSelector(
    (state: RootState) => state.resource.resourcePageStatusByIcon
  );

  useEffect(() => {
    if (muiTabsValue === '3') {
      setTemplateTabValue(resourcePageStatusByTemplate.submenuMuiTabsValue);
      setTemplateSearchList(resourcePageStatusByTemplate.templateSearchList);
      setCurrentSearchValue(resourcePageStatusByTemplate.searchValue);
      return;
    }
    if (muiTabsValue === '4') {
      setImagesSearch(resourcePageStatusByImage.searchValue);
      setImagesPage(resourcePageStatusByImage.imagesPage);
      setCurrentSearchValue(resourcePageStatusByImage.searchValue);
      return;
    }
    if (muiTabsValue === '5') {
      setIconSearch(resourcePageStatusByIcon.searchValue);
      setIconPage(resourcePageStatusByIcon.iconsPage);
      setCurrentSearchValue(resourcePageStatusByIcon.searchValue);
      return;
    }
  }, []);

  const { data: myTemplateList = [] } = useGetMyTemplatesQuery(orgId);
  const { data: offTemplateList = [] } = useGetOfficialTemplatesQuery(orgId);
  const { data: orgTemplateList = [] } = useGetOrgTemplatesQuery(orgId);
  const { data: teamsManagementTemplateList = [] } =
    useGetTeamsManagementTemplatesQuery({
      orgId: orgId
    });

  function addUnclassifiedData(tagsTemplateList, allTemplateList) {
    return {
      ...tagsTemplateList,
      Unclassified: allTemplateList.filter(d => !d.tags)
    };
  }

  function convertTagsToArray(data) {
    const newFilterTagsData = [];
    const tagsValueData = [];

    data.forEach(item => {
      if (typeof item.tags === 'string') {
        item = { ...item, tags: item.Tags.split(',') };
      }
      tagsValueData.push(...item.tags);
      newFilterTagsData.push(item);
    });

    return { newFilterTagsData, tagsValueData };
  }

  function deduplicateTagsValues(tagsValueData) {
    return Array.from(new Set(tagsValueData));
  }

  function createTagsTemplateData(tagsValueData) {
    const tagsTemplateList = {
      AI: [],
      Featured: [],
      Basics: [],
      'Workshop & Meeting': [],
      'Project Management': [],
      'Design Thinking': [],
      'Strategy & Planning': [],
      'Lean Manufacturing': [],
      Storytelling: [],
      Education: [],
      Games: []
    };

    for (const item of tagsValueData) {
      tagsTemplateList[item] = [];
    }

    return tagsTemplateList;
  }

  function classifyByTagsValue(newFilterTagsData, tagsTemplateList) {
    newFilterTagsData.forEach(item => {
      for (const key in tagsTemplateList) {
        if (item.tags.includes(key)) {
          tagsTemplateList[key].push(item);
        }
      }
    });

    return tagsTemplateList;
  }

  function handleClassificationTemplates(allTemplateList) {
    const filterTagsData = allTemplateList.filter(d => d.tags);
    const { newFilterTagsData, tagsValueData } =
      convertTagsToArray(filterTagsData);
    const deduplicatedTagsValues = deduplicateTagsValues(tagsValueData);
    let tagsTemplateList = createTagsTemplateData(deduplicatedTagsValues);

    tagsTemplateList = classifyByTagsValue(newFilterTagsData, tagsTemplateList);
    tagsTemplateList = addUnclassifiedData(tagsTemplateList, allTemplateList);

    for (const key of Object.keys(tagsTemplateList)) {
      if (tagsTemplateList[key].length === 0) {
        delete tagsTemplateList[key];
      }
    }

    return {
      tagsTemplateList, // Tags values corresponding data
      tagsType: Object.keys(tagsTemplateList) // Tags values
    };
  }

  const allTemplateList = [
    ...myTemplateList,
    ...orgTemplateList,
    ...offTemplateList,
    ...teamsManagementTemplateList
  ];

  const { tagsTemplateList, tagsType } =
    handleClassificationTemplates(allTemplateList);

  const { data: imagesList = [], currentData: currentImagesList = [] } =
    useGetImageListByKeyQuery({
      search: imagesSearch,
      currentPage: imagesPage
    });

  const { data: IconsList = [], currentData: currentIconsList = [] } =
    useGetIconListByKeyQuery({ search: iconSearch, offset: iconPage });

  const stickerList = [
    {
      previewUrl: 'https://files.boardx.us/images/KHR3uokRhDSq7rAPB.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/qjSShCN8qG6nrGy3H.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/AcTtLgfDmQc4hggf9.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/GDRvqcMdsMtw2NXG3.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/A6FPzdaDWKWS27iiL.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/eJ8NSkitSvfckmoac.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/aL52Wq4e8ezoujyrH.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/twhkRtLMFEmF6vyDY.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/8AjBSMxFYmKG4n3c9.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/ihTpp3g3euEMe6APh.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/9sFDuSW2TTmrx3dXp.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/3bYpop76hwe3iY2Kd.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/d6MX8oswHrypbMei4.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/g5eLshhQzi7xmLF5N.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/SF9bmN38PsA5rgJ6C.png'
    },
    {
      previewUrl: 'https://files.boardx.us/images/rtxnHMsQdJ3iiiGPb.png'
    }
  ];

  const handleClose = () => {
    dispatch(handleSetOpenResources(false));
    dispatch(changeMode('default'));
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    dispatch(handleSetMuiTabsValue(newValue));
    handleSearch(newValue);
  };

  const handleChangeTemplateTab = (event, newValue) => {
    setTemplateTabValue(newValue);
    dispatch(
      handleSetResourcePageStatusByTemplate({
        ...resourcePageStatusByTemplate,
        submenuMuiTabsValue: newValue
      })
    );
  };

  /* ====================================================================================
    * Handle Sticker functions
   =======================================================================================*/
  const stickerListDOM = () => {
    return stickerList.map((r, index) => (
      <MenuImageDragItem
        isSticker={true}
        width={64}
        margin="10px 13px"
        key={index}
        objType="WBImage"
        previewUrl={r.previewUrl}
        downloadUrl={r.previewUrl}
        handleClose={handleClose}
        handleShowClose={() => {
          handleShowClose();
        }}
      />
    ));
  };

  /* ====================================================================================
    * Handle Template functions
   =======================================================================================*/
  const handleTemplateClickSearch = () => {
    const search = searchRef.current ? searchRef.current.value : '';
    // if (search.trim() === '') return setTemplateSearchList([]);
    const newTemplateSearchList = allTemplateList.filter(item => {
      if (item.name && item.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
      return false;
    });
    setTemplateSearchList(newTemplateSearchList);
    dispatch(
      handleSetResourcePageStatusByTemplate({
        ...resourcePageStatusByTemplate,
        templateSearchList: newTemplateSearchList,
        searchValue: search
      })
    );
  };

  /* ====================================================================================
    * Handle Image functions
   =======================================================================================*/
  const handleImageClickSearch = () => {
    dispatch(handleSetRescourePageImageList([]));
    const search = searchRef.current
      ? searchRef.current.value
        ? searchRef.current.value
        : 'ideas'
      : '';

    setImagesSearch(search);
    setImagesPage(imagesPage);
    dispatch(
      handleSetResourcePageStatusByImage({
        searchValue: search,
        imagesPage: imagesPage
      })
    );
  };

  const handleImageScroll = e => {
    const { target } = e;
    const search = searchRef.current
      ? searchRef.current.value
        ? searchRef.current.value
        : 'ideas'
      : '';

    if (search.trim() === '') {
      return;
    }
    if (
      target.scrollHeight - Math.round(target.scrollTop) ===
      target.clientHeight
    ) {
      setImagesSearch(search);
      setImagesPage(imagesPage + 1);
      dispatch(
        handleSetResourcePageStatusByImage({
          searchValue: search,
          imagesPage: imagesPage
        })
      );
    }
  };

  const imageListItemDOM = () => {
    return imagesList.map((r, index) => (
      <ImageListItem key={index}>
        <MenuImageDragItem
          isSticker={false}
          width={175}
          margin="0"
          key={index}
          objType="WBImage"
          previewUrl={r.previewURL}
          downloadUrl={r.largeImageURL}
          handleClose={handleClose}
          handleShowClose={() => {
            handleShowClose();
          }}
        />
      </ImageListItem>
    ));
  };

  /* ====================================================================================
    * Handle Icon functions
   =======================================================================================*/
  const handleIconClickSearch = () => {
    dispatch(handleSetRescourePageIconList([]));
    const search = searchRef.current
      ? searchRef.current.value
        ? searchRef.current.value
        : 'badge'
      : '';

    setIconSearch(search);
    setIconPage(0);
    dispatch(
      handleSetResourcePageStatusByIcon({
        searchValue: search,
        iconPage: 0
      })
    );
  };

  const handleIconScroll = e => {
    const { target } = e;
    const search = searchRef.current
      ? searchRef.current.value
        ? searchRef.current.value
        : 'badge'
      : '';
    if (search.trim() === '') {
      return;
    }

    if (
      target.scrollHeight - Math.round(target.scrollTop) ===
      target.clientHeight
    ) {
      setIconSearch(search);
      setIconPage(iconPage + 15);
      dispatch(
        handleSetRescourePageIconList(IconsList.concat(currentIconsList))
      );
      dispatch(
        handleSetResourcePageStatusByIcon({
          searchValue: search,
          iconPage: 0
        })
      );
    }
  };

  const iconListItemDOM = () => {
    return IconsList.map((r, index) => (
      <ImageListItem key={index} sx={{ display: 'inline-block' }}>
        <MenuImageDragItem
          isSticker={false}
          width={64}
          margin="10px 13px"
          key={index}
          objType="WBImage"
          previewUrl={r.previewUrl}
          downloadUrl={r.previewUrl}
          handleClose={handleClose}
          handleShowClose={() => {
            handleShowClose();
          }}
        />
      </ImageListItem>
    ));
  };

  const handleSearch = value => {
    if (value === '0') {
      handleImageClickSearch();
      handleIconClickSearch();
      return;
    }
    if (value === '3') {
      handleTemplateClickSearch();
      return;
    }
    if (value === '4') {
      handleImageClickSearch();
      return;
    }
    if (value === '5') {
      handleIconClickSearch();
      return;
    }
  };

  const handleInitialDiscoverDOM = () => {
    return (
      <Box>
        {/* Discover */}
        <Box className={classes.discoverContentBox}>
          <Box className={classes.titleBox}>
            <Typography variant="body1">
              {t('board.contextMenu.sticker')}
            </Typography>
            <Button
              className={classes.seeAllButton}
              variant="text"
              onClick={() => dispatch(handleSetMuiTabsValue('2'))}
            >
              {t('board.contextMenu.seeAll')}
            </Button>
          </Box>
          <Box className={classes.listBoxStyle}>
            {stickerList
              .map((r, index) => (
                <MenuImageDragItem
                  isSticker={true}
                  width={64}
                  margin="10px 13px"
                  key={index}
                  objType="WBImage"
                  previewUrl={r.previewUrl}
                  downloadUrl={r.previewUrl}
                  handleClose={handleClose}
                  handleShowClose={() => {
                    handleShowClose();
                  }}
                />
              ))
              .slice(0, 8)}
          </Box>
        </Box>
        {/* Template */}
        <Box className={classes.discoverContentBox}>
          <Box className={classes.titleBox}>
            <Typography variant="body1">
              {t('board.contextMenu.template')}
            </Typography>
            <Button
              className={classes.seeAllButton}
              variant="text"
              onClick={() => dispatch(handleSetMuiTabsValue('3'))}
            >
              {t('board.contextMenu.seeAll')}
            </Button>
          </Box>
          <Box className={classes.listBoxStyle}>
            {offTemplateList &&
              offTemplateList.length > 0 &&
              offTemplateList
                .map(d => {
                  return (
                    <MenuTemplateBoard
                      key={d._id}
                      board={d}
                      width="174px"
                      height="auto"
                      margin="0px 0px 5px 0px"
                      fontSize="14px"
                      fontWeight="400"
                    />
                  );
                })
                .slice(0, 4)}
          </Box>
        </Box>
        {/* Images */}
        <Box className={classes.discoverContentBox}>
          <Box className={classes.titleBox}>
            <Typography variant="body1">
              {t('board.contextMenu.image')}
            </Typography>
            <Button
              className={classes.seeAllButton}
              variant="text"
              onClick={() => dispatch(handleSetMuiTabsValue('4'))}
            >
              {t('board.contextMenu.seeAll')}
            </Button>
          </Box>
          <Box className={classes.listBoxStyle}>
            <ImageList
              variant="masonry"
              cols={2}
              gap={8}
              sx={{
                overflow: 'hidden',
                m: 0
              }}
            >
              {imagesList
                .map((r, index) => (
                  <MenuImageDragItem
                    isSticker={false}
                    width={175}
                    margin="0"
                    key={index}
                    objType="WBImage"
                    previewUrl={r.previewURL}
                    downloadUrl={r.largeImageURL}
                    handleClose={handleClose}
                    handleShowClose={() => {
                      handleShowClose();
                    }}
                  />
                ))
                .slice(0, 8)}
            </ImageList>
          </Box>
        </Box>
        {/* Icon */}
        <Box className={classes.discoverContentBox}>
          <Box className={classes.titleBox}>
            <Typography variant="body1">
              {t('board.contextMenu.icon')}
            </Typography>
            <Button
              className={classes.seeAllButton}
              variant="text"
              onClick={() => dispatch(handleSetMuiTabsValue('5'))}
            >
              {t('board.contextMenu.seeAll')}
            </Button>
          </Box>
          <Box className={classes.listBoxStyle}>
            {IconsList.map((r, index) => (
              <MenuImageDragItem
                isSticker={false}
                width={64}
                margin="10px 13px"
                key={index}
                objType="WBImage"
                previewUrl={r.previewUrl}
                downloadUrl={r.downloadUrl}
                handleClose={handleClose}
                handleShowClose={() => {
                  handleShowClose();
                }}
              />
            )).slice(0, 8)}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Root>
      <Box className={classes.boxStyle}>
        <TextField
          value={currentSearchValue}
          onChange={e => setCurrentSearchValue(e.target.value)}
          inputRef={searchRef}
          onContextMenu={e => {
            e.stopPropagation();
          }}
          onPaste={e => {
            e.stopPropagation();
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') handleSearch(muiTabsValue);
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
          placeholder={t('board.contextMenu.search')}
          variant="outlined"
        />

        <TabContext value={muiTabsValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              className={classes.tabList}
              onChange={handleChangeTab}
              aria-label="Resources"
            >
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.discover')}
                value="1"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.sticker')}
                value="2"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.template')}
                value="3"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.image')}
                value="4"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.icon')}
                value="5"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label={t('board.contextMenu.more')}
                value="6"
              />
            </TabList>
          </Box>

          <Box className={classes.tabPanelBox}>
            <TabPanel
              classes={{ root: classes.tabPanelRoot }}
              sx={{ overflowY: 'scroll' }}
              value="1"
            >
              {handleInitialDiscoverDOM()}
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
              <Box
                className={classes.tabPanelContent}
                sx={{ pl: '3px', pr: '3px' }}
              >
                {stickerListDOM()}
              </Box>
            </TabPanel>
            <TabPanel
              classes={{ root: classes.templateTabList }}
              style={{ padding: '0px' }}
              sx={{ overflow: 'auto' }}
              value="3"
            >
              {resourcePageStatusByTemplate.searchValue &&
              resourcePageStatusByTemplate.searchValue.length > 0 ? (
                <Box sx={{ pl: '16px', pr: '16px', height: '495px' }}>
                  <Box
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      paddingTop: '10px'
                    }}
                  >
                    {templateSearchList && templateSearchList.length > 0 ? (
                      templateSearchList.map(d => {
                        return (
                          <MenuTemplateBoard
                            key={d._id}
                            board={d}
                            width="174px"
                            height="auto"
                            margin="0px 0px 5px"
                            fontSize="14px"
                            fontWeight="400"
                          />
                        );
                      })
                    ) : (
                      <Typography className={classes.noResultsText}>
                        {t('board.contextMenu.NoResultsFromTheQuery')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <TabContext value={templateTabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      classes={{
                        flexContainer: classes.tabsFlexContainer,
                        scrollButtons: classes.tabsListscrollButtons
                      }}
                      onChange={handleChangeTemplateTab}
                      variant="scrollable"
                    >
                      {tagsType &&
                        tagsType.map((item, index) => {
                          return (
                            <Tab
                              classes={{ root: classes.tabRoot }}
                              label={item}
                              value={String(index)}
                              key={index}
                            />
                          );
                        })}
                    </TabList>
                  </Box>
                  <Box className={classes.tabPanelBox}>
                    {tagsType &&
                      tagsType.map((item, index) => {
                        return (
                          <TabPanel
                            classes={{ root: classes.templateTabPanelRoot }}
                            value={String(index)}
                            key={index}
                          >
                            {tagsTemplateList[item] &&
                              tagsTemplateList[item].length > 0 && (
                                <Box sx={{ pl: '16px', pr: '16px' }}>
                                  <Box
                                    style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    {tagsTemplateList[item].map(d => {
                                      return (
                                        <MenuTemplateBoard
                                          key={d._id}
                                          board={d}
                                          width="174px"
                                          height="auto"
                                          margin="0px 0px 5px"
                                          fontSize="14px"
                                          fontWeight="400"
                                        />
                                      );
                                    })}
                                  </Box>
                                </Box>
                              )}
                          </TabPanel>
                        );
                      })}
                  </Box>
                </TabContext>
              )}
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="4">
              <div
                className={classes.imageListBox}
                onScroll={handleImageScroll}
              >
                {imagesList.length === 0 ? (
                  <Typography className={classes.noResultsText}>
                    {t('board.contextMenu.NoResultsFromTheQuery')}
                  </Typography>
                ) : (
                  <ImageList
                    variant="masonry"
                    cols={2}
                    gap={8}
                    //className={classes.tabPanelContent}
                    sx={{
                      overflow: 'hidden',
                      m: 0,
                      pl: '16px',
                      pr: '16px',
                      alignItems: 'center'
                    }}
                  >
                    {imageListItemDOM()}
                  </ImageList>
                )}
              </div>
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="5">
              <div className={classes.imageListBox} onScroll={handleIconScroll}>
                <Box
                  className={classes.tabPanelContent}
                  sx={{ pl: '3px', pr: '3px' }}
                >
                  {IconsList.length === 0 ? (
                    <Typography className={classes.noResultsText}>
                      {t('board.contextMenu.NoResultsFromTheQuery')}
                    </Typography>
                  ) : (
                    iconListItemDOM()
                  )}
                </Box>
              </div>
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="6">
              <MenuMore />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </Root>
  );
}
