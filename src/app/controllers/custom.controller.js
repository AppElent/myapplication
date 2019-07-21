
exports.redirectCall = async (req, res) => {
	
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


