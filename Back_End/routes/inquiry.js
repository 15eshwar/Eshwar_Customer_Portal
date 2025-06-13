const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

router.post('/salesInquiry', (req, res) => {
  const { customerID } = req.body;

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_SI>
             <CUSTOMER_ID>${customerID}</CUSTOMER_ID>
          </urn:ZFM_PORT_SI>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_sid_ws?sap-client=100',
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

    xml2js.parseString(body, { explicitArray: true }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response' });
      }

      try {
        const items = result['soap-env:Envelope']['soap-env:Body'][0]['n0:ZFM_PORT_SIResponse'][0]['SALES_INQUIRY'][0]['item'];
        const formattedItems = items.map(entry => ({
          CUSTOMER_ID: entry.CUSTOMER_ID[0],
          CUSTOMER_NAME: entry.CUSTOMER_NAME[0],
          SALES_DOC_NO: entry.SALES_DOC_NO[0],
          INQUIRY_DATE: entry.INQUIRY_DATE[0],
          MATERIAL_NO: entry.MATERIAL_NO[0],
          MATERIAL_DESCRIPT: entry.MATERIAL_DESCRIPT[0],
          SALES_UNIT: entry.SALES_UNIT[0],
          SALES_DOC_TYPE: entry.SALES_DOC_TYPE[0],
          SALES_DOC_ITEM: entry.SALES_DOC_ITEM[0],
          SALES_ORG: entry.SALES_ORG[0],
          SD_DOC_CURR: entry.SD_DOC_CURR[0],
          REQUESTED_QUAN: entry.REQUESTED_QUAN[0],
        }));
        res.json({ inquiries: formattedItems });

      } catch (parseError) {
        console.error('Data Extraction Error:', parseError);
        res.status(500).json({ message: 'Unexpected response format from SAP.' });
      }
    });
  });
});

module.exports = router;
