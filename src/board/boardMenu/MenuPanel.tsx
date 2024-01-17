import React from 'react';
import { styled } from '@mui/material/styles';
import { useDrag } from 'react-dnd';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PanelIcon from '../../mui/icons/panelIcon';
import ToggleButton from '@mui/material/ToggleButton';
import { Theme } from '@mui/material/styles';
import {
  AntTabs,
  TabPanel,
  AntTab,
  a11yProps,
} from '../../mui/components/TabPanelObjects';
import MenuPopover from '../../mui/components/MenuPopover';
import { MenuPanelDragItem } from './MenuPanelDragItem';
import store from '../../store';
import {handleSetIsPanMode,handleSetBoardPanelClicked,handleSetDrawingEraseMode} from '../../store/board';
import Popover from '@mui/material/Popover';

const PREFIX = 'MenuPanel';

const classes = {
  root: `${PREFIX}-root`,
  padding: `${PREFIX}-padding`,
  demo1: `${PREFIX}-demo1`,
  demo2: `${PREFIX}-demo2`,
  typography: `${PREFIX}-typography`,
  notesPanel: `${PREFIX}-notesPanel`,
  menuPanel: `${PREFIX}-menuPanel`,
  tabPanelBox0: `${PREFIX}-tabPanelBox0`,
  tabPanelBox1: `${PREFIX}-tabPanelBox1`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    flexGrow: 1,
    width: '200px'
  },

  [`& .${classes.padding}`]: {
    padding: theme.spacing(3)
  },

  [`& .${classes.demo1}`]: {
    backgroundColor: theme.palette.background.paper
  },

  [`& .${classes.demo2}`]: {
    backgroundColor: '#2e1534'
  },

  [`& .${classes.typography}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.notesPanel}`]: {
    width: 200,
    height: 201,
    paddingLeft: 8
  },

  [`& .${classes.menuPanel}`]: {
    width: 24,
    height: 24,
    padding: 0,
    marginTop: 12,
    marginBottom: 12
  },

  [`& .${classes.tabPanelBox0}`]: {
    paddingTop: 12,
    paddingRight: 14,
    paddingLeft: 14
  },

  [`& .${classes.tabPanelBox1}`]: {
    paddingRight: 14,
    paddingLeft: 14
  }
}));

export default function MenuPanel() {
  const [panelIconColor, setPanelIconColor] = React.useState('#757575');
  const cursorNote =
    "data:image/svg+xml, %3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='3' y='5' width='19' height='2' rx='1' fill='%23757575'/%3E%3Crect x='3' y='16' width='19' height='2' rx='1' fill='%23757575'/%3E%3Crect x='8' y='2' width='19' height='2' rx='1' transform='rotate(90 8 2)' fill='%23757575'/%3E%3Crect x='19' y='2' width='19' height='2' rx='1' transform='rotate(90 19 2)' fill='%23757575'/%3E%3C/svg%3E";
  const objType = 'WBRectPanel';
  const [, drag] = useDrag(() => ({
    item: { objType, type: 'widget' },
    end: (item) => {
      canvas.createWidgetatCurrentLocationByType(item.objType, { text: Text });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    store.dispatch(handleSetIsPanMode(false));
    setAnchorEl(event.currentTarget);
    
    store.dispatch(handleSetDrawingEraseMode(false));

    /**
     * @author Gengda
     * @date: 04/05/2021
     * @description: Fix the tab's indicator shift when refresh
     * This is a substitute to solve. We should use the api "updateIndicator()", which is an action at Tabs.
     * However, it comes the error "updateIndicator is not defined". And I don't know how to solve it.
     */
    // TODO: Still have timeout
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);

    if (!store.getState().board.boardPanelClicked) {
      store.dispatch(handleSetBoardPanelClicked(true));
      store.dispatch(handleSetIsPanMode(false));
      
    }
  };


  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'note-popover' : undefined;

  return (
    <Root>
      <Tooltip title={t('board.menu.iFrame')} placement="left" arrow>
        <ToggleButton
          onMouseEnter={() => setPanelIconColor('#f21d6b')}
          onMouseLeave={() => setPanelIconColor('#757575')}
          id="menuPanel"
          value="iframe"
          aria-label="iframe"
          onClick={handleClick}
          className={classes.menuPanel}
        >
          <PanelIcon panelIconColor={panelIconColor} />
        </ToggleButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        <div className={classes.root}>
          <div className={classes.demo1}>
            <AntTabs
              value={value}
              onChange={handleChange}
              aria-label="ant example"
            >
              <AntTab label="Basic" {...a11yProps(0)} />
              <AntTab label="Device" {...a11yProps(1)} />
            </AntTabs>
            <div className={classes.tabPanelBox0}>
              <TabPanel value={value} index={0} width={200} height={120}>
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={0}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={1}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={2}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={3}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={4}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={5}
                />
              </TabPanel>
            </div>
            <div className={classes.tabPanelBox1}>
              <TabPanel value={value} index={1} width={200} height={120}>
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={6}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={7}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={8}
                />
              </TabPanel>
            </div>
          </div>
        </div>
      </Popover>
    </Root>
  );
}
