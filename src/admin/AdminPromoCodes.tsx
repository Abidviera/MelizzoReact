import { useEffect, useState, useCallback } from 'react';
import { getAdminPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from '../services/adminService';
import type { AdminPromoCode } from './adminTypes';
import './AdminPage.css';

interface PromoFormData {
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  minOrderValue: string;
  maxUsageCount: string;
  expiresAt: string;
  isActive: boolean;
}

const EMPTY_FORM: PromoFormData = {
  code: '', description: '', discountType: 'Percentage',
  discountValue: '', minOrderValue: '', maxUsageCount: '0', expiresAt: '', isActive: true,
};

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState<AdminPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [form, setForm] = useState<PromoFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);

  const loadCodes = useCallback(async () => {
    setLoading(true);
    const result = await getAdminPromoCodes();
    if (result.success && result.data) {
      setCodes(result.data);
    } else {
      setError(result.error ?? 'Failed to load promo codes');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadCodes(); }, [loadCodes]);

  function openCreate() {
    setEditingCode(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(code: AdminPromoCode) {
    setEditingCode(code.code);
    setForm({
      code: code.code,
      description: code.description,
      discountType: code.discountType === 'Percentage' ? 'Percentage' : 'Fixed',
      discountValue: code.discountValue.toString(),
      minOrderValue: code.minOrderValue?.toString() ?? '',
      maxUsageCount: code.maxUsageCount.toString(),
      expiresAt: code.expiresAt ? code.expiresAt.split('T')[0] : '',
      isActive: code.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.code.trim()) {
      setFormError('Code is required');
      return;
    }
    if (!form.discountValue) {
      setFormError('Discount value is required');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      code: form.code.toUpperCase(),
      description: form.description,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : null,
      maxUsageCount: parseInt(form.maxUsageCount) || 0,
      expiresAt: form.expiresAt || null,
    };
    const result = editingCode
      ? await updatePromoCode(editingCode, { ...payload, isActive: form.isActive })
      : await createPromoCode(payload);
    setSaving(false);
    if (result.success) {
      setModalOpen(false);
      loadCodes();
    } else {
      setFormError(result.error ?? 'Failed to save promo code');
    }
  }

  async function handleDelete(code: string) {
    const result = await deletePromoCode(code);
    if (result.success) {
      setDeleteCode(null);
      loadCodes();
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__toolbar">
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Add Promo Code</button>
      </div>

      {loading ? (
        <div className="admin-page__loading">Loading...</div>
      ) : error ? (
        <div className="admin-page__error">{error}</div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.length === 0 ? (
                  <tr><td colSpan={9} className="admin-table__empty">No promo codes found</td></tr>
                ) : codes.map(c => (
                  <tr key={c.code}>
                    <td><code className="admin-code">{c.code}</code></td>
                    <td>{c.description}</td>
                    <td>{c.discountType}</td>
                    <td>
                      {c.discountType === 'Percentage'
                        ? `${c.discountValue}%`
                        : `$${c.discountValue.toFixed(2)}`}
                    </td>
                    <td>{c.minOrderValue ? `$${c.minOrderValue.toFixed(2)}` : '—'}</td>
                    <td>
                      <div className="admin-usage-bar">
                        <div className="admin-usage-bar__text">{c.usedCount} / {c.maxUsageCount || '∞'}</div>
                        {c.maxUsageCount > 0 && (
                          <div className="admin-usage-bar__track">
                            <div
                              className="admin-usage-bar__fill"
                              style={{ width: `${Math.min(100, (c.usedCount / c.maxUsageCount) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${c.isActive ? 'success' : 'danger'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(c)}>Edit</button>
                        <button className="admin-btn admin-btn--danger" onClick={() => setDeleteCode(c.code)}>Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promo Code Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editingCode ? 'Edit Promo Code' : 'Add Promo Code'}</h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              {formError && <div className="admin-form-error">{formError}</div>}
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label>Code *</label>
                  <input className="admin-form-input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="WELCOME20" />
                </div>
                <div className="admin-form-field">
                  <label>Type</label>
                  <select className="admin-form-input" value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="admin-form-field">
                  <label>Discount Value *</label>
                  <input className="admin-form-input" type="number" step="0.01" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder="10" />
                </div>
                <div className="admin-form-field">
                  <label>Min Order Value</label>
                  <input className="admin-form-input" type="number" step="0.01" value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="admin-form-field">
                  <label>Max Usage</label>
                  <input className="admin-form-input" type="number" value={form.maxUsageCount} onChange={e => setForm(f => ({ ...f, maxUsageCount: e.target.value }))} placeholder="0 = unlimited" />
                </div>
                <div className="admin-form-field">
                  <label>Expires At</label>
                  <input className="admin-form-input" type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-field">
                <label>Description</label>
                <textarea className="admin-form-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Promo code description" />
              </div>
              {editingCode && (
                <label className="admin-form-toggle">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  <span>Active</span>
                </label>
              )}
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingCode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteCode && (
        <div className="admin-modal-overlay" onClick={() => setDeleteCode(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>Deactivate Promo Code</h2>
              <button className="admin-modal__close" onClick={() => setDeleteCode(null)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              <p>Deactivate <strong>{deleteCode}</strong>? It will no longer be usable.</p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteCode(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteCode)}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
