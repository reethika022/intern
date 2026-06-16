import { useState, useRef } from "react";
import { 
  Download, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { 
  downloadEmployeeTemplate, 
  validateEmployeeCSV, 
  importEmployeeCSV,
  APIError 
} from "../lib/api";

const REQUIRED_HEADERS = [
  "full_name",
  "email",
  "role_designation",
  "department",
  "team_id",
  "phone",
  "emergency_phone",
  "dob",
  "gender",
  "address",
  "employment_type",
  "work_location",
  "joining_date",
  "status",
  "role",
  "reporting_manager"
];

export function BulkEmployeeRegistration() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [headerError, setHeaderError] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // { total, valid, invalid, invalidRows }
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  
  // Import process states
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatusText, setImportStatusText] = useState("Uploading...");
  const [successData, setSuccessData] = useState(null); // { total, success }
  
  const fileInputRef = useRef(null);

  // Helper: Simple CSV String Parser
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0 || !lines[0].trim()) return { headers: [], rows: [] };
    
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

  // Helper: Detailed Client-side Row Validation
  const performRowValidation = (rows) => {
    const invalidRows = [];
    const seenEmails = new Set();
    const validManagerNames = new Set([
      "Uma Reethika", "Arjun Varma", "Maya Singh", "Nikhil Rao", 
      "Operations Lead", "hasini", "harika", "Demo User", "Admin"
    ]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    const phoneRegex = /^[+]?[\d\s\-()]{7,15}$/;

    const parseDate = (str) => {
      if (!str) return null;
      const parts = str.split('-');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
      return null;
    };

    const isFuture = (str) => {
      const d = parseDate(str);
      if (!d) return false;
      return d.getTime() > Date.now();
    };

    rows.forEach((row, index) => {
      const rowNum = index + 2; // 1-indexed, +1 for header
      const errors = [];

      // Required and Empty validations
      if (!row.full_name || !row.full_name.trim()) errors.push("Missing Full Name");
      
      if (!row.email || !row.email.trim()) {
        errors.push("Missing Email");
      } else if (!emailRegex.test(row.email.trim())) {
        errors.push("Invalid Email");
      } else {
        const emailLower = row.email.trim().toLowerCase();
        if (seenEmails.has(emailLower)) {
          errors.push("Duplicate Email");
        } else {
          seenEmails.add(emailLower);
        }
      }

      if (!row.role_designation || !row.role_designation.trim()) errors.push("Missing Role Designation");
      if (!row.department || !row.department.trim()) errors.push("Missing Department");
      if (!row.team_id || !row.team_id.trim()) errors.push("Missing Team ID");
      
      if (!row.phone || !row.phone.trim()) {
        errors.push("Missing Phone");
      } else if (!phoneRegex.test(row.phone.trim())) {
        errors.push("Invalid Phone Number");
      }

      if (!row.emergency_phone || !row.emergency_phone.trim()) {
        errors.push("Missing Emergency Phone");
      } else if (!phoneRegex.test(row.emergency_phone.trim())) {
        errors.push("Invalid Emergency Phone Number");
      }

      // DOB validation
      if (!row.dob || !row.dob.trim()) {
        errors.push("Missing DOB");
      } else if (!dateRegex.test(row.dob.trim()) || !parseDate(row.dob.trim())) {
        errors.push("Invalid DOB Format (expected DD-MM-YYYY)");
      } else if (isFuture(row.dob.trim())) {
        errors.push("DOB cannot be a future date");
      }

      // Gender validation
      const allowedGenders = ["Male", "Female", "Other"];
      if (!row.gender || !row.gender.trim()) {
        errors.push("Missing Gender");
      } else if (!allowedGenders.includes(row.gender.trim())) {
        errors.push("Invalid Gender");
      }

      if (!row.address || !row.address.trim()) errors.push("Missing Address");

      // Employment Type validation
      const allowedEmpTypes = ["Full Time", "Part Time", "Contract", "Intern"];
      if (!row.employment_type || !row.employment_type.trim()) {
        errors.push("Missing Employment Type");
      } else if (!allowedEmpTypes.includes(row.employment_type.trim())) {
        errors.push("Invalid Employment Type");
      }

      // Work Location validation
      const allowedLocs = ["On Site", "Remote", "Hybrid"];
      if (!row.work_location || !row.work_location.trim()) {
        errors.push("Missing Work Location");
      } else if (!allowedLocs.includes(row.work_location.trim())) {
        errors.push("Invalid Work Location");
      }

      // Joining Date validation
      if (!row.joining_date || !row.joining_date.trim()) {
        errors.push("Missing Joining Date");
      } else if (!dateRegex.test(row.joining_date.trim()) || !parseDate(row.joining_date.trim())) {
        errors.push("Invalid Joining Date Format (expected DD-MM-YYYY)");
      } else if (isFuture(row.joining_date.trim())) {
        errors.push("Joining Date cannot be a future date");
      }

      // Status validation
      const allowedStatus = ["Active", "Inactive"];
      if (!row.status || !row.status.trim()) {
        errors.push("Missing Status");
      } else if (!allowedStatus.includes(row.status.trim())) {
        errors.push("Invalid Status");
      }

      // Role validation
      const allowedRoles = ["Admin", "Manager", "Employee", "HR"];
      if (!row.role || !row.role.trim()) {
        errors.push("Missing Role");
      } else if (!allowedRoles.includes(row.role.trim())) {
        errors.push("Invalid Role");
      }

      // Reporting Manager validation (Optional)
      if (row.reporting_manager && row.reporting_manager.trim()) {
        const mgr = row.reporting_manager.trim();
        const matchExists = Array.from(validManagerNames).some(
          name => name.toLowerCase() === mgr.toLowerCase()
        );
        if (!matchExists) {
          errors.push(`Reporting manager "${mgr}" does not exist`);
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowNum,
          error: errors.join(", "),
          originalRow: row
        });
      }
    });

    return invalidRows;
  };

  // Download Empty CSV Template (GET /api/employees/bulk/template)
  const handleDownloadTemplate = async () => {
    try {
      const templateText = await downloadEmployeeTemplate();
      triggerCSVDownload(templateText, "employee_bulk_import_template.csv");
      toast.success("CSV template downloaded!");
    } catch (err) {
      // Fallback: Generate template dynamically if backend is offline
      const headerStr = REQUIRED_HEADERS.join(",") + "\n";
      triggerCSVDownload(headerStr, "employee_bulk_import_template.csv");
      toast.success("CSV template downloaded (local fallback)!");
    }
  };

  const triggerCSVDownload = (csvText, fileName) => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag and Drop File Handlers
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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    setHeaderError(null);
    setValidationResult(null);

    // Limit format to .csv only
    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Only CSV files are allowed.");
      return;
    }

    // Maximum file size: 10 MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error("File size exceeds the 10 MB limit.");
      return;
    }

    setFile(selectedFile);
    toast.success(`File "${selectedFile.name}" selected!`);
  };

  // CSV Validation Handler
  const handleValidateFile = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsParsing(true);
    setHeaderError(null);
    setValidationResult(null);

    // Give a small delay for premium parsing UX
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const { headers, rows } = parseCSV(text);

        if (headers.length === 0) {
          setHeaderError("The uploaded CSV file is empty.");
          setIsParsing(false);
          return;
        }

        // 1. Header Validation: Compare exact names and order
        const isHeaderValid = REQUIRED_HEADERS.every((val, index) => headers[index] === val) && headers.length === REQUIRED_HEADERS.length;
        
        if (!isHeaderValid) {
          setHeaderError("Invalid CSV format. Please download and use the provided template.");
          setIsParsing(false);
          toast.error("Header format mismatch!");
          return;
        }

        // Try hitting backend validator
        try {
          const apiResult = await validateEmployeeCSV(file);
          // If API validates, use API result
          setValidationResult({
            total: apiResult.totalRecords || rows.length,
            valid: apiResult.validRecords || (rows.length - apiResult.invalidRows.length),
            invalid: apiResult.invalidRecords || apiResult.invalidRows.length,
            invalidRows: apiResult.invalidRows || []
          });
          toast.success("Validation completed by server!");
        } catch (apiErr) {
          // Local fallback: Perform full local validation on rows
          console.warn("Backend API not reachable. Using local verification engine.");
          const invalidRows = performRowValidation(rows);
          
          setValidationResult({
            total: rows.length,
            valid: rows.length - invalidRows.length,
            invalid: invalidRows.length,
            invalidRows
          });
          toast.success("Validation completed locally!");
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsText(file);
    }, 600);
  };

  // Trigger Download Error Report
  const handleDownloadErrorReport = () => {
    if (!validationResult || validationResult.invalidRows.length === 0) return;

    // Header for error report: original template headers + error_message
    const reportHeaders = [...REQUIRED_HEADERS, "error_message"];
    const reportRows = validationResult.invalidRows.map(errRow => {
      const rowCells = REQUIRED_HEADERS.map(header => {
        const cellVal = errRow.originalRow[header] || "";
        // Escape quotes
        const escaped = String(cellVal).replace(/"/g, '""');
        return escaped.includes(",") || escaped.includes('"') ? `"${escaped}"` : escaped;
      });
      // Append the error details cell
      const errEscaped = String(errRow.error).replace(/"/g, '""');
      rowCells.push(`"${errEscaped}"`);
      return rowCells.join(",");
    });

    const reportContent = [reportHeaders.join(","), ...reportRows].join("\n");
    triggerCSVDownload(reportContent, "employee_import_error_report.csv");
    toast.success("Error report CSV downloaded!");
  };

  // Trigger actual bulk import
  const handleConfirmImport = async () => {
    setImportConfirmOpen(false);
    setIsImporting(true);
    setImportProgress(0);
    setImportStatusText("Uploading...");

    // Simulate progress bar mapping to a REST request
    let progressTimer = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 95;
        }
        return prev + 5;
      });
    }, 120);

    try {
      // API call
      await importEmployeeCSV(file);
      
      clearInterval(progressTimer);
      setImportProgress(100);
      setImportStatusText("Completed!");
      
      setTimeout(() => {
        setIsImporting(false);
        setSuccessData({
          total: validationResult.total,
          success: validationResult.valid
        });
        toast.success("Import completed successfully!");
      }, 300);

    } catch (apiErr) {
      // Local fallback simulation if offline
      if (apiErr.status === 0 || apiErr.message.includes("Failed to fetch")) {
        console.warn("API Server offline. Simulating local insert...");
        
        // Let it run to 100%
        setTimeout(() => {
          clearInterval(progressTimer);
          setImportProgress(100);
          setImportStatusText("Bulk Insert completed (simulated)!");
          
          setTimeout(() => {
            setIsImporting(false);
            setSuccessData({
              total: validationResult.total,
              success: validationResult.valid
            });
            toast.success("Import completed (demo mode)!");
          }, 300);
        }, 1200);
      } else {
        // Handle actual server side error (500, etc.)
        clearInterval(progressTimer);
        setIsImporting(false);
        const code = apiErr.status || 500;
        if (code >= 500) {
          toast.error("Bulk import failed. Please contact administrator.");
        } else {
          toast.error(apiErr.message || "Unable to connect to server. Please try again.");
        }
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setValidationResult(null);
    setHeaderError(null);
    setSuccessData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Render the components
  return (
    <>
      <PageHeader 
        title="Bulk Employee Registration"
        description="Import multiple employees at once using the provided CSV template."
      />

      <div className="max-w-4xl mx-auto grid gap-6">
        
        {/* Success Card Screen */}
        {successData && (
          <Card className="border border-emerald-200 bg-emerald-50/20 shadow-lg text-center p-8 rounded-2xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">✓ Bulk Registration Completed</h2>
              <p className="text-slate-600 mt-2 text-base max-w-md">
                {successData.success} out of {successData.total} employees have been registered successfully.
              </p>
              
              <div className="flex gap-3 justify-center mt-6">
                <Button variant="secondary" onClick={handleReset}>Import Another File</Button>
                <Button 
                  onClick={() => {
                    toast.success("Opening employee list view (simulated)");
                    window.location.replace("/dashboard");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  View Employees
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!successData && (
          <>
            {/* Top Action Card */}
            <Card className="border border-pulse-border shadow-sm">
              <CardHeader className="py-4 border-b border-pulse-border">
                <CardTitle className="text-sm font-bold text-slate-700 flex justify-between items-center">
                  <span>Excel Template & File Upload</span>
                  <Button variant="ghost" size="sm" onClick={handleDownloadTemplate} className="text-pulse-primary flex items-center gap-1.5 font-bold">
                    <Download className="h-4 w-4" /> Download CSV Template
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="grid gap-6 p-6">
                {/* Drag and Drop Zone */}
                <div
                  className={`flex flex-col min-h-48 items-center justify-center rounded-2xl border-2 border-dashed text-center px-4 py-8 transition relative ${
                    dragActive 
                      ? "border-pulse-primary bg-emerald-500/5" 
                      : file 
                        ? "border-emerald-300 bg-emerald-50/10" 
                        : "border-slate-300 bg-white hover:border-pulse-primary hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet className="h-12 w-12 text-pulse-primary mb-3" />
                      <p className="text-base font-semibold text-slate-800">{file.name}</p>
                      <p className="text-xs text-pulse-muted mt-1">{(file.size / 1024).toFixed(1)} KB • Comma Separated Values</p>
                      
                      {/* Upload status */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold mt-4">
                        <CheckCircle2 className="h-3.5 w-3.5" /> File Selected
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-12 w-12 text-slate-400 mb-3" />
                      <p className="text-base font-semibold text-slate-700">Drag & drop your CSV file here</p>
                      <p className="text-xs text-pulse-muted mt-1.5">Only .csv spreadsheet formats under 10 MB supported</p>
                      
                      <div className="mt-4">
                        <Button 
                          type="button" 
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-100 hover:bg-slate-200 border-slate-300"
                        >
                          Browse File
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-not-allowed pointer-events-none"
                    disabled={isParsing || isImporting}
                  />
                </div>

                {/* Validate / Import Trigger Actions */}
                <div className="flex justify-between items-center gap-3 border-t border-slate-100 pt-4 flex-wrap">
                  <div>
                    {file && (
                      <Button variant="ghost" size="sm" onClick={handleReset} disabled={isParsing || isImporting} className="text-rose-600 hover:text-rose-700">
                        Remove File
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary"
                      onClick={handleValidateFile}
                      disabled={!file || isParsing || isImporting}
                      className="flex items-center gap-2"
                    >
                      {isParsing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Validating File...
                        </>
                      ) : (
                        "Validate File"
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => setImportConfirmOpen(true)}
                      disabled={!validationResult || validationResult.valid === 0 || isImporting}
                      className="bg-pulse-primary hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold flex items-center gap-2"
                    >
                      Import Employees
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header Error Banner */}
            {headerError && (
              <Card className="border border-rose-200 bg-rose-50/30 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
                <XCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-rose-800">CSV Header Validation Failed</p>
                  <p className="text-xs text-rose-700 mt-1">{headerError}</p>
                </div>
              </Card>
            )}

            {/* Progress Bar Loader */}
            {isImporting && (
              <Card className="border border-pulse-border p-5 rounded-xl shadow-md bg-white">
                <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-pulse-primary border-t-transparent rounded-full animate-spin" />
                    {importStatusText}
                  </span>
                  <span className="text-pulse-primary font-bold">{importProgress}%</span>
                </div>
                
                {/* Progress track */}
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-pulse-primary h-full rounded-full transition-all duration-150"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                
                <p className="text-[10px] text-pulse-muted mt-2 text-center">Uploading employee records. Do not close this browser tab.</p>
              </Card>
            )}

            {/* Validation Result Summary & Detail Table */}
            {validationResult && (
              <div className="grid gap-6 animate-fade-in">
                {/* Summary Banner Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-pulse-border p-4 rounded-xl text-center shadow-inner">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Records</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{validationResult.total}</p>
                  </div>
                  <div className="bg-emerald-50/20 border border-emerald-200 p-4 rounded-xl text-center shadow-inner">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Valid Records</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{validationResult.valid}</p>
                  </div>
                  <div className="bg-rose-50/30 border border-rose-200 p-4 rounded-xl text-center shadow-inner">
                    <p className="text-xs font-bold text-rose-500 uppercase">Invalid Records</p>
                    <p className="text-2xl font-black text-rose-700 mt-1">{validationResult.invalid}</p>
                  </div>
                </div>

                {/* Error Rows Inspection Panel */}
                {validationResult.invalidRows.length > 0 && (
                  <Card className="border border-pulse-border shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-pulse-border py-3 px-4 flex justify-between items-center flex-wrap gap-2">
                      <CardTitle className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                        Invalid Rows Detail Log
                      </CardTitle>
                      
                      <Button variant="secondary" size="xs" onClick={handleDownloadErrorReport} className="text-rose-600 hover:text-rose-700 bg-white border border-rose-200 shadow-sm flex items-center gap-1">
                        <Download className="h-3 w-3" /> Download Error Report
                      </Button>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <div className="max-h-72 overflow-y-auto table-scroll">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-[10px] text-pulse-muted font-bold uppercase sticky top-0">
                            <tr>
                              <th className="px-4 py-2 border-b border-pulse-border w-20 text-center">Row</th>
                              <th className="px-4 py-2 border-b border-pulse-border">Error Description</th>
                              <th className="px-4 py-2 border-b border-pulse-border">Roster Email (Target)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {validationResult.invalidRows.map((errRow, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/40">
                                <td className="px-4 py-2 text-center font-bold text-slate-500 bg-slate-50/30">{errRow.row}</td>
                                <td className="px-4 py-2 text-rose-700 font-semibold leading-normal">{errRow.error}</td>
                                <td className="px-4 py-2 text-slate-600 font-mono">{errRow.originalRow.email || "(no email)"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Validation Passed Confirmation Badge */}
                {validationResult.invalid === 0 && (
                  <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-sm font-semibold animate-pulse shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-pulse-primary flex-shrink-0" />
                    <span>All records successfully verified! Click "Import Employees" to proceed.</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* Confirmation Modal */}
      {validationResult && (
        <Modal 
          open={importConfirmOpen} 
          onClose={() => setImportConfirmOpen(false)} 
          title="Confirm Bulk Registration"
        >
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-10 w-10 text-pulse-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Ready to Bulk Insert</p>
                <p className="text-xs text-pulse-muted mt-1 leading-relaxed">
                  Are you sure you want to import {validationResult.valid} valid employee records from your uploaded sheet? This operation cannot be reversed.
                </p>
              </div>
            </div>

            {validationResult.invalid > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold">Attention:</span> {validationResult.invalid} invalid rows will be skipped during this import batch. You can download the error log report to inspect them.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-1">
              <Button variant="secondary" onClick={() => setImportConfirmOpen(false)}>
                Cancel
              </Button>
              
              <Button 
                onClick={handleConfirmImport}
                className="bg-pulse-primary hover:bg-emerald-600 text-slate-950 font-bold"
              >
                Confirm Import
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
