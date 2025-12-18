import Dexie from 'dexie';

export const db = new Dexie('aqua_track_db');

db.version(1).stores({
  users: 'id, email, role, status, technician_zone, full_name',
  pools: 'id, owner_email, address, status, construction_status, updated_date',
  serviceRequests: 'id, pool_id, client_email, assigned_technician, status, priority, created_date, updated_date, scheduled_date, completion_date',
  serviceReports: 'id, pool_id, created_date',
  technicianFeedbacks: 'id++, service_request_id, technician_email, client_email, created_date'
});

// Helper utils
export async function getAll(tableName) {
  return await db[tableName].toArray();
}

export async function upsert(tableName, item) {
  await db[tableName].put(item);
  return item;
}

export async function bulkUpsert(tableName, items) {
  await db[tableName].bulkPut(items);
}


