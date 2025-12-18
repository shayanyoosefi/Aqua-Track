import { USER_ROLES } from './roles';
import { db, bulkUpsert } from './db';

/**
 * Lightweight in-browser database bootstrapper using localStorage.
 * Seeds initial data and provides a single init() function to call on app startup.
 */
export const Database = {
  init: async () => {
    const initialized = localStorage.getItem('db_initialized_v2');
    if (initialized) return;

    // Seed Users (Admin, Technicians, Pool Owner)
    const users = [
      { id: '1', email: 'admin@absolutepools.com', full_name: 'Admin User', role: USER_ROLES.ADMIN },
      { id: '2', email: 'tech1@absolutepools.com', full_name: 'John Technician', role: USER_ROLES.TECHNICIAN, status: 'available', technician_zone: 'North' },
      { id: '3', email: 'tech2@absolutepools.com', full_name: 'Jane Technician', role: USER_ROLES.TECHNICIAN, status: 'available', technician_zone: 'South' },
      { id: '4', email: 'owner@example.com', full_name: 'Pool Owner', role: USER_ROLES.POOL_OWNER },
      { id: '5', email: 'customer@absolutepools.com', full_name: 'Customer User', role: USER_ROLES.POOL_OWNER },
    ];
    await bulkUpsert('users', users);
    localStorage.setItem('currentUserId', '1');

    // Seed Pools (owned by pool owner)
    const pools = [
      {
        id: 'p1',
        owner_email: 'owner@example.com',
        address: '123 Ocean View Dr',
        status: 'good',
        ph_level: 7.4,
        water_temperature: 26,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: 'p2',
        owner_email: 'owner@example.com',
        address: '456 Coral Reef Ave',
        status: 'needs_attention',
        ph_level: 7.0,
        water_temperature: 24,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: 'p3',
        owner_email: 'customer@absolutepools.com',
        address: '789 Blue Lagoon Rd',
        status: 'good',
        ph_level: 7.2,
        water_temperature: 25,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    ];
    await bulkUpsert('pools', pools);

    // Seed Service Requests
    const serviceRequests = [
      {
        id: 'sr1',
        pool_id: 'p2',
        client_email: 'owner@example.com',
        service_type: 'maintenance',
        priority: 'high',
        status: 'pending',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: 'sr2',
        pool_id: 'p1',
        client_email: 'owner@example.com',
        service_type: 'chemical_check',
        priority: 'medium',
        status: 'assigned',
        assigned_technician: 'tech1@absolutepools.com',
        scheduled_date: new Date(Date.now() + 86400000).toISOString(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    ];
    await bulkUpsert('serviceRequests', serviceRequests);

    // Seed Service Reports and Technician Feedback (empty by default)
    await bulkUpsert('serviceReports', []);
    await bulkUpsert('technicianFeedbacks', []);

    localStorage.setItem('db_initialized_v2', 'true');
  },
  reset: () => {
    ['users','pools','serviceRequests','serviceReports','technicianFeedbacks','currentUserId','db_initialized_v2']
      .forEach((k) => localStorage.removeItem(k));
  }
};


