class ServiceRequest {
  static async list(orderBy = '-created_date', limit = null) {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    
    let sorted = requests.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    
    if (limit) {
      sorted = sorted.slice(0, limit);
    }
    
    return sorted;
  }

  static async create(data) {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const newRequest = {
      id: Date.now().toString(),
      ...data,
      status: data.status || 'pending',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    requests.push(newRequest);
    localStorage.setItem('serviceRequests', JSON.stringify(requests));
    return newRequest;
  }

  static async update(id, data) {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('serviceRequests', JSON.stringify(requests));
      return requests[index];
    }
    throw new Error('Service request not found');
  }
}

export { ServiceRequest };
