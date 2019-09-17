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

import {runSalarisVerdelenScript } from 'helpers/bunq-functions';
import useForm from 'hooks/useForm';


const ScriptDialog = ({accounts, rekeningen, bunqSettings}) => {
  const [running, setRunning] = useState(false);
  const {values, handleChange, handleSubmit, submitting, changing, setInitial, setValues} = useForm(undefined, {from_account: '', sparen: 0});
  
  const [open, setOpen] = useState(false);
  return (<div>
    <Button color="primary" onClick={() => {setOpen(true)}} variant="contained">
        Verdelen
    </Button>
    <Dialog aria-labelledby="form-dialog-title" onClose={() => {setOpen(false)}} open={open}>
      <DialogTitle id="form-dialog-title">Salaris verdelen</DialogTitle>
      <DialogContent>
        <DialogContentText>
            Gebruik deze functie om binnenkomend salaris te verdelen over de rekeningen.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="from_account"
          label="Salaris rekening"
          margin="dense"
          name="from_account"
          onChange={handleChange}
          type="text"
          value={values.from_account}
        />
        <TextField
          fullWidth
          id="keep"
          label="Behouden"
          margin="dense"
          name="sparen"
          onChange={handleChange}
          type="numeric"
          value={values.sparen}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {setOpen(false)}}>
            Cancel
        </Button>
        <Button 
          color="primary" 
          onClick={async () => {
            setRunning(true);
            runSalarisVerdelenScript(accounts, rekeningen, values.from_account, bunqSettings, values.sparen);
            setRunning(false);
          }}
        >
            Run
        </Button>
      </DialogActions>
    </Dialog>
  </div>);
}

export default ScriptDialog