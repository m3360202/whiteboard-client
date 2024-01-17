//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOfficialTemplatesByTypeQuery } from '../../redux/BoardAPISlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MenuTemplateBoard } from '../../board/boardMenu/MenuTemplateBoard';
import MenuTemplate from '../../board/boardMenu/MenuTemplate';

const PREFIX = 'ExploreBoardXTemplates';

const classes = {
  exploreBoardXTemplatesContent: `${PREFIX}-exploreBoardXTemplatesContent`,
  exploreBoardXTemplatesContentTitle: `${PREFIX}-exploreBoardXTemplatesContentTitle`,
  templatesBox: `${PREFIX}-templatesBox`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.exploreBoardXTemplatesContent}`]: {
    width: '100%',
    // height: '220px',
    backgroundColor: '#F7FAFA',
    borderRadius: '8px',
    padding: '16px',
    boxSizing: 'border-box'
  },

  [`& .${classes.exploreBoardXTemplatesContentTitle}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px'
  },

  [`& .${classes.templatesBox}`]: {
    width: '100%',
    height: '150px',
    // display: 'grid',
    // gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    // gridGap: '24px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
    // gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'
  }
}));

export default function ExploreBoardXTemplates() {

  const { t } = useTranslation();
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const { data: officialTemplateList = [] } = useGetOfficialTemplatesByTypeQuery({
    type: 'official',
    orgId: orgId
  });

  return (
    <Root>
      {officialTemplateList.length > 0 ? (
        <Box className={classes.exploreBoardXTemplatesContent}>
          <Typography
            className={classes.exploreBoardXTemplatesContentTitle}
            variant="h5"
          >
            {t('pages.listPage.exploreBoardXTemplatesTitle')}
          </Typography>
          <Box className={classes.templatesBox}>
            {officialTemplateList.map(item => {
              return (
                <MenuTemplateBoard
                  key={item._id}
                  board={item}
                  width="200px"
                  height="auto"
                  margin="0px"
                  fontSize="14px"
                  fontWeight="500"
                />
              );
            })}
          </Box>
          <MenuTemplate />
        </Box>
      ) : null}
    </Root>
  );
}
