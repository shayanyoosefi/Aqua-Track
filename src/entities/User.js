class User {
  static async me() {
    // Mock implementation - returns a default admin user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userId = localStorage.getItem('currentUserId') || '1';
    let user = users.find(u => u.id === userId);
    
    if (!user) {
      user = {
        id: '1',
        email: 'admin@absolutepools.com',
        full_name: 'Admin User',
        role: 'admin'
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    return user;
  }

  static async list() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      return [
        { id: '1', email: 'admin@absolutepools.com', full_name: 'Admin User', role: 'admin' },
        { id: '2', email: 'tech1@absolutepools.com', full_name: 'John Technician', role: 'technician', status: 'available', technician_zone: 'North' },
        { id: '3', email: 'tech2@absolutepools.com', full_name: 'Jane Technician', role: 'technician', status: 'available', technician_zone: 'South' },
        { id: '4', email: 'client@example.com', full_name: 'Client User', role: 'client' }
      ];
    }
    return users;
  }

  static async logout() {
    localStorage.removeItem('currentUserId');
    window.location.href = '/';
  }
}

export { User };
