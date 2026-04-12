import { useEffect, useState, useCallback } from 'react';
import { getAdminUsers, updateUserRole } from '../services/adminService';
import type { AdminUser } from './adminTypes';
import './AdminPage.css';

export default function AdminCustomers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [roleModal, setRoleModal] = useState<{ user: AdminUser; newRole: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const result = await getAdminUsers({
      page, pageSize: 20,
      search: search || undefined,
      role: roleFilter || undefined,
    });
    if (result.success && result.data) {
      setUsers(result.data.items);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.error ?? 'Failed to load users');
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function handleRoleChange() {
    if (!roleModal) return;
    setUpdating(true);
    const result = await updateUserRole(roleModal.user.id, roleModal.newRole);
    setUpdating(false);
    if (result.success) {
      setRoleModal(null);
      loadUsers();
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__toolbar">
        <input
          className="admin-page__search"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="admin-page__select"
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-page__loading">Loading...</div>
      ) : error ? (
        <div className="admin-page__error">{error}</div>
      ) : (
        <>
          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} className="admin-table__empty">No users found</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-customer">
                          <div className="admin-customer__avatar">{u.firstName[0]}{u.lastName[0]}</div>
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone ?? '—'}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${u.role === 'Admin' ? 'success' : 'info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.orderCount}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`admin-btn admin-btn--ghost admin-btn--sm`}
                          onClick={() => setRoleModal({
                            user: u,
                            newRole: u.role === 'Admin' ? 'Customer' : 'Admin',
                          })}
                        >
                          {u.role === 'Admin' ? 'Demote to Customer' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-pagination__btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button className="admin-pagination__btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      {/* Role Change Confirmation */}
      {roleModal && (
        <div className="admin-modal-overlay" onClick={() => setRoleModal(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>Change Role</h2>
              <button className="admin-modal__close" onClick={() => setRoleModal(null)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              <p>
                {roleModal.newRole === 'Admin' ? (
                  <>Promote <strong>{roleModal.user.firstName} {roleModal.user.lastName}</strong> to Admin?</>
                ) : (
                  <>Demote <strong>{roleModal.user.firstName} {roleModal.user.lastName}</strong> to Customer?</>
                )}
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setRoleModal(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleRoleChange} disabled={updating}>
                {updating ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
