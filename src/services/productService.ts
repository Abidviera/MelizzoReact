import type { Product, Category, ProductFilters } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pistachio Kunafa Dubai Chocolate',
    slug: 'pistachio-kunafa-dubai-chocolate',
    description: 'Experience the authentic taste of Dubai with our signature Pistachio Kunafa Chocolate Bar. A perfect fusion of traditional Middle Eastern knafa flaky pastry filled with premium pistachio cream, enrobed in rich dark chocolate. Each bar is crafted with 72% Dubai-sourced cocoa and real pistachios for an unforgettable crunch.',
    shortDescription: 'Crunchy. Syrupy. Unapologetically Bold.',
    price: 24.99,
    originalPrice: 29.99,
    images: [{ url: '/KUNAFAPISTACHIO/ezgif-frame-001.png', alt: 'Pistachio Kunafa Chocolate' }],
    category: 'Dubai Chocolate',
    categorySlug: 'dubai-chocolate',
    brand: 'MELiZZO',
    tags: ['bestseller', 'featured', 'new'],
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    stockQuantity: 150,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    features: [
      { icon: '🌿', label: 'Ingredients', value: '72% Cocoa, Real Pistachios' },
      { icon: '📦', label: 'Size', value: '90g Bar' },
      { icon: '🏪', label: 'Origin', value: 'Made in UAE' },
    ],
  },
  {
    id: '2',
    name: 'Angel Hair White Dubai Chocolate',
    slug: 'angel-hair-white-dubai-chocolate',
    description: 'Delicate angel hair pastry strands infused with creamy white chocolate and a hint of vanilla. This ethereal creation melts in your mouth, releasing layers of sweet, buttery flavors inspired by the finest Dubai confections. A refined treat for those who appreciate subtle elegance.',
    shortDescription: 'Silky. Luxurious. Tastes Like Heaven.',
    price: 22.99,
    images: [{ url: '/ANGLE HAIR/ezgif-frame-001.png', alt: 'Angel Hair White Chocolate' }],
    category: 'Dubai Chocolate',
    categorySlug: 'dubai-chocolate',
    brand: 'MELiZZO',
    tags: ['featured', 'new'],
    rating: 4.9,
    reviewCount: 218,
    inStock: true,
    stockQuantity: 200,
    isFeatured: true,
    isNew: true,
    features: [
      { icon: '🌿', label: 'Ingredients', value: '34% White Cocoa, Vanilla' },
      { icon: '📦', label: 'Size', value: '85g Bar' },
      { icon: '🏪', label: 'Origin', value: 'Made in UAE' },
    ],
  },
  {
    id: '3',
    name: 'MELiZZO Mystery Box',
    slug: 'melizzo-mystery-box',
    description: 'A curated selection of MELiZZO finest chocolates delivered to your door. Each mystery box contains a surprise assortment of our signature bars, limited editions, and exclusive creations. Perfect for gifting or treating yourself to something extraordinary.',
    shortDescription: 'Something Extraordinary is Baking…',
    price: 49.99,
    images: [{ url: '/ComminSoon/ezgif-frame-001.png', alt: 'Mystery Box' }],
    category: 'Gift Sets',
    categorySlug: 'gift-sets',
    brand: 'MELiZZO',
    tags: ['coming-soon', 'limited'],
    rating: 5.0,
    reviewCount: 0,
    inStock: false,
    stockQuantity: 0,
    isFeatured: false,
    isNew: true,
    features: [
      { icon: '🎁', label: 'Contents', value: '5+ Chocolate Bars' },
      { icon: '📦', label: 'Size', value: 'Mixed Weight' },
      { icon: '🎀', label: 'Packaging', value: 'Gift Box' },
    ],
  },
  {
    id: '4',
    name: 'Classic Dark Collection',
    slug: 'classic-dark-collection',
    description: 'Our curated collection of dark chocolate bars featuring varying cocoa percentages from 60% to 85%. Each bar showcases the pure, intense flavors of single-origin cocoa with no artificial additives. Ideal for dark chocolate purists.',
    shortDescription: 'Pure. Intense. Uncompromising.',
    price: 34.99,
    images: [{ url: '/chocolate images/classic-dark.jpg', alt: 'Classic Dark Collection' }],
    category: 'Collections',
    categorySlug: 'collections',
    brand: 'MELiZZO',
    tags: ['collection'],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 80,
    isFeatured: false,
    features: [
      { icon: '🍫', label: 'Includes', value: '3 Dark Chocolate Bars' },
      { icon: '📦', label: 'Size', value: '3 x 75g' },
      { icon: '🌿', label: 'Cocoa', value: '60-85% Range' },
    ],
  },
  {
    id: '5',
    name: 'Corporate Gift Box — Premium',
    slug: 'corporate-gift-box-premium',
    description: 'Elevate your corporate gifting with our premium collection featuring 12 hand-selected MELiZZO chocolate bars, elegantly packaged in a keepsake box with your custom branding. Includes a personalized note card and tasting guide.',
    shortDescription: 'Make an Impression. Delight Your Team.',
    price: 129.99,
    images: [{ url: '/chocolate images/corporate-gift.jpg', alt: 'Corporate Gift Box' }],
    category: 'Corporate',
    categorySlug: 'corporate',
    brand: 'MELiZZO',
    tags: ['corporate', 'gift', 'bulk'],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    stockQuantity: 50,
    isFeatured: true,
    features: [
      { icon: '🎁', label: 'Quantity', value: '12 Bars' },
      { icon: '📦', label: 'Packaging', value: 'Custom Branded' },
      { icon: '💼', label: 'MOQ', value: '10 Boxes' },
    ],
  },
  {
    id: '6',
    name: 'Pistachio Duo Pack',
    slug: 'pistachio-duo-pack',
    description: "Can't decide between Kunafa and Classic Pistachio? Get both in our carefully curated duo pack. Two full-size bars showcasing the versatility of premium pistachio in two distinct chocolate traditions. Perfect for sharing or stocking up.",
    shortDescription: 'Two Icons. One Perfect Pack.',
    price: 39.99,
    originalPrice: 44.99,
    images: [{ url: '/chocolate images/pistachio-duo.jpg', alt: 'Pistachio Duo Pack' }],
    category: 'Bundles',
    categorySlug: 'bundles',
    brand: 'MELiZZO',
    tags: ['bundle', 'value'],
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 120,
    isFeatured: false,
    features: [
      { icon: '🍫', label: 'Includes', value: '2 Full-Size Bars' },
      { icon: '📦', label: 'Size', value: '2 x 90g' },
      { icon: '💰', label: 'Savings', value: '$5 Off' },
    ],
  },
];

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Dubai Chocolate', slug: 'dubai-chocolate', description: 'Authentic Dubai chocolate bars', productCount: 3 },
  { id: '2', name: 'Gift Sets', slug: 'gift-sets', description: 'Curated chocolate gift collections', productCount: 2 },
  { id: '3', name: 'Collections', slug: 'collections', description: 'Themed chocolate collections', productCount: 1 },
  { id: '4', name: 'Corporate', slug: 'corporate', description: 'Corporate and bulk orders', productCount: 1 },
  { id: '5', name: 'Bundles', slug: 'bundles', description: 'Value bundles and combos', productCount: 1 },
];

