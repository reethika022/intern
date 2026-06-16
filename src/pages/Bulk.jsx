import { useState } from "react";
import { Plus, Send, Download, FileSpreadsheet, AlertCircle, FileText, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { useAuthStore } from "../store/authStore";
import { bulk } from "../data/mockData";

// Define the template headers matching the Excel screenshot columns exactly
const TEMPLATE_HEADERS = [
  "batch id",
  "Intern Name",
  "qualification",
  "phone number",
  "Mandal",
  "District"
];



// Mock details mapping for existing batches
const initialBatchDetails = {
  "B-001": [
    { name: "Ravi Kumar", phone: "98765 23014", village: "Narsapur", crop: "Paddy", status: "Active" },
    { name: "Anitha Reddy", phone: "99887 44120", village: "Moinabad", crop: "Cotton", status: "Pending" },
    { name: "Suresh Naik", phone: "91234 88901", village: "Kothapally", crop: "Chilli", status: "Approved" },
    { name: "Lakshmi Bai", phone: "90123 67012", village: "Mallapur", crop: "Maize", status: "Active" },
  ],
  "B-002": [
    { farmer: "Ravi Kumar", product: "BioRoot Plus", crop: "Paddy", date: "2026-06-01", status: "In Progress" },
    { farmer: "Anitha Reddy", product: "Pulse Zinc", crop: "Cotton", date: "2026-06-02", status: "Pending" },
    { farmer: "Suresh Naik", product: "GreenShield", crop: "Chilli", date: "2026-06-03", status: "Completed" },
  ],
  "B-003": [
    { name: "Sri Sai Agro Agencies", location: "Chevella", visitDate: "2026-06-01", status: "Completed" },
    { name: "Kisan Mitra Inputs", location: "Moinabad", visitDate: "2026-06-02", status: "In Progress" },
    { name: "Green Valley Traders", location: "Shadnagar", visitDate: "2026-06-04", status: "Pending" },
  ],
  "B-004": [
    { title: "Paddy field visit", type: "Farmer", linked: "F-1001", uploaded: "Today" },
    { title: "Before application", type: "Demo", linked: "D-4101", uploaded: "Yesterday" },
    { title: "Leaf curl evidence", type: "Issue", linked: "I-301", uploaded: "Jun 3" },
  ]
};

// Simple quote-safe CSV string parser
const parseCSV = (text) => {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) return { headers: [], rows: [] };
  
  // Parse headers: clean quotes
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let fields = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField.trim().replace(/^["']|["']$/g, ''));
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim().replace(/^["']|["']$/g, ''));
    
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = fields[index] || '';
    });
    rows.push(rowObj);
  }
  
  return { headers, rows };
};

const normalizeHeader = (h) => h.toLowerCase().trim().replace(/[\s_-]/g, "");

const getRowValue = (row, key) => {
  const normKey = normalizeHeader(key);
  const foundKey = Object.keys(row).find(k => normalizeHeader(k) === normKey);
  return foundKey ? row[foundKey] : "";
};

// Validate CSV headers with prefix/substring matching to account for Excel column truncation
const validateCSVHeaders = (uploadedHeaders) => {
  const missing = [];
  const normalizedUploaded = uploadedHeaders.map(normalizeHeader);

  TEMPLATE_HEADERS.forEach((col) => {
    const normCol = normalizeHeader(col);
    // An uploaded header is valid if it is a prefix of or equals the template column
    const exists = normalizedUploaded.some(
      upCol => upCol.startsWith(normCol) || normCol.startsWith(upCol) || upCol === normCol
    );
    if (!exists) {
      missing.push(col);
    }
  });

  return {
    isValid: missing.length === 0,
    missing
  };
};


export function Bulk() {
  const [open, setOpen] = useState(false);
  const [bulkUploads, setBulkUploads] = useState(bulk);
  const [selectedBatchId, setSelectedBatchId] = useState(bulk[0]?.id || "");
  const [batchDetails, setBatchDetails] = useState(initialBatchDetails);
  
  const user = useAuthStore((state) => state.user);


  
  // File Upload States
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Main table column configuration
  const columns = [
    { accessorKey: "id", header: "Batch ID" },
    { accessorKey: "internName", header: "Intern Name" },
    { accessorKey: "type", header: "Upload Type" },
    { 
      accessorKey: "quantity", 
      header: "Quantity",
      cell: ({ getValue }) => <span className="font-semibold text-slate-900">{getValue()} items</span>
    },
    { accessorKey: "mandal", header: "Mandal" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBatchId(row.original.id);
          }}
          className="text-xs font-bold text-pulse-primary hover:text-emerald-700 flex items-center gap-1 transition"
        >
          Inspect <ChevronRight className="h-3 w-3" />
        </button>
      )
    }
  ];

  // Helper to trigger Excel template download
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.setAttribute("href", "/bulk_import_format.xlsx");
    link.setAttribute("download", "bulk_import_format.xlsx");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel template download started!");
  };

  // FileReader CSV processor
  const processCSVFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Accept only CSV
    if (!selectedFile.name.endsWith('.csv')) {
      setValidationError("Invalid file extension. Please upload a spreadsheet saved as a .csv file.");
      toast.error("Format error: Only .csv files are supported");
      setFile(null);
      setParsedRows([]);
      return;
    }

    setFile(selectedFile);
    setValidationError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const { headers, rows } = parseCSV(text);

      if (headers.length === 0) {
        setValidationError("The uploaded CSV file appears to be empty.");
        return;
      }

      // Format validation matching picture
      const validation = validateCSVHeaders(headers);
      if (!validation.isValid) {
        setValidationError(`Format mismatch. The following columns are missing in your sheet: ${validation.missing.join(', ')}`);
        toast.error("Format Validation Failed");
        setParsedRows([]);
      } else {
        setParsedRows(rows);
        toast.success(`Verified! Format matches template. Parsed ${rows.length} rows.`);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCSVFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processCSVFile(e.target.files[0]);
    }
  };

  // Handle new bulk submission
  const handleSubmitUpload = (e) => {
    e.preventDefault();

    if (parsedRows.length === 0) {
      toast.error("Please upload a valid CSV file before submitting.");
      return;
    }

    // Group rows by batch id
    const grouped = {};
    parsedRows.forEach((row) => {
      const rawBatchId = getRowValue(row, "batch id");
      const batchId = rawBatchId ? rawBatchId.trim() : `B-0${bulkUploads.length + 1}`;
      if (!grouped[batchId]) {
        grouped[batchId] = [];
      }
      grouped[batchId].push(row);
    });

    const newUploads = Object.keys(grouped).map((batchId) => {
      const rows = grouped[batchId];
      const firstRow = rows[0];
      const internName = getRowValue(firstRow, "Intern Name") || user?.name || "Uma Reethika";
      const mandal = getRowValue(firstRow, "Mandal") || "Chevella";
      const district = getRowValue(firstRow, "District") || "";
      const date = new Date().toISOString().split('T')[0];

      return {
        id: batchId,
        internName,
        type: "Interns",
        quantity: rows.length,
        mandal,
        district,
        date,
        status: "Completed"
      };
    });

    setBulkUploads(prev => [...newUploads, ...prev]);

    // Store details locally for details rendering
    const nextDetails = { ...batchDetails };
    Object.keys(grouped).forEach((batchId) => {
      const rows = grouped[batchId];
      nextDetails[batchId] = rows.map((row) => ({
        name: getRowValue(row, "Intern Name") || "Unknown",
        qualification: getRowValue(row, "qualification") || "N/A",
        phone: getRowValue(row, "phone number") || "N/A",
        mandal: getRowValue(row, "Mandal") || "",
        district: getRowValue(row, "District") || "",
      }));
    });
    setBatchDetails(nextDetails);

    toast.success("Bulk registrations imported and logged successfully!");
    
    // Auto-select the first imported batch
    if (newUploads.length > 0) {
      setSelectedBatchId(newUploads[0].id);
    }
    setOpen(false);

    // Reset uploader states
    setFile(null);
    setParsedRows([]);
    setValidationError(null);
  };

  // Get records details to display at bottom
  const selectedBatch = bulkUploads.find(b => b.id === selectedBatchId);
  const selectedDetails = batchDetails[selectedBatchId] || [];

  return (
    <>
      <PageHeader 
        title="Bulk Import" 
        description="Download spreadsheet templates, upload CSV data, and inspect imported operations batches."
        actions={
          <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Bulk Upload
          </Button>
        }
      />

      <div className="grid gap-6">
        {/* Master: Upload Batches Table */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Upload Batches</h2>
          <DataTable 
            data={bulkUploads} 
            columns={columns} 
            onRowClick={(row) => setSelectedBatchId(row.id)}
            selectedRowId={selectedBatchId}
          />
        </div>

        {/* Detail: Records Inspector */}
        {selectedBatch && (
          <Card className="border border-pulse-border shadow-md">
            <CardHeader className="bg-slate-50 border-b border-pulse-border py-4">
              <CardTitle className="text-base font-bold text-slate-800 flex justify-between items-center flex-wrap gap-2">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pulse-primary" />
                  Inspect Batch: {selectedBatchId} ({selectedBatch.type})
                </span>
                <span className="text-xs font-normal text-pulse-muted">
                  Uploaded by <span className="font-semibold text-slate-700">{selectedBatch.internName}</span> on {selectedBatch.date}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {selectedDetails.length > 0 ? (
                <div className="table-scroll overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100/60 text-xs uppercase text-pulse-muted font-bold">
                      <tr>
                        {selectedBatch.type === "Employees" ? (
                          <>
                            <th className="px-4 py-3">Full Name</th>
                            <th className="px-4 py-3">Email Address</th>
                            <th className="px-4 py-3">Designation</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Joining Date</th>
                            <th className="px-4 py-3 text-center">Status</th>
                          </>
                        ) : selectedBatch.type === "Interns" ? (
                          <>
                            <th className="px-4 py-3">Intern Name</th>
                            <th className="px-4 py-3">Qualification</th>
                            <th className="px-4 py-3">Phone Number</th>
                            <th className="px-4 py-3">Mandal</th>
                            <th className="px-4 py-3">District</th>
                          </>
                        ) : selectedBatch.type === "Farmers" ? (
                          <>
                            <th className="px-4 py-3">Farmer Name</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Mandal</th>
                            <th className="px-4 py-3">Preferred Crop</th>
                            <th className="px-4 py-3 text-center">Status</th>
                          </>
                        ) : selectedBatch.type === "Demos" ? (
                          <>
                            <th className="px-4 py-3">Farmer</th>
                            <th className="px-4 py-3">Product Applied</th>
                            <th className="px-4 py-3">Crop</th>
                            <th className="px-4 py-3">Launch Date</th>
                            <th className="px-4 py-3 text-center">Status</th>
                          </>
                        ) : selectedBatch.type === "Dealers" ? (
                          <>
                            <th className="px-4 py-3">Dealer Shop</th>
                            <th className="px-4 py-3">Territory</th>
                            <th className="px-4 py-3">Last Visit</th>
                            <th className="px-4 py-3 text-center">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Linked ID</th>
                            <th className="px-4 py-3">Upload Time</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          {selectedBatch.type === "Employees" ? (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                              <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{item.email}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.designation}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.phone}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.joiningDate}</td>
                              <td className="px-4 py-2.5 text-center"><StatusBadge value={item.status} /></td>
                            </>
                          ) : selectedBatch.type === "Interns" ? (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.qualification}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.phone}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.mandal}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.district}</td>
                            </>
                          ) : selectedBatch.type === "Farmers" ? (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.phone}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.village}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.crop}</td>
                              <td className="px-4 py-2.5 text-center"><StatusBadge value={item.status} /></td>
                            </>
                          ) : selectedBatch.type === "Demos" ? (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.farmer}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.product}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.crop}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.date}</td>
                              <td className="px-4 py-2.5 text-center"><StatusBadge value={item.status} /></td>
                            </>
                          ) : selectedBatch.type === "Dealers" ? (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.location}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.visitDate}</td>
                              <td className="px-4 py-2.5 text-center"><StatusBadge value={item.status} /></td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-2.5 font-medium text-slate-800">{item.title}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.type}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.linked}</td>
                              <td className="px-4 py-2.5 text-slate-600">{item.uploaded}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-pulse-muted text-center py-6">No detailed records mapped for this batch type.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Bulk Upload Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Import New Bulk Upload">
        <form className="grid gap-4" onSubmit={handleSubmitUpload}>
          <div className="grid gap-3 border border-pulse-border p-4 bg-slate-50/50 rounded-xl mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Upload Spreadsheet (.csv)</span>
              <a
                href="/bulk_import_format.xlsx"
                download="bulk_import_format.xlsx"
                className="text-xs text-pulse-primary hover:text-emerald-700 font-bold flex items-center gap-1 bg-white px-2.5 py-1 border border-pulse-border rounded-lg shadow-sm"
              >
                <Download className="h-3.5 w-3.5" /> Download Excel Template
              </a>
            </div>

            {/* Drag and Drop Zone */}
            <div
              className={`flex flex-col min-h-32 items-center justify-center rounded-xl border border-dashed text-center px-4 py-6 transition cursor-pointer relative ${
                dragActive 
                  ? "border-pulse-primary bg-emerald-500/5" 
                  : file 
                    ? "border-emerald-300 bg-emerald-50/20" 
                    : "border-slate-300 bg-white hover:border-pulse-primary hover:bg-slate-50"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-7 w-7 text-pulse-primary mb-2" />
                  <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                  <p className="text-xs text-pulse-muted mt-1">{(file.size / 1024).toFixed(1)} KB • Click or drag to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className="h-7 w-7 text-pulse-muted mb-2" />
                  <p className="text-sm font-medium text-slate-700">Drag & drop your CSV file here</p>
                  <p className="text-xs text-pulse-muted mt-1">Accepts spreadsheet saved as .csv format only</p>
                </div>
              )}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Validation Feedback */}
            {validationError && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs leading-normal">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>{validationError}</p>
              </div>
            )}

            {parsedRows.length > 0 && (
              <div className="bg-emerald-50/40 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4 text-pulse-primary" />
                  Format Verified: {parsedRows.length} records parsed
                </div>
                
                {/* Miniature Data Preview */}
                <div className="mt-2 border border-emerald-100 rounded bg-white overflow-hidden max-h-28 overflow-y-auto">
                  <table className="w-full text-left text-[10px] text-slate-700">
                    <thead className="bg-slate-50 font-bold border-b border-emerald-50">
                      <tr>
                        <th className="px-2 py-1">Batch ID</th>
                        <th className="px-2 py-1">Intern Name</th>
                        <th className="px-2 py-1">Qualification</th>
                        <th className="px-2 py-1">Phone Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 3).map((r, i) => (
                        <tr key={i} className="border-b border-slate-50">
                          <td className="px-2 py-1 font-semibold truncate max-w-[80px]">{getRowValue(r, "batch id")}</td>
                          <td className="px-2 py-1 truncate max-w-[100px]">{getRowValue(r, "Intern Name")}</td>
                          <td className="px-2 py-1 text-slate-500 truncate max-w-[80px]">{getRowValue(r, "qualification")}</td>
                          <td className="px-2 py-1 text-slate-500 truncate max-w-[80px]">{getRowValue(r, "phone number")}</td>
                        </tr>
                      ))}
                      {parsedRows.length > 3 && (
                        <tr>
                          <td colSpan={4} className="px-2 py-1 text-center bg-slate-50 text-[9px] text-pulse-muted font-semibold">
                            + {parsedRows.length - 3} more records...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit Import
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
