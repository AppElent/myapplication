import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, Divider, CardActions, CardContent, Typography, FormControl, InputLabel, FormHelperText, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

import { useForm } from 'hooks';
import { fetchBackend } from 'helpers';
import { Button, ResponsiveSelect, ResponsiveSelectItem } from 'components';


const useStyles = makeStyles(theme => ({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  refreshButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));



const Overboeken = ({accounts, accountsRequest, user}) => {
  const classes = useStyles();
  const initialValues = {description: '', amount: '0', from_account: '', to_account: '', internal: true, name: '', iban: '', errormessage: {}, successmessage: ''}
  const makePayment = (user) => async (state) => {
    let body;
    let payment;
    if(state.amount.value.indexOf('.') === -1) state.amount.value = state.amount.value + '.00'
    if(state.internal.value){
      body = {from: {type: 'description', value: state.from_account.value}, to: {type: 'description', value: state.to_account.value}, description: state.description.value, amount: state.amount.value}
      payment = await fetchBackend('/api/bunq/payment', {method: 'POST', body, user})
    }else{
      body = {from: {type: 'description', value: state.from_account.value}, to: {type: 'IBAN', name: state.name.value, value: state.iban.value}, description: state.description.value, amount: state.amount.value}
      payment = await fetchBackend('/api/bunq/draftpayment', {method: 'POST', body, user})
    }
    console.log(payment);
    return payment;
  }
  const validationSchema = {
    from_account: {
      type: 'string',
      presence: {allowEmpty: false}
    },
    to_account: {
      type: 'string'
    },
    amount: {
      type: 'string',
      format: {
        pattern: /[0-9]+(\.[0-9][0-9])?/
      },
      presence: {allowEmpty: false}
    }
  }
  const {hasError, isDirty, state, handleOnChange, submitting, handleOnSubmit} = useForm(initialValues, validationSchema, makePayment(user));

  return (  
    <div className={classes.content}>
      <Card>
        <CardHeader
          subheader="Intern of extern"
          title="Geld overboeken"
        />
        <Divider />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel
              htmlFor="from-account-placeholder"
              shrink
            >
              Van rekening
            </InputLabel>
            <ResponsiveSelect
              inputProps={{
                name: 'from_account',
                id: 'age-label-placeholder',
              }}
              onChange={handleOnChange}
              value={state.from_account.value}
            >
              {accounts.filter(account => account.status === 'ACTIVE').map(account => <ResponsiveSelectItem key={account.id} value={account.description}>{account.description}</ResponsiveSelectItem>)}
            </ResponsiveSelect>
          </FormControl>
          <FormControlLabel
            control={<Checkbox
              checked={state.internal.value}
              color="primary"
              inputProps={{
                'aria-label': 'secondary checkbox',
                'name': 'internal'
              }}
              onChange={handleOnChange}
              value={state.internal.value}
            />}
            label="Intern?"
            labelPlacement="end"
          />
          {state.internal.value && <FormControl fullWidth>
              <InputLabel
                htmlFor="to-account-placeholder"
                shrink
              >
                Naar rekening
              </InputLabel>
              <ResponsiveSelect
                inputProps={{
                  name: 'to_account',
                  id: 'age-label-placeholder',
                }}
                onChange={handleOnChange}
                value={state.to_account.value}
              >
                {accounts.filter(account => account.status === 'ACTIVE').map(account => <ResponsiveSelectItem key={account.id} value={account.description}>{account.description}</ResponsiveSelectItem>)}
              </ResponsiveSelect>
            </FormControl>
          }
          {!state.internal.value && <> <TextField
            fullWidth
            id="name"
            label="Naam"
            margin="dense"
            name="name"
            onChange={handleOnChange}
            type="text"
            value={state.name.value}
          /><TextField
            fullWidth
            id="iban"
            label="IBAN"
            margin="dense"
            name="iban"
            onChange={handleOnChange}
            type="text"
            value={state.iban.value}
          /></>}
          <TextField
            fullWidth
            id="amount"
            label="Bedrag"
            margin="dense"
            name="amount"
            onChange={handleOnChange}
            type="text"
            value={state.amount.value}
          />
          <FormHelperText>Vul hier het bedrag inn (bijv 11.99)</FormHelperText>
          <TextField
            fullWidth
            id="description"
            label="Omschrijving"
            margin="dense"
            name="description"
            onChange={handleOnChange}
            type="text"
            value={state.description.value}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.button}
            color ="primary"
            disabled={!isDirty || hasError || submitting || (state.internal.value && state.from_account.value === '') || (!state.internal.value && (state.iban.value === '' || state.name.value === ''))}
            onClick={handleOnSubmit}
            variant="contained"
          >
            Boek
          </Button>
        </CardActions>
      </Card>
    </div>
  )

}

Overboeken.propTypes = {
  
};

export default Overboeken;

