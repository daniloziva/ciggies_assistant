import express from 'express';
import cors from 'cors';
import invoicesRouter from './api/invoices';

const ExpressApp = express();
const PORT = process.env.PORT || 5000;

// Middleware
ExpressApp.use(cors());
ExpressApp.use(express.json());

// Use invoices route for API endpoints
ExpressApp.use('/api/invoices', invoicesRouter);

ExpressApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 