// Import dependencies
import React, { useState, useCallback, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PropTypes from "prop-types";

// Import custom components
import ContentSectionCommand from "./ContentSectionCommand";

const PREFIX = 'ContentCommand';

const classes = {
  tabsRoot: `${PREFIX}-tabsRoot`,
  tabsFlexContainer: `${PREFIX}-tabsFlexContainer`,
  tabsListscrollButtons: `${PREFIX}-tabsListscrollButtons`,
  labelIcon: `${PREFIX}-labelIcon`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.tabsRoot}`]: {
    minHeight: '24px'
  },

  [`& .${classes.tabsFlexContainer}`]: {
    height: '26px',
    minHeight: '24px'
  },

  [`& .${classes.tabsListscrollButtons}`]: {
    width: '18px',
    margin: '0 8px'
  },

  [`& .${classes.labelIcon}`]: {
    padding: '0px 5px',
    height: '24px',
    minHeight: '24px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0.16px',
    color: '#3A3541',
    textTransform: 'none',
    minWidth: '65px'
  },

  [`& .${classes.tabPanelRoot}`]: {
    padding: '0px'
  }
}));

/**
 * ContentCommand component
 * 
 * @param {Object} props
 * @param {Function} props.handleCommand
 * 
 * @return {JSX.Element} ContentCommand component
 */
function ContentCommand({ handleCommand }) {

  const [value, setValue] = useState('0');
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const AICommandData = useSelector(
    (state: RootState) => state.AIAssist.commandData
  );

  const teamsCommandData = useSelector(
    (state: RootState) => state.AIAssist.teamsCommandData
  );
  const [sectionCommandData, setSectionCommandData] = useState([]);
  const [sectionType, setSectionType] = useState([]);


  useEffect(() => {
    const allCommandDataInTheTeams = AICommandData.concat(teamsCommandData);

    let { sectionCommandData, sectionType } =
      handleClassificationCommands(allCommandDataInTheTeams);
    setSectionCommandData(JSON.parse(JSON.stringify(sectionCommandData)));
    setSectionType(JSON.parse(JSON.stringify(sectionType)));

    // console.log('sectionCommandData', sectionCommandData.General.find((item)=>item.name=='Content Writer').favoriteCommand.favorite);
  }, [AICommandData, teamsCommandData]);



  /**
   * Create an object with keys as section values and empty arrays as values.
   * @param {Array} sectionValueData
   * @return {Object} Returns an object with section values as keys and arrays as values
   */
  function createSectionCommandData(sectionValueData) {
    const sectionCommandData = {
      General: [],
      Ideate: [],
      Extract: [],
      Blog: [],
      Email: [],
      'Sales & Marketing': [],
      Product: [],
      Persona: [],
      Storytelling: [],
      'Social Media': [],
      Video: [],
      SEO: [],
      Translation: [],
      Unclassified: []
    };

    for (const item of sectionValueData) {
      sectionCommandData[item] = [];
    }

    return sectionCommandData;
  }

  /**
   * Classify data by section value.
   * @param {Array} newFilterSectionData
   * @param {Object} sectionCommandData
   * @return {Object} Returns the sectionCommandData with updated values
   */
  function classifyBySectionValue(newFilterSectionData, sectionCommandData) {
    newFilterSectionData.forEach(item => {
      for (const key in sectionCommandData) {
        if (item.section.includes(key)) {
          sectionCommandData[key].push(item);
        }
      }
    });

    return sectionCommandData;
  }

  /**
   * Adds unclassified data to sectionCommandData.
   * @param {Object} sectionCommandData
   * @param {Array} AICommandData
   * @return {Object} Returns the sectionCommandData with added unclassified data
   */
  function addUnclassifiedData(sectionCommandData, AICommandData) {
    const newUnclassified = sectionCommandData.Unclassified.concat(
      AICommandData.filter(d => !d.section)
    );

    return {
      ...sectionCommandData,
      Unclassified: newUnclassified
    };
  }


  /**
   * Convert section values from string to array.
   * @param {Array} data
   * @return {Object} Returns an object with newFilterSectionData and sectionValueData
   */
  function convertSectionToArray(data) {
    const newFilterSectionData = [];
    const sectionValueData = [];

    data.forEach(item => {
      if (typeof item.section === 'string') {
        item = { ...item, section: item.section.split(',') };
      }
      sectionValueData.push(...item.section);
      newFilterSectionData.push(item);
    });

    return { newFilterSectionData, sectionValueData };
  }

  /**
   * Deduplicate section values.
   * @param {Array} sectionValueData
   * @return {Array} Returns an array with deduplicated section values
   */
  function deduplicateSectionValues(sectionValueData) {
    return Array.from(new Set(sectionValueData));
  }


  function handleClassificationCommands(AICommandData) {
    const filterSectionData = AICommandData.filter(d => d.section);
    const { newFilterSectionData, sectionValueData } =
      convertSectionToArray(filterSectionData);
    const deduplicatedSectionValues =
      deduplicateSectionValues(sectionValueData);
    let sectionCommandData = createSectionCommandData(
      deduplicatedSectionValues
    );

    sectionCommandData = classifyBySectionValue(
      newFilterSectionData,
      sectionCommandData
    );
    sectionCommandData = addUnclassifiedData(sectionCommandData, AICommandData);

    for (const key of Object.keys(sectionCommandData)) {
      if (sectionCommandData[key].length === 0) {
        delete sectionCommandData[key];
      }
    }

    return {
      sectionCommandData, // section values corresponding data
      sectionType: Object.keys(sectionCommandData) // section values
    };
  }

  return (
    <StyledBox sx={{ mt: '8px' }}>
      <TabContext value={value}>
        <Box>
          <TabList
            variant="scrollable"
            classes={{
              root: classes.tabsRoot,
              flexContainer: classes.tabsFlexContainer,
              scrollButtons: classes.tabsListscrollButtons
            }}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            {sectionType &&
              sectionType.map((item, index) => {
                return (
                  <Tab
                    classes={{ root: classes.labelIcon }}
                    label={item}
                    value={String(index)}
                    key={index}
                  />
                );
              })}
          </TabList>
        </Box>
        {sectionType &&
          sectionType.map((item, index) => {
            return (
              <TabPanel
                classes={{ root: classes.tabPanelRoot }}
                value={String(index)}
                key={index}
              >
                <ContentSectionCommand
                  key={index}
                  item={item}
                  sectionCommandData={sectionCommandData}
                  handleCommand={handleCommand}
                />
              </TabPanel>
            );
          })}
      </TabContext>
    </StyledBox>
  );
}

ContentCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired
};

export default ContentCommand;