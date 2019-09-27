import React from 'react'
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(3)
  },
  spinner: {
    color: 'white'
  }
}))

/*
const SpinnerAdornment = withStyles(styles)(props => (
  <CircularProgress
    className={props.classes.spinner}
    size={20}
  />
))
*/
const LoadingButton = (props) => {
  const classes = useStyles();
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button disabled={loading} {...rest}>
      {!loading && children}
      {loading && <CircularProgress className={classes.spinner} size={20} />}
    </Button>
  )
}

export default LoadingButton