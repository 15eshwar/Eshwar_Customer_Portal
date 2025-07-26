const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/profile', (req, res) => {
  const { customerID } = req.body;
  console.log('Received Customer ID:', customerID);

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_PROF>
             <IM_CUSTOMER_ID>${customerID}</IM_CUSTOMER_ID>
          </urn:ZFM_PORT_PROF>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_prof_ws?sap-client=100',
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

    xml2js.parseString(body, { explicitArray: true }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response' });
      }

      try {
        const profile =
          result['soap-env:Envelope']['soap-env:Body'][0]['n0:ZFM_PORT_PROFResponse'][0]['EX_PROFILE'][0];
        const formattedProfile = {
          customerID: profile.CUSTOMER_ID[0],
          customerName: profile.CUSTOMER_NAME[0],
          street: profile.STREET[0],
          city: profile.CITY[0],
          postalCode: profile.POSTAL_CODE[0],
          state: profile.STATE[0],
          country: profile.COUNTRY_KEY[0],
        };

        return res.json(formattedProfile);
      } catch (parseError) {
        console.error('Error extracting profile:', parseError);
        return res.status(500).json({ message: 'Unexpected SOAP structure' });
      }
    });
  });
});

module.exports = router;
