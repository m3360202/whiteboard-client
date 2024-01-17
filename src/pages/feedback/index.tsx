import { Button, Popover } from '@mui/material';
import { changeMode } from '../../store/mode';
import React from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Feedback from './components/feedback';



const FeedbackIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2993_4263)">
        <path
          d="M7.5 10.625H1.875C1.54348 10.625 1.22553 10.4933 0.991117 10.2589C0.756696 10.0245 0.625 9.7065 0.625 9.375V1.875C0.625 1.54348 0.756696 1.22553 0.991117 0.991117C1.22553 0.756696 1.54348 0.625 1.875 0.625H16.875C17.2065 0.625 17.5245 0.756696 17.7589 0.991117C17.9933 1.22553 18.125 1.54348 18.125 1.875V9.375"
          stroke="black"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.9166 11.2166L13.3333 18.9333C13.3644 19.0325 13.4197 19.1225 13.4944 19.1949C13.5691 19.2674 13.6606 19.3201 13.7607 19.3483C13.8608 19.3763 13.9664 19.3791 14.0679 19.3561C14.1693 19.3331 14.2634 19.2852 14.3416 19.2166L15.625 15.6249L19.1666 14.8749C19.2421 14.8052 19.2996 14.7181 19.3338 14.6212C19.3681 14.5243 19.3784 14.4205 19.3636 14.3188C19.3488 14.2171 19.3096 14.1205 19.2491 14.0373C19.1886 13.9542 19.1089 13.887 19.0166 13.8416L11.775 10.5083C11.6693 10.4626 11.5531 10.447 11.4391 10.4632C11.3252 10.4793 11.218 10.5267 11.1291 10.5999C11.0404 10.6732 10.9736 10.7695 10.9361 10.8783C10.8986 10.9872 10.8919 11.1042 10.9166 11.2166Z"
          stroke="black"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.37085 5.93341C9.19827 5.93341 9.05835 5.79349 9.05835 5.62091C9.05835 5.44832 9.19827 5.30841 9.37085 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
        <path
          d="M9.37085 5.93341C9.54343 5.93341 9.68335 5.79349 9.68335 5.62091C9.68335 5.44832 9.54343 5.30841 9.37085 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
        <path
          d="M14.3708 5.93341C14.1983 5.93341 14.0583 5.79349 14.0583 5.62091C14.0583 5.44832 14.1983 5.30841 14.3708 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
        <path
          d="M14.3708 5.93341C14.5434 5.93341 14.6833 5.79349 14.6833 5.62091C14.6833 5.44832 14.5434 5.30841 14.3708 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
        <path
          d="M4.37085 5.93341C4.19826 5.93341 4.05835 5.79349 4.05835 5.62091C4.05835 5.44832 4.19826 5.30841 4.37085 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
        <path
          d="M4.37085 5.93341C4.54343 5.93341 4.68335 5.79349 4.68335 5.62091C4.68335 5.44832 4.54343 5.30841 4.37085 5.30841"
          stroke="black"
          strokeWidth="1.25"
        />
      </g>
      <defs>
        <clipPath id="clip0_2993_4263">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { t } = useTranslation();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch(changeMode('feedback'));
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(changeMode('default'));
  };

  const open = Boolean(anchorEl);
  const id = open ? 'feedback-popover' : undefined;

  return (
    <>
      <FeedbackButton
        id="feedbackButton"
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
        style={{position: 'fixed', boxShadow:'0px 1px 3px 2px #00000014'}}
      >
        <FeedbackIcon />
        <span className="text">{t('feedback.iconText')}</span>
      </FeedbackButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Feedback onCancel={handleClose} />
      </Popover>
    </>
  );
};

const FeedbackButton = styled(Button)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 20px;
  bottom: 0px;
  width: 102px;
  height: 36px;
  padding: 4px 8px;
  background-color: #fff;
  border-radius: 8px 8px 0px 0px;
  box-shadow: 0px 1px 3px 2px rgba(222, 222, 222, 0.64);

  .text {
    flex: 1;
    height: 20px;
    font-size: 12px;
    color: #232930;
    font-weight: 500;
    line-height: 20px;
    font-style: normal;
    font-family: 'Inter';
  }
`;
