import { Modal, Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react'; 
import {fetchBackend} from '../utils/fetching';

const BunqPaymentModal = ({auth, accounts}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({description: '', amount: '', from: {}, to: {}})
  
  const makePayment = async () => {
    const body = {from: {type: 'description', value: 'Algemeen'}, to: {type: 'description', value: 'Spaar'}, description: data.description, amount: data.amount}
    const payment = await fetchBackend('/api/bunq/payment', 'POST', body, auth)
    //const body2 = {from: {type: 'description', value: 'Algemeen'}, to: {type: 'IBAN', name: 'E. Jansen', value: 'NL70ABNA0577271423'}, description: 'testtest', amount: '0.01'}
    //const payment2 = await fetchBackend('/api/bunq/draftpayment', 'POST', body2, auth)
    //console.log(payment, payment2)
    setShow(false);
  }
  
  const form = () => {
  
      return (
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Van rekening:</Form.Label>
            <Form.Control as="select">
              {accounts.map(account => <option key={account.id}>{account.description}</option>)}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Naar rekening:</Form.Label>
            <Form.Control as="select">
              {accounts.map(account => <option key={account.id}>{account.description}</option>)}
            </Form.Control>
          </Form.Group>  
          <Form.Group controlId="formGridAddress1">
            <Form.Label>Omschrijving</Form.Label>
            <Form.Control value={data.description} onChange={(input) => {setData({...data, description: input.target.value})}}/>
          </Form.Group> 
          <Form.Group controlId="formGridAddress1">
            <Form.Label>Bedrag</Form.Label>
            <Form.Control placeholder="0.01" value={data.amount} onChange={(input) => {setData({...data, amount: input.target.value})}}/>
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
        <Button variant="primary" onClick={makePayment}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>)
      
}

export default withAuth(BunqPaymentModal)
