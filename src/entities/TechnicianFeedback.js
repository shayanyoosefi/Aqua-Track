import { db } from './db';

class TechnicianFeedback {
  static async list(orderBy = '-created_date') {
    const feedbacks = await db.technicianFeedbacks.toArray();
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    return feedbacks.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  }

  static async create(data) {
    const newFeedback = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    await db.technicianFeedbacks.put(newFeedback);
    return newFeedback;
  }
}

export { TechnicianFeedback };
