const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // Logging middleware
const authRoutes = require('./routes/auth'); // Route path
const profileRoutes = require ('./routes/Profile')
const SIRoutes = require ('./routes/inquiry')
const SORoutes = require('./routes/salesOrder')
const LODRoutes = require ('./routes/lod')
const OSDRoutes = require ('./routes/osd')
const CDRoutes = require ('./routes/credit_debit')
const PARoutes = require ('./routes/payage')
const IVPRoutes = require ('./routes/invoice_pdf')
const DIVRoutes = require ('./routes/invoiceD')

console.log("hello");

const app = express();
const PORT = 3000;

//  Middleware 
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests to console

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/Profile', profileRoutes);
app.use('/api/inquiry', SIRoutes);
app.use('/api/salesOrder',SORoutes)
app.use('/api/lod',LODRoutes)
app.use('/api/osd',OSDRoutes)
app.use('/api/credit_debit',CDRoutes)
app.use('/api/payage',PARoutes)
app.use('/api/invoice_pdf',IVPRoutes)
app.use('/api/invoiceD',DIVRoutes)

// Root Health Check 
app.get('/', (req, res) => {
  res.send(' Server is up and running!');
});

// Start Server 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


