import React from 'react';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import store from '../../store';
import {
  handleSetCurrentPrompt,
  handleSetPromptDetail
} from '../../store/resource';

const PREFIX = 'PromptCardPreview';

const classes = {
  root: `${PREFIX}-root`,
  cardHeaderRoot: `${PREFIX}-cardHeaderRoot`,
  cardContent: `${PREFIX}-cardContent`,
  media: `${PREFIX}-media`,
  title: `${PREFIX}-title`,
  noMargin: `${PREFIX}-noMargin`,
  titleTypography: `${PREFIX}-titleTypography`
};

const StyledCard = styled(Card)((
  { theme }
) => ({
  [`&.${classes.root}`]: {
    float: 'left',
    display: 'block',
    backgroundColor: 'transparent',
    flexShrink: '0'
  },

  [`& .${classes.cardHeaderRoot}`]: {
    padding: 0
  },

  [`& .${classes.cardContent}`]: {
    width: '100%'
  },

  [`& .${classes.media}`]: {
    width: '100%',
    height: '0px',
    overflow: 'hidden',
    paddingTop: '62.50%', // 16:10
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    cursor: 'pointer',
    borderRadius: '8px'
  },

  [`& .${classes.title}`]: {
    display: 'block',
    paddingRight: 0,
    paddingTop: '4px',
    color: '#232930',
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },

  [`& .${classes.noMargin}`]: {
    marginRight: 0,
    order: 1
  },

  [`& .${classes.titleTypography}`]: {
    lineHeight: '20px',
    paddingTop: '2px',
    paddingLeft: '6px'
  }
}));

export function PromptCardPreview(props) {
  const { prompt } = props;


  const displayPrompt = prompt => {
    store.dispatch(handleSetCurrentPrompt(prompt));
    store.dispatch(handleSetPromptDetail(true));
  };
  const previewPromptCard = prompt => {
    let thumbnail = prompt.backgroundUrl;
    let classNameValue = classes.media;
    if (!thumbnail) {
      thumbnail = '/images/ImageCommandBackgroundImg.png';
      classNameValue = `${classes.media} logo2`;
    }

    return (
      <CardMedia
        className={classNameValue}
        image={thumbnail}
        title={prompt.name}
      />
    );
  };

  const cardTitle = prompt => (
    <span
      className={classes.title}
      style={{ fontSize: props.fontSize, fontWeight: props.fontWeight }}
      title={prompt.name}
    >
      {_.truncate(prompt.name, { length: 45, separator: /,? +/ })}
    </span>
  );

  const cardHeaderClasses = () => ({
    avatar: classes.noMargin,
    root: classes.cardHeaderRoot,
    titleTypography: classes.titleTypography,
    content: classes.cardContent
  });
  return (
    <StyledCard
      className={classes.root}
      style={{ width: props.width, height: props.height, margin: props.margin }}
      data-id={prompt._id}
      onClick={e => {
        displayPrompt(prompt);
      }}
    >
      {previewPromptCard(prompt)}
      <CardHeader classes={cardHeaderClasses()} title={cardTitle(prompt)} />
    </StyledCard>
  );
}
