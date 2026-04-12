import { useEffect, useState, useCallback } from 'react';
import { getAdminOrders, updateOrderStatus } from '../services/adminService';
import type { AdminOrder } from './adminTypes';
import './AdminPage.css';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CLASS: Record<string, string> = {
  Pending: 'warning',
  Processing: 'info',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await getAdminOrders({
      page, pageSize: 20,
      status: statusFilter || undefined,
      search: search || undefined,
    });
    if (result.success && result.data) {
      setOrders(result.data.items);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.error ?? 'Failed to load orders');
    }
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function handleUpdateStatus() {
    if (!selectedOrder || !statusUpdate) return;
    setUpdating(true);
    const result = await updateOrderStatus(
      selectedOrder.id,
      statusUpdate,
      statusUpdate === 'Shipped' ? trackingNumber || undefined : undefined,
    );
    setUpdating(false);
    if (result.success) {
      setSelectedOrder(null);
      loadOrders();
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__toolbar">
        <input
          className="admin-page__search"
          placeholder="Search by order # or customer..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="admin-page__select"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="admin-table__empty">No orders found</td></tr>
                  ) : orders.map(o => (
                    <tr key={o.id}>
                      <td><code className="admin-code">{o.orderNumber}</code></td>
                      <td>
                        <div>{o.customerName}</div>
                        <div className="admin-table__sub">{o.customerEmail}</div>
                      </td>
                      <td>{o.itemCount}</td>
                      <td>${o.total.toFixed(2)}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${STATUS_CLASS[o.status] ?? 'info'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="admin-btn admin-btn--ghost" onClick={() => {
                          setSelectedOrder(o);
                          setStatusUpdate(o.status);
                          setTrackingNumber('');
                        }}>Update Status</button>
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

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>Update Order Status</h2>
              <button className="admin-modal__close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              <p><strong>{selectedOrder.orderNumber}</strong> — {selectedOrder.customerName}</p>
              <div className="admin-form-field">
                <label>Status</label>
                <select className="admin-form-input" value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {statusUpdate === 'Shipped' && (
                <div className="admin-form-field">
                  <label>Tracking Number</label>
                  <input className="admin-form-input" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Tracking #" />
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setSelectedOrder(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleUpdateStatus} disabled={updating}>
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
