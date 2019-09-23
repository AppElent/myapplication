import React from 'react'
import {Select, NativeSelect} from '@material-ui/core'

import useCustomMediaQuery from 'hooks/useCustomMediaQuery';


const ResponsiveSelect = (props) => {
  const isDesktop = useCustomMediaQuery();

  const SelectVersion = isDesktop ? Select : NativeSelect;

  const {
    children,
    ...rest
  } = props
  return (
    <SelectVersion {...rest}>
      {children}
      
    </SelectVersion>
  )
}

export default ResponsiveSelect