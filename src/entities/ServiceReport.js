import { db } from './db';

class ServiceReport {
  static async list(orderBy = '-created_date') {
    const reports = await db.serviceReports.toArray();
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    return reports.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  }

  static async create(data) {
    const newReport = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    await db.serviceReports.put(newReport);
    return newReport;
  }
}

export { ServiceReport };
