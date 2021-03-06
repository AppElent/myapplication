
const router = require('express').Router();
import asyncHandler from 'express-async-handler';
import { basicAuthentication } from '../middleware/authentication';


export const redirectCall = async (req, res) => {
	
  const body = req.body.body === null ? undefined : req.body.body;
  const headers = req.body.headers === null ? undefined : req.body.headers;
  const url = req.body.url;
  
  console.log('Making call to ' + url + ' with method ' + req.body.method);
  const data = await fetch(url, {    
	    method: req.body.method ,
            headers: headers,
	    body: JSON.stringify(body)
          })
  const jsondata = await data.json().catch(err => res.status(500).send(err));

  return res.send( jsondata)
	
}

router.post('/redirectcall', basicAuthentication, asyncHandler(redirectCall));
module.exports = router;