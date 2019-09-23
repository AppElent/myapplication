import React, {useState} from 'react';
import { 
  Button,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText
} from '@material-ui/core';

import {checkPreconditions, runSalarisVerdelenScript } from 'helpers/bunq-functions';
import useForm from 'hooks/useForm';
import useCustomMediaQuery from 'hooks/useCustomMediaQuery';
import {ResponsiveDialog, ResponsiveSelect, ResponsiveSelectItem} from 'components'


const ScriptDialog = ({accounts, accountsRequest, rekeningen, bunqSettings, user}) => {
  
  const [running, setRunning] = useState(false);
  const initialState = {
    from_account: {
      value: '',
      error: ''
    }, keep: {
      value: 0,
      error: ''
    }, move_rest: {
      value: false,
      error: ''
    }, savings_account: {
      value: '',
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

  const options = {
    from_account: state.from_account.value,
    keep: state.keep.value
  }
  const preconditions = accounts[0] === undefined ? {balance: 0, maandtotaal: 0, sparen: 0} : checkPreconditions(accounts, rekeningen, options);
  console.log(preconditions);

  
  const [open, setOpen] = useState(false);
  return (<div>
    <Button
      color="primary"
      onClick={() => {setOpen(true)}}
      variant="contained"
    >
        Verdelen
    </Button>
    <ResponsiveDialog
      aria-labelledby="form-dialog-title"
      onClose={() => {setOpen(false)}}
      open={open}
      title="Salaris verdelen"
    >
      <DialogContent>
        <DialogContentText>
            Gebruik deze functie om binnenkomend salaris te verdelen over de rekeningen.<br />
            Huidig saldo: {preconditions.balance}<br />
            Maandtotaal: {preconditions.maandtotaal}<br />
            Sparen: {preconditions.sparen}<br />
            Alle rekeningen bestaan: {preconditions.accountsExist.length === 0 ? 'Ja' : 'Nee'}
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel
            htmlFor="from-account-placeholder"
            shrink
          >
            Salarisrekening
          </InputLabel>
          <ResponsiveSelect
            fullWidth
            inputProps={{
              name: 'from_account',
              id: 'age-label-placeholder',
            }}
            onChange={handleOnChange}
            value={state.from_account.value}
          >
            {accounts.filter(account => account.status === 'ACTIVE').map(account => <ResponsiveSelectItem key={account.id} value={account.description}>{account.description}</ResponsiveSelectItem>)}
          </ResponsiveSelect>
          <FormHelperText>Vul hier de rekening waarvandaan verdeeld moet worden</FormHelperText>
        </FormControl>
        <FormControlLabel
          control={<Checkbox
            checked={state.move_rest.value}
            color="primary"
            inputProps={{
              'aria-label': 'secondary checkbox',
              'name': 'move_rest'
            }}
            onChange={handleOnChange}
            value={state.move_rest.value}
          />}
          label="Rest naar spaarrekening overmaken"
          labelPlacement="end"
        />
        {state.move_rest.value && 
        <TextField
          fullWidth
          id="keep"
          label="Behouden"
          margin="dense"
          name="keep"
          onChange={handleOnChange}
          type="number"
          value={state.keep.value}
        />}
        {state.move_rest.value && 
        <FormControl fullWidth>
          <InputLabel
            htmlFor="from-account-placeholder"
            shrink
          >
            Spaarrekening
          </InputLabel>
          <ResponsiveSelect
            fullWidth
            inputProps={{
              name: 'savings_account',
              id: 'age-label-placeholder',
            }}
            onChange={handleOnChange}
            value={state.savings_account.value}
          >
            {accounts.filter(account => account.status === 'ACTIVE').map(account => <ResponsiveSelectItem key={account.id} value={account.description}>{account.description}</ResponsiveSelectItem>)}
          </ResponsiveSelect>
          <FormHelperText>Vul hier de spaarrekening</FormHelperText>
        </FormControl>}

      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {setOpen(false)}}
        >
            Cancel
        </Button>
        <Button 
          color="primary" 
          disabled={hasError || preconditions.accountsExist.length > 0 || (preconditions.maandtotaal > preconditions.balance)}
          onClick={async () => {
            setRunning(true);
            const options = {
              move_rest: state.move_rest.value,
              from_account: state.from_account.value,
              savings_account: state.savings_account.value,
              keep: state.keep.value,
              income: 10000,
              sparen: preconditions.sparen,
              user
            }
            runSalarisVerdelenScript(rekeningen, options);
            accountsRequest.get();
            setRunning(false);
          }}
        >
            Run
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  </div>);
}

export default ScriptDialog