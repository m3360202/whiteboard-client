import React from 'react';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import BoardService from '../../services/BoardService';
import store, { RootState } from '../../store';
import { handleSetCurrentTemplate,handleSetTemplateDetail } from '../../store/resource';
const PREFIX = 'MenuTemplateBoard';

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
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    float: 'left',
    display: 'block',
    backgroundColor: 'transparent'
  },

  [`& .${classes.cardHeaderRoot}`]: {
    padding: 0,
  },

  [`& .${classes.cardContent}`]: {
    width: '100%',
  },

  [`& .${classes.media}`]: {
    width: '100%',
    height: '0px',
    overflow: 'hidden',
    paddingTop: '62.50%', // 16:10
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    cursor: 'pointer',
    borderRadius: '8px',
  },

  [`& .${classes.title}`]: {
    display: 'block',
    paddingRight: 0,
    paddingTop: '4px',
    color: '#232930',
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.noMargin}`]: {
    marginRight: 0,
    order: 1,
  },

  [`& .${classes.titleTypography}`]: {
    lineHeight: '20px',
    paddingTop: '2px',
    paddingLeft: '6px',
  }
}));

export function MenuTemplateBoard(props) {
  const { board } = props;


  const importTemplate = (board) => {
    store.dispatch(handleSetCurrentTemplate(board));
    store.dispatch(handleSetTemplateDetail(true));
  };

  const cardMedia = (board) => {
    let thumbnail = board.thumbnail2 ? board.thumbnail2 : board.thumbnail;
    let classNameValue = classes.media;
    if (!thumbnail) {
      thumbnail = '/images/boardbg.png';
      classNameValue = `${classes.media} logo2`;
    }

    return (
      <CardMedia
        className={classNameValue}
        image={thumbnail}
        title={board.name}
      />
    );
  };

  const cardTitle = (board) => (
    <span
      className={classes.title}
      style={{ fontSize: props.fontSize, fontWeight: props.fontWeight }}
      title={board.name}
    >
      {_.truncate(board.name, { length: 45, separator: /,? +/ })}
    </span>
  );

  const cardHeaderClasses = () => ({
    avatar: classes.noMargin,
    root: classes.cardHeaderRoot,
    titleTypography: classes.titleTypography,
    content: classes.cardContent,
  });

  return (
    <StyledCard
      className={classes.root}
      style={{ width: props.width, height: props.height, margin: props.margin }}
      data-id={board._id}
      onClick={(e) => importTemplate(board)}
    >
      {cardMedia(board)}
      <CardHeader classes={cardHeaderClasses()} title={cardTitle(board)} />
    </StyledCard>
  );
}