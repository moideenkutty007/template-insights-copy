/**
 * Utility functions for exporting data from reports
 */

/**
 * Convert data to CSV format and trigger download
 * @param data Array of objects to export
 * @param filename Name of the file to download
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data || !data.length) {
    console.error('No data to export')
    return
  }

  // Get headers from the first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle different data types
        if (value === null || value === undefined) return ''
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
        if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        return value
      }).join(',')
    )
  ].join('\n')
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  // Set up download
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Convert data to JSON format and trigger download
 * @param data Data to export
 * @param filename Name of the file to download
 */
export function exportToJSON<T>(data: T, filename: string): void {
  if (!data) {
    console.error('No data to export')
    return
  }
  
  // Create a blob and download link
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  // Set up download
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  
  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}