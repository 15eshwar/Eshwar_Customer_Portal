const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

///////////////////////////// ROUTER FOR LOGIN /////////////////////////////////////////////////////
router.post('/login', (req, res) => {
  console.log('Received from frontend:', req.body.customerID, req.body.password);
  const { customerID, password } = req.body;
     if (!customerID || !password) {
    return res.status(400).json({ message: 'Customer ID and password are required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_LOGIN>
             <IM_CUSTOMER_ID>${customerID}</IM_CUSTOMER_ID>
             <IM_PASSWORD>${password}</IM_PASSWORD>
          </urn:ZFM_PORT_LOGIN>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_log_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': `Basic SzkwMTQ4MzpFc2h3YXJAMTIz`,
      'Cookie': 'sap-usercontext=sap-client=100',
    },
    body: soapBody,
  };

  request(options, (error,response, body) => {
    
 
    if (error) {
      console.error('SOAP Request Error:', error);
      return res.status(500).json({ message: 'Failed to connect to SAP.' });
    }
 console.log('Raw SOAP response body:', body);

    xml2js.parseString(body, { explicitArray: true }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response' });
      }
  console.log('Parsed SOAP response object:', JSON.stringify(result, null, 2));
  

      try {
        const log = result['soap-env:Envelope']['soap-env:Body'][0]['n0:ZFM_PORT_LOGINResponse'][0];
        const message = log.EX_LOGIN_MESSAGE[0];
        const status = log.EX_LOGIN_STATUS[0];

      res.status(200).json({ status, message });
      } catch (e) {
        console.error('Response Parsing Error:', e);
        res.status(500).json({ message: 'Unexpected SOAP response structure' });
      }
    });
  });
});

module.exports = router;
