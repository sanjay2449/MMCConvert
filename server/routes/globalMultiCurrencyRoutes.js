import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Importing all the necessary functions from the global QBO modules
import { downloadCoaGlobal, processCoaGlobal, uploadCoaGlobal } from "../controllers/globalControllers/chartOfAccount.js";
import { downloadCustomerGlobal, processCustomerGlobal, uploadCustomerGlobal } from "../controllers/globalControllers/customer.js";
import { downloadSupplierGlobal, processSupplierGlobal, uploadSupplierGlobal } from "../controllers/globalControllers/supplier.js";
import { downloadClass, processClass, uploadClass } from "../controllers/globalControllers/class_job.js";
import{ downloadItem, processItem, uploadItem } from "../controllers/globalControllers/item.js";
import{ downloadtrackedItem, processtrackedItem, uploadtrackedItem } from "../controllers/globalControllers/trackedItems.js";
import { downloadOpenAR, processOpenAR, uploadOpenAR } from "../controllers/globalControllers/openAR.js";
import { downloadOpenAP, uploadOpenAP } from "../controllers/globalControllers/openAP.js";
import { downloadOpeningBalance, processOpeningBalance, uploadOpeningBalance } from "../controllers/globalControllers/openingBalance.js";
import { downloadInvoice, processMultiCurrencyInvoice, uploadInvoice } from "../controllers/globalControllers/invoice.js";
import { downloadAdjustmentNote, processAdjustmentNote, uploadAdjustmentNote } from "../controllers/globalControllers/adjustmentNote.js";
import { downloadBill, processMultiCurrencyBill, uploadBill } from "../controllers/globalControllers/bill.js";
import { downloadSupplierCredit, processSupplierCredit, uploadSupplierCredit } from "../controllers/globalControllers/supplierCredit.js";
import { downloadCheque, processCheque, uploadCheque } from "../controllers/globalControllers/cheque.js";
import { downloadDeposit, processDeposit, uploadDeposit } from "../controllers/globalControllers/deposit.js";
import { downloadJournal, processJournal, uploadJournal } from "../controllers/globalControllers/journal.js";
import { downloadCreditCardCharge, processCreditCardCharge, uploadCreditCardCharge } from "../controllers/globalControllers/creditCardCharge.js";
import { downloadTransfer, processTransfer, uploadTransfer } from "../controllers/globalControllers/transfer.js";
import { downloadBillPayment, processBillPayment, uploadBillPayment } from "../controllers/globalControllers/billPayment.js";
import { downloadInvoicePayment, processInvoicePayment, uploadInvoicePayment } from "../controllers/globalControllers/invoicePayment.js";
import { downloadBillPaymentCreditCard, processBillPaymentCreditCard, uploadBillPaymentCreditCard } from "../controllers/globalControllers/billPaymentCreditCard.js";
import { downloadJournalEntry, processJournalEntry, uploadJournalEntry } from "../controllers/globalControllers/journalEntry.js";
import { downloadEstimates, processEstimates, uploadEstimates } from "../controllers/globalControllers/estimates.js";
import{ downloadPurchaseOrder, processPurchaseOrder, uploadPurchaseOrder } from "../controllers/globalControllers/purchaseOrder.js"

// Utility to wrap async route handlers and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Upload routes for Global QBO data
router.post("/upload-coa", upload.single("file"), asyncHandler(uploadCoaGlobal));
router.post("/upload-customer", upload.single("file"), asyncHandler(uploadCustomerGlobal));
router.post("/upload-supplier", upload.single("file"), asyncHandler(uploadSupplierGlobal));
router.post("/upload-class", upload.single("file"), asyncHandler(uploadClass));
router.post("/upload-item", upload.single("file"), asyncHandler(uploadItem));
router.post("/upload-trackeditem", upload.single("file"), asyncHandler(uploadtrackedItem));
router.post("/upload-openar", upload.single("file"), asyncHandler(uploadOpenAR));
router.post("/upload-openap", upload.single("file"), asyncHandler(uploadOpenAP));
router.post("/upload-invoice", upload.single("file"), asyncHandler(uploadInvoice));
router.post("/upload-adjustmentnote", upload.single("file"), asyncHandler(uploadAdjustmentNote));
router.post("/upload-bill", upload.single("file"), asyncHandler(uploadBill));
router.post("/upload-suppliercredit", upload.single("file"), asyncHandler(uploadSupplierCredit));
router.post("/upload-cheque", upload.single("file"), asyncHandler(uploadCheque));
router.post("/upload-deposit", upload.single("file"), asyncHandler(uploadDeposit));
router.post("/upload-journal", upload.single("file"), asyncHandler(uploadJournal));
router.post("/upload-creditcardcharge", upload.single("file"), asyncHandler(uploadCreditCardCharge));
router.post("/upload-transfer", upload.single("file"), asyncHandler(uploadTransfer));
router.post("/upload-billpayment", upload.single("file"), asyncHandler(uploadBillPayment));
router.post("/upload-invoicepayment", upload.single("file"), asyncHandler(uploadInvoicePayment));
router.post("/upload-billpaymentcreditcard", upload.single("file"), asyncHandler(uploadBillPaymentCreditCard));
router.post("/upload-openingbalance", upload.single("file"), asyncHandler(uploadOpeningBalance));
router.post("/upload-journalentry", upload.single("file"), asyncHandler(uploadJournalEntry));
router.post("/upload-estimates", upload.single("file"), asyncHandler(uploadEstimates));
router.post("/upload-purchaseorder", upload.single("file"), asyncHandler(uploadPurchaseOrder));

