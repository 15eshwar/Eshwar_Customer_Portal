const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/invoice-download', async (req, res) => {
  const { invoiceNumber } = req.body;

  if (!invoiceNumber) {
    return res.status(400).json({ status: 'E', message: 'invoiceNumber is required' });
  }

  const soapEnvelope = `<?xml version="1.0"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Body>
        <urn:ZFM_PORT_IV>
          <IV_VBELN>${invoiceNumber}</IV_VBELN>
        </urn:ZFM_PORT_IV>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(
      'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zport_civ_esh?sap-client=100',
      soapEnvelope,
      {
        headers: {
          'Content-Type': 'text/xml',
         'Authorization': `Basic ${process.env.Password}`,
        },
        responseType: 'text',
      }
    );

    // Extract base64 PDF data between <X_PDF>...</X_PDF> tags
   const pdfMatch = response.data.match(/<X_PDF>([\s\S]*?)<\/X_PDF>/);

if (!pdfMatch || !pdfMatch[1]) {
  return res.status(500).send('PDF data not found in response');
}

const base64String = pdfMatch[1].replace(/\s/g, ''); // remove newlines or spaces
const buffer = Buffer.from(base64String, 'base64');
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoiceNumber}.pdf`);
res.send(buffer);

  } catch (error) {
    console.error('PDF download error:', error.message);
    res.status(500).json({ status: 'E', message: 'PDF download error' });
  }
});

module.exports = router;
