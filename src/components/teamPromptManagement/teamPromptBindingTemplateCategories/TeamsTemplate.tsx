//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetTeamsManagementTemplatesQuery } from '../../../redux/BoardAPISlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const PREFIX = 'TeamsTemplate';

const classes = {
  imagesCommandBox: `${PREFIX}-imagesCommandBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardRoot2: `${PREFIX}-cardRoot2`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`
};

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',

  [`& .${classes.cardRoot}`]: {
    width: '174px',
    cursor: 'pointer',
    marginBottom: '10px',
    position: 'relative',
    borderRadius: '0px',
    boxShadow: 'none'
  },

  [`& .${classes.cardRoot2}`]: {
    width: '174px',
    opacity: 0
  },

  [`& .${classes.cardMediaRoot}`]: {
    boxSizing: 'border-box',
    borderRadius: '2px',
    border: '2px solid transparent',
    '&:hover': {
      boxSizing: 'border-box',
      border: '2px solid #F21D6B'
    }
  },

  [`& .${classes.cardMediaActive}`]: {
    padding: '2px',
    boxSizing: 'border-box',
    border: '2px solid #F21D6B'
  }
}));

const TeamsTemplate = props => {
  const { currentBindingTemplatesData, setCurrentBindingTemplatesData } = props;

  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const { data: teamsTemplateList = [] } = useGetTeamsManagementTemplatesQuery({
    orgId: orgId
  });

  return (
    <StyledBox>
      {teamsTemplateList &&
        teamsTemplateList.map((item, index) => (
          <TemplatesCard
            key={index}
            item={item}
            index={index}
            currentBindingTemplatesData={currentBindingTemplatesData}
            setCurrentBindingTemplatesData={setCurrentBindingTemplatesData}
            classes={classes}
          />
        ))}

      {teamsTemplateList &&
        teamsTemplateList.length % 4 === 2 &&
        teamsTemplateList
          .slice(0, 2)
          .map((item, index) => (
            <Card classes={{ root: classes.cardRoot2 }} key={index}></Card>
          ))}

      {teamsTemplateList &&
        teamsTemplateList.length % 4 === 3 &&
        teamsTemplateList
          .slice(0, 2)
          .map((item, index) => (
            <Card classes={{ root: classes.cardRoot2 }} key={index}></Card>
          ))}
    </StyledBox>
  );
};

const TemplatesCard = ({
  item,
  index,
  currentBindingTemplatesData,
  setCurrentBindingTemplatesData,
  classes
}) => (
  <Card
    classes={{ root: classes.cardRoot }}
    onClick={() => setCurrentBindingTemplatesData(item)}
    onDoubleClick={() => {
      setCurrentBindingTemplatesData(null);
    }}
    key={index}
  >
    <CardMedia
      classes={{ root: classes.cardMediaRoot }}
      className={
        currentBindingTemplatesData &&
        currentBindingTemplatesData._id === item._id
          ? classes.cardMediaActive
          : ''
      }
      component="img"
      width="174"
      height="108"
      image={
        item.thumbnail2
          ? item.thumbnail2
          : item.thumbnail
          ? item.thumbnail
          : '/images/abbdgor.png'
      }
    />
    <Typography className={classes.customCommandName}>{item.name}</Typography>
  </Card>
);

export default TeamsTemplate;
