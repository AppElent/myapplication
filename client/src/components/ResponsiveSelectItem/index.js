import React from 'react'
import {MenuItem} from '@material-ui/core'

import useCustomMediaQuery from 'hooks/useCustomMediaQuery';


const ResponsiveSelectItem = (props) => {
  const isDesktop = useCustomMediaQuery();

  const {
    children,
    ...rest
  } = props

  if(isDesktop){
    return <MenuItem {...rest}>
      {children}
    </MenuItem>
  }
  return (
    <option {...rest}>
      {children}
    </option>
  )
}

export default ResponsiveSelectItem