class Pool {
  static async list(orderBy = '-updated_date') {
    const pools = JSON.parse(localStorage.getItem('pools') || '[]');
    
    // Simple sorting (in real app, this would be handled by backend)
    const sortField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const descending = orderBy.startsWith('-');
    
    return pools.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (descending) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  static async create(data) {
    const pools = JSON.parse(localStorage.getItem('pools') || '[]');
    const newPool = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      construction_status: data.construction_status || 'not_started'
    };
    pools.push(newPool);
    localStorage.setItem('pools', JSON.stringify(pools));
    return newPool;
  }

  static async update(id, data) {
    const pools = JSON.parse(localStorage.getItem('pools') || '[]');
    const index = pools.findIndex(p => p.id === id);
    if (index !== -1) {
      pools[index] = {
        ...pools[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('pools', JSON.stringify(pools));
      return pools[index];
    }
    throw new Error('Pool not found');
  }
}

export { Pool };
