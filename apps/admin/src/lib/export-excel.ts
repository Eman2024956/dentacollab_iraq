/**
 * Excel / CSV Export Utility with UTF-8 BOM support for Arabic text
 * DentaCollab Admin Dashboard
 */

export interface ExportColumn<T = any> {
  key: keyof T | string;
  label: string;
  format?: (value: any, item: T) => string;
}

/**
 * Exports data array as a CSV/Excel file with UTF-8 BOM (\uFEFF)
 * Ensuring Arabic characters are rendered correctly in Microsoft Excel and macOS Numbers
 */
export function exportToExcel<T extends Record<string, any>>(
  filename: string,
  columns: ExportColumn<T>[],
  data: T[]
) {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات متاحة للتصدير');
    return;
  }

  // Header row
  const headerRow = columns.map((col) => escapeCsvField(col.label)).join(',');

  // Data rows
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        let value: any;
        if (typeof col.key === 'string' && col.key.includes('.')) {
          // Resolve nested key e.g. "title.ar"
          value = col.key.split('.').reduce((acc, part) => acc && acc[part], item);
        } else {
          value = item[col.key as string];
        }

        if (col.format) {
          return escapeCsvField(col.format(value, item));
        }

        if (value === null || value === undefined) {
          return '""';
        }

        if (typeof value === 'object') {
          // If it's an object with ar/en, prefer Arabic
          if (value.ar) return escapeCsvField(value.ar);
          if (value.en) return escapeCsvField(value.en);
          return escapeCsvField(JSON.stringify(value));
        }

        return escapeCsvField(String(value));
      })
      .join(',');
  });

  // UTF-8 BOM (\uFEFF) forces Excel to interpret the CSV as UTF-8
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const sanitizedFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', sanitizedFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvField(field: string): string {
  if (field === null || field === undefined) return '""';
  const stringField = String(field);
  // If field contains quotes, commas, newlines, wrap in quotes and escape internal quotes
  if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return `"${stringField}"`;
}