export const ProductService = {
  getAll(): Product[] {
    return MOCK_PRODUCTS;
  },

  getById(id: string): Product | undefined {
    return MOCK_PRODUCTS.find((p) => p.id === id);
  },

  getBySlug(slug: string): Product | undefined {
    return MOCK_PRODUCTS.find((p) => p.slug === slug);
  },

  getFeatured(): Product[] {
    return MOCK_PRODUCTS.filter((p) => p.isFeatured);
  },

  getBestsellers(): Product[] {
    return MOCK_PRODUCTS.filter((p) => p.isBestseller);
  },

  getNewArrivals(): Product[] {
    return MOCK_PRODUCTS.filter((p) => p.isNew);
  },

  getByCategory(categorySlug: string): Product[] {
    return MOCK_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
  },

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  },

  filter(filters: ProductFilters): Product[] {
    let results = [...MOCK_PRODUCTS];

    if (filters.category) {
      results = results.filter((p) => p.categorySlug === filters.category);
    }
    if (filters.brand) {
      results = results.filter((p) => p.brand?.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.inStock !== undefined) {
      results = results.filter((p) => p.inStock === filters.inStock);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          results.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          results.sort((a, b) => {
            if (a.isNew && !b.isNew) return -1;
            if (!a.isNew && b.isNew) return 1;
            return 0;
          });
          break;
      }
    }

    return results;
  },

  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  },

  getRelated(productId: string, limit = 4): Product[] {
    const product = this.getById(productId);
    if (!product) return [];
    return MOCK_PRODUCTS.filter(
      (p) => p.id !== productId && p.categorySlug === product.categorySlug
    ).slice(0, limit);
  },
};
