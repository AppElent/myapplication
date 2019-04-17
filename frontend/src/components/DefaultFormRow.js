import React from 'react';
import { Button, Form, Col } from 'react-bootstrap';


const DefaultFormRow = ({data, buttons = null}) => {
    //id, changehandler, type, label
    
    const formItems = data.map((formItem) => {
        let itemprops = {}
        itemprops.as = (formItem.type === 'text' ? formItem.type : 'input')
        
        return  <Form.Group as={Col} key={formItem.name}>
            <Form.Label>{formItem.label}</Form.Label>
            <Form.Control type={formItem.type} className="form-control" name={formItem.name} onChange={formItem.changehandler} value={formItem.value}/>
        </Form.Group>
    });
    
    const buttonItems = (buttons === null ? null : buttons.map((buttonItem) => {
        return <Form.Group as={Col} key={buttonItem.id}>
                <Button style={{marginTop: '32px'}} className="form-control" variant="outline-primary" type="button" onClick={buttonItem.click} disabled={buttonItem.disabled}>{buttonItem.text}</Button>
            </Form.Group>
    }))

        
    return <Form>
        <Form.Row>
            {formItems}
            {buttonItems !== null && buttonItems}
        </Form.Row>
    </Form>
    
}

export default DefaultFormRow
