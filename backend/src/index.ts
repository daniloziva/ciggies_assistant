import express from 'express';
import cors from 'cors';
import invoicesRouter from './api/invoices';
import openAIRouter from './api/openAI';
import bodyParser from 'body-parser';

const ExpressApp = express();
const PORT = process.env.PORT || 5000;

// Middleware
ExpressApp.use(cors());
ExpressApp.use(bodyParser.json({limit: '50mb'}));
ExpressApp.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Use invoices route for API endpoints
ExpressApp.use('/api/invoices', invoicesRouter);
ExpressApp.use('/api/openai', openAIRouter);

ExpressApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 