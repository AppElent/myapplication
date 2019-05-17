import { Modal, Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react'; 
import {fetchBackend} from '../utils/fetching';

const BunqPaymentModal = ({auth, accounts}) => {
  const initialValues = {description: '', amount: '', from: 'Algemeen', to: 'Spaar', type: 'internal', name: '', iban: '', errormessage: {}, successmessage: ''}
  const [processing, setProcessing] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(initialValues)
  const [internal, setInternal] = useState(true)
  
  const makePayment = async () => {
    setProcessing(true);
    let body;
    let payment;
    if(internal){
      body = {from: {type: 'description', value: data.from}, to: {type: 'description', value: data.to}, description: data.description, amount: data.amount}
      payment = await fetchBackend('/api/bunq/payment', {method: 'POST', body, auth})
    }else{
      body = {from: {type: 'description', value: data.from}, to: {type: 'IBAN', name: data.name, value: data.iban}, description: data.description, amount: data.amount}
      payment = await fetchBackend('/api/bunq/draftpayment', {method: 'POST', body, auth})
    }
    if(payment.success === false) {console.log(payment.message.Error[0]);setData({...data, errormessage: payment.message}); setProcessing(false); return; }
    setData({...data, successmessage: 'Succesvol uitgevoerd', errormessage: {}})
    setProcessing(false);
  }
  
  useEffect(() => {
    if(show === false) setData(initialValues)
  }, [show])
  
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
          <p>{data.errormessage.Error !== undefined ? data.errormessage.Error[0].error_description : ''}</p>
          <p>{data.successmessage}</p>
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
        <Button variant="primary" onClick={makePayment} disabled={!data.amount || !data.description || (!internal && (!data.iban || !data.name)) || processing}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>)
      
}

export default withAuth(BunqPaymentModal)
