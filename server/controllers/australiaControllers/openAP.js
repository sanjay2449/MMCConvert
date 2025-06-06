import { move, pathExists } from "fs-extra";
import ExcelJS from "exceljs";
import {readExcelToJson} from "../../utils/excelReader.js";
import { writeJsonToExcel, saveJsonToFile } from "../../utils/excelWriter.js";
import { getPaths } from "../../utils/filePaths.js";

const type = "openap";
const { excelFilePath, outputJsonPath, modifiedExcelPath } = getPaths(type);

// Column name mappings
const changeColumnName = {
    "Num": "BillNo",
    "Vendor": "Supplier",
    "Date": "BillDate",
    "Due Date": "DueDate",
    "Terms": "Terms",
    "Account": "Account",
    "Location": "Location",
    "Memo/Description": "Memo",
    "Open Balance": "LineAmount",
    "Currency": "Currency",
    "Exchange rate": "Exchange rate",
};

const changeBillCreditColumnName = {
    "BillNo": "Ref No",
    "Supplier": "Vendor",
    "BillDate": "Payment Date",
    "Terms": "Terms",
    "Location": "Location",
    "Account": "Expense Account",
    "Memo": "Expense Description",
    "LineAmount": "Expense Line Amount",
    "Currency": "Currency Code",
    "Exchange rate": "Exchange rate",
};

const allowedBillColumns = [
    "BillNo", "Supplier", "BillDate", "DueDate", "Terms", "Location", "Memo",
    "Account", "LineDescription", "LineAmount", "Currency", "Exchange rate"
];

const allowedBillCreditColumns = [
    "Ref No", "Vendor", "Payment Date", "Expense Account", "Terms", "Expense Description",
    "Expense Line Amount", "Currency Code", "Exchange rate"
];

// Utility functions
function renameColumns(data, changeMap) {
    return data.map(row => {
        const newRow = {};
        for (const key in row) {
            const newKey = changeMap[key] || key;
            newRow[newKey] = row[key];
        }
        return newRow;
    });
}

function assignBillType(data) {
    return data.map(row => {
        let amount = parseFloat(row["LineAmount"]) || 0;
        row["Type"] = amount < 0 ? "Bill credit" : "Bill";
        amount = Math.abs(amount);
        row["LineAmount"] = Number(amount.toFixed(2));
        row["Account"] = "Retained earnings";
        row["LineDescription"] = row["Memo"] || "";
        return row;
    });
}

function normalizeBillNumbers(data) {
    return data.map(row => {
        let billNo = row["BillNo"]?.toString().trim() || "";
        row["BillNo"] = billNo.slice(0, 21);
        return row;
    });
}

// 🟢 Upload Controller
export async function uploadOpenAP(req, res) {
    if (!req.file) return res.status(400).send("No file uploaded");

    try {
        await move(req.file.path, excelFilePath, { overwrite: true });
        console.log("✅Australia Open-AP file saved at:", excelFilePath);
        res.send({ message: "File uploaded and saved successfully" });
    } catch (err) {
        console.error("❌ File move error:", err.message);
        res.status(500).send("Error saving file");
    }
}

// ⚙️ Process Controller (2 sheets by Type)
export async function processOpenAP(req, res) {
    try {
        const jsonData = await readExcelToJson(excelFilePath);

        // Step 1: Rename columns to internal format
        const renamedData = renameColumns(jsonData, changeColumnName);

        // Step 2: Assign type, transform line amount, etc.
        const typedData = assignBillType(renamedData);

        // Step 3: Normalize BillNo
        const normalizedData = normalizeBillNumbers(typedData);

        // Step 4: Split by type
        const billData = normalizedData.filter(row => row.Type === "Bill");
        const billCreditDataRaw = normalizedData.filter(row => row.Type === "Bill credit");

        // Step 5: Rename columns for Bill Credit sheet
        const billCreditData = renameColumns(billCreditDataRaw, changeBillCreditColumnName);

        // Step 6: Filter final columns
        const filteredBillData = billData.map(row => {
            const filtered = {};
            for (const col of allowedBillColumns) {
                filtered[col] = row[col] ?? "";
            }
            return filtered;
        });

        const filteredBillCreditData = billCreditData.map(row => {
            const filtered = {};
            for (const col of allowedBillCreditColumns) {
                filtered[col] = row[col] ?? "";
            }
            return filtered;
        });

        // Step 7: Save combined JSON
        await saveJsonToFile([...filteredBillData, ...filteredBillCreditData], outputJsonPath);

        // Step 8: Write to Excel with 2 sheets
        const workbook = new ExcelJS.Workbook();

        const billSheet = workbook.addWorksheet("Bills");
        billSheet.columns = allowedBillColumns.map(header => ({ header, key: header }));
        billSheet.addRows(filteredBillData);

        const creditSheet = workbook.addWorksheet("Bill Credits");
        creditSheet.columns = allowedBillCreditColumns.map(header => ({ header, key: header }));
        creditSheet.addRows(filteredBillCreditData);

        await workbook.xlsx.writeFile(modifiedExcelPath);

        console.log("✅Australia Open-AP Excel processed into 2 sheets.");
        res.send("Excel processed into Bills and Bill Credits.");
    } catch (error) {
        console.error("❌ Error processing Excel:", error.message);
        res.status(500).send(`Error processing Excel file: ${error.message}`);
    }
}

// 📥 Download Controller
export async function downloadOpenAP(req, res) {
    try {
        const exists = await pathExists(modifiedExcelPath);
        if (exists) {
            res.download(modifiedExcelPath, "modifiedOpenAP.xlsx", (err) => {
                if (err) console.error("❌ Download error:", err.message);
                else console.log("✅ Excel file downloaded.");
            });
        } else {
            res.status(404).send("Modified Excel file not found. Please process it first.");
        }
    } catch (err) {
        console.error("❌ File check error:", err.message);
        res.status(500).send("Error checking or downloading the file.");
    }
}
