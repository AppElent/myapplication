import { Modal, Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react'; 
import {fetchBackend} from '../utils/fetching';

const BunqPaymentModal = ({auth, accounts}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({description: '', amount: '', from: 'Algemeen', to: 'Spaar', type: 'internal', name: '', iban: ''})
  const [internal, setInternal] = useState(true)
  
  const makePayment = async () => {
    let body;
    if(internal){
      body = {from: {type: 'description', value: data.from}, to: {type: 'description', value: data.to}, description: data.description, amount: data.amount}
      const payment = await fetchBackend('/api/bunq/payment', 'POST', body, auth)
    }else{
      body = {from: {type: 'description', value: data.from}, to: {type: 'IBAN', name: data.name, value: data.iban}, description: data.description, amount: data.amount}
      const payment = await fetchBackend('/api/bunq/draftpayment', 'POST', body, auth)
    }
    setShow(false);
  }
  
  const form = () => {
  
      return (
        <Form>
          <Form.Group>
            <Form.Label>Van rekening:</Form.Label>
            <Form.Control as="select" value={data.from} onChange={(e) => {setData({...data, from: e.target.value})}}>
              {accounts.filter((account) => account.status === 'ACTIVE').map(account => <option key={account.id}>{account.description}</option>)}
            </Form.Control>
          </Form.Group>
          <Button variant={internal ? 'primary' : 'outline-primary'} onClick={() => setInternal(true)}>Intern</Button>
          <Button variant={!internal ? 'primary' : 'outline-primary'} onClick={() => setInternal(false)}>Extern</Button>
          {internal &&
            <Form.Group>
              <Form.Label>Naar rekening:</Form.Label>
              <Form.Control as="select" value={data.to} onChange={(e) => {setData({...data, to: e.target.value})}}>
                {accounts.filter((account) => account.status === 'ACTIVE').map(account => <option key={account.id}>{account.description}</option>)}
              </Form.Control>
            </Form.Group>  }
          {!internal &&
            <><Form.Group>
              <Form.Label>Naar</Form.Label>
              <Form.Control value={data.name} onChange={(e) => {setData({...data, name: e.target.value})}}/>
            </Form.Group> 
            <Form.Group>
              <Form.Label>IBAN</Form.Label>
              <Form.Control value={data.iban} onChange={(e) => {setData({...data, iban: e.target.value})}}/>
            </Form.Group>
            <p>Extern kunnen alleen betaalverzoeken worden gedaan. Je moet deze goedkeuren in de app</p></> }
          <Form.Group>
            <Form.Label>Omschrijving</Form.Label>
            <Form.Control value={data.description} onChange={(e) => {setData({...data, description: e.target.value})}}/>
          </Form.Group> 
          <Form.Group>
            <Form.Label>Bedrag</Form.Label>
            <Form.Control placeholder="0.01" value={data.amount} onChange={(e) => {setData({...data, amount: e.target.value})}}/>
          </Form.Group>
        </Form>
      )
    
  }
  
  return (<>
    <Button variant="primary" onClick={() => setShow(true)}>
      Handmatige betaling
    </Button>

    <Modal show={show} onHide={() => {setShow(false)}}>
      <Modal.Header closeButton>
        <Modal.Title>Overboeking</Modal.Title>
      </Modal.Header>
      <Modal.Body>{form()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {setShow(false)}}>
          Close
        </Button>
        <Button variant="primary" onClick={makePayment} disabled={!data.amount || !data.description || (!internal && (!data.iban || !data.name))}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>)
      
}

export default withAuth(BunqPaymentModal)
