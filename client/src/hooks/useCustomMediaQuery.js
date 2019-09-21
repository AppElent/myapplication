//import { useMediaQuery } from 'react';
import { useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';



const useCustomMediaQuery = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });
  return isDesktop;
}



export default useCustomMediaQuery;