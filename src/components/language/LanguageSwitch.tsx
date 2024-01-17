/* eslint-disable quotes */
/* eslint-disable no-undef */
import React from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { SysService } from '../../services';
import Menu from '@mui/material/Menu';
import ArrowRight from '@mui/icons-material/ArrowRight';
const PREFIX = 'LanguageSwitch';

const classes = {
  gutters: `${PREFIX}-gutters`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.gutters}`]: {
    height: '40px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingRight: 0,
    justifyContent: 'space-between',
  }
}));

function LanguageSwitch({ setSelectMore }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onChange = (event, language) => {
    event.preventDefault();
    if (language) {
      SysService.setLocale(language);
      window.location.reload();
    }
    setSelectMore(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Root>
      <MenuItem
        classes={{ gutters: classes.gutters }}
        onClick={handleClick}
        value="languages"
      >
        {t('board.header.moreLanguage')}
        <ArrowRight />
      </MenuItem>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        style={{ boxShadow: '1px 1px 4px 2px #D9A1B18A', marginLeft: -8 }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={(event) => onChange(event, 'en')}>English</MenuItem>
        <MenuItem onClick={(event) => onChange(event, 'zh-CN')}>中文</MenuItem>
      </Menu>
    </Root>
  );
}

export default LanguageSwitch;
