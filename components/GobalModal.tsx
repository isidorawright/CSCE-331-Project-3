import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../models/store';
import { Stack, Grid, TextField } from '@mui/material';
import { ModalType } from '../models/store';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export function CheckoutModal() {
  const dispatch = useDispatch<Dispatch>();
  const order = useSelector((state: RootState) => state.order);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    dispatch.order.submit(order);
    dispatch.modal.setOpen(false);
  }

  return <Stack>
    <Box
      component="form"
      onSubmit={onSubmit}
    >
      <TextField
        required
        fullWidth
        name="name"
        label="Order Name"
        sx={{
          mb: "12px"
        }}
      />
      <Typography variant="h6" component="h6" sx={{mb: "12px"}}> Payment Method: </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button type="submit">Credit Card</Button>
        </Grid>
        <Grid item>
          <Button type="submit">Cash</Button>
        </Grid>
      </Grid>
    </Box>
  </Stack>
}

export function GlobalModal() {
  const state = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch<Dispatch>();

  return (
    <div>
      <Modal
        open={state.open}
        onClose={() => dispatch.modal.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {
            {
              [ModalType.checkout]: CheckoutModal
            }[state.type]()
          }
        </Box>
      </Modal>
    </div>
  );
}