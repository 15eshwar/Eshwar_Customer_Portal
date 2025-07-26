const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/credit-memo-data', (req, res) => {
  const { customerID } = req.body;

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_CD>
             <CUSTOMER_ID>${customerID}</CUSTOMER_ID>
          </urn:ZFM_PORT_CD>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_cd_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': `Basic ${process.env.Password}`,
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
        return res.status(500).json({ message: 'Failed to parse XML response.' });
      }

      try {
        const responseBody = result['soap-env:Envelope']['soap-env:Body'];
        const creditMemoResponse = responseBody['n0:ZFM_PORT_CDResponse'];
        const creditMemoItems = creditMemoResponse?.CD_MEMO?.item;

        let parsedItems = [];

        if (Array.isArray(creditMemoItems)) {
          parsedItems = creditMemoItems;
        } else if (typeof creditMemoItems === 'object') {
          parsedItems = [creditMemoItems]; 
        }
        return res.json({ customerID, creditMemos : parsedItems });
      } catch (e) {
        console.error('Processing Error:', e);
        return res.status(500).json({ message: 'Error processing SAP response.' });
      }
    });
  });
});

module.exports = router;