// Convert routes for Global QBO data
router.post("/process-coa", asyncHandler(processCoaGlobal));
router.post("/process-customer", asyncHandler(processCustomerGlobal));
router.post("/process-supplier", asyncHandler(processSupplierGlobal));
router.post("/process-class", asyncHandler(processClass));
router.post("/process-item", asyncHandler(processItem));
router.post("/process-trackeditem", asyncHandler(processtrackedItem));
router.post("/process-openar", asyncHandler(processOpenAR));
router.post("/process-openap", asyncHandler(processOpenAR));
router.post("/process-invoice", asyncHandler(processMultiCurrencyInvoice));
router.post("/process-adjustmentnote", asyncHandler(processAdjustmentNote));
router.post("/process-bill", asyncHandler(processMultiCurrencyBill));
router.post("/process-suppliercredit", asyncHandler(processSupplierCredit));
router.post("/process-cheque", asyncHandler(processCheque));
router.post("/process-deposit", asyncHandler(processDeposit));
router.post("/process-journal", asyncHandler(processJournal));
router.post("/process-creditcardcharge", asyncHandler(processCreditCardCharge));
router.post("/process-transfer", asyncHandler(processTransfer));
router.post("/process-billpayment", asyncHandler(processBillPayment));
router.post("/process-invoicepayment", asyncHandler(processInvoicePayment));
router.post("/process-billpaymentcreditcard", asyncHandler(processBillPaymentCreditCard));
router.post("/process-openingbalance", asyncHandler(processOpeningBalance));
router.post("/process-journalentry", asyncHandler(processJournalEntry));
router.post("/process-estimates", asyncHandler(processEstimates));
router.post("/process-purchaseorder", asyncHandler(processPurchaseOrder));


// Download routes for Global QBO data
router.get("/download-coa", asyncHandler(downloadCoaGlobal));
router.get("/download-customer", asyncHandler(downloadCustomerGlobal));
router.get("/download-supplier", asyncHandler(downloadSupplierGlobal));
router.get("/download-class", asyncHandler(downloadClass));
router.get("/download-item", asyncHandler(downloadItem));
router.get("/download-trackeditem", asyncHandler(downloadtrackedItem));
router.get("/download-openar", asyncHandler(downloadOpenAR));
router.get("/download-openap", asyncHandler(downloadOpenAP));
router.get("/download-invoice", asyncHandler(downloadInvoice));
router.get("/download-adjustmentnote", asyncHandler(downloadAdjustmentNote));
router.get("/download-bill", asyncHandler(downloadBill));
router.get("/download-suppliercredit", asyncHandler(downloadSupplierCredit));
router.get("/download-cheque", asyncHandler(downloadCheque));
router.get("/download-deposit", asyncHandler(downloadDeposit));
router.get("/download-journal", asyncHandler(downloadJournal));
router.get("/download-creditcardcharge", asyncHandler(downloadCreditCardCharge));
router.get("/download-transfer", asyncHandler(downloadTransfer));
router.get("/download-billpayment", asyncHandler(downloadBillPayment));
router.get("/download-invoicepayment", asyncHandler(downloadInvoicePayment));
router.get("/download-billpaymentcreditcard", asyncHandler(downloadBillPaymentCreditCard));
router.get("/download-openingbalance", asyncHandler(downloadOpeningBalance));
router.get("/download-journalentry", asyncHandler(downloadJournalEntry));
router.get("/download-estimates", asyncHandler(downloadEstimates));
router.get("/download-purchaseorder", asyncHandler(downloadPurchaseOrder));


export default router;
