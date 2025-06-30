import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { FaFolderOpen, FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { FaDownload, FaTrash } from 'react-icons/fa';

const functionRoutesForQboToQbo = {
  Masters: {
    "Charts of Account": 'coa',// QBO to QBO
    "Customer": 'customer',// QBO to QBO
    "Supplier": 'supplier',// QBO to QBO
    "Class": 'class',// QBO to QBO
    "Items": 'item',// QBO to QBO
    "Tracked Item": "trackeditem", // QBO to QBO
  },
  "Open Data": {
    "Open AR": 'openar',// QBO to QBO
    "Open AP": 'openap', // QBO to QBO
    "Opening Balance": "openingbalance" // QBO to QBO
  },
  Transaction: {
    "Invoice": 'invoice', // QBO to QBO
    "Adjustment Note": 'adjustmentnote',  // QBO to QBO
    "Bill": "bill", // QBO to QBO
    "Supplier Credit": "suppliercredit",  // QBO to QBO
    "Cheque": "cheque", // QBO to QBO
    "Deposit": "deposit", // QBO to QBO
    "Journal": "journal", // QBO to QBO
    "Credit Card Charge (Expense)": "creditcardcharge", // QBO to QBO
    "Transfer": "transfer", // QBO to QBO
    "Bill Payment": "billpayment",  // QBO to QBO
    "Invoice Payment": "invoicepayment",  // QBO to QBO
    "Bill Payment Credit Card": "billpaymentcreditcard",  // QBO to QBO
    "Journal Entry": "journalentry", // QBO to QBO
    "Estimates": "estimates", // QBO to QBO
    "Purchase Order": "purchaseorder", // QBO to QBO
  },
};
const functionRoutesForReckonToXero = {
  Masters: {
    "Chart of Accounts": 'chartofaccounts', // Reckon to Xero
    "Customer Master": 'customermaster', // Reckon to Xero
    "Vendor Master": 'vendormaster', // Reckon to Xero
    "Item Master": 'itemmaster', // Reckon to Xero
    "Tracking Class": 'trackingclass', // Reckon to Xero
  },
  "Open Data": {
    "AR(Open invoices)": 'aropeninvoices', //Reckon to Xero
    "AP(Open Bills)": 'apopenbills', //Reckon to Xero
  },
  Transaction: {
    "Invoice": 'invoice',// Reckon to Xero
    "Adjustment Note": 'adjustmentnote',// Reckon to Xero
    "Bill": "bill",// Reckon to Xero
    "Bill credit": "billcredit",// Reckon to Xero
    "Sales Receipt": "salesreceipt",// Reckon to Xero
    "Manual Journal": "manualjournal",// Reckon to Xero
    "Spend money": "spendmoney",// Reckon to Xero
    "Receive money": "receivemoney",// Reckon to Xero
    "Invoice Payment": "invoicepayment",// Reckon to Xero
    "Bill Payment": "billpayment",// Reckon to Xero
    "Paycheque": "paycheque",// Reckon to Xero
    "Liability Cheque": "liabilitycheque",// Reckon to Xero
    "Inventory Adjust": "inventoryadjust",// Reckon to Xero
    "Conversion Balance": "conversionbalance",// Reckon to Xero
    "Receive OverPayment Money": "receiveoverpaymentmoney",// Reckon to Xero
    "Spend OverPayment Money": "spendoverpaymentmoney", // Reckon to Xero
    Transfer: "transfer", // Reckon to Xero
  },
};
const functionRoutesForXeroToXero = {
  Masters: {},
  "Open Data": {},
  Transaction: {}
};
const functionRoutesForSageOneToQbo = {
  Masters: {
    "Chart of Accounts": "coa",
  },
  "Open Data": {},
  Transaction: {}
};
const sectionKeyMap = {
  masters: "Masters",
  openData: "Open Data",
  transaction: "Transaction",
};

const sectionsForQboToQbo = {
  masters: ["Charts of Account", "Customer", "Supplier", "Class", "Items", "Tracked Item"], // QBO to QBO
  openData: ["Open AR", "Open AP", "Opening Balance"],  // QBO to QBO
  transaction: [
    "Invoice", "Adjustment Note", "Bill", "Supplier Credit", "Cheque", "Deposit", "Journal",
    "Credit Card Charge (Expense)", "Transfer", "Bill Payment", "Invoice Payment", "Bill Payment Credit Card",
    "Journal Entry", "Estimates", "Purchase Order"
  ],  // QBO to QBO
};
const sectionsForReckonToXero = {
  masters: ["Chart of Accounts", "Customer Master", "Vendor Master", "Item Master", "Tracking Class"],  // Reckon to Xero
  openData: ["AR(Open invoices)", "AP(Open Bills)"],  // Reckon to Xero
  transaction: ["Invoice", "Adjustment Note", "Bill", "Bill credit", "Sales Receipt", "Manual Journal", "Spend money", "Receive money",
    "Invoice Payment", "Bill Payment", "Paycheque", "Liability Cheque", "Inventory Adjust", "Conversion Balance", "Receive OverPayment Money",
    "Spend OverPayment Money", "Transfer"
  ],  // Reckon to Xero
};
const sectionsForXeroToXero = {
  masters: ["Chart of Accounts", "Customer Master", "Vendor Master", "Item Master", "Job/Tracking Class"],  // Xero to Xero
  openData: ["AR", "AP"], // Xero to Xero
  transaction: ["Invoice", "Credit note", "Manual Journal", "Spend money", "Receive money", "Bill payment", "Transfer", "Bill-Direct",
    "Auth Bill", "Paid-Bill", "Paid-Invoice", "Auth Invoice", "Invoice payment", "Paid credit note", "Auth Credit note", "Auth bill credit",
    "Paid bill credit", "Conversion balance"],  // Xero to Xero
};

const sectionsForSageOneToQbo = {
  masters: ["Chart of Accounts", "Customer Master", "Vendor Master", "Item Master"],  // Sage One to QBO
  openData: ["Opening balance"],  // Sage One to QBO
  transaction: ["Customer Balances - Days Outstanding", "Supplier Balances - Days Outstanding", "Tax invoice", "Credit note",
    "Supplier invoice", "Supplier Return", "Account payment", "Account Receipt", "Supplier payment", "Customer Receipt",
    "Journal Entry", "Vat payment", "Supplier Adjustment", "Customer Adjustment", "Customer Write-Off", "Transfer In",
    "Transfer Out"], // Sage One to QBO
};

const FileView = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const file = state?.file;

  const countryRouteMap = {
    "Australia": "australia",
    "Global": "global",
  };

  const rawCountry = file?.countryName?.trim();
  const softwareType = file?.softwareType?.toLowerCase().replace(/\s+/g, '');
  const countryRoute = countryRouteMap[rawCountry] || rawCountry?.toLowerCase().replace(/\s+/g, '');
  const combinedRoutePrefix = `excel-${countryRoute}-${softwareType}`;

  const [openSection, setOpenSection] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [convertComplete, setConvertComplete] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedSoftware, setSelectedSoftware] = useState("qbotoqbo");

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const getCurrentSections = (softwareType) => {
    if (softwareType === 'qbotoqbo') return sectionsForQboToQbo;
    if (softwareType === 'reckondesktop/hostedtoxero') return sectionsForReckonToXero;
    if (softwareType === 'xerotoxero') return sectionsForXeroToXero;
    if (softwareType === 'sageonetoqbo') return sectionsForSageOneToQbo;
    return sectionsForQboToQbo;
  };

  const getCurrentFunctionRoutes = (softwareType) => {
    if (softwareType === 'qbotoqbo') return functionRoutesForQboToQbo;
    if (softwareType === 'reckondesktop/hostedtoxero') return functionRoutesForReckonToXero;
    if (softwareType === 'xerotoxero') return functionRoutesForXeroToXero;
    if (softwareType === 'sageonetoqbo') return functionRoutesForSageOneToQbo;
    return functionRoutesForQboToQbo;
  };

  // In the component definition (FileView), add this above all function usages:
  const currentSections = getCurrentSections(softwareType);
  const currentFunctionRoutes = getCurrentFunctionRoutes(softwareType);

  // Update renderSection function:
  const renderSection = (name, label) => (
    <div key={name}>
      <button
        className="w-full flex items-center justify-between py-2 mt-4 text-left font-semibold text-white hover:text-blue-300"
        onClick={() => {
          setOpenSection(openSection === name ? '' : name);
          setSelectedSection(sectionKeyMap[name]);
        }}
      >
        <div className="flex items-center gap-2">
          <FaFolderOpen /> {label}
        </div>
        {openSection === name ? <FaChevronDown /> : <FaChevronRight />}
      </button>
      {openSection === name && (
        <ul className="pl-6 text-sm font-semibold space-y-2 mt-1">
          {currentSections[name].map((item) => (
            <li
              key={item}
              className={`cursor-pointer px-2 py-1 rounded transition-colors ${selectedFunction === item ? 'bg-blue-600 text-white' : 'hover:bg-[#1c2a4d] hover:text-white text-gray-300'}`}
              onClick={() => handleFunctionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  const getAcceptedFileTypes = (softwareType, selectedFunction) => {
    const csvFunctionsForXeroToXero = ["Chart of Accounts", "Customer Master", "Vendor Master", "Item Master", "Job/Tracking Class", "Conversion balance"];
    // const csvFunctionsForSageOneToQbo = ["Chart of Accounts","Customer Master","Vendor Master","Item Master"]; 

    const type = softwareType?.toLowerCase();

    if (type === 'qbotoqbo') return '.xlsx,.xls';
    if (type === 'reckondesktop/hostedtoxero') return '.csv';
    if (type === 'sageonetoqbo') return '.xlsx,.xls';
    if (type === 'xerotoxero') {
      return csvFunctionsForXeroToXero.includes(selectedFunction) ? '.csv' : '.xlsx,.xls';
    }
    // if (type === 'sageonetoqbo') {
    //   return csvFunctionsForSageOneToQbo.includes(selectedFunction) ? '.csv' : '.xlsx,.xls';
    // }
    return '.xlsx,.xls';
  };


  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/files/${file._id}`);
      if (!res.ok) throw new Error("File not found or server error");

      const data = await res.json();
      setHistoryData(data.downloadedSheets || []);
    } catch (error) {
      console.error("Failed to fetch history:", error.message);
      toast.error("Unable to fetch download history.");
    }
  };
  const handleHistoryDownload = async (entry) => {
    const currencyPath = getCurrencyPath();

    try {
      // `entry.routeUsed` is something like 'invoice' — no need to strip anything
      const route = entry.routeUsed;

      const response = await fetch(`/api/${combinedRoutePrefix}/${currencyPath}/download-${route}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Recreate filename if it's missing
      const fileName = entry.fileName || `${file?.fileName || 'Export'}__${route}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Downloaded again");
    } catch (error) {
      toast.error("Download failed");
      console.error("Error in handleHistoryDownload:", error);
    }
  };


  const handleHistoryDelete = async (index) => {
    try {
      const res = await fetch(`/api/files/${file._id}/delete-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Entry deleted");
      fetchHistory(); // refresh list
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };



  const handleFunctionClick = (func) => {
    const sectionName = sectionKeyMap[openSection];
    setSelectedSection(sectionName);
    setSelectedFunction(func);
    setSelectedFile(null);
    setCurrencyCode('');
    setUploadComplete(false);
    setConvertComplete(false);
    setDownloadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Get accepted types string, like '.csv' or '.xlsx,.xls'
  //   const acceptedTypes = getAcceptedFileTypes(softwareType, selectedFunction);

  //   // Convert acceptedTypes string to an array of extensions without dots, e.g. ['csv'] or ['xlsx', 'xls']
  //   const acceptedExtensions = acceptedTypes.split(',').map(ext => ext.trim().replace('.', '').toLowerCase());

  //   // Get uploaded file extension
  //   const fileExtension = file.name.split('.').pop().toLowerCase();

  //   if (!acceptedExtensions.includes(fileExtension)) {
  //     toast.error(`Invalid file type. Please upload a valid file: ${acceptedTypes}`);
  //     setSelectedFile(null);
  //     return;
  //   }

  //   setSelectedFile(file);
  //   setUploadComplete(false);
  //   setConvertComplete(false);
  //   setDownloadComplete(false);
  // };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedFunction('');
    setCurrencyCode('');
    setSelectedFile(null);
    setUploadComplete(false);
    setConvertComplete(false);
    setDownloadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };


  const getCurrencyPath = () => {
    if (file?.currencyStatus?.toLowerCase() === 'multi currency') {
      return 'multicurrency';
    }
    return 'singlecurrency';
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedFunction || !selectedSection || !countryRoute) return;
    const route = currentFunctionRoutes[selectedSection]?.[selectedFunction];
    if (!route) return;

    const currencyPath = getCurrencyPath(); // 🔁 New logic

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("currencyCode", currencyCode); // 👈 only used if applicable

    try {
      const response = await fetch(`/api/${combinedRoutePrefix}/${currencyPath}/upload-${route}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");

      setUploadComplete(true);
      toast.success("Uploaded successfully");
    } catch (error) {
      toast.error("Upload error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    const route = currentFunctionRoutes[selectedSection]?.[selectedFunction];
    if (!route || !countryRoute) return;

    const currencyPath = getCurrencyPath(); // 🔁 New logic

    setLoading(true);
    try {
      const response = await fetch(`/api/${combinedRoutePrefix}/${currencyPath}/process-${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currencyCode })
      });

      if (!response.ok) throw new Error("Conversion failed");

      setConvertComplete(true);
      toast.success("Converted successfully");
    } catch (error) {
      toast.error("Conversion error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = async () => {
    const route = currentFunctionRoutes[selectedSection]?.[selectedFunction];
    if (!route || !countryRoute) return;

    const currencyPath = getCurrencyPath(); // 🔁 New logic

    setLoading(true);
    try {
      const response = await fetch(`/api/${combinedRoutePrefix}/${currencyPath}/download-${route}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const isoDate = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}__${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

      const sanitize = (str) => (str || "Unknown").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
      const namePart = sanitize(file?.fileName);
      const softwarePart = sanitize(file?.softwareType);
      const countryPart = sanitize(file?.countryName);
      const routePart = sanitize(route);

      const fileName = `${namePart}__${softwarePart}__${countryPart}__${routePart}__${isoDate}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      await fetch(`/api/files/${file._id}/save-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, routeUsed: route })
      });

      setDownloadComplete(true);
      toast.success("Downloaded successfully");
    } catch (error) {
      toast.error("Download error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const sageHandleUpload = () => { console.log("Sage Upload"); };
  const sageHandleConvert = () => { console.log("Sage Convert"); };
  const sageHandleDownload = () => { console.log("Sage Download"); };

  const reckonHandleUpload = () => { console.log("Reckon Upload"); };
  const reckonHandleConvert = () => { console.log("Reckon Convert"); };
  const reckonHandleDownload = () => { console.log("Reckon Download"); };

  const xeroHandleUpload = () => { console.log("Xero Upload"); };
  const xeroHandleConvert = () => { console.log("Xero Convert"); };
  const xeroHandleDownload = () => { console.log("Xero Download"); };
  const functionMap = {
    "qbotoqbo": {
      upload: handleUpload,
      convert: handleConvert,
      download: handleDownload,
    },
    "reckondesktop/hostedtoxero": {
      upload: reckonHandleUpload,
      convert: reckonHandleConvert,
      download: reckonHandleDownload,
    },
    "sageonetoqbo": {
      upload: sageHandleUpload,
      convert: sageHandleConvert,
      download: sageHandleDownload,
    },
    "xerotoxero": {
      upload: xeroHandleUpload,
      convert: xeroHandleConvert,
      download: xeroHandleDownload,
    },
    // Add more softwareType mappings here if needed
  };

  const multiSheetFunctions = {
    qbotoqbo: {
      'Tracking Invoice': ['Tracking Data', 'Invoice List'],
    },
    sgaeonetoqbo: {
      'Charts of account': ['Main Accounts', 'Sub Accounts', 'Account Types'],
    }
  };

  // Helper: check how many inputs are needed
  const getSheetCount = (software, func) => {
    return multiSheetFunctions[software]?.[func] || 1;
  };
  const getSheetLabels = (software, func) => {
    return multiSheetFunctions[software]?.[func] || ['Sheet 1'];
  };

  const sheetCount = getSheetCount(softwareType, selectedFunction);
  
  const sheetLabels = Array.isArray(getSheetLabels(softwareType, selectedFunction))
  ? getSheetLabels(softwareType, selectedFunction)
  : [];

  return (
    <div className="flex flex-col h-screen gradient-bg text-white overflow-hidden">
      <Toaster position="top-right" />
      <Navbar userDetail={{ name: file?.fileName, software: file?.softwareType, country: file?.countryName, currencyStatus: file?.currencyStatus }} />
      <div className="flex flex-1 overflow-hidden custom-scroll">
        {/* Sidebar */}
        <aside className="w-64 gradient-bg p-1 ml-3 border-r border-[#1c2a4d] flex flex-col overflow-y-auto h-full custom-scroll">
          <div>
            <button
              className="w-full flex items-center gap-2 text-left font-semibold text-white py-2 hover:text-gray-300"
              onClick={() => {
                fetchHistory();
                setShowHistoryModal(true);
              }}
            >
              <FaFolderOpen />
              History
            </button>
          </div>
          <div className="flex-1 custom-scroll pr-3">
            {renderSection('masters', 'Masters')}
            {renderSection('openData', 'Open Data')}
            {renderSection('transaction', 'Transaction')}
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">
              Selected Function: <span className="text-gray-300">{selectedFunction || ' '}</span>
            </h1>
            {(selectedFunction || selectedFile) && (
              <button className="text-red-400 hover:text-red-600 text-lg" onClick={handleReset} title="Clear">
                <FaTimes />
              </button>
            )}
          </div>

          {file?.currencyStatus === 'Multi Currency' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Currency Code</label>
              <input
                type="text"
                className="w-full p-2 bg-[#162447] border border-gray-500 rounded text-white"
                placeholder="Enter Currency Code (e.g., USD)"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
              />
            </div>
          )}


          {/* Upload File Label */}
          {selectedFunction && (
            <div className="mb-2 text-sm text-white font-bold">
              Upload File:__<span className="text-blue-300">{currentFunctionRoutes[selectedSection]?.[selectedFunction]}-sheet</span>
            </div>
          )}

          {/* File Upload Input */}
          {/* <div className="flex items-center w-full gap-4 mb-4">
            <input
              id="file-upload"
              type="file"
              accept={getAcceptedFileTypes(softwareType, selectedFunction)}
              onChange={handleFileChange}
              className={`w-full bg-[#162447] text-white p-2 border ${selectedFunction ? 'border-gray-500' : 'border-gray-700 opacity-60 cursor-not-allowed'} rounded`}
              disabled={!selectedFunction}
              ref={fileInputRef}
            />
          </div> */}
          <div className="w-full mb-4">
          {Array.isArray(sheetLabels) &&
            sheetLabels.map((label, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-4">
                  <input
                    id={`file-upload-${index}`}
                    type="file"
                    accept={getAcceptedFileTypes(softwareType, selectedFunction)}
                    onChange={(e) => handleFileChange(e, index)}
                    className={`w-full bg-[#162447] text-white p-2 border ${selectedFunction ? 'border-gray-500' : 'border-gray-700 opacity-60 cursor-not-allowed'
                      } rounded`}
                    disabled={!selectedFunction}
                    ref={index === 0 ? fileInputRef : null}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex gap-4">
              <button
                onClick={() => functionMap[softwareType]?.upload()}
                disabled={!selectedFile || uploadComplete || loading}
                className={`px-4 py-2 rounded text-white transition-colors ${!selectedFile || uploadComplete || loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {uploadComplete ? 'Uploaded' : loading ? 'Uploading...' : 'Upload'}
              </button>

              <button
                onClick={() => functionMap[softwareType]?.convert()}
                disabled={!uploadComplete || convertComplete || loading}
                className={`px-4 py-2 rounded text-white transition-colors ${!uploadComplete || convertComplete || loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {convertComplete ? 'Converted' : loading ? 'Converting...' : 'Convert'}
              </button>

              <button
                onClick={() => functionMap[softwareType]?.download()}
                disabled={!convertComplete || downloadComplete || loading}
                className={`px-4 py-2 rounded text-white transition-colors ${!convertComplete || downloadComplete || loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {downloadComplete ? 'Downloaded' : loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>

        </main>
      </div>

      {showHistoryModal && (
        <div className="fixed inset-0 gradient-bg bg-opacity-60 z-50 flex items-center justify-center">
          <div className="gradient-bg rounded-2xl p-6 w-[95%] max-w-3xl shadow-2xl relative border border-blue-400">
            <button
              className="absolute top-3 right-4 text-white text-xl hover:text-red-400"
              onClick={() => setShowHistoryModal(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-blue-300 pb-2 font-serif">
              {file?.fileName || 'File'} History
            </h2>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scroll">
              {historyData.length > 0 ? (
                historyData.map((entry, index) => (
                  <div
                    key={index}
                    className="gradient-bg text-white rounded-lg px-4 py-3 mb-4 flex justify-between items-center shadow-md"
                  >
                    <div>
                      <div className="font-semibold text-lg font-serif">Function: {entry.routeUsed}</div>
                      <div className="text-sm text-white">File: {entry.fileName}</div>
                      <div className="text-sm text-white">
                        Processed on {new Date(entry.downloadedAt).toISOString().split('T')[0]}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                        title="Download"
                        onClick={() => handleHistoryDownload(entry)}
                      >
                        <FaDownload />
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        title="Delete"
                        onClick={() => {
                          setDeleteIndex(index);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white">No download history available.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 gradient-bg bg-opacity-60 z-50 flex items-center justify-center">
          <div className="gradient-bg text-white rounded-xl p-6 w-full max-w-sm shadow-2xl border border-gray-300">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-sm text-white">Are you sure you want to delete this entry?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-[#0b1a4b] px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleHistoryDelete(deleteIndex);
                  setShowDeleteConfirm(false);
                  setDeleteIndex(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FileView;