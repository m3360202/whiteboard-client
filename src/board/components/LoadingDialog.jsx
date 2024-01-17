import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';



export default function LoadingDialog(props) {
    const { open } = props;

    return (
        <Dialog open={open}>
            <Box sx={{ display: 'flex', margin: 10, alignItems: 'center' }}>
                <Stack>
                    <Box>
                        Loading data...
                    </Box>
                    <CircularProgress sx={{ padding: 10, color: '#F21D28' }} />
                </Stack>
            </Box>

        </Dialog>
    );
}