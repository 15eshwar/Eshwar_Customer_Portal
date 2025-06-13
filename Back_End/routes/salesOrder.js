const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

router.post('/sales-order', (req, res) => {
  const { customerID } = req.body;

  if (!customerID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:ZFM_PORT_SO>
             <CUSTOMER_ID>${customerID}</CUSTOMER_ID>
          </urn:ZFM_PORT_SO>
       </soapenv:Body>
    </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_so_esh?sap-client=100',
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
        const items = result['soap-env:Envelope']['soap-env:Body'][0]['n0:ZFM_PORT_SOResponse'][0]['SALES_ORDER'][0]['item'];
        const formattedItems = items.map(entry => ({
          CUSTOMER_ID: entry.CUSTOMER_ID?.[0],
          CUSTOMER_NAME: entry.CUSTOMER_NAME?.[0],
          SALES_OR_NO: entry.SALES_OR_NO?.[0],
          SALES_OR_DATE: entry.SALES_OR_DATE?.[0],
          SALES_DOC_TYPE: entry.SALES_DOC_TYPE?.[0],
          MATERIAL_NO: entry.MATERIAL_NO?.[0],
          MATERIAL_DESCRIPT: entry.MATERIAL_DESCRIPT?.[0],
          ORDER_QTY: entry.ORDER_QTY?.[0],
          SALES_UNIT: entry.SALES_UNIT?.[0],
          SALES_ORG: entry.SALES_ORG?.[0],
          SD_DOC_CURR: entry.SD_DOC_CURR?.[0],
          SALES_DOC_ITEM_NO: entry.SALES_DOC_ITEM_NO?.[0],
          CONFIRMED_QTY: entry.CONFIRMED_QTY?.[0],
          DELIVERY_DATE: entry.DELIVERY_DATE?.[0],
          PRICE_COND_TYPE: entry.PRICE_COND_TYPE?.[0],
          PRICE_COND_AMNT: entry.PRICE_COND_AMNT?.[0],
          PRICE_COND_VAL: entry.PRICE_COND_VAL?.[0],
          PRICE_COND_CURR: entry.PRICE_COND_CURR?.[0],
          OVERALL_STATUS: entry.OVERALL_STATUS?.[0],
          DELIVERY_STATUS: entry.DELIVERY_STATUS?.[0],
          BILLING_STATUS: entry.BILLING_STATUS?.[0],
        }));
        res.json(formattedItems);
      } catch (parseErr) {
        console.error('Response Mapping Error:', parseErr);
        res.status(500).json({ message: 'Unexpected response structure' });
      }
    });
  });
});

module.exports = router;
