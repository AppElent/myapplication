import { useState } from 'react';

const useMaterialUIMenu = () => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const open = Boolean(anchorEl);


  return Object.assign([anchorEl, open, handleOpen, handleClose, handleOpen], { anchorEl, open, handleOpen, handleClose, handleOpen })
}

export default useMaterialUIMenu;