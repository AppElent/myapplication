import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';

import { useSession, useForm } from 'hooks';
import { Button } from 'components';

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const {user, firebase} = useSession();

  const classes = useStyles();

  const saveUserInfo = (user) => async (state) => {
    console.log(user, state);
    await user.updateProfile({
      displayName: state.name.value,
      email: state.email.value,
      phoneNumber: state.phone.value
    })
    return;
  }

  const {isDirty, state, submitting, handleOnChange, handleOnSubmit} = useForm({name: user.displayName, email: user.email, phone: user.phoneNumber}, {}, saveUserInfo(user));



  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the name"
                label="Name"
                margin="dense"
                name="name"
                onChange={handleOnChange}
                required
                value={state.name.value}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                margin="dense"
                name="email"
                onChange={handleOnChange}
                required
                value={state.email.value}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                margin="dense"
                name="phone"
                onChange={handleOnChange}
                type="text"
                value={state.phone.value || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            disabled={!isDirty}
            loading={submitting}
            onClick={handleOnSubmit}
            variant="contained"
          >
            Save details
          </Button>
          <Button
            color="primary"
            onClick={() => firebase.auth.signOut()}
            variant="contained"
          >
            Logout
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
