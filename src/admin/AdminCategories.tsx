import { useEffect, useState, useCallback } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/adminService';
import type { Category } from '../types';
import './AdminPage.css';

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const EMPTY_FORM: CategoryFormData = { name: '', description: '', imageUrl: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const result = await getCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    } else {
      setError(result.error ?? 'Failed to load categories');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description ?? '', imageUrl: cat.image ?? '' });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setFormError('Category name is required');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = { name: form.name, description: form.description || undefined, imageUrl: form.imageUrl || undefined };
    const result = editingId
      ? await updateCategory(editingId, payload)
      : await createCategory(payload);
    setSaving(false);
    if (result.success) {
      setModalOpen(false);
      loadCategories();
    } else {
      setFormError(result.error ?? 'Failed to save category');
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteCategory(id);
    if (result.success) {
      setDeleteId(null);
      loadCategories();
    } else {
      setFormError(result.error ?? 'Failed to delete category');
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__toolbar">
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Add Category</button>
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={5} className="admin-table__empty">No categories found</td></tr>
                ) : categories.map(c => (
                  <tr key={c.id}>
                    <td>
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="admin-table__thumb" />
                      ) : (
                        <div className="admin-table__thumb admin-table__thumb--placeholder">—</div>
                      )}
                    </td>
                    <td className="admin-table__name">{c.name}</td>
                    <td><code className="admin-code">{c.slug}</code></td>
                    <td>{c.productCount ?? 0}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(c)}>Edit</button>
                        <button className="admin-btn admin-btn--danger" onClick={() => setDeleteId(c.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              {formError && <div className="admin-form-error">{formError}</div>}
              <div className="admin-form-field">
                <label>Name *</label>
                <input className="admin-form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" />
              </div>
              <div className="admin-form-field">
                <label>Description</label>
                <textarea className="admin-form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Category description" />
              </div>
              <div className="admin-form-field">
                <label>Image URL</label>
                <input className="admin-form-input" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>Delete Category</h2>
              <button className="admin-modal__close" onClick={() => setDeleteId(null)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              <p>Are you sure you want to delete this category?</p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
