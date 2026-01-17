export function exportAsJSON(data, filename = 'monday-data.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export function exportAsCSV(items, entityType, filename = null) {
  if (!items || items.length === 0) {
    alert('No data to export');
    return;
  }

  const keys = [...new Set(items.flatMap(item => Object.keys(item)))];

  const header = keys.join(',');

  const rows = items.map(item => {
    return keys.map(key => {
      const value = item[key];
      if (value === null || value === undefined) return '';
      
      const stringValue = String(value);
      
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  
  const finalFilename = filename || `monday-${entityType}-${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, finalFilename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
