import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import { resolve as _resolve, join } from 'path';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { DOWNLOAD_DIR } from '../../config/config.mjs';

const conversionBalanceMapping = {
  'ACCOUNT': 'Account Code',
  'DATE': 'Conversion Date',

};

const allowedConversionColumns = ['Account Code', 'Balance', 'Conversion Date'];

let uploadedConversionBalancePath = '';

const uploadConversionBalance = (req, res) => {
  uploadedConversionBalancePath = req.file.path;
  console.log("Uploaded Conversion Balance File Path:", uploadedConversionBalancePath);
  res.json({ message: 'Conversion Balance file uploaded successfully.' });
};

const convertConversionBalance = async (req, res) => {
  try {
    if (!existsSync(uploadedConversionBalancePath)) {
      return res.status(400).json({ error: 'Uploaded conversion balance file not found.' });
    }

    const originalRows = await parseCSV(uploadedConversionBalancePath);
    const cleanedRows = [];

    const cleanNumber = (value) => {
      if (typeof value === 'string') {
        return parseFloat(value.replace(/,/g, '').trim()) || 0;
      }
      return parseFloat(value) || 0;
    };

    for (const row of originalRows) {
        let debit = cleanNumber(row['DR'] || row['Debit']);
        let credit = cleanNumber(row['CR'] || row['Credit']);
      
        const balance = +(debit - credit).toFixed(2);
        if (balance === 0) continue;
      
        let accountRaw = (row['ACCOUNT'] || '').trim();
        let accountCode = '';
        const lowerRaw = accountRaw.toLowerCase();
      
        // Step 1: Handle known keywords
        if (lowerRaw.includes('accounts receivable'  && 'trade receivables')) {
          accountCode = '610';
        } else if (lowerRaw.includes('accounts payable' && 'trade creditors')) {
          accountCode = '800';
        } else if (lowerRaw.includes('retained earnings')) {
          accountCode = '960';
        } else if (accountRaw.includes(':')) {
          // Step 2: After colon, extract alphanumeric starting with number
          const afterColon = accountRaw.split(':').pop() || '';
          const match = afterColon.trim().match(/\b\d\w*\b/);
          accountCode = match ? match[0] : '';
        } else {
          // Step 3: Extract from full string
          const match = accountRaw.match(/\b\d\w*\b/);
          accountCode = match ? match[0] : '';
        }
      
        if (!accountCode) continue;
      
        const xeroRow = {
          'Account Code': accountCode,
          'Balance': balance,
          'Conversion Date': row['DATE'] || ''
        };
      
        cleanedRows.push(xeroRow);
      }
      
      
      

    const parser = new Parser({ fields: allowedConversionColumns });
    const csvOutput = parser.parse(cleanedRows);

    const outputDir = _resolve(process.cwd(), DOWNLOAD_DIR);
    mkdirSync(outputDir, { recursive: true });

    const fileName = 'converted_conversion_balance.csv';
    const outputPath = join(outputDir, fileName);
    writeFileSync(outputPath, csvOutput);

    return res.json({
      message: 'Conversion Balance data converted successfully.',
      downloadLink: `/download-conversion-balance/${fileName}`
    });

  } catch (error) {
    console.error('Error during conversion balance processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const downloadConversionBalance = (req, res) => {
  const fileName = req.params.filename;
  const filePath = join(process.cwd(), DOWNLOAD_DIR, fileName);

  if (!existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading:', err);
      res.status(500).json({ error: 'Download failed' });
    }
  });
};

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

export  {
  uploadConversionBalance,
  convertConversionBalance,
  downloadConversionBalance
};
