//index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/fileRoutes.js';
import ausRoutes from './routes/ausRoutes.js'; // Import Australia-specific Excel Routes For Single Currency
import ausMultiCurrencyRoutes from './routes/ausMultiCurrecnyRoutes.js'; // Import Australia-specific Excel Routes For Multi Currency
import globalRoutes from './routes/globalRoutes.js'; // Import Global Excel Routes For Single Currency
import globalMultiCurrencyRoutes from './routes/globalMultiCurrencyRoutes.js'; // Import Global Excel Routes For Multi Currency
import fileRoutesSheet from './routes/fileRoutesSheet.js'; // Import file routes for saving downloaded sheets
import file from './routes/files.js';
import fileShowRoutes from './routes/fileShowRoutes.js';
import userRoutes from './routes/userRoutes.js';

// other setup ...

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON

app.use('/api', userRoutes);
app.use('/api/files', fileShowRoutes);
app.use('/api', fileRoutesSheet);
app.use('/api/files', file);
// Routes
app.use('/api/auth', authRoutes);        // Authentication routes
app.use('/api/files', fileRoutes);       // File upload/download routes
// Excel processing routes For Australia Qbo to Qbo conversion 
app.use('/api/excel-australia-qbotoqbo/singlecurrency', ausRoutes);
app.use('/api/excel-australia-qbotoqbo/multicurrency', ausMultiCurrencyRoutes); 
// Excel processing routes For Global Qbo to Qbo conversion
app.use('/api/excel-global-qbotoqbo/singlecurrency', globalRoutes);  
app.use('/api/excel-global-qbotoqbo/multicurrency', globalMultiCurrencyRoutes); 


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
