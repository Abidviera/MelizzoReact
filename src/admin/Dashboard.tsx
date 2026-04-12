import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import type { DashboardStats } from './adminTypes';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    setError(null);
    const result = await getDashboardStats();
    if (result.success && result.data) {
      setStats(result.data);
    } else {
      setError(result.error ?? 'Failed to load dashboard');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-loading__spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error">
          <p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={loadStats}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: 'users', color: '#3A6E5F' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: 'orders', color: '#3A6E5F' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'revenue', color: '#3A6E5F' },
    { label: 'Orders Today', value: stats.ordersToday.toLocaleString(), icon: 'today', color: '#C34E7C' },
    { label: 'Revenue This Month', value: `$${stats.revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'revenue', color: '#C34E7C' },
    { label: 'Low Stock Alert', value: stats.lowStockProducts.length.toString(), icon: 'alert', color: stats.lowStockProducts.length > 0 ? '#C34E7C' : '#3A6E5F' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Metric Cards */}
      <div className="admin-metrics">
        {cards.map((card) => (
          <div key={card.label} className="admin-metric-card">
            <div className="admin-metric-card__icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon === 'users' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              )}
              {card.icon === 'orders' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              )}
              {card.icon === 'revenue' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              )}
              {card.icon === 'today' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              )}
              {card.icon === 'alert' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              )}
            </div>
            <div className="admin-metric-card__content">
              <span className="admin-metric-card__value">{card.value}</span>
              <span className="admin-metric-card__label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="admin-dashboard__tables">
        {/* Top Products */}
        <div className="admin-table-card">
          <div className="admin-table-card__header">
            <h3>Top Products by Revenue</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.length === 0 ? (
                  <tr><td colSpan={3} className="admin-table__empty">No sales data yet</td></tr>
                ) : (
                  stats.topProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.unitsSold.toLocaleString()}</td>
                      <td>${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="admin-table-card">
          <div className="admin-table-card__header">
            <h3>Low Stock Products</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.length === 0 ? (
                  <tr><td colSpan={3} className="admin-table__empty">All products are well stocked</td></tr>
                ) : (
                  stats.lowStockProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className={p.stockQuantity <= 3 ? 'admin-text--danger' : 'admin-text--warning'}>
                        {p.stockQuantity}
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge--${p.inStock ? 'success' : 'danger'}`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
