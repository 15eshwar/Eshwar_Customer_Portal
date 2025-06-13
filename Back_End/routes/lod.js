const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

router.post('/list-of-delivery', (req, res) => {
  
  const { customerID } = req.body;

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_LOD>
             <CUSTOMER_ID>${customerID}</CUSTOMER_ID>
          </urn:ZFM_PORT_LOD>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_lod_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': 'Basic SzkwMTQ4MzpFc2h3YXJAMTIz',
      'Cookie': 'sap-usercontext=sap-client=100',
    },
    body: soapBody,
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('SOAP Request Error:', error);
      return res.status(500).json({ message: 'Failed to connect to SAP.' });
    }

    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Failed to parse XML.' });
      }

      try {
        const items =
          result['soap-env:Envelope']['soap-env:Body']['n0:ZFM_PORT_LODResponse']['LIST_OF_DELIVERY']['item'];
        return res.status(200).json({ deliveries : Array.isArray(items) ? items : [items] });
      } catch (parseErr) {
        console.error('Parsing Delivery Items Failed:', parseErr);
        return res.status(500).json({ message: 'Unexpected response format.' });
      }
    });
  });
});

module.exports = router;
