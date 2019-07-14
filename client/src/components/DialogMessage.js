import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogMessage = ({title, message}) => {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {setOpen(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpen(false)}} color="primary">
            Niet nu
          </Button>
          <Button onClick={() => {setOpen(false)}} color="primary" autoFocus>
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

}

export default DialogMessage;
