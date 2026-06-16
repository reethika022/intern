import sys
import subprocess
import csv

try:
    import openpyxl
except ImportError:
    print("Installing openpyxl...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
    import openpyxl

from openpyxl import Workbook

# Create workbook
wb = Workbook()
ws = wb.active
ws.title = "bulk_import_format"

# Excel Headers matching new request
headers = [
    "batch id",
    "Intern Name",
    "qualification",
    "phone number",
    "Mandal",
    "District"
]

# Append header row
ws.append(headers)

# Auto-adjust column widths for premium Excel aesthetics
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = col[0].column_letter
    ws.column_dimensions[col_letter].width = max(max_len + 3, 16)

# Save Excel files
wb.save(r"c:\Users\DELL\Documents\frontend\public\bulk_import_format.xlsx")
wb.save(r"c:\Users\DELL\Documents\frontend\bulk_import_format.xlsx")

# Save CSV files
for filepath in [r"c:\Users\DELL\Documents\frontend\public\bulk_import_format.csv", r"c:\Users\DELL\Documents\frontend\bulk_import_format.csv"]:
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)

print("Excel and CSV templates generated successfully!")

