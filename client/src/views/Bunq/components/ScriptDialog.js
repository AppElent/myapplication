import React, {useState} from 'react';
import { 
  Checkbox,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { useArray } from 'react-hanger';

import { checkPreconditions, runSalarisVerdelenScript } from 'modules/Bunq';
import { useForm, useSession, useFetch } from 'hooks';
import { Button, ResponsiveDialog, ResponsiveSelect, ResponsiveSelectItem } from 'components'


const ScriptDialog = ({accounts, rekeningen, accountsRequest}) => {
  const logging = useArray([]);
  const { user, userInfo } = useSession();

  const initialState = {
    from_account: '',
    keep: 0, 
    move_rest: false, 
    savings_account: ''
  }
  const validationSchema = {
    from_account: {
      type: 'string'
    },
    sparen: {
      type: 'number'
    },
    keep: {
      type: 'number'
    }
  }
  const submitFunction = async () => {
    const options = {
      move_rest: state.move_rest.value,
      from_account: state.from_account.value,
      savings_account: state.savings_account.value,
      keep: state.keep.value,
      income: 10000,
      sparen: preconditions.sparen,
      logger: logging.push,
      user
    }
    logging.clear();
    await runSalarisVerdelenScript(rekeningen, options);
    accountsRequest.get(true);
  }
  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm(initialState, validationSchema, submitFunction, {localStorage: 'bunq'});

  const options = {
    from_account: state.from_account.value,
    keep: state.keep.value
  }
  const preconditions = ((accounts[0] === undefined || rekeningen === undefined) ? {balance: 0, maandtotaal: 0, sparen: 0, accountsExist: []} : checkPreconditions(accounts, rekeningen, options));

  
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
        <List>
          {logging.value.map((item, index) => <ListItem key={index}><ListItemText>{item}</ListItemText></ListItem>)}  
        </List>
        
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
          loading={submitting}
          onClick={handleOnSubmit}
          variant="contained"
        >
            Run
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  </div>);
}

export default ScriptDialog
