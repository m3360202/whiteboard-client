import React from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import { WidgetService } from '../../services';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import store, { RootState } from '../../store';
import { handleSetDropdownDisplayed } from '../../store/widgets';
import { useSelector, useDispatch } from 'react-redux';
const PREFIX = 'EmojiMenu';

const classes = {
  container: `${PREFIX}-container`,
  thumb: `${PREFIX}-thumb`,
  thumbActive: `${PREFIX}-thumbActive`,
  love: `${PREFIX}-love`,
  loveActive: `${PREFIX}-loveActive`,
  smile: `${PREFIX}-smile`,
  smileActive: `${PREFIX}-smileActive`,
  shock: `${PREFIX}-shock`,
  shockActive: `${PREFIX}-shockActive`,
  question: `${PREFIX}-question`,
  questionActive: `${PREFIX}-questionActive`,
  emojiEmotionsButton: `${PREFIX}-emojiEmotionsButton`,
  emojiA: `${PREFIX}-emojiA`,
  emojiPopover: `${PREFIX}-emojiPopover`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledPopover = styled(Popover)(({ theme }) => ({
   top: 4,
  '& .MuiPopover-paper': {
    width: '48px',
    paddingTop: '0px',
    boxShadow: '0px 1px 3px 2px #00000014'
  },
  
  [`& .${classes.container}`]: {
    height: 'auto',
    paddingLeft: '0px',
    margin: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  [`& .${classes.thumb}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='15' height='16' viewBox='0 0 15 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.5359 7.96273C14.5359 7.73918 14.4826 7.5294 14.3932 7.33873C13.7972 5.41607 11.007 5.55651 7.03811 5.46273C6.37455 5.44718 6.75411 4.66362 6.987 2.94362C7.13855 1.82496 6.41722 0.107178 5.20478 0.107178C3.20566 0.107178 5.12878 1.68407 3.36122 5.58362C2.41678 7.66718 0.305664 6.50007 0.305664 8.59296V13.357C0.305664 14.1716 0.385664 14.9547 1.53144 15.0836C2.64211 15.2085 2.39233 16.0001 3.99455 16.0001H12.0141C12.831 16.0001 13.4954 15.3352 13.4954 14.5183C13.4954 14.1796 13.3768 13.8712 13.1852 13.6214C13.6386 13.3676 13.9497 12.8885 13.9497 12.333C13.9497 11.9952 13.8314 11.6867 13.6403 11.4374C14.095 11.1841 14.407 10.7045 14.407 10.1481C14.407 9.74407 14.2434 9.37784 13.9799 9.10985C14.3163 8.83829 14.5359 8.42762 14.5359 7.96273Z' fill='%23FFDB5E'/%3E%3Cpath d='M9.231 9.44399H13.055C13.575 9.44399 14.063 9.16577 14.3288 8.71821C14.4381 8.53377 14.3772 8.2951 14.1923 8.18532C14.0079 8.07555 13.7692 8.13732 13.6594 8.32177C13.5337 8.53466 13.3012 8.66621 13.0546 8.66621H9.139C8.751 8.66621 8.43545 8.35066 8.43545 7.96266C8.43545 7.57466 8.751 7.2591 9.139 7.2591H11.7554C11.9701 7.2591 12.1443 7.08488 12.1443 6.87021C12.1443 6.65555 11.9701 6.48132 11.7554 6.48132H9.13856C8.32167 6.48132 7.65723 7.14577 7.65723 7.96266C7.65723 8.41821 7.86834 8.82132 8.19278 9.09332C7.91945 9.36221 7.74923 9.73555 7.74923 10.148C7.74923 10.6049 7.96167 11.0093 8.28789 11.2809C8.01634 11.5493 7.84789 11.9213 7.84789 12.3329C7.84789 12.8307 8.09634 13.2698 8.47412 13.5387C8.24123 13.8004 8.09545 14.1413 8.09545 14.5182C8.09545 15.3351 8.75989 15.9995 9.57678 15.9995H12.0141C12.5341 15.9995 13.0226 15.7218 13.2883 15.2742C13.3981 15.0898 13.3372 14.8511 13.1528 14.7413C12.9679 14.6324 12.7292 14.6924 12.6199 14.8769C12.4932 15.0898 12.2608 15.2218 12.0141 15.2218H9.57678C9.18878 15.2218 8.87323 14.9062 8.87323 14.5182C8.87323 14.1302 9.18878 13.8147 9.57678 13.8147H12.4683C12.9883 13.8147 13.4772 13.5364 13.7426 13.0889C13.8523 12.904 13.7914 12.6653 13.607 12.556C13.4208 12.4444 13.183 12.5071 13.0741 12.6915C12.9457 12.908 12.719 13.0369 12.4683 13.0369H9.32923C8.94123 13.0369 8.62567 12.7209 8.62567 12.3329C8.62567 11.9449 8.94123 11.6293 9.32923 11.6293H12.9252C13.4452 11.6293 13.9337 11.3515 14.1994 10.904C14.3092 10.7195 14.2483 10.4809 14.0639 10.3711C13.8786 10.2618 13.6403 10.3222 13.531 10.5067C13.4026 10.7227 13.1759 10.8515 12.9252 10.8515H9.231C8.843 10.8515 8.52745 10.536 8.52745 10.148C8.52745 9.75999 8.84256 9.44399 9.231 9.44399Z' fill='%23EE9547'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    '&:hover': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    },
    '&:active': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    }
  },

  [`& .${classes.thumbActive}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='15' height='16' viewBox='0 0 15 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.5359 7.96273C14.5359 7.73918 14.4826 7.5294 14.3932 7.33873C13.7972 5.41607 11.007 5.55651 7.03811 5.46273C6.37455 5.44718 6.75411 4.66362 6.987 2.94362C7.13855 1.82496 6.41722 0.107178 5.20478 0.107178C3.20566 0.107178 5.12878 1.68407 3.36122 5.58362C2.41678 7.66718 0.305664 6.50007 0.305664 8.59296V13.357C0.305664 14.1716 0.385664 14.9547 1.53144 15.0836C2.64211 15.2085 2.39233 16.0001 3.99455 16.0001H12.0141C12.831 16.0001 13.4954 15.3352 13.4954 14.5183C13.4954 14.1796 13.3768 13.8712 13.1852 13.6214C13.6386 13.3676 13.9497 12.8885 13.9497 12.333C13.9497 11.9952 13.8314 11.6867 13.6403 11.4374C14.095 11.1841 14.407 10.7045 14.407 10.1481C14.407 9.74407 14.2434 9.37784 13.9799 9.10985C14.3163 8.83829 14.5359 8.42762 14.5359 7.96273Z' fill='%23FFDB5E'/%3E%3Cpath d='M9.231 9.44399H13.055C13.575 9.44399 14.063 9.16577 14.3288 8.71821C14.4381 8.53377 14.3772 8.2951 14.1923 8.18532C14.0079 8.07555 13.7692 8.13732 13.6594 8.32177C13.5337 8.53466 13.3012 8.66621 13.0546 8.66621H9.139C8.751 8.66621 8.43545 8.35066 8.43545 7.96266C8.43545 7.57466 8.751 7.2591 9.139 7.2591H11.7554C11.9701 7.2591 12.1443 7.08488 12.1443 6.87021C12.1443 6.65555 11.9701 6.48132 11.7554 6.48132H9.13856C8.32167 6.48132 7.65723 7.14577 7.65723 7.96266C7.65723 8.41821 7.86834 8.82132 8.19278 9.09332C7.91945 9.36221 7.74923 9.73555 7.74923 10.148C7.74923 10.6049 7.96167 11.0093 8.28789 11.2809C8.01634 11.5493 7.84789 11.9213 7.84789 12.3329C7.84789 12.8307 8.09634 13.2698 8.47412 13.5387C8.24123 13.8004 8.09545 14.1413 8.09545 14.5182C8.09545 15.3351 8.75989 15.9995 9.57678 15.9995H12.0141C12.5341 15.9995 13.0226 15.7218 13.2883 15.2742C13.3981 15.0898 13.3372 14.8511 13.1528 14.7413C12.9679 14.6324 12.7292 14.6924 12.6199 14.8769C12.4932 15.0898 12.2608 15.2218 12.0141 15.2218H9.57678C9.18878 15.2218 8.87323 14.9062 8.87323 14.5182C8.87323 14.1302 9.18878 13.8147 9.57678 13.8147H12.4683C12.9883 13.8147 13.4772 13.5364 13.7426 13.0889C13.8523 12.904 13.7914 12.6653 13.607 12.556C13.4208 12.4444 13.183 12.5071 13.0741 12.6915C12.9457 12.908 12.719 13.0369 12.4683 13.0369H9.32923C8.94123 13.0369 8.62567 12.7209 8.62567 12.3329C8.62567 11.9449 8.94123 11.6293 9.32923 11.6293H12.9252C13.4452 11.6293 13.9337 11.3515 14.1994 10.904C14.3092 10.7195 14.2483 10.4809 14.0639 10.3711C13.8786 10.2618 13.6403 10.3222 13.531 10.5067C13.4026 10.7227 13.1759 10.8515 12.9252 10.8515H9.231C8.843 10.8515 8.52745 10.536 8.52745 10.148C8.52745 9.75999 8.84256 9.44399 9.231 9.44399Z' fill='%23EE9547'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: '#F2F2F3',
    backgroundSize: '20px 20px',
    cursor: 'pointer'
  },

  [`& .${classes.love}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58178 16 0 12.4182 0 8C0 3.58178 3.58178 0 8 0C12.4182 0 16 3.58178 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.99994 9.71064C6.68171 9.71064 5.8066 9.55686 4.72483 9.34664C4.47727 9.29953 3.99683 9.34664 3.99683 10.0746C3.99683 11.5302 5.66927 13.3497 7.99994 13.3497C10.3306 13.3497 12.003 11.5302 12.003 10.0746C12.003 9.34664 11.5222 9.29908 11.275 9.34664C10.1933 9.55686 9.3186 9.71064 7.99994 9.71064Z' fill='%23664500'/%3E%3Cpath d='M7.40009 1.45823C7.01831 0.377788 5.83387 -0.189323 4.75298 0.191566C4.09698 0.422677 3.63253 0.952011 3.45164 1.57112C2.92231 1.20268 2.22898 1.08223 1.57387 1.31334C0.493866 1.69468 -0.0741343 2.88001 0.307644 3.96046C0.361866 4.11334 0.433866 4.25512 0.517421 4.38623C1.38453 5.97823 3.88987 7.09734 5.40675 7.11112C6.57875 6.14801 7.8272 3.70446 7.50364 1.92134C7.48675 1.76668 7.45342 1.61112 7.40009 1.45823ZM8.60009 1.45823C8.98187 0.377788 10.1668 -0.189323 11.2472 0.191566C11.9032 0.422677 12.3676 0.952011 12.549 1.57112C13.0783 1.20268 13.7716 1.08223 14.4268 1.31334C15.5068 1.69468 16.0743 2.88001 15.6934 3.96046C15.6388 4.11334 15.5672 4.25512 15.4832 4.38623C14.6161 5.97823 12.1108 7.09734 10.5934 7.11112C9.42142 6.14801 8.17342 3.70446 8.49698 1.92134C8.51342 1.76668 8.54675 1.61112 8.60009 1.45823Z' fill='%23DD2E44'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    '&:hover': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    },
    '&:active': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    }
  },

  [`& .${classes.loveActive}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58178 16 0 12.4182 0 8C0 3.58178 3.58178 0 8 0C12.4182 0 16 3.58178 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.99994 9.71064C6.68171 9.71064 5.8066 9.55686 4.72483 9.34664C4.47727 9.29953 3.99683 9.34664 3.99683 10.0746C3.99683 11.5302 5.66927 13.3497 7.99994 13.3497C10.3306 13.3497 12.003 11.5302 12.003 10.0746C12.003 9.34664 11.5222 9.29908 11.275 9.34664C10.1933 9.55686 9.3186 9.71064 7.99994 9.71064Z' fill='%23664500'/%3E%3Cpath d='M7.40009 1.45823C7.01831 0.377788 5.83387 -0.189323 4.75298 0.191566C4.09698 0.422677 3.63253 0.952011 3.45164 1.57112C2.92231 1.20268 2.22898 1.08223 1.57387 1.31334C0.493866 1.69468 -0.0741343 2.88001 0.307644 3.96046C0.361866 4.11334 0.433866 4.25512 0.517421 4.38623C1.38453 5.97823 3.88987 7.09734 5.40675 7.11112C6.57875 6.14801 7.8272 3.70446 7.50364 1.92134C7.48675 1.76668 7.45342 1.61112 7.40009 1.45823ZM8.60009 1.45823C8.98187 0.377788 10.1668 -0.189323 11.2472 0.191566C11.9032 0.422677 12.3676 0.952011 12.549 1.57112C13.0783 1.20268 13.7716 1.08223 14.4268 1.31334C15.5068 1.69468 16.0743 2.88001 15.6934 3.96046C15.6388 4.11334 15.5672 4.25512 15.4832 4.38623C14.6161 5.97823 12.1108 7.09734 10.5934 7.11112C9.42142 6.14801 8.17342 3.70446 8.49698 1.92134C8.51342 1.76668 8.54675 1.61112 8.60009 1.45823Z' fill='%23DD2E44'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: '#F2F2F3',
    backgroundSize: '20px 20px',
    cursor: 'pointer'
  },

  [`& .${classes.smile}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58222 16 0 12.4182 0 8C0 3.58222 3.58222 0 8 0C12.4182 0 16 3.58222 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.11108 8.00005C6.92486 8.00005 6.75153 7.88228 6.68931 7.69605C6.59908 7.42983 6.23731 6.66672 5.77775 6.66672C5.30575 6.66672 4.93864 7.47872 4.8662 7.69605C4.78842 7.9285 4.5382 8.05517 4.30397 7.97694C4.07108 7.89961 3.94531 7.64761 4.02308 7.41472C4.07864 7.24761 4.60264 5.77783 5.77775 5.77783C6.95286 5.77783 7.47686 7.24761 7.53286 7.41517C7.61064 7.64805 7.48486 7.90005 7.25197 7.97739C7.20486 7.9925 7.15731 8.00005 7.11108 8.00005ZM11.5555 8.00005C11.3693 8.00005 11.196 7.88228 11.1342 7.69605C11.044 7.42983 10.6813 6.66672 10.2222 6.66672C9.7502 6.66672 9.38264 7.47872 9.3102 7.69605C9.23242 7.9285 8.98308 8.05517 8.74797 7.97694C8.51553 7.89961 8.38931 7.64761 8.46708 7.41472C8.52308 7.24761 9.04664 5.77783 10.2222 5.77783C11.3978 5.77783 11.9213 7.24761 11.9769 7.41517C12.0546 7.64805 11.9289 7.90005 11.696 7.97739C11.6493 7.9925 11.6018 8.00005 11.5555 8.00005ZM7.99997 9.77783C6.38975 9.77783 5.32131 9.59028 3.99997 9.33339C3.6982 9.27517 3.11108 9.33339 3.11108 10.2223C3.11108 12.0001 5.15331 14.2223 7.99997 14.2223C10.8462 14.2223 12.8889 12.0001 12.8889 10.2223C12.8889 9.33339 12.3018 9.27472 12 9.33339C10.6786 9.59028 9.6102 9.77783 7.99997 9.77783Z' fill='%23664500'/%3E%3Cpath d='M7.99993 12.264C6.40171 12.264 5.21238 12.0987 4.47238 11.9329L4.10571 11.1014C4.47149 11.24 5.83416 11.5 8.00038 11.5C10.2022 11.5 11.5724 11.2262 11.9399 11.0831L11.6284 11.9018C10.9022 12.0707 9.66438 12.264 7.99993 12.264Z' fill='%23664500'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    '&:hover': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    },
    '&:active': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    }
  },

  [`& .${classes.smileActive}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58222 16 0 12.4182 0 8C0 3.58222 3.58222 0 8 0C12.4182 0 16 3.58222 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.11108 8.00005C6.92486 8.00005 6.75153 7.88228 6.68931 7.69605C6.59908 7.42983 6.23731 6.66672 5.77775 6.66672C5.30575 6.66672 4.93864 7.47872 4.8662 7.69605C4.78842 7.9285 4.5382 8.05517 4.30397 7.97694C4.07108 7.89961 3.94531 7.64761 4.02308 7.41472C4.07864 7.24761 4.60264 5.77783 5.77775 5.77783C6.95286 5.77783 7.47686 7.24761 7.53286 7.41517C7.61064 7.64805 7.48486 7.90005 7.25197 7.97739C7.20486 7.9925 7.15731 8.00005 7.11108 8.00005ZM11.5555 8.00005C11.3693 8.00005 11.196 7.88228 11.1342 7.69605C11.044 7.42983 10.6813 6.66672 10.2222 6.66672C9.7502 6.66672 9.38264 7.47872 9.3102 7.69605C9.23242 7.9285 8.98308 8.05517 8.74797 7.97694C8.51553 7.89961 8.38931 7.64761 8.46708 7.41472C8.52308 7.24761 9.04664 5.77783 10.2222 5.77783C11.3978 5.77783 11.9213 7.24761 11.9769 7.41517C12.0546 7.64805 11.9289 7.90005 11.696 7.97739C11.6493 7.9925 11.6018 8.00005 11.5555 8.00005ZM7.99997 9.77783C6.38975 9.77783 5.32131 9.59028 3.99997 9.33339C3.6982 9.27517 3.11108 9.33339 3.11108 10.2223C3.11108 12.0001 5.15331 14.2223 7.99997 14.2223C10.8462 14.2223 12.8889 12.0001 12.8889 10.2223C12.8889 9.33339 12.3018 9.27472 12 9.33339C10.6786 9.59028 9.6102 9.77783 7.99997 9.77783Z' fill='%23664500'/%3E%3Cpath d='M7.99993 12.264C6.40171 12.264 5.21238 12.0987 4.47238 11.9329L4.10571 11.1014C4.47149 11.24 5.83416 11.5 8.00038 11.5C10.2022 11.5 11.5724 11.2262 11.9399 11.0831L11.6284 11.9018C10.9022 12.0707 9.66438 12.264 7.99993 12.264Z' fill='%23664500'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: '#F2F2F3',
    backgroundSize: '20px 20px',
    cursor: 'pointer'
  },

  [`& .${classes.shock}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58178 16 0 12.4182 0 8C0 3.58178 3.58178 0 8 0C12.4182 0 16 3.58178 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.99995 13.3334C8.98179 13.3334 9.77772 12.3384 9.77772 11.1111C9.77772 9.88384 8.98179 8.88892 7.99995 8.88892C7.01811 8.88892 6.22217 9.88384 6.22217 11.1111C6.22217 12.3384 7.01811 13.3334 7.99995 13.3334Z' fill='%23664500'/%3E%3Cpath d='M5.33328 7.55557C5.94693 7.55557 6.44439 6.85912 6.44439 6.00001C6.44439 5.1409 5.94693 4.44446 5.33328 4.44446C4.71963 4.44446 4.22217 5.1409 4.22217 6.00001C4.22217 6.85912 4.71963 7.55557 5.33328 7.55557Z' fill='%23664500'/%3E%3Cpath d='M10.6668 7.55557C11.2804 7.55557 11.7779 6.85912 11.7779 6.00001C11.7779 5.1409 11.2804 4.44446 10.6668 4.44446C10.0531 4.44446 9.55566 5.1409 9.55566 6.00001C9.55566 6.85912 10.0531 7.55557 10.6668 7.55557Z' fill='%23664500'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    },
    '&:active': {
      backgroundColor: '#F2F2F3',
      borderRadius: '4px',
      opacity: 1,
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    }
  },

  [`& .${classes.shockActive}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8C16 12.4182 12.4182 16 8 16C3.58178 16 0 12.4182 0 8C0 3.58178 3.58178 0 8 0C12.4182 0 16 3.58178 16 8Z' fill='%23FFCC4D'/%3E%3Cpath d='M7.99995 13.3334C8.98179 13.3334 9.77772 12.3384 9.77772 11.1111C9.77772 9.88384 8.98179 8.88892 7.99995 8.88892C7.01811 8.88892 6.22217 9.88384 6.22217 11.1111C6.22217 12.3384 7.01811 13.3334 7.99995 13.3334Z' fill='%23664500'/%3E%3Cpath d='M5.33328 7.55557C5.94693 7.55557 6.44439 6.85912 6.44439 6.00001C6.44439 5.1409 5.94693 4.44446 5.33328 4.44446C4.71963 4.44446 4.22217 5.1409 4.22217 6.00001C4.22217 6.85912 4.71963 7.55557 5.33328 7.55557Z' fill='%23664500'/%3E%3Cpath d='M10.6668 7.55557C11.2804 7.55557 11.7779 6.85912 11.7779 6.00001C11.7779 5.1409 11.2804 4.44446 10.6668 4.44446C10.0531 4.44446 9.55566 5.1409 9.55566 6.00001C9.55566 6.85912 10.0531 7.55557 10.6668 7.55557Z' fill='%23664500'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: '#F2F2F3',
    backgroundSize: '20px 20px',
    cursor: 'pointer'
  },

  [`& .${classes.question}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.99989 15.1192C12.1727 15.1192 15.5554 11.7364 15.5554 7.56361C15.5554 3.39079 12.1727 0.00805664 7.99989 0.00805664C3.82707 0.00805664 0.444336 3.39079 0.444336 7.56361C0.444336 11.7364 3.82707 15.1192 7.99989 15.1192Z' fill='%23FFCB4C'/%3E%3Cpath d='M6.45494 9.34928C6.3905 9.29773 6.34028 9.2275 6.31628 9.14306C6.25672 8.93861 6.37406 8.73506 6.5785 8.68928C8.59094 8.2355 9.94606 9.29506 10.0034 9.34039C10.1741 9.47639 10.2074 9.71595 10.0803 9.87595C9.95317 10.0351 9.71228 10.0542 9.54206 9.91906C9.49317 9.88173 8.42072 9.06439 6.7945 9.43106C6.67272 9.45817 6.54828 9.42395 6.45494 9.34928Z' fill='%2365471B'/%3E%3Cpath d='M5.83067 6.14666C6.35228 6.14666 6.77512 5.61815 6.77512 4.96621C6.77512 4.31427 6.35228 3.78577 5.83067 3.78577C5.30907 3.78577 4.88623 4.31427 4.88623 4.96621C4.88623 5.61815 5.30907 6.14666 5.83067 6.14666Z' fill='%2365471B'/%3E%3Cpath d='M10.8334 6.6187C11.355 6.6187 11.7778 6.0902 11.7778 5.43826C11.7778 4.78632 11.355 4.25781 10.8334 4.25781C10.3118 4.25781 9.88892 4.78632 9.88892 5.43826C9.88892 6.0902 10.3118 6.6187 10.8334 6.6187Z' fill='%2365471B'/%3E%3Cpath d='M7.67815 15.6217C7.67815 15.6217 8.24037 15.4391 8.31326 15.0208C8.39015 14.5888 8.03593 14.5022 8.03593 14.5022C8.03593 14.5022 8.49859 14.4097 8.55682 13.8906C8.61148 13.4013 8.17415 13.2848 8.17415 13.2848C8.17415 13.2848 8.60526 13.1071 8.6257 12.6008C8.64259 12.1746 8.18348 11.9662 8.18348 11.9662C8.18348 11.9662 10.4226 11.4235 10.6528 11.3702C10.8821 11.3168 11.2395 11.0968 11.1279 10.6173C11.0173 10.1373 10.5928 10.1204 10.3737 10.1715C10.1541 10.2226 7.37637 10.8675 6.41815 11.0906L5.77859 11.2391C5.53859 11.2955 5.4297 11.1902 5.59904 11.0115C5.82481 10.7733 5.96926 10.5097 6.01948 10.0724C6.07237 9.61239 5.91637 9.04439 5.82704 8.82394C5.66081 8.41461 5.38037 8.09105 5.05637 7.97994C4.55104 7.80661 4.19193 8.12261 4.37104 8.67372C4.63948 9.49772 4.46348 10.1737 4.00081 10.5817C2.91237 11.5404 2.40615 12.2239 2.74304 13.6808C3.11104 15.2697 4.68837 16.2924 6.27726 15.9244L7.67815 15.6217Z' fill='%23F19020'/%3E%3Cpath d='M4.13155 2.82271C4.05866 2.7836 3.99689 2.72315 3.95778 2.64538C3.86178 2.45515 3.94 2.23338 4.13244 2.15115C6.02844 1.33738 7.55422 2.13204 7.61822 2.16626C7.81066 2.26893 7.88844 2.49826 7.792 2.67915C7.696 2.85915 7.46311 2.92182 7.27066 2.82049C7.216 2.79249 6.012 2.18404 4.48044 2.84138C4.36622 2.88982 4.23733 2.87915 4.13155 2.82271ZM9.52489 4.48938C9.45555 4.44582 9.39778 4.38138 9.364 4.30093C9.28089 4.10449 9.37422 3.88893 9.572 3.81915C11.5191 3.13649 12.9876 4.03249 13.0489 4.07115C13.2333 4.18671 13.2956 4.42093 13.1876 4.59471C13.08 4.76804 12.8427 4.81471 12.6582 4.70049C12.6049 4.66849 11.4462 3.98004 9.87289 4.53204C9.75466 4.57249 9.62711 4.55249 9.52489 4.48938Z' fill='%2365471B'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    listStyle: 'none',
    width: '16px',
    height: '16px',
    padding: '10px',
    opacity: 1,
    borderRadius: '4px',
    backgroundSize: '20px 20px',
    '&:hover': {
      borderRadius: '4px',
      opacity: 1,
      backgroundColor: '#F2F2F3',
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    },
    '&:active': {
      borderRadius: '4px',
      opacity: 1,
      backgroundColor: '#F2F2F3',
      backgroundSize: '20px 20px',
      cursor: 'pointer'
    }
  },

  [`& .${classes.questionActive}`]: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.99989 15.1192C12.1727 15.1192 15.5554 11.7364 15.5554 7.56361C15.5554 3.39079 12.1727 0.00805664 7.99989 0.00805664C3.82707 0.00805664 0.444336 3.39079 0.444336 7.56361C0.444336 11.7364 3.82707 15.1192 7.99989 15.1192Z' fill='%23FFCB4C'/%3E%3Cpath d='M6.45494 9.34928C6.3905 9.29773 6.34028 9.2275 6.31628 9.14306C6.25672 8.93861 6.37406 8.73506 6.5785 8.68928C8.59094 8.2355 9.94606 9.29506 10.0034 9.34039C10.1741 9.47639 10.2074 9.71595 10.0803 9.87595C9.95317 10.0351 9.71228 10.0542 9.54206 9.91906C9.49317 9.88173 8.42072 9.06439 6.7945 9.43106C6.67272 9.45817 6.54828 9.42395 6.45494 9.34928Z' fill='%2365471B'/%3E%3Cpath d='M5.83067 6.14666C6.35228 6.14666 6.77512 5.61815 6.77512 4.96621C6.77512 4.31427 6.35228 3.78577 5.83067 3.78577C5.30907 3.78577 4.88623 4.31427 4.88623 4.96621C4.88623 5.61815 5.30907 6.14666 5.83067 6.14666Z' fill='%2365471B'/%3E%3Cpath d='M10.8334 6.6187C11.355 6.6187 11.7778 6.0902 11.7778 5.43826C11.7778 4.78632 11.355 4.25781 10.8334 4.25781C10.3118 4.25781 9.88892 4.78632 9.88892 5.43826C9.88892 6.0902 10.3118 6.6187 10.8334 6.6187Z' fill='%2365471B'/%3E%3Cpath d='M7.67815 15.6217C7.67815 15.6217 8.24037 15.4391 8.31326 15.0208C8.39015 14.5888 8.03593 14.5022 8.03593 14.5022C8.03593 14.5022 8.49859 14.4097 8.55682 13.8906C8.61148 13.4013 8.17415 13.2848 8.17415 13.2848C8.17415 13.2848 8.60526 13.1071 8.6257 12.6008C8.64259 12.1746 8.18348 11.9662 8.18348 11.9662C8.18348 11.9662 10.4226 11.4235 10.6528 11.3702C10.8821 11.3168 11.2395 11.0968 11.1279 10.6173C11.0173 10.1373 10.5928 10.1204 10.3737 10.1715C10.1541 10.2226 7.37637 10.8675 6.41815 11.0906L5.77859 11.2391C5.53859 11.2955 5.4297 11.1902 5.59904 11.0115C5.82481 10.7733 5.96926 10.5097 6.01948 10.0724C6.07237 9.61239 5.91637 9.04439 5.82704 8.82394C5.66081 8.41461 5.38037 8.09105 5.05637 7.97994C4.55104 7.80661 4.19193 8.12261 4.37104 8.67372C4.63948 9.49772 4.46348 10.1737 4.00081 10.5817C2.91237 11.5404 2.40615 12.2239 2.74304 13.6808C3.11104 15.2697 4.68837 16.2924 6.27726 15.9244L7.67815 15.6217Z' fill='%23F19020'/%3E%3Cpath d='M4.13155 2.82271C4.05866 2.7836 3.99689 2.72315 3.95778 2.64538C3.86178 2.45515 3.94 2.23338 4.13244 2.15115C6.02844 1.33738 7.55422 2.13204 7.61822 2.16626C7.81066 2.26893 7.88844 2.49826 7.792 2.67915C7.696 2.85915 7.46311 2.92182 7.27066 2.82049C7.216 2.79249 6.012 2.18404 4.48044 2.84138C4.36622 2.88982 4.23733 2.87915 4.13155 2.82271ZM9.52489 4.48938C9.45555 4.44582 9.39778 4.38138 9.364 4.30093C9.28089 4.10449 9.37422 3.88893 9.572 3.81915C11.5191 3.13649 12.9876 4.03249 13.0489 4.07115C13.2333 4.18671 13.2956 4.42093 13.1876 4.59471C13.08 4.76804 12.8427 4.81471 12.6582 4.70049C12.6049 4.66849 11.4462 3.98004 9.87289 4.53204C9.75466 4.57249 9.62711 4.55249 9.52489 4.48938Z' fill='%2365471B'/%3E%3C/svg%3E%0A\")",
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    width: '16px',
    height: '16px',
    padding: '10px',
    listStyle: 'none',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: '#F2F2F3',
    backgroundSize: '20px 20px',
    cursor: 'pointer'
  },

  [`& .${classes.emojiEmotionsButton}`]: {
    borderLeftWidth: 1,
    paddingLeft: 0,
    paddingRight: 0,
    height: 44
  },

  [`& .${classes.emojiA}`]: {
    width: 40
  },

  [`& .${classes.emojiPopover}`]: {
    top: 4,
    '& .MuiPopover-paper': {
      width: '48px',
      paddingTop: '0px',
      boxShadow: '0px 1px 3px 2px #00000014'
    }
  }
}));



export default function EmojiMenu({ paddingLeft, paddingRight }) {


  const [anchorEl, setAnchorEl] = React.useState(null);

  const currentHoverObjectId = useSelector((state: RootState) => state.resource.currentHoverObjectId);
  const userEmojiWidget =  WidgetService.getInstance().getWidgetFromWidgetList(currentHoverObjectId);
  const thumb = userEmojiWidget && userEmojiWidget[store.getState().user.userInfo.userId] && userEmojiWidget[store.getState().user.userInfo.userId][0] === 1 ?'active':''
  const love = userEmojiWidget && userEmojiWidget[store.getState().user.userInfo.userId] && userEmojiWidget[store.getState().user.userInfo.userId][1] === 1 ?'active':''
  const smile = userEmojiWidget && userEmojiWidget[store.getState().user.userInfo.userId] && userEmojiWidget[store.getState().user.userInfo.userId][2] === 1 ?'active':''
  const shock = userEmojiWidget && userEmojiWidget[store.getState().user.userInfo.userId] && userEmojiWidget[store.getState().user.userInfo.userId][3] === 1 ?'active':''
  const question = userEmojiWidget && userEmojiWidget[store.getState().user.userInfo.userId] && userEmojiWidget[store.getState().user.userInfo.userId][4] === 1 ?'active':''

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleBlur = (e) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const [open, setOpen] = React.useState(false);
  const id = open ? 'simple-popover' : undefined;

  const clickLove = (e) => {
    e.preventDefault();
    const currentID = canvas.getActiveObject()._id?canvas.getActiveObject()._id:null;
    console.log('currentID', currentID);
    let emojiWidget = canvas.findById(currentID).emoji;

    if (!emojiWidget) {
      canvas.findById(currentID).set({ userEmoji: {}, emoji: [0, 0, 0, 0, 0] });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }

    let userEmojiWidget = canvas.findById(currentID).userEmoji;

    if (emojiWidget === undefined || isNaN(emojiWidget[0])) {
      emojiWidget = [0, 0, 0, 0, 0];
    }
    const u_id = store.getState().user.userInfo.userId;

    if (userEmojiWidget === undefined) {
      userEmojiWidget = {}; // user-emoji key-value pair
    }
    if (u_id in userEmojiWidget) {
      if (userEmojiWidget[u_id][1] === 1) {
        delete userEmojiWidget[u_id];
        if(emojiWidget[1] ===0){
          emojiWidget[1] = 0;
        }else{
          emojiWidget[1] =emojiWidget[1] -1;
        }
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      } else {
        const tmpEW = [];
        for (let i = 0; i <= emojiWidget.length - 1; i++) {
          tmpEW.push(emojiWidget[i] - userEmojiWidget[u_id][i]);
        }
        tmpEW[1] += 1;
        emojiWidget = tmpEW;
        userEmojiWidget[u_id] = [0, 1, 0, 0, 0];
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      }
    } else {
      userEmojiWidget[u_id] = [0, 1, 0, 0, 0];
      emojiWidget= [0, 1, 0, 0, 0];
      canvas
        .findById(currentID)
        .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }
    canvas.findById(currentID).set({ dirty: true });
    setOpen(false);
    // canvas.requestRenderAll();
    focusHiddenTextarea();
  };
  const clickSmile = (e) => {
    e.preventDefault();
    const currentID = canvas.getActiveObject()._id;
    let emojiWidget = canvas.findById(currentID).emoji;
    let userEmojiWidget = canvas.findById(currentID).userEmoji;

    if (userEmojiWidget === undefined) userEmojiWidget = {};
    if (emojiWidget === undefined || isNaN(emojiWidget[0])) {
      emojiWidget = [0, 0, 0, 0, 0];
    }
    const u_id = store.getState().user.userInfo.userId;

    if (userEmojiWidget === undefined) {
      userEmojiWidget = {}; // user-emoji key-value pair
    }
    if (u_id in userEmojiWidget) {
      if (userEmojiWidget[u_id][2] === 1) {
        delete userEmojiWidget[u_id];
        if(emojiWidget[2] ===0){
          emojiWidget[2] = 0;
        }else{
          emojiWidget[2] =emojiWidget[2] -1;
        }
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      } else {
        const tmpEW = [];
        for (let i = 0; i <= emojiWidget.length - 1; i++) {
          tmpEW.push(emojiWidget[i] - userEmojiWidget[u_id][i]);
        }
        tmpEW[2] += 1;
        emojiWidget = tmpEW;
        userEmojiWidget[u_id] = [0, 0, 1, 0, 0];
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      }
    } else {
      userEmojiWidget[u_id] = [0, 0, 1, 0, 0];
      emojiWidget= [0, 0, 1, 0, 0];
      canvas
        .findById(currentID)
        .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }
    canvas.findById(currentID).set({ dirty: true });
    setOpen(false);
    // canvas.requestRenderAll();
    focusHiddenTextarea();
  };
  const clickShock = (e) => {
    e.preventDefault();
    const currentID = canvas.getActiveObject()._id;
    let emojiWidget = canvas.findById(currentID).emoji;
    let userEmojiWidget = canvas.findById(currentID).userEmoji;

    if (userEmojiWidget === undefined) userEmojiWidget = {};
    if (emojiWidget === undefined || isNaN(emojiWidget[0])) {
      emojiWidget = [0, 0, 0, 0, 0];
    }
    const u_id = store.getState().user.userInfo.userId;

    if (userEmojiWidget === undefined) {
      userEmojiWidget = {}; // user-emoji key-value pair
    }
    if (u_id in userEmojiWidget) {
      if (userEmojiWidget[u_id][3] === 1) {
        delete userEmojiWidget[u_id];
        if(emojiWidget[3] ===0){
          emojiWidget[3] = 0;
        }else{
          emojiWidget[3] =emojiWidget[3] -1;
        }
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      } else {
        const tmpEW = [];
        for (let i = 0; i <= emojiWidget.length - 1; i++) {
          tmpEW.push(emojiWidget[i] - userEmojiWidget[u_id][i]);
        }
        tmpEW[3] += 1;
        emojiWidget = tmpEW;
        userEmojiWidget[u_id] = [0, 0, 0, 1, 0];
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      }
    } else {
      userEmojiWidget[u_id] = [0, 0, 0, 1, 0];
      emojiWidget= [0, 0, 0, 1, 0];
      canvas
        .findById(currentID)
        .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }
    canvas.findById(currentID).set({ dirty: true });
    setOpen(false);
    // canvas.requestRenderAll();
    focusHiddenTextarea();
  };
  const clickQuestion = (e) => {
    e.preventDefault();
    const currentID = canvas.getActiveObject()._id;
    let emojiWidget = canvas.findById(currentID).emoji;
    let userEmojiWidget = canvas.findById(currentID).userEmoji;

    if (userEmojiWidget === undefined) userEmojiWidget = {};
    if (emojiWidget === undefined || isNaN(emojiWidget[0])) {
      emojiWidget = [0, 0, 0, 0, 0];
    }
    const u_id = store.getState().user.userInfo.userId;

    if (userEmojiWidget === undefined) {
      userEmojiWidget = {}; // user-emoji key-value pair
    }
    if (u_id in userEmojiWidget) {
      if (userEmojiWidget[u_id][4] === 1) {
        delete userEmojiWidget[u_id];
        if(emojiWidget[4] ===0){
          emojiWidget[4] = 0;
        }else{
          emojiWidget[4] =emojiWidget[4] -1;
        }
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      } else {
        const tmpEW = [];
        for (let i = 0; i <= emojiWidget.length - 1; i++) {
          tmpEW.push(emojiWidget[i] - userEmojiWidget[u_id][i]);
        }
        tmpEW[4] += 1;
        emojiWidget = tmpEW;
        userEmojiWidget[u_id] = [0, 0, 0, 0, 1];
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      }
    } else {
      userEmojiWidget[u_id] = [0, 0, 0, 0, 1];
      emojiWidget= [0, 0, 0, 0, 1];
      canvas
        .findById(currentID)
        .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }
    canvas.findById(currentID).set({ dirty: true });
    setOpen(false);
    // canvas.requestRenderAll();
    focusHiddenTextarea();
  };

  const clickThumb = (e) => {
    e.preventDefault();
    const currentID = canvas.getActiveObject()._id;
    console.log('currentID', currentID);
    let emojiWidget = canvas.findById(currentID).emoji;
    let userEmojiWidget = canvas.findById(currentID).userEmoji;

    if (emojiWidget === undefined || isNaN(emojiWidget[0])) {
      emojiWidget = [0, 0, 0, 0, 0];
    }
    const u_id = store.getState().user.userInfo.userId;

    if (userEmojiWidget === undefined || !userEmojiWidget) {
      userEmojiWidget = {}; // user-emoji key-value pair
    }
    if (u_id in userEmojiWidget) {

      if (userEmojiWidget[u_id][0] === 1) {
        delete userEmojiWidget[u_id];

        if(emojiWidget[0] ===0){
          emojiWidget[0] = 0;
        }else{
          emojiWidget[0] -=1;
        }

        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      } else {
        const tmpEW = [];
        for (let i = 0; i <= emojiWidget.length - 1; i++) {
          tmpEW.push(emojiWidget[i] - userEmojiWidget[u_id][i]);
        }
        tmpEW[0] += 1;
        emojiWidget = tmpEW;
        userEmojiWidget[u_id] = [1, 0, 0, 0, 0];
        canvas
          .findById(currentID)
          .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
        canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
      }
    } else {
      userEmojiWidget[u_id] = [1, 0, 0, 0, 0];
      emojiWidget= [1, 0, 0, 0, 0];
  
      canvas
        .findById(currentID)
        .set({ userEmoji: userEmojiWidget, emoji: emojiWidget });
      canvas.findById(currentID).saveData('MODIFIED', ['userEmoji', 'emoji']);
    }
    canvas.findById(currentID).set({ dirty: true });
    setOpen(false);
    // canvas.requestRenderAll();
    focusHiddenTextarea();
  };

  const focusHiddenTextarea = () => {
    if (canvas.getActiveObject().hiddenTextarea)
      setTimeout(() => {
        canvas.getActiveObject().hiddenTextarea.focus();
      }, 100);
  };

  return (
    <>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          // className={classes.emojiEmotionsButton}
          sx={{
            borderLeftWidth: 1,
            paddingLeft: 0,
            paddingRight: 0,
            height: 44
          }}
          data-cy="emoji"
          selected={false}
          value="emoji"
        >
          {/* <EmojiEmotionsOutlinedIcon /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
            strokeWidth="1"
            className="widgetMenuImgSize"
          >
            <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3.27901 6.65C4.07667 5.01402 5.2859 3.61348 6.78807 2.58576C8.29024 1.55805 10.0338 0.938453 11.8476 0.787762C13.6614 0.63707 15.4833 0.960456 17.1345 1.7262C18.7856 2.49194 20.2094 3.67373 21.2661 5.15566C22.3228 6.63758 22.9761 8.36873 23.162 10.1793C23.3479 11.9899 23.06 13.8177 22.3264 15.4834C21.5929 17.1491 20.439 18.5956 18.9779 19.6809C17.5168 20.7661 15.7986 21.453 13.992 21.674"
              />
              <path
                stroke="#000000"
                strokeWidth="1.5"
                d="M9.8 9.953C9.5929 9.953 9.425 9.78511 9.425 9.578C9.425 9.3709 9.5929 9.203 9.8 9.203"
              />
              <path
                stroke="#000000"
                strokeWidth="1.5"
                d="M9.8 9.953C10.0071 9.953 10.175 9.78511 10.175 9.578C10.175 9.3709 10.0071 9.203 9.8 9.203"
              />
              <path
                stroke="#000000"
                strokeWidth="1.5"
                d="M19.8 9.453C19.5929 9.453 19.425 9.28511 19.425 9.078C19.425 8.8709 19.5929 8.703 19.8 8.703"
              />
              <path
                stroke="#000000"
                strokeWidth="1.5"
                d="M19.8 9.453C20.0071 9.453 20.175 9.28511 20.175 9.078C20.175 8.8709 20.0071 8.703 19.8 8.703"
              />
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M18.857 12.454C18.9635 12.4525 19.0692 12.4721 19.1682 12.5115C19.2672 12.5509 19.3574 12.6094 19.4337 12.6837C19.51 12.758 19.571 12.8466 19.6131 12.9445C19.6552 13.0423 19.6776 13.1475 19.679 13.254C19.6793 13.3215 19.6706 13.3888 19.653 13.454C19.3646 14.4932 18.6796 15.3776 17.7456 15.9166C16.8115 16.4557 15.703 16.6063 14.659 16.336C13.9537 16.1641 13.3074 15.806 12.7878 15.299C12.2682 14.7921 11.8942 14.1549 11.705 13.454C11.6791 13.3512 11.6738 13.2443 11.6896 13.1395C11.7054 13.0346 11.7418 12.934 11.7968 12.8434C11.8518 12.7528 11.9242 12.674 12.0099 12.6116C12.0956 12.5492 12.1929 12.5045 12.296 12.48C12.363 12.4629 12.4318 12.4541 12.501 12.454H18.857Z"
              />
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2.279 14.46L1.626 12.468C1.49581 12.0724 1.52801 11.6414 1.71553 11.2695C1.90304 10.8977 2.23052 10.6155 2.626 10.485V10.485C3.02157 10.3548 3.45265 10.387 3.82449 10.5745C4.19633 10.762 4.47851 11.0895 4.609 11.485L5.262 13.477"
              />
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8.338 22.4C8.7154 22.2771 9.0648 22.0808 9.36614 21.8224C9.66747 21.5641 9.91481 21.2487 10.094 20.8946C10.2731 20.5404 10.3805 20.1543 10.41 19.7584C10.4396 19.3626 10.3906 18.9649 10.266 18.588L8.627 13.637L8.618 13.609C8.5215 13.3156 8.31251 13.0724 8.0369 12.9329C7.7613 12.7934 7.4416 12.769 7.148 12.865L5.377 13.445L4.653 13.683L3.391 14.1C2.43633 14.4129 1.64496 15.0921 1.1908 15.9882C0.736647 16.8843 0.656868 17.9241 0.969 18.879L1.545 20.638C1.85811 21.5935 2.53787 22.3855 3.43481 22.8398C4.33175 23.2942 5.37242 23.3738 6.328 23.061L7.589 22.647L8.338 22.4Z"
              />
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.128 15.153L6.355 16.227"
              />
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10.102 18.095L7.41 19.104"
              />
            </g>
          </svg>
          <ArrowIcon />
        </ToggleButton>
      </div>

      <StyledPopover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        // className={classes.emojiPopover}
        id={id}
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <ul className={classes.container}>
          <li
            className={thumb === 'active' ? classes.thumbActive : classes.thumb}
            onClick={clickThumb}
          >
            <a className={classes.emojiA} href="#" title="emoji-thumb" />
          </li>
          <li
            className={love === 'active' ? classes.loveActive : classes.love}
            data-cy="emoji-love"
            onClick={clickLove}
          >
            <a className={classes.emojiA} href="#" title="emoji-love" />
          </li>
          <li
            className={smile === 'active' ? classes.smileActive : classes.smile}
            onClick={clickSmile}
          >
            <a className={classes.emojiA} href="#" title="emoji-smile" />
          </li>
          <li
            className={shock === 'active' ? classes.shockActive : classes.shock}
            onClick={clickShock}
          >
            <a className={classes.emojiA} href="#" title="emoji-shock" />
          </li>
          <li
            className={
              question === 'active' ? classes.questionActive : classes.question
            }
            onClick={clickQuestion}
          >
            <a className={classes.emojiA} href="#" title="emoji-question" />
          </li>
        </ul>
      </StyledPopover>
    </>
  );
}
