const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

router.post('/pay-age-data', (req, res) => {
  const { customerID } = req.body;

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_PA>
             <CUSTOMER_ID>${customerID}</CUSTOMER_ID>
          </urn:ZFM_PORT_PA>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_pa_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': 'Basic SzkwMTQ4MzpFc2h3YXJAMTIz', // Move to .env in prod
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
        const responseTag =
          result['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZFM_PORT_PAResponse'] ||
          result['soapenv:Envelope']?.['soapenv:Body']?.['n0:ZFM_PORT_PAResponse'];

        if (!responseTag) {
          console.error('Missing ZFM_PORT_PAResponse tag:', JSON.stringify(result, null, 2));
          return res.status(500).json({ message: 'Error extracting data from SOAP response.' });
        }

        const payAgeData = responseTag.PAY_AGE_DATA?.item;

        if (!payAgeData) {
          return res.status(404).json({ message: 'No PAY_AGE_DATA found for this customer.' });
        }

       const items = Array.isArray(payAgeData) ? payAgeData : [payAgeData];

         const processedItems = items.map(item => {
           return {
             ...item,
             AGING_DAYS: parseFloat(item.AGING_DAYS) < 0 ? "0" : item.AGING_DAYS 
           };
         });

         return res.status(200).json({
           customerID,
           payAgeData: processedItems,
         });
         

      } catch (ex) {
        console.error('Exception while parsing SOAP response:', ex);
        return res.status(500).json({ message: 'Error extracting data from SOAP response.' });
      }
    });
  });
});

module.exports = router;
