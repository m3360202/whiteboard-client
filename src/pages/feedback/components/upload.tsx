import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
interface UploadProps {
  onChange?: Function;
  defaultFiles?: [];
}

export default (props: UploadProps) => {
  const { defaultFiles, onChange } = props;
  const [files, setFiles] = useState([]);
  const { t } = useTranslation();
  const handleFilesChange = e => {
    const newFiles = [...files, ...e.target.files];
    setFiles(newFiles);
    onChange(newFiles);
  };

  const handleRemoveFile = idx => {
    const tempFiles = files.filter((item, index) => index !== idx);
    setFiles(tempFiles);
    onChange(tempFiles);
  };

  useEffect(() => {
    if (defaultFiles && defaultFiles.length > 0) setFiles(defaultFiles);
  }, [defaultFiles]);

  return (
    <UploadWrap>
      <List>
        {files.map((item, idx) => (
          <ListItem key={idx}>
            <Tooltip title={item.name} placement="top">
              <ListItemText children={item.name} />
            </Tooltip>
            <Button variant="text" onClick={() => handleRemoveFile(idx)}>
              {t('feedback.removeBtn')}
            </Button>
          </ListItem>
        ))}
      </List>
      <Button
        variant="text"
        component="label"
        style={{ width: '100%', justifyContent: 'flex-start', padding: 0, height: 'auto' }}
      >
        <AddIcon />
        {t('feedback.uploadText')}
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          name="files"
          onChange={handleFilesChange}
        />
      </Button>
    </UploadWrap>
  );
};

const UploadWrap = styled('div')`
  width: 100%;
  margin-bottom: 24px;
`;

const List = styled('ul')`
  width: 100%;
  padding: 0;
  margin: 0;
  max-height: 80px;
  overflow-y: auto;
`;

const ListItem = styled('li')`
  height: 24px;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  color: #232930;
  line-height: 24px;
  font-style: normal;
  align-items: center;
  justify-content: space-between;
  font-family: 'Inter';
  margin-bottom: 4px;
`;

const ListItemText = styled('span')`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
`;
