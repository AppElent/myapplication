import React, {useState} from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from '@material-ui/core';



const ScriptDialog = ({}) => {
    
  
    const [open, setOpen] = useState(false);
  return (<div>
    <Button color="primary" onClick={() => {setOpen(true)}} variant="contained">
        Run Script
    </Button>
    <Dialog aria-labelledby="form-dialog-title" onClose={() => {setOpen(false)}} open={open}>
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="from_account"
          label="Salaris rekening"
          margin="dense"
          type="text"
        />
        <TextField
          fullWidth
          id="keep"
          label="Behouden"
          margin="dense"
          type="numeric"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {setOpen(false)}}>
            Cancel
        </Button>
        <Button color="primary" onClick={() => {setOpen(false)}}>
            Run
        </Button>
      </DialogActions>
    </Dialog>
  </div>);
}

export default ScriptDialog