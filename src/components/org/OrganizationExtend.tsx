//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetOrgListQuery,
  useSetOrganizationGhostMutation,
  useSetOrganizationLinkedinMutation,
  useGetOrgMemberListQuery,
  useGetExtendSettingsQuery
} from '../../redux/OrgAPISlice';

//** Import Mui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';

//** Import services
import { OrgService } from '../../services';
import server from '../../startup/serverConnect';

const PREFIX = 'OrganizationExtend';

const classes = {
  root: `${PREFIX}-root`,
  textColorPrimary: `${PREFIX}-textColorPrimary`,
  updateOrgNameButton: `${PREFIX}-updateOrgNameButton`,
  inviteMembersCanAccessOrgText: `${PREFIX}-inviteMembersCanAccessOrgText`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`
};

const StyledThemeProvider = styled('div')((
  { theme }
) => ({
  [`& .${classes.root}`]: {
    '& .MuiOutlinedInput-input': {
      padding: '8px 0px 8px 12px',
      width: '360px',
      height: '40px',
      boxSizing: 'border-box'
    }
  },

  [`& .${classes.textColorPrimary}`]: {
    minWidth: 'unset',
    marginRight: '24px',
    padding: 0,
    textTransform: 'none'
  },

  [`& .${classes.updateOrgNameButton}`]: {
    marginLeft: '16px',
    width: '73px',
    height: '40px'
  },

  [`& .${classes.inviteMembersCanAccessOrgText}`]: {
    fontSize: '20px',
    fontWeight: 500,
    fontStyle: 'normal',
    margin: '24px 0px'
  },

  [`& .${classes.autocompleteInputRoot}`]: {
    minHeight: '40px',
    padding: '0px !important'
  },

  [`& .${classes.autocompleteInput}`]: {
    paddingLeft: '15px !important'
  },

  [`& .${classes.autocompleteFocused}`]: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B !important'
    }
  }
}));

export default function OrganizationExtend() {
  //use
  const dispatch = useDispatch();

  const theme = useTheme();
  const { t } = useTranslation();

  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const [setOrganizationGhost] = useSetOrganizationGhostMutation();
  const [setOrganizationLinkedin] =  useSetOrganizationLinkedinMutation();

  const { data: extend} = useGetExtendSettingsQuery({
    orgId: orgInfo.orgId
  });
  //dom

  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isInputGhost ,setIsInputGhost] = useState(false);
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [linkedinAppKey, setLinkedinAppKey] = useState('');
  const [linkedinAppSecret, setLinkedinAppSecret] = useState('');
  const [linkedinCallBack, setLinkedinCallBack] = useState('');
  const [updateGhostButtonLoading, setUpdateGhostButtonLoading] = useState(false);
  const [updateLinkedinButtonLoading, setUpdateLinkedinButtonLoading] = useState(false);

  const onSubmitGhost = async (e) => {

    setUpdateGhostButtonLoading(true);
    await setOrganizationGhost({
      orgId: orgInfo.orgId,
      ghostKey: key,
      ghostUrl: url,
      author:author,
      tags:selectedTags
    });

    Boardx.Util.Msg.success(t('pages.organizationUpdated'));
    setUpdateGhostButtonLoading(false);
  };

  const onSubmitLinkedin = async (e) => {

    setUpdateLinkedinButtonLoading(true);
    await setOrganizationLinkedin({
      orgId: orgInfo.orgId,
      linkedinAppKey,
      linkedinAppSecret,
      linkedinCallBack
    });
    // Boardx.Util.Msg.warning(error.message);
    Boardx.Util.Msg.success(t('pages.organizationUpdated'));
    setUpdateLinkedinButtonLoading(false);
  };
  const handleChange = (value) => {
    setSelectedTags(value);
  };
  useEffect(() => {
    if (extend) {
      setKey(extend.ghostKey);
      setUrl(extend.ghostUrl);
      setAuthor(extend.ghostAuthor);
      setSelectedTags(extend.ghostTags);
      setLinkedinAppKey(extend.linkedinAppKey);
      setLinkedinAppSecret(extend.linkedinAppSecret);
      setLinkedinCallBack(extend.linkedinCallBack);
      if(extend.ghostKey && extend.ghostUrl){
        let data = {
          orgId: orgInfo.orgId,
          ghostUrl: extend.ghostUrl,
          ghostKey: extend.ghostKey
        }
        server.call('getGhostTags', data).then(result => {
          if (result && result.length>0) {
            setTags(result);
            setIsInputGhost(true);
          }
        }).catch(err => {
          console.log(err)
        });

      }
    }
  }, [extend]);

  return (
    <StyledThemeProvider theme={lightTheme}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ flexGrow: 1, mt: '24px' }}>
          <Typography>
            {t('pages.listPage.roomSettings.organizationGhost')}
          </Typography>

          <Box style={{ marginTop: '10px' }}>
            <Typography>
             Url
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="orgGhostUrl"
              type="text"
              onChange={e => setUrl(e.target.value)}
              value={url}
            />

          </Box>
          <Box style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography>
              ApiKey
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="orgGhostKey"
              type="text"
              onChange={e => setKey(e.target.value)}
              value={key}
            />
          </Box>
          {isInputGhost &&(<Box style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography>
              Author
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="author"
              type="text"
              onChange={e => setAuthor(e.target.value)}
              value={author}
            />
          </Box>)}
          {isInputGhost &&(<Box style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography>
              Tags
            </Typography>
          
            {(tags && tags.length > 0) && (
               
                    <Autocomplete
                      id="commandSectionSelect"
                      multiple
                      options={tags.map(option => option)}
                      getOptionLabel={option => option.name}
                      filterSelectedOptions
                      onChange={(event, value) => handleChange(value)}
                      value={selectedTags}
                      freeSolo
                      classes={{
                        inputRoot: classes.autocompleteInputRoot,
                        input: classes.autocompleteInput,
                        focused: classes.autocompleteFocused
                      }}
                      style={{ width: '260px' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                        />
                      )}
                    />
                )}
          </Box>)}
          <LoadingButton
            loading={updateGhostButtonLoading}

            color="primary"
            onClick={onSubmitGhost}
            size="small"
            variant="contained"
            style={{ margin: '10px 0px' }}
          >
            {t('pages.listPage.roomSettings.update')}
          </LoadingButton>

        </Box>
        {/*<Divider sx={{ width: '916px' }} />*/}
        {/*<Box sx={{ flexGrow: 1, mt: '24px' }}>
          <Typography>
            {t('pages.listPage.roomSettings.organizationLinkedin')}
          </Typography>

          <Box style={{ marginTop: '10px' }}>
            <Typography>
            Client ID
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="appkey"
              type="text"
              onChange={e => setLinkedinAppKey(e.target.value)}
              value={linkedinAppKey}
            />

          </Box>
          <Box style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography>
            Client Secret
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="secret"
              type="text"
              onChange={e => setLinkedinAppSecret(e.target.value)}
              value={linkedinAppSecret}
            />
          </Box>
          <Box style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography>
            Authorized redirect URLs
            </Typography>

            <TextField
              classes={{ root: classes.root }}
              id="callback"
              type="text"
              onChange={e => setLinkedinCallBack(e.target.value)}
              value={linkedinCallBack}
            />
          </Box>
          <LoadingButton
            loading={updateLinkedinButtonLoading}

            color="primary"
            onClick={onSubmitLinkedin}
            size="small"
            variant="contained"
            style={{ margin: '10px 0px' }}
          >
            {t('pages.listPage.roomSettings.update')}
          </LoadingButton>

          </Box>*/}
      </Box>
    </StyledThemeProvider>
  );
}
