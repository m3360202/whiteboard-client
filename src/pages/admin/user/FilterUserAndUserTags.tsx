//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

//** Import Redux kit
import { useGetUserTagsQuery } from '../../../redux/UserAPISlice';

//** Import Mui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import clsx from 'clsx';

const PREFIX = 'FilterUserAndUserTags';

const classes = {
  popperBox: `${PREFIX}-popperBox`,
  boxStyle: `${PREFIX}-boxStyle`,
  titleText: `${PREFIX}-titleText`,
  formGroupRoot: `${PREFIX}-formGroupRoot`,
  formControlLabelRoot: `${PREFIX}-formControlLabelRoot`,
  formControlLabelText: `${PREFIX}-formControlLabelText`,
  checkboxRoot: `${PREFIX}-checkboxRoot`,
  checked: `${PREFIX}-checked`,
  chipRoot: `${PREFIX}-chipRoot`,
  chipRootSelected: `${PREFIX}-chipRootSelected`,
  chipLabel: `${PREFIX}-chipLabel`,
  chipLabelSelected: `${PREFIX}-chipLabelSelected`,
  stackRoot: `${PREFIX}-stackRoot`,
  buttonPublicStyle: `${PREFIX}-buttonPublicStyle`
};

const StyledPopper = styled(Popper)(({ theme }) => ({
  [`& .${classes.popperBox}`]: {
    width: '340px',
    height: '634px',
    background: '#F4F5FA',
    border: '1px solid rgba(58, 53, 65, 0.23)',
    boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
    borderRadius: '6px',
    padding: '16px 0px 4px',
    display: 'flex',
    flexDirection: 'column'
  },

  [`& .${classes.boxStyle}`]: {
    margin: '0px 16px 16px',
    paddingLeft: '8px'
  },

  [`& .${classes.titleText}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.87)',
    marginBottom: '6px'
  },

  [`& .${classes.formGroupRoot}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '2px'
  },

  [`& .${classes.formControlLabelRoot}`]: {
    height: '28px',
    margin: 0,
    flex: '50%'
  },

  [`& .${classes.formControlLabelText}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    color: '#000000',
    whiteSpace: 'nowrap'
  },

  [`& .${classes.checkboxRoot}`]: {
    padding: 0,
    width: '15px',
    height: '15px',
    marginRight: '10px'
  },

  [`& .${classes.checked}`]: {
    color: '#F21D6B !important'
  },

  [`& .${classes.chipRoot}`]: {
    padding: '3px 10px',
    background: 'rgba(58, 53, 65, 0.08)',
    borderRadius: '16px',
    height: '24px',
    margin: '0px 10px 8px 0px'
  },

  [`& .${classes.chipRootSelected}`]: {
    background: '#F21D6B'
  },

  [`& .${classes.chipLabel}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '18px',
    letterSpacing: '0.16px',
    color: 'rgba(58, 53, 65, 0.87)',
    padding: 0,
    whiteSpace: 'nowrap'
  },

  [`& .${classes.chipLabelSelected}`]: {
    color: '#FFFFFF'
  },

  [`& .${classes.stackRoot}`]: {
    maxHeight: '60px',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    overflowY: 'scroll'
  },

  [`& .${classes.buttonPublicStyle}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'capitalize',
    padding: 0,
    background: 'transparent !important',
    color: '#F21D6B'
  }
}));

function FilterUserAndUserTags(props) {

  const {
    openFilterUserPopper,
    setOpenFilterUserPopper,
    setUserList,
    setData
  } = props;
  const [currentSelectedTags, setCurrentSelectedTags] = useState([]);
  const { data: userTags = [] } = useGetUserTagsQuery(undefined);

  const handleSelectTag = tag => {
    if (currentSelectedTags.some(t => t._id === tag._id)) {
      setCurrentSelectedTags(
        currentSelectedTags.filter(item => item._id !== tag._id)
      );
    } else {
      setCurrentSelectedTags([...currentSelectedTags, tag]);
    }
  };

  const handleClickReset = () => {
    setCurrentSelectedTags([]);
    setOpenFilterUserPopper(false);
    setData({
      filter: null,
      start: 0,
      limit: 3000
    });
  };

  const handleClickSave = () => {
    let newUserList = [];
    currentSelectedTags.map(item => {
      newUserList.push(...item.users);
    });
    newUserList = newUserList.filter(
      (obj, index, self) =>
        index === self.findIndex(t => t.id === obj.id && t.name === obj.name)
    );
    setUserList(newUserList);
    setOpenFilterUserPopper(false);
  };

  return (
    <StyledPopper
      open={openFilterUserPopper}
      anchorEl={document.getElementById('filterUserBtn')}
      placement="bottom-start"
      sx={{ marginTop: '10px !important' }}
    >
      <Box className={classes.popperBox}>
        <Box className={classes.boxStyle}>
          <Typography className={classes.titleText}>Basic User Info</Typography>
          <FormGroup classes={{ root: classes.formGroupRoot }}>
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Region"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Occupation"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Country"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Registered"
            />
          </FormGroup>
        </Box>
        <Box className={classes.boxStyle}>
          <Typography className={classes.titleText}>
            Board Active Time
          </Typography>
          <FormGroup classes={{ root: classes.formGroupRoot }}>
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Daily active"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Latest login"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                />
              }
              label="Monthly active"
            />
          </FormGroup>
        </Box>
        <Box className={classes.boxStyle}>
          <Typography className={classes.titleText}>Board Usage</Typography>
          <FormGroup classes={{ root: classes.formGroupRoot }}>
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="AI assistant"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Basic tool"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                />
              }
              label="AI widget"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Templates"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                />
              }
              label="Resources"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                />
              }
              label="Help center"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                />
              }
              label="Feedback"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Others"
            />
          </FormGroup>
        </Box>
        <Box className={classes.boxStyle}>
          <Typography className={classes.titleText}>Credit</Typography>
          <FormGroup classes={{ root: classes.formGroupRoot }}>
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Credit balance"
            />
            <FormControlLabel
              classes={{
                root: classes.formControlLabelRoot,
                label: classes.formControlLabelText
              }}
              control={
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked
                  }}
                  defaultChecked
                />
              }
              label="Credit consumption"
            />
          </FormGroup>
        </Box>
        <Box className={classes.boxStyle}>
          <Typography className={classes.titleText}>Tags</Typography>
          <Box className={classes.stackRoot}>
            {userTags?.map((tag, index) => (
              <Chip
                classes={{
                  root: clsx(
                    classes.chipRoot,
                    currentSelectedTags.some(t => t._id === tag._id)
                      ? classes.chipRootSelected
                      : ''
                  ),
                  label: clsx(
                    classes.chipLabel,
                    currentSelectedTags.some(t => t._id === tag._id)
                      ? classes.chipLabelSelected
                      : ''
                  )
                }}
                label={tag.tagName}
                key={tag._id}
                onClick={() => handleSelectTag(tag)}
              />
            ))}
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            m: '4px 16px 0px',
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Button
            className={classes.buttonPublicStyle}
            style={{ color: '#8A8D93' }}
            variant="text"
            onClick={handleClickReset}
          >
            Reset
          </Button>
          <Button
            onClick={handleClickSave}
            className={classes.buttonPublicStyle}
            variant="text"
          >
            Save
          </Button>
        </Box>
      </Box>
    </StyledPopper>
  );
}

export default FilterUserAndUserTags;
