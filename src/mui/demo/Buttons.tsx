import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ColorButtons() {
  return (
    <Stack direction="row" spacing={2}>
      <Button color="secondary">Secondary</Button>
      <Button color="success" variant="contained">
        Success
      </Button>
      <Button color="error" variant="outlined">
        Error
      </Button>
    </Stack>
  );
}
