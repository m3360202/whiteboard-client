//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useGetAllAiCommandQuery } from '../../redux/AiAssistApiSlice';

import { Box, Typography, Dialog } from '@mui/material';
import { PromptDetail } from './PromptDetail';
import { PromptCardPreview } from './PromptCardPreview';

const PREFIX = 'ExploreBoardXPropmts';

const classes = {
  exploreBoardXPromptsContent: `${PREFIX}-exploreBoardXPromptsContent`,
  exploreBoardXPromptsContentTitle: `${PREFIX}-exploreBoardXPromptsContentTitle`,
  promptsBox: `${PREFIX}-promptsBox`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.exploreBoardXPromptsContent}`]: {
    width: '100%',
    // height: '220px',
    backgroundColor: '#F7FAFA',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '32px',
    boxSizing: 'border-box'
  },

  [`& .${classes.exploreBoardXPromptsContentTitle}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px'
  },

  [`& .${classes.promptsBox}`]: {
    my: '4px',
    width: '100%',
    display: 'flex',
    overflowX: 'auto',
    flexWrap: 'nowrap'
  }
}));

export default function ExploreBoardXPrompts() {


  // Get prompt list
  const {
    data: AICommandData = [],
    isLoading: useGetAllAiCommandQueryIsLoading,
    isError: useGetAllAiCommandQueryisLoadingIsError,
    isSuccess: useGetAllAiCommandQueryisLoadingIsSuccess
  } = useGetAllAiCommandQuery({});

  // Group prompt by category
  var groupBy = function (data, key) {
    return data.reduce(function (modifiedData, item) {
      (modifiedData[item[key]] = modifiedData[item[key]] || []).push(item);
      return modifiedData;
    }, {});
  };
  var groupedBySection = groupBy(AICommandData, 'section');
  var sections = Object.keys(groupedBySection);

  return (
    <Root>
      {sections.length > 0
        ? sections.map(section => {
            return (
              <Box className={classes.exploreBoardXPromptsContent}>
                <Typography
                  className={classes.exploreBoardXPromptsContentTitle}
                  variant="h5"
                >
                  Category: {section == '' ? 'Undefined' : section}
                </Typography>
                <Box component="div" className={classes.promptsBox}>
                  {groupedBySection[section].map(item => {
                    return (
                      <PromptCardPreview
                        key={item._id}
                        prompt={item}
                        width="200px"
                        height="auto"
                        margin="8px"
                        fontSize="14px"
                        fontWeight="500"
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })
        : null}
      <PromptDetail />
    </Root>
  );
}
