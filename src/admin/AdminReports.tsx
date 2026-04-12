import { useEffect, useState, useCallback } from 'react';
import { getSalesReport } from '../services/adminService';
import type { SalesReport } from './adminTypes';
import './AdminPage.css';

export default function AdminReports() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getSalesReport(startDate, endDate);
    if (result.success && result.data) {
      setReport(result.data);
    } else {
      setError(result.error ?? 'Failed to load report');
    }
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const maxRevenue = report ? Math.max(...report.dailySales.map(d => d.revenue), 1) : 1;

  return (
    <div className="admin-page">
      {/* Date Range */}
      <div className="admin-page__toolbar">
        <div className="admin-reports__dates">
          <div className="admin-form-field">
            <label>From</label>
            <input className="admin-form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>To</label>
            <input className="admin-form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-page__loading">Loading...</div>
      ) : error ? (
        <div className="admin-page__error">{error}</div>
      ) : report ? (
        <>
          {/* Summary Cards */}
          <div className="admin-metrics">
            <div className="admin-metric-card">
              <div className="admin-metric-card__icon" style={{ background: 'rgba(58,110,95,0.2)', color: '#3A6E5F' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="admin-metric-card__content">
                <span className="admin-metric-card__value">${report.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="admin-metric-card__label">Total Revenue</span>
              </div>
            </div>
            <div className="admin-metric-card">
              <div className="admin-metric-card__icon" style={{ background: 'rgba(58,110,95,0.2)', color: '#3A6E5F' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div className="admin-metric-card__content">
                <span className="admin-metric-card__value">{report.totalOrders.toLocaleString()}</span>
                <span className="admin-metric-card__label">Total Orders</span>
              </div>
            </div>
            <div className="admin-metric-card">
              <div className="admin-metric-card__icon" style={{ background: 'rgba(58,110,95,0.2)', color: '#3A6E5F' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="admin-metric-card__content">
                <span className="admin-metric-card__value">${report.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="admin-metric-card__label">Avg. Order Value</span>
              </div>
            </div>
          </div>

          {/* Daily Sales Chart */}
          <div className="admin-table-card">
            <div className="admin-table-card__header">
              <h3>Daily Sales</h3>
            </div>
            <div className="admin-chart">
              {report.dailySales.length === 0 ? (
                <div className="admin-chart__empty">No sales data for this period</div>
              ) : (
                <div className="admin-chart__bars">
                  {report.dailySales.map((day) => (
                    <div key={day.date} className="admin-chart__bar-group">
                      <div className="admin-chart__bar-container">
                        <div
                          className="admin-chart__bar"
                          style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                          title={`${new Date(day.date).toLocaleDateString()}: $${day.revenue.toFixed(2)}`}
                        />
                      </div>
                      <div className="admin-chart__bar-label">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="admin-table-card">
            <div className="admin-table-card__header">
              <h3>Top Products</h3>
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
                  {report.topProducts.length === 0 ? (
                    <tr><td colSpan={3} className="admin-table__empty">No product sales data</td></tr>
                  ) : report.topProducts.map((p) => (
                    <tr key={p.productId}>
                      <td>{p.productName}</td>
                      <td>{p.unitsSold.toLocaleString()}</td>
                      <td>${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
