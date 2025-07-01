import { move, pathExists } from "fs-extra";
import { readExcelToJson } from "../../utils/excelReader.js";
import { writeJsonToExcel, saveJsonToFile } from "../../utils/excelWriter.js";
import { getPaths } from "../../utils/filePaths.js";

const type = "trackedinvoice";
const { excelFilePath, outputJsonPath, modifiedExcelPath } = getPaths(type);

const changeColumnName = {
  "Num": "Invoice No",
  "Name": "Customer",
  "Date": "Invoice Date",
  "Due Date": "Due Date",
  "Service Date": "Service Date",
  "Product/Service": "Product/Service",
  "Memo/Description": "Product/Service Description",
  "Qty": "Product/Service Quantity",
  "Rate": "Product/Service Rate",
  "Tax Code": "Product/Service Tax Code",
  "GST": "Product/Service Tax Amount",
  "Class": "Product/Service Class",
  "Customer memo": "Note to customer",
  "Memo": "Memo on statement",
  "SKU": "SKU",
  "Term": "Terms",
  "Discount": "Discount Percent",
  "Currency": "Currency Code",
  "Exchange Rate": "Exchange Rate",
  "Debit": "Debit",
  "Credit": "Credit",
  "Account": "Account",
  "Unit Price/Rate": "Unit Price/Rate"
};

const allowedColumns = [
  "Invoice No", "Customer", "Invoice Date", "Due Date", "Global Tax Calculation", "Service Date",
  "Product/Service", "Product/Service Description", "Product/Service Quantity", "Product/Service Rate",
  "Product/Service Amount", "Product/Service Tax Code", "Product/Service Tax Amount", "Product/Service Class",
  "Note to customer", "Memo on statement", "SKU", "Terms", "Discount Percent", "Currency Code", "Exchange Rate"
];

function renameColumns(data, map) {
  return data.map(row => {
    const newRow = {};
    for (const key in row) {
      const newKey = map[key] || key;
      newRow[newKey] = row[key];
    }
    return newRow;
  });
}

function fillDownDueDate(data) {
  let lastDueDate = "";
  return data.map(row => {
    if (row["Due Date"]) {
      lastDueDate = row["Due Date"];
    } else {
      row["Due Date"] = lastDueDate;
    }
    return row;
  });
}

function processInvoiceData(data) {
  return data.map(row => {
    if (!row["Product/Service Quantity"]) row["Product/Service Quantity"] = 1;
    if (!row["Product/Service Tax Code"]) {
      row["Product/Service Tax Code"] = "Out Of Scope";
      row["Product/Service Tax Amount"] = 0;
    }
    if (!row["Product/Service Tax Amount"]) row["Product/Service Tax Amount"] = 0;

    row["Product/Service Quantity"] = row["Product/Service Quantity"].toString().replace("-", "");

    const debit = parseFloat(row["Debit"] || 0);
    const credit = parseFloat(row["Credit"] || 0);
    row["Product/Service Amount"] = (credit - debit).toFixed(2);

    const amount = parseFloat(row["Product/Service Amount"]) || 0;
    const quantity = parseFloat(row["Product/Service Quantity"]) || 1;
    row["Product/Service Rate"] = quantity !== 0 ? (amount / quantity).toFixed(2) : 0;

    row["Global Tax Calculation"] = "TaxExcluded";
    return row;
  });
}

function removeInvalidRows(data) {
  return data.filter(row => {
    const accountName = (row["Account"] || "").toLowerCase();
    return !accountName.includes("receivable") && !accountName.includes("payable");
  });
}

function normalizeInvoiceNumbers(data) {
  return data.map(row => {
    row["Invoice No"] = (row["Invoice No"] || "").toString().trim().slice(0, 21);
    return row;
  });
}

function filterColumns(data) {
  return data.map(row => {
    const filtered = {};
    for (const key of allowedColumns) {
      filtered[key] = row[key] ?? "";
    }
    return filtered;
  });
}

function sortByInvoiceNo(data) {
  return data.sort((a, b) => (a["Invoice No"] || "").localeCompare(b["Invoice No"] || ""));
}

// 🟢 Upload Controller
export async function uploadTrackedInvoice(req, res) {
  try {
    if (!req.files || req.files.length < 2) return res.status(400).send("Two files are required");

    // Save Invoice file (1st) only — COA not needed for processing
    await move(req.files[0].path, excelFilePath, { overwrite: true });

    console.log("✅Tracked Invoice file uploaded:", excelFilePath);
    res.send({ message: "Invoice & COA files uploaded. Ready to process." });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).send("File upload failed.");
  }
}

// ⚙️ Process Controller
export async function processTrackedInvoice(req, res) {
  try {
    let jsonData = await readExcelToJson(excelFilePath);
    jsonData = renameColumns(jsonData, changeColumnName);
    jsonData = fillDownDueDate(jsonData);
    jsonData = processInvoiceData(jsonData);
    jsonData = removeInvalidRows(jsonData);
    jsonData = normalizeInvoiceNumbers(jsonData);
    jsonData = sortByInvoiceNo(jsonData);
    jsonData = filterColumns(jsonData);

    await saveJsonToFile(jsonData, outputJsonPath);
    await writeJsonToExcel(jsonData, modifiedExcelPath, [
      "Product/Service Amount",
      "Product/Service Rate",
      "Product/Service Tax Amount"
    ]);

    console.log("✅ Tracked Invoice Excel processed.");
    res.send("Invoice processed successfully.");
  } catch (error) {
    console.error("❌ Processing error:", error.message);
    res.status(500).send("Processing failed.");
  }
}

// 📥 Download Controller
export async function downloadTrackedInvoice(req, res) {
  try {
    if (await pathExists(modifiedExcelPath)) {
      res.download(modifiedExcelPath, "Modified_TrackedInvoice.xlsx", err => {
        if (err) console.error("❌ Download error:", err.message);
        else console.log("✅ File sent to user.");
      });
    } else {
      res.status(404).send("Please process file first.");
    }
  } catch (err) {
    console.error("❌ Download check error:", err.message);
    res.status(500).send("Download failed.");
  }
}
