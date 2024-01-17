import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const PREFIX = 'NewLayout';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  tidyButton: `${PREFIX}-tidyButton`
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

  [`& .${classes.tidyButton}`]: {
    borderRightWidth: 1,
    color: '#150d33',
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,
    '&:hover': {
      color: '#150d33',
    },
  }
}));

export default function NewLayout({ paddingLeft, paddingRight }) {

  const { t } = useTranslation();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  function NewLayout(event, columns) {
    if (!canvas) return null;
    const objects = canvas.getActiveObjects();

    canvas.planNewLayout(objects, columns);
    setAnchorEl(null);
  }

  return (
    <Root>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          className={classes.tidyButton}
          selected={false}
          value="alignGroup"
        >
          {t('board.contextMenu.tidy')}
          {/*--<Tidy/>  */}
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem key={100} onClick={(event) => NewLayout(event, 100)}>
          {t('board.contextMenu.oneRow')}
        </MenuItem>
        <MenuItem key={1} onClick={(event) => NewLayout(event, 1)}>
          {t('board.contextMenu.oneColumn')}
        </MenuItem>
        <MenuItem key={2} onClick={(event) => NewLayout(event, 2)}>
          {t('board.contextMenu.twoColumns')}
        </MenuItem>
        <MenuItem key={3} onClick={(event) => NewLayout(event, 3)}>
          {t('board.contextMenu.threeColumns')}
        </MenuItem>
        <MenuItem key={4} onClick={(event) => NewLayout(event, 4)}>
          {t('board.contextMenu.fourColumns')}
        </MenuItem>
        <MenuItem key={5} onClick={(event) => NewLayout(event, 5)}>
          {t('board.contextMenu.fiveColumns')}
        </MenuItem>
      </Menu>
    </Root>
  );
}
