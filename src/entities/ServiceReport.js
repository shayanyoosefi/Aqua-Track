class ServiceReport {
  static async list(orderBy = '-created_date') {
    const reports = JSON.parse(localStorage.getItem('serviceReports') || '[]');
    
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    
    return reports.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  static async create(data) {
    const reports = JSON.parse(localStorage.getItem('serviceReports') || '[]');
    const newReport = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    reports.push(newReport);
    localStorage.setItem('serviceReports', JSON.stringify(reports));
    return newReport;
  }
}

export { ServiceReport };
