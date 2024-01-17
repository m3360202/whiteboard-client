import React from 'react';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import * as fabric from '@boardxus/x-canvas';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import { handleChangeFontFamily } from '../../store/widgetMenu';
import store, { RootState } from '../../store';
import {
  handleSetDropdownDisplayed,
  handleSetMultiFontFamily,
  handleSetObjectWidgetStatusChange
} from '../../store/widgets';
import { useTranslation } from 'react-i18next';

const PREFIX = 'Font';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  button: `${PREFIX}-button`,
  arrowDropIcon: `${PREFIX}-arrowDropIcon`,
  menu: `${PREFIX}-menu`,
  arial: `${PREFIX}-arial`,
  caveat: `${PREFIX}-caveat`,
  roboto: `${PREFIX}-roboto`,
  inter: `${PREFIX}-inter`,
  impact: `${PREFIX}-impact`,
  comicSansMS: `${PREFIX}-comicSansMS`,
  piedra: `${PREFIX}-piedra`,
  permanent: `${PREFIX}-permanent`,
  yellowtail: `${PREFIX}-yellowtail`,
  notoSansSC: `${PREFIX}-notoSansSC`,
  liuJianMaoCao: `${PREFIX}-liuJianMaoCao`,
  zhiMangXing: `${PREFIX}-zhiMangXing`,
  ZCOOL: `${PREFIX}-ZCOOL`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.widget}`]: {},
  [`& .${classes.align}`]: {},

  [`& .${classes.button}`]: {
    borderColor: 'gainsboro',
    textAlign: 'center',
    color: '#150D33',
    borderRightWidth: 0,
    fontSize: 16,
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,
    textTransform: 'none',
    '&:hover': {
      color: '#f21d6b'
    }
  },

  [`& .${classes.arrowDropIcon}`]: {
    width: 16
  },

  [`& .${classes.menu}`]: {
    top: 4
  },

  [`& .${classes.arial}`]: {
    fontFamily: 'Arial',
    fontWeight: 400
  },

  [`& .${classes.caveat}`]: {
    fontFamily: 'Caveat',
    fontWeight: 400
  },

  [`& .${classes.roboto}`]: {
    fontFamily: 'Inter',
    fontWeight: 400
  },

  [`& .${classes.inter}`]: {
    fontFamily: 'Inter',
    fontWeight: 400
  },

  [`& .${classes.impact}`]: {
    fontFamily: 'Impact',
    fontWeight: 400
  },

  [`& .${classes.comicSansMS}`]: {
    fontFamily: 'Comic Sans MS',
    fontWeight: 400
  },

  [`& .${classes.piedra}`]: {
    fontFamily: 'Piedra',
    fontWeight: 400
  },

  [`& .${classes.permanent}`]: {
    fontFamily: 'Permanent Marker',
    fontWeight: 400
  },

  [`& .${classes.yellowtail}`]: {
    fontFamily: 'Yellowtail',
    fontWeight: 400
  },

  [`& .${classes.notoSansSC}`]: {
    fontFamily: 'Noto Sans SC',
    fontWeight: 400
  },

  [`& .${classes.liuJianMaoCao}`]: {
    fontFamily: 'Liu Jian Mao Cao',
    fontWeight: 400
  },

  [`& .${classes.zhiMangXing}`]: {
    fontFamily: 'Zhi Mang Xing',
    fontWeight: 400
  },

  [`& .${classes.ZCOOL}`]: {
    fontFamily: 'ZCOOL KuaiLe',
    fontWeight: 400
  }
}));

export default function ({ font, paddingLeft, paddingRight }) {
  font = font || 'Inter';

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = e => {
    changeFont(e.target.value, 400);
  };

  const handleBlur = e => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = e => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const changeFont = (value, weight) => {
    const fontFamily = value;
    const object = canvas.getActiveObject();
    const fontWeight = weight;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (object) {
      object.set('fontFamily', fontFamily);

      object.set('fontWeight', fontWeight);
      object.saveData('MODIFIED', ['fontFamily', 'fontWeight']);
      canvas.requestRenderAll();
    }
    if (group && group._objects) {
      group._objects.forEach(obj => {
        obj.set('fontFamily', fontFamily);
        obj.set('fontWeight', fontWeight);
        //fabric.util.clearFabricFontCache(fontFamily);
        canvas.requestRenderAll();
      });

      group.saveData('MODIFIED', ['fontFamily', 'fontWeight']);
      store.dispatch(handleSetMultiFontFamily(fontFamily));
    }
    store.dispatch(handleChangeFontFamily(value));
    canvas.requestRenderAll();
    setAnchorEl(null);
    if (store.getState().widgets.objectWidgetStatusChange) {
      store.dispatch(handleSetObjectWidgetStatusChange(false));
    } else {
      store.dispatch(handleSetObjectWidgetStatusChange(true));
    }
  };

  const open = Boolean(anchorEl);

  const handleFontFamily = () => {
    return font?.toString() === t('board.contextMenu.mixed') ? 'Inter' : font;
  };

  const handleFont = () => {
    return font?.toString() === 'Noto Sans SC'
      ? '黑体'
      : font?.toString() === 'ZCOOL KuaiLe'
      ? '快乐'
      : font?.toString() === 'Liu Jian Mao Cao'
      ? '草书'
      : font?.toString() === 'Zhi Mang Xing'
      ? '行书'
      : font?.toString().length > 6
      ? `${font?.toString().substring(0, 4)}..`
      : font?.toString();
  };

  return (
    <Root>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <Button
          aria-controls="font-menu"
          aria-haspopup="true"
          className={classes.button}
          style={{ fontFamily: handleFontFamily(), fontWeight: 400 }}
        >
          {handleFont()}
          <ArrowIcon />
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        autoFocus
        className={classes.menu}
        data-cy="FontChange"
        id="font-menu"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        value={font}
        defaultValue={font}
      >
        {/* <MenuItem
          className={classes.arial}
          onClick={() => changeFont('Arial', 400)}
          value="Arial"
        >
          Arial
        </MenuItem> */}
        {/* <MenuItem
          className={classes.caveat}
          onClick={() => changeFont('Caveat', 400)}
          value="Caveat"
        >
          Caveat
        </MenuItem> */}
        {/* <MenuItem
          className={classes.roboto}
          onClick={() => changeFont('Inter', 400)}
          value="Roboto"
        >
          Roboto
        </MenuItem> */}
        <MenuItem
          className={classes.inter}
          onClick={() => changeFont('Inter', 400)}
          value="Inter"
        >
          Inter
        </MenuItem>
        {/* <MenuItem
          className={classes.impact}
          onClick={() => changeFont('Impact', 400)}
          value="Impact"
        >
          Impact
        </MenuItem>
        <MenuItem
          className={classes.comicSansMS}
          onClick={() => changeFont('Comic Sans MS', 400)}
          value="Comic Sans MS"
        >
          Comic Sans MS
        </MenuItem>
        <MenuItem
          className={classes.piedra}
          onClick={() => changeFont('Piedra', 400)}
          value="Piedra"
        >
          Piedra
        </MenuItem> */}
        <MenuItem
          className={classes.permanent}
          onClick={() => changeFont('Permanent Marker', 400)}
          value="Permanent Marker"
        >
          Permanent Marker
        </MenuItem>
        {/* <MenuItem
          className={classes.yellowtail}
          onClick={() => changeFont('Yellowtail', 400)}
          value="Yellowtail"
        >
          Yellowtail
        </MenuItem> */}
        {/* <MenuItem
          className={classes.notoSansSC}
          onClick={() => changeFont('Noto Sans SC', 400)}
          value="Noto Sans SC"
        >
          黑体
        </MenuItem> */}
        {/* <MenuItem
          className={classes.liuJianMaoCao}
          onClick={() => changeFont('Liu Jian Mao Cao', 400)}
          value="Liu Jian Mao Cao"
        >
          草书
        </MenuItem>
        <MenuItem
          className={classes.zhiMangXing}
          onClick={() => changeFont('Zhi Mang Xing', 400)}
          value="Zhi Mang Xing"
        >
          行书
        </MenuItem> */}
        {/* <MenuItem
          className={classes.ZCOOL}
          onClick={() => changeFont('ZCOOL KuaiLe', 400)}
          value="ZCOOL KuaiLe"
        >
          快乐
        </MenuItem> */}
      </Menu>
    </Root>
  );
}
