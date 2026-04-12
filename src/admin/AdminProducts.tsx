import { useEffect, useState, useCallback } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../services/adminService';
import type { AdminProduct } from './adminTypes';
import type { Category } from '../types';
import ImageUpload from './ImageUpload';
import type { ImageEntry } from './ImageUpload';
import './AdminPage.css';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  brand: string;
  weight: string;
  inStock: boolean;
  stockQuantity: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  images: ImageEntry[];
  variants: { name: string; price: string; stock: string; sku: string }[];
  tags: string[];
  features: string[];
  ingredients: string;
}

const EMPTY_FORM: ProductFormData = {
  name: '', slug: '', description: '', shortDescription: '',
  price: '', originalPrice: '', categoryId: '', brand: '',
  weight: '0', inStock: true, stockQuantity: '10',
  isFeatured: false, isBestseller: false, isNew: false,
  images: [], variants: [], tags: [],
  features: [''],
  ingredients: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const result = await getAdminProducts({
      page, pageSize: 15, search: search || undefined,
      includeDeleted: showDeleted,
    });
    if (result.success && result.data) {
      setProducts(result.data.items);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.error ?? 'Failed to load products');
    }
    setLoading(false);
  }, [page, search, showDeleted]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    getCategories().then(r => {
      if (r.success && r.data) setCategories(r.data);
    });
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: '',
      shortDescription: '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() ?? '',
      categoryId: '',
      brand: product.brand ?? '',
      weight: '0',
      inStock: product.inStock,
      stockQuantity: product.stockQuantity.toString(),
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      isNew: product.isNew,
      images: [],
      variants: [],
      tags: [],
      features: [''],
      ingredients: '',
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    const nonEmptyFeatures = form.features.filter(f => f.trim() !== '');
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.description,
      shortDescription: form.shortDescription,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      categoryId: form.categoryId || undefined,
      brand: form.brand || undefined,
      weight: parseFloat(form.weight) || 0,
      inStock: form.inStock,
      stockQuantity: parseInt(form.stockQuantity) || 0,
      isFeatured: form.isFeatured,
      isBestseller: form.isBestseller,
      isNew: form.isNew,
      images: form.images.map(img => ({ url: img.url, alt: img.alt || img.url })),
      variants: form.variants.map(v => ({ name: v.name, price: parseFloat(v.price), stock: parseInt(v.stock) || 0, sku: v.sku || undefined })),
      tags: form.tags,
      features: nonEmptyFeatures,
      ingredients: form.ingredients || undefined,
    };

    const result = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    setSaving(false);
    if (result.success) {
      setModalOpen(false);
      loadProducts();
    } else {
      setFormError(result.error ?? 'Failed to save product');
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteProduct(id);
    if (result.success) {
      setDeleteId(null);
      loadProducts();
    }
  }

  return (
    <div className="admin-page">
      {/* Toolbar */}
      <div className="admin-page__toolbar">
        <input
          className="admin-page__search"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <label className="admin-page__toggle">
          <input type="checkbox" checked={showDeleted} onChange={e => { setShowDeleted(e.target.checked); setPage(1); }} />
          <span>Show deleted</span>
        </label>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {/* Table */}
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
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={7} className="admin-table__empty">No products found</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className={p.isDeleted ? 'admin-table__row--deleted' : ''}>
                      <td>
                        <span className="admin-table__name">{p.name}</span>
                      </td>
                      <td>{p.categoryName || '—'}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>
                        <span className={p.stockQuantity <= 5 ? 'admin-text--warning' : ''}>{p.stockQuantity}</span>
                      </td>
                      <td>
                        {p.isFeatured && <span className="admin-badge admin-badge--success">Featured</span>}
                        {p.isBestseller && <span className="admin-badge admin-badge--warning">Best</span>}
                      </td>
                      <td>
                        {p.isDeleted ? (
                          <span className="admin-badge admin-badge--danger">Deleted</span>
                        ) : p.inStock ? (
                          <span className="admin-badge admin-badge--success">Active</span>
                        ) : (
                          <span className="admin-badge admin-badge--danger">Out</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(p)}>Edit</button>
                          {!p.isDeleted && (
                            <button className="admin-btn admin-btn--danger" onClick={() => setDeleteId(p.id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-pagination__btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button className="admin-pagination__btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      {/* Product Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              {formError && <div className="admin-form-error">{formError}</div>}
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label>Name *</label>
                  <input className="admin-form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
                </div>
                <div className="admin-form-field">
                  <label>Slug</label>
                  <input className="admin-form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated-from-name" />
                </div>
                <div className="admin-form-field">
                  <label>Price *</label>
                  <input className="admin-form-input" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="admin-form-field">
                  <label>Original Price</label>
                  <input className="admin-form-input" type="number" step="0.01" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="admin-form-field">
                  <label>Category</label>
                  <select className="admin-form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="admin-form-field">
                  <label>Brand</label>
                  <input className="admin-form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" />
                </div>
                <div className="admin-form-field">
                  <label>Stock Quantity</label>
                  <input className="admin-form-input" type="number" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} placeholder="10" />
                </div>
                <div className="admin-form-field">
                  <label>Weight (g)</label>
                  <input className="admin-form-input" type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="100" />
                </div>
              </div>

              <div className="admin-form-field">
                <label>Short Description</label>
                <textarea className="admin-form-input" rows={2} value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Brief description for cards" />
              </div>
              <div className="admin-form-field">
                <label>Full Description</label>
                <textarea className="admin-form-input" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Full product description" />
              </div>

              {/* Images */}
              <div className="admin-form-field">
                <label>Product Images</label>
                <ImageUpload
                  images={form.images}
                  onChange={images => setForm(f => ({ ...f, images }))}
                  maxImages={8}
                />
              </div>

              {/* Features */}
              <div className="admin-form-field">
                <label>Features <span style={{ fontWeight: 400, color: '#888' }}>(e.g. Premium Milk Chocolate, Creamy Filling)</span></label>
                <div className="admin-form-list">
                  {form.features.map((feature, idx) => (
                    <div key={idx} className="admin-form-list__row">
                      <input
                        className="admin-form-input"
                        value={feature}
                        onChange={e => {
                          const updated = [...form.features];
                          updated[idx] = e.target.value;
                          setForm(f => ({ ...f, features: updated }));
                        }}
                        placeholder={`Feature ${idx + 1}`}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }))}
                        disabled={form.features.length <= 1}
                        title="Remove feature"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => setForm(f => ({ ...f, features: [...f.features, ''] }))}
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Ingredients */}
              <div className="admin-form-field">
                <label>Ingredients</label>
                <textarea
                  className="admin-form-input"
                  rows={3}
                  value={form.ingredients}
                  onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  placeholder="e.g. Cocoa mass, cocoa butter, sugar, pistachios, vanilla extract. May contain traces of nuts and milk."
                />
              </div>

              <div className="admin-form-toggles">
                {[
                  { key: 'inStock', label: 'In Stock' },
                  { key: 'isFeatured', label: 'Featured' },
                  { key: 'isBestseller', label: 'Bestseller' },
                  { key: 'isNew', label: 'New Arrival' },
                ].map(t => (
                  <label key={t.key} className="admin-form-toggle">
                    <input type="checkbox" checked={form[t.key as keyof ProductFormData] as boolean} onChange={e => setForm(f => ({ ...f, [t.key]: e.target.checked }))} />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
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
              <h2>Delete Product</h2>
              <button className="admin-modal__close" onClick={() => setDeleteId(null)}>&times;</button>
            </div>
            <div className="admin-modal__body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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
