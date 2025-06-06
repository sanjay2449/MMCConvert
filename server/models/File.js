// // models/File.js
import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema({
  fileName: String,
  routeUsed: String,
  downloadedAt: { type: Date, default: Date.now }
});

const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  softwareType: String,
  countryName: String,
  currencyStatus: { type: String, enum: ['Single Currency', 'Multi Currency'], required: true },
  status: { type: String, enum: ['running', 'completed'], default: 'running' },
  createdAt: { type: Date, default: Date.now, index: { expires: 60 * 60 * 24 * 30 } }, // Auto-delete after 30 days
  downloadedSheets: [sheetSchema]
});

export default mongoose.model('File', fileSchema);
