export const exportToCsv = (data: any[], headers: Record<string, string>, filename: string) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const headerRow = Object.values(headers).join(',');

  const dataRows = data.map(row => {
    return Object.keys(headers)
      .map(key => {
        const cellValue = row[key] ?? '';
        const formattedValue = typeof cellValue === 'string' 
          ? `"${cellValue.replace(/"/g, '""')}"` 
          : cellValue;
        return formattedValue;
      })
      .join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
};