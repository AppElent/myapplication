import { useState } from 'react';

const useModal = (
  initialMode = false,
  initialData = null
) => {

  const [modalOpen, setModalOpen] = useState(initialMode)   
  const toggleModal = () => setModalOpen(!modalOpen)   
  const [modalData, setModalData] = useState(initialData)
  /*
  const setModalState = state => {
    setModalOpen(state)
    if (state === false) {
      setSelected(null)
    }
  }
  */
  //return { modalOpen, setModalOpen, selected, setSelected, setModalState }
  return Object.assign([modalOpen, setModalOpen, toggleModal, modalData, setModalData], { modalOpen, setModalOpen, toggleModal, modalData, setModalData })
}

export default useModal;