
//** Import react
import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import {
    WidgetService,
    ClipboardService,
    UtilityService
  } from 'services';
  

function ChatItemFile({item, index}) {

    return (
        <Box>
            <Box

                sx={{
                    display: 'flex', alignItems: 'flex-end', background: '#eeeeee',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
                    borderRadius: '4px 4px 4px 4px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    maxWidth: '200px',
                    height: '40px'
                }}
            >
                <Box sx={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(58, 53, 65, 0.5)',
                    fontSize: '14px',
                    textAlign: 'center',
                    lineHeight: '40px',
                    color: '#FFFFFF',
                    fontWeight: 500
                }}>
                    {UtilityService.getInstance().getFileExtension(item.fileName)}
                </Box>
                <Box sx={{
                    padding: '0px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    boxSizing: 'border-box',
                }}>
                    <Typography sx={{ fontSize: '12px' }}>
                        {item.fileName}
                    </Typography>
                    <Typography
                        sx={{ fontSize: '10px', color: 'rgba(58, 53, 65, 0.88)' }}
                    >
                        {UtilityService.getInstance().formatFileSize(item.fileSize)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}


export default ChatItemFile;