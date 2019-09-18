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
  const initialState = {
    from_account: {
      value: '',
      error: ''
    }, sparen: {
      value: 0,
      error: ''
    }
  }
  const validationSchema = {
    from_account: {
      type: 'string'
    },
    sparen: {
      type: 'number'
    }
  }
  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm(initialState, validationSchema, () => {});
  
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
          onChange={handleOnChange}
          type="text"
          value={state.from_account.value}
        />
        <TextField
          fullWidth
          id="keep"
          label="Behouden"
          margin="dense"
          name="sparen"
          onChange={handleOnChange}
          type="numeric"
          value={state.sparen.value}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {setOpen(false)}}>
            Cancel
        </Button>
        <Button 
          color="primary" 
          disabled={hasError}
          onClick={async () => {
            setRunning(true);
            runSalarisVerdelenScript(accounts, rekeningen, state.from_account, bunqSettings, state.sparen);
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