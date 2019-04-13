import React from 'react';
import { Button, Form, Col } from 'react-bootstrap';


const DefaultFormRow = ({data, button}) => {
    //id, changehandler, type, label
    
   
    const formItems = data.map((formItem) => {
        let itemprops = {}
        itemprops.as = (formItem.type === 'text' ? formItem.type : 'input')
        
        return  <Form.Group as={Col} key={formItem.id}>
            <Form.Label>{formItem.label}</Form.Label>
            <Form.Control type={formItem.type} className="form-control" name={formItem.id} onChange={formItem.changehandler} value={formItem.value}/>
        </Form.Group>
    });

        
    return <Form>
        <Form.Row>
            {formItems}
            {button !== null &&
            <Form.Group as={Col}>
                <Button style={{marginTop: '32px'}} className="form-control" variant="outline-primary" type="submit" onClick={button.click} disabled={button.disabled}>{button.text}</Button>
            </Form.Group>}
            
        </Form.Row>
    </Form>
    
}

export default DefaultFormRow
