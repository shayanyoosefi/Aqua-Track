import { db } from './db';

class Pool {
  static async list(orderBy = '-updated_date') {
    const pools = await db.pools.toArray();
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    return pools.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  }

  static async create(data) {
    const newPool = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      construction_status: data.construction_status || 'planning'
    };
    await db.pools.put(newPool);
    return newPool;
  }

  static async update(id, data) {
    const existing = await db.pools.get(id);
    if (!existing) throw new Error('Pool not found');
    const updated = { ...existing, ...data, updated_date: new Date().toISOString() };
    await db.pools.put(updated);
    return updated;
  }
}

export { Pool };
