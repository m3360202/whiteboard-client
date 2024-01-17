import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import GroupAlignHTop from '../../mui/icons/GroupAlignHTop';
import GroupAlignHBottom from '../../mui/icons/GroupAlignHBottom';
import GroupAlignHCenter from '../../mui/icons/GroupAlignHCenter';
import GroupAlignVLeft from '../../mui/icons/GroupAlignVLeft';
import GroupAlignVRight from '../../mui/icons/GroupAlignVRight';
import GroupAlignVCenter from '../../mui/icons/GroupAlignVCenter';
import GroupDistributeH from '../../mui/icons/GroupDistributeH';
import GroupDistributeV from '../../mui/icons/GroupDistributeV';
import { WidgetService } from '../../services';
import BorderLineIcon from '../../mui/icons/BorderLineIcon';
import store from '../../store';
import { handleSetDropdownDisplayed } from '../../store/widgets';
const PREFIX = 'AlignGroup';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  toggleButton: `${PREFIX}-toggleButton`,
  menuItem: `${PREFIX}-menuItem`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.widget}`]: {
    display: 'block',
    position: 'absolute',
    top: '60px',
    left: '50%',
    margin: '0 0 0 -64px',
    padding: '5px 0',
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '4px',
    width: '128px',
    height: '48px',
  },

  [`& .${classes.align}`]: {
    width: '36',
    margin: '8px',
  },

  [`& .${classes.toggleButton}`]: {
    borderRightWidth: 1,
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,
    //
  },

  [`& .${classes.menuItem}`]: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  }
}));

const options = [
  { id: 1, text: 'Vertical Left', value: 'vleft' },
  { id: 2, text: 'Vertical Right', value: 'vright' },
  { id: 3, text: 'Vertical Middle', value: 'vmiddle' },
  { id: 4, text: 'Horizontal Top', value: 'htop' },
  { id: 5, text: 'Horizontal Middle', value: 'hmiddle' },
  { id: 6, text: 'Horizontal Bottom', value: 'hbottom' },
];

export default function AlighGroup({ paddingLeft, paddingRight }) {


  const [anchorEl, setAnchorEl] = React.useState(null);

  const [] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlur = (e) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const alignGroup = (event, alginGroup) => {
    const currentObject = canvas.getActiveObject();

    canvas.alignGroupObjects(currentObject, alginGroup);
    setAnchorEl(null);
  };

  return (
    <Root>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          className={classes.toggleButton}
          selected={false}
          value="alignGroup"
        >
          <GroupAlignVRight fill="#757575" />
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={Boolean(anchorEl)}
      >
        <table>
          <tbody>
            <tr>
              <td>
                <MenuItem
                  key="GroupAlignVLeft"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'VLeft')}
                >
                  <GroupAlignVLeft />
                </MenuItem>
              </td>
              <td>
                <MenuItem
                  key="GroupAlignVCenter"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'VCenter')}
                >
                  <GroupAlignVCenter />
                </MenuItem>
              </td>
              <td>
                <MenuItem
                  key="GroupAlignVRight"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'VRight')}
                >
                  <GroupAlignVRight />
                </MenuItem>
              </td>
              <td>
                <BorderLineIcon style={{ position: 'relative' }} />
              </td>
              <td>
                <MenuItem
                  key="GroupDistributeH"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'DistrH')}
                >
                  <GroupDistributeH />
                </MenuItem>
              </td>
            </tr>
            <tr>
              <td>
                <MenuItem
                  key="GroupAlignHTop"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'HTop')}
                >
                  <GroupAlignHTop />
                </MenuItem>
              </td>
              <td>
                <MenuItem
                  key="GroupAlignHCenter"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'HCenter')}
                >
                  <GroupAlignHCenter />
                </MenuItem>
              </td>
              <td>
                <MenuItem
                  key="GroupAlignHBottom"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'HBottom')}
                >
                  <GroupAlignHBottom />
                </MenuItem>
              </td>
              <td>
                <BorderLineIcon style={{ position: 'relative' }} />
              </td>
              <td>
                <MenuItem
                  key="GroupDistributeV"
                  className={classes.menuItem}
                  onClick={(event) => alignGroup(event, 'DistrV')}
                >
                  <GroupDistributeV />
                </MenuItem>
              </td>
            </tr>
          </tbody>
        </table>
      </Menu>
    </Root>
  );
}
