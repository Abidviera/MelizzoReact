import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import ProductCard from '../../components/ProductCard/ProductCard';
import type { ProductFilters, Product, Category } from '../../types';
import './Shop.css';

type SortOption = ProductFilters['sortBy'];

interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: '$0 - $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: undefined },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: undefined, label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Rating' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Read initial filter values from URL
  const activeCategory = searchParams.get('category') || '';
  const activeSort = (searchParams.get('sort') as SortOption) || undefined;
  const activeInStock = searchParams.get('inStock') === 'true';
  const activeMinPrice = searchParams.get('minPrice');
  const activeMaxPrice = searchParams.get('maxPrice');
  const activeSearch = searchParams.get('q') || '';

  // Local filter state (controlled)
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [selectedSort, setSelectedSort] = useState<SortOption>(activeSort);
  const [inStockOnly, setInStockOnly] = useState(activeInStock);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number | undefined>(
    activeMinPrice ? Number(activeMinPrice) : undefined
  );
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(
    activeMaxPrice ? Number(activeMaxPrice) : undefined
  );

  // Sync state from URL on mount / URL change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedSort((searchParams.get('sort') as SortOption) || undefined);
    setInStockOnly(searchParams.get('inStock') === 'true');
    setSelectedMinPrice(searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined);
    setSelectedMaxPrice(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined);
  }, [searchParams]);

  // Load categories and featured products
  useEffect(() => {
    setIsLoading(true);
    const [cats, featured] = [ProductService.getCategories(), ProductService.getFeatured()];
    setCategories(cats);
    setFeaturedProducts(featured);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Build filters object
  const filters: ProductFilters = useMemo(() => ({
    category: selectedCategory || undefined,
    sortBy: selectedSort,
    inStock: inStockOnly ? true : undefined,
    minPrice: selectedMinPrice,
    maxPrice: selectedMaxPrice,
    search: activeSearch || undefined,
  }), [selectedCategory, selectedSort, inStockOnly, selectedMinPrice, selectedMaxPrice, activeSearch]);

  const filteredProducts = useMemo(() => {
    return ProductService.filter(filters);
  }, [filters]);

  // Sync filters back to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSort) params.sort = selectedSort;
    if (inStockOnly) params.inStock = 'true';
    if (selectedMinPrice !== undefined) params.minPrice = String(selectedMinPrice);
    if (selectedMaxPrice !== undefined) params.maxPrice = String(selectedMaxPrice);
    if (activeSearch) params.q = activeSearch;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedSort, inStockOnly, selectedMinPrice, selectedMaxPrice, activeSearch, setSearchParams]);

  // Active filter chips
  const activeFilters = useMemo(() => {
    const chips: { label: string; key: string }[] = [];
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      chips.push({ label: cat?.name || selectedCategory, key: 'category' });
    }
    if (selectedMinPrice !== undefined || selectedMaxPrice !== undefined) {
      const label = selectedMaxPrice !== undefined
        ? `$${selectedMinPrice ?? 0} - $${selectedMaxPrice}`
        : `$${selectedMinPrice}+`;
      chips.push({ label, key: 'price' });
    }
    if (inStockOnly) chips.push({ label: 'In Stock Only', key: 'inStock' });
    if (activeSearch) chips.push({ label: `"${activeSearch}"`, key: 'search' });
    return chips;
  }, [selectedCategory, selectedMinPrice, selectedMaxPrice, inStockOnly, activeSearch, categories]);

  const removeFilter = (key: string) => {
    switch (key) {
      case 'category':
        setSelectedCategory('');
        break;
      case 'price':
        setSelectedMinPrice(undefined);
        setSelectedMaxPrice(undefined);
        break;
      case 'inStock':
        setInStockOnly(false);
        break;
      case 'search':
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('q');
          return next;
        }, { replace: true });
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSort(undefined);
    setInStockOnly(false);
    setSelectedMinPrice(undefined);
    setSelectedMaxPrice(undefined);
    setSearchParams({}, { replace: true });
  };

  const selectPriceRange = (range: PriceRange) => {
    setSelectedMinPrice(range.min);
    setSelectedMaxPrice(range.max);
  };

  const activePriceRange = PRICE_RANGES.find(
    (r) => r.min === selectedMinPrice && r.max === selectedMaxPrice
  );

  const Sidebar = () => (
    <aside className="shop__sidebar">
      {/* Categories */}
      <section className="shop__filter-section">
        <h3 className="shop__filter-title">Category</h3>
        <ul className="shop__category-list">
          <li>
            <button
              className={`shop__category-btn ${!selectedCategory ? 'shop__category-btn--active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              <span className="shop__category-name">All Products</span>
              <span className="shop__category-count">{ProductService.getAll().length}</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`shop__category-btn ${selectedCategory === cat.slug ? 'shop__category-btn--active' : ''}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                <span className="shop__category-name">{cat.name}</span>
                <span className="shop__category-count">{cat.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Price Range */}
      <section className="shop__filter-section">
        <h3 className="shop__filter-title">Price Range</h3>
        <div className="shop__price-buttons">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              className={`shop__price-btn ${activePriceRange?.label === range.label ? 'shop__price-btn--active' : ''}`}
              onClick={() => selectPriceRange(range)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="shop__filter-section">
        <h3 className="shop__filter-title">Availability</h3>
        <label className="shop__toggle">
          <span className="shop__toggle-label">In Stock Only</span>
          <button
            role="switch"
            aria-checked={inStockOnly}
            className={`shop__toggle-switch ${inStockOnly ? 'shop__toggle-switch--on' : ''}`}
            onClick={() => setInStockOnly((prev) => !prev)}
          >
            <span className="shop__toggle-thumb" />
          </button>
        </label>
      </section>

      {/* Clear Filters */}
      {activeFilters.length > 0 && (
        <button className="shop__clear-filters" onClick={clearAllFilters}>
          Clear All Filters
        </button>
      )}
    </aside>
  );

  const MobileFilterModal = () => (
    <div className={`shop__mobile-overlay ${mobileFiltersOpen ? 'shop__mobile-overlay--visible' : ''}`} onClick={() => setMobileFiltersOpen(false)}>
      <div className="shop__mobile-filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="shop__mobile-filter-header">
          <h2 className="shop__mobile-filter-title">Filters</h2>
          <button className="shop__mobile-close" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="shop__mobile-filter-body">
          <Sidebar />
        </div>
        <div className="shop__mobile-filter-footer">
          <button className="shop__mobile-apply" onClick={() => setMobileFiltersOpen(false)}>
            Show {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="shop__skeleton">
      <div className="shop__skeleton-image" />
      <div className="shop__skeleton-info">
        <div className="shop__skeleton-line shop__skeleton-line--short" />
        <div className="shop__skeleton-line" />
        <div className="shop__skeleton-line shop__skeleton-line--medium" />
      </div>
    </div>
  );

  return (
    <div className="shop">
      {/* Hero Banner */}
      <section className="shop__hero">
        <div className="shop__hero-bg" />
        <div className="shop__hero-content">
          <span className="shop__hero-eyebrow">Discover</span>
          <h1 className="shop__hero-title">Our Collection</h1>
          <p className="shop__hero-subtitle">
            Handcrafted chocolates inspired by the world's finest flavors
          </p>
        </div>
      </section>

      {/* Featured Products */}
      {!selectedCategory && !activeSearch && featuredProducts.length > 0 && (
        <section className="shop__featured">
          <div className="shop__section-header">
            <h2 className="shop__section-title">Featured</h2>
            <span className="shop__section-divider" />
          </div>
          <div className="shop__featured-grid">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="shop__layout">
        {/* Desktop Sidebar */}
        <div className="shop__desktop-sidebar">
          <Sidebar />
        </div>

        {/* Products Area */}
        <div className="shop__main">
          {/* Toolbar */}
          <div className="shop__toolbar">
            <div className="shop__toolbar-left">
              <p className="shop__results-count">
                <span className="shop__results-number">{filteredProducts.length}</span>
                {' '}product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
              {/* Mobile filter button */}
              <button
                className="shop__mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
                Filters
              </button>
            </div>
            <div className="shop__toolbar-right">
              <label className="shop__sort-label" htmlFor="sort-select">Sort:</label>
              <select
                id="sort-select"
                className="shop__sort-select"
                value={selectedSort || ''}
                onChange={(e) => setSelectedSort((e.target.value as SortOption) || undefined)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value || ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="shop__active-filters">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  className="shop__filter-chip"
                  onClick={() => removeFilter(chip.key)}
                >
                  {chip.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
              <button className="shop__filter-chip shop__filter-chip--clear" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="shop__grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="shop__grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="shop__empty">
              <div className="shop__empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="shop__empty-title">No products found</h3>
              <p className="shop__empty-text">
                Try adjusting your filters or search to find what you are looking for.
              </p>
              <button className="shop__empty-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal />
    </div>
  );
}
