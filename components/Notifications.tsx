import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { RootState, Dispatch } from '../models/store';
import { useSelector, useDispatch } from 'react-redux';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Notifications() {
  const notificationState = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<Dispatch>();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch.notifications.setOpen(false);

  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={notificationState.open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notificationState.severity} sx={{ width: '100%' }}>
          {notificationState.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}