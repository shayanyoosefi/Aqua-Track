import { db } from './db';

class ServiceRequest {
  static async list(orderBy = '-created_date', limit = null) {
    const requests = await db.serviceRequests.toArray();
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    let sorted = requests.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
    if (limit) sorted = sorted.slice(0, limit);
    return sorted;
  }

  static async create(data) {
    const newRequest = {
      id: Date.now().toString(),
      ...data,
      status: data.status || 'pending',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    await db.serviceRequests.put(newRequest);
    return newRequest;
  }

  static async update(id, data) {
    const existing = await db.serviceRequests.get(id);
    if (!existing) throw new Error('Service request not found');
    const updated = { ...existing, ...data, updated_date: new Date().toISOString() };
    await db.serviceRequests.put(updated);
    return updated;
  }

  static async delete(id) {
    await db.serviceRequests.delete(id);
  }
}

export { ServiceRequest };
