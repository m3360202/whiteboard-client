import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';

const PREFIX = 'CropImage';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  cropButton: `${PREFIX}-cropButton`
};

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

  [`& .${classes.cropButton}`]: {
    borderRightWidth: 1,
    width: 40,
  }
}));

export default function CropImage  () {


  const onClickApplyFormat = (e) => {
    e.preventDefault();
    const object = canvas.getActiveObject();
    object.startCrop();
  };

  return (
    <Root>
      <ToggleButton
        aria-label="bold"
        className={classes.cropButton}
        onClick={(e) => onClickApplyFormat(e)}
        selected={false}
        value="crop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 32 32"
          enableBackground="new 0 0 32 32"
          className="menuImgSize"
        >
          <image
            id="image0"
            width="32"
            height="32"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmBBUHEDmOBt+OAAABPklEQVRIx6WUMUsDMRiGn5PsDnYR cXMubgoOnRxOXHQQCo4Waujeye5OIoj/wkUQR9E/ILi7O55TXfrFoVevickl1/tuyvvme0jeC19G mzpmZgs5eYN2jVDY0pRpcvsBgjC0RYNJBuzwzsAVUwG7dPxGGkAjPC0Wipwu8MFzqYy9TZWvuQMe KqvAYMo0TfBbpD1EEHTVrujTA17/lGvvCeZ+xg0w4j50u3gGZ5zU2XWAPhPWYvmGARphRofIaw0B 9FJ0ta/VDzi3kq/NyW/eWj9uBYBiMyknj3nJF4eJOXnMeXRHqwIGCMIo8Zr/zD33zTcFbPPGRVJO HnOfLWJ7akyN8NIGIEjg8F6A8mx5ZCMwl5arnGSZQ0+rDChYB75twBVdPiPN4xKQO5MsuZwMojMm Vq0BqnHHT1vAqb38BdjCjr64RAyqAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA0LTIxVDA3OjE2 OjU3KzAwOjAwjVQ68wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wNC0yMVQwNzoxNjo1NyswMDow MPwJgk8AAAAASUVORK5CYII="
          />
        </svg>
      </ToggleButton>
    </Root>
  );
}
