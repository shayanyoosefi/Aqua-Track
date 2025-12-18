import { USER_ROLES } from './roles';
import { db } from './db';

class User {
  static async me() {
    const users = await db.users.toArray();
    const userId = localStorage.getItem('currentUserId') || '1';
    let user = users.find(u => u.id === userId);
    if (!user) {
      // Fallback to admin if DB was cleared
      user = {
        id: '1',
        email: 'admin@absolutepools.com',
        full_name: 'Admin User',
        role: USER_ROLES.ADMIN
      };
      users.push(user);
      await db.users.put(user);
      localStorage.setItem('currentUserId', user.id);
    }
    return user;
  }

  static async list() {
    return await db.users.toArray();
  }

  static async create(data) {
    const newUser = {
      id: Date.now().toString(),
      status: data.role === USER_ROLES.TECHNICIAN ? (data.status || 'available') : undefined,
      ...data,
    };
    await db.users.put(newUser);
    return newUser;
  }

  static async update(id, data) {
    const existing = await db.users.get(id);
    if (!existing) throw new Error('User not found');
    const updated = { ...existing, ...data };
    await db.users.put(updated);
    return updated;
  }

  static async loginAs(id) {
    localStorage.setItem('currentUserId', id);
    return await this.me();
  }

  static async logout() {
    localStorage.removeItem('currentUserId');
    window.location.href = '/login';
  }
}

export { User };
