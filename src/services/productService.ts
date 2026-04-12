import type { Product, Category, ProductFilters } from '../types';
import apiClient from './apiClient';

// ── Backend DTO types (must match API responses) ────────────────
interface ProductImageDto { url: string; alt?: string | null; }

interface ProductListDto {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  categorySlug: string;
  categoryName: string;
  inStock: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  rating?: number | null;
  reviewCount: number;
  tags?: string[] | null;
  features?: string[] | null;
  ingredients?: string | null;
}

interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  images: ProductImageDto[];
  categorySlug: string;
  categoryName: string;
  brand?: string | null;
  tags: string[];
  weight: number;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  rating?: number | null;
  reviewCount: number;
  features: string[];
  ingredients?: string | null;
}

interface CategoryListDto {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Mapping ────────────────────────────────────────────────────
function mapProduct(dto: ProductListDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: '',
    price: dto.price,
    originalPrice: dto.originalPrice ?? undefined,
    images: [{ url: dto.imageUrl, alt: dto.name }],
    category: dto.categoryName,
    categorySlug: dto.categorySlug,
    brand: 'MELiZZO',
    tags: dto.tags ?? [
      dto.isFeatured ? 'featured' : '',
      dto.isBestseller ? 'bestseller' : '',
      dto.isNew ? 'new' : '',
    ].filter(Boolean),
    rating: dto.rating ?? undefined,
    reviewCount: dto.reviewCount,
    inStock: dto.inStock,
    stockQuantity: 0,
    isFeatured: dto.isFeatured,
    isBestseller: dto.isBestseller,
    isNew: dto.isNew,
    features: dto.features ?? [],
    ingredients: dto.ingredients ?? undefined,
  };
}

function mapProductDetail(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    shortDescription: dto.shortDescription ?? undefined,
    price: dto.price,
    originalPrice: dto.originalPrice ?? undefined,
    images: dto.images.map((img) => ({ url: img.url, alt: img.alt ?? undefined })),
    category: dto.categoryName,
    categorySlug: dto.categorySlug,
    brand: dto.brand ?? 'MELiZZO',
    tags: dto.tags,
    rating: dto.rating ?? undefined,
    reviewCount: dto.reviewCount,
    inStock: dto.inStock,
    stockQuantity: dto.stockQuantity,
    isFeatured: dto.isFeatured,
    isBestseller: dto.isBestseller,
    isNew: dto.isNew,
    features: dto.features.map((f, i) => ({ label: f, value: '' })),
    ingredients: dto.ingredients ?? undefined,
  };
}

// ── Product Service ────────────────────────────────────────────
export const ProductService = {
  async getAll(
    filters: ProductFilters = {},
    page = 1,
    pageSize = 20,
  ): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        pageSize,
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStock: filters.inStock,
        search: filters.search,
        sortBy: filters.sortBy?.replace(/-/g, '').replace('priceasc', 'price').replace('pricedesc', 'price') ?? 'newest',
      };

      const response = await apiClient.get<PagedResult<ProductListDto>>('/products', { params });
      const data = response.data;

      return {
        products: data.items.map(mapProduct),
        total: data.totalCount,
        totalPages: data.totalPages,
      };
    } catch {
      return { products: [], total: 0, totalPages: 0 };
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<ProductDto>(`/products/${id}`);
      return mapProductDetail(response.data);
    } catch {
      return null;
    }
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<ProductDto>(`/products/slug/${slug}`);
      return mapProductDetail(response.data);
    } catch {
      return null;
    }
  },

  async getFeatured(limit = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get<ProductListDto[]>('/products/featured', {
        params: { limit },
      });
      return response.data.map(mapProduct);
    } catch {
      return [];
    }
  },

  async getBestsellers(limit = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get<ProductListDto[]>('/products/bestsellers', {
        params: { limit },
      });
      return response.data.map(mapProduct);
    } catch {
      return [];
    }
  },

  async getNewArrivals(limit = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get<PagedResult<ProductListDto>>('/products', {
        params: { page: 1, pageSize: limit, sortBy: 'newest' },
      });
      return response.data.items.map(mapProduct);
    } catch {
      return [];
    }
  },

  async getByCategory(categorySlug: string, page = 1, pageSize = 20): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await apiClient.get<PagedResult<ProductListDto>>('/products', {
        params: { page, pageSize, category: categorySlug },
      });
      return {
        products: response.data.items.map(mapProduct),
        total: response.data.totalCount,
      };
    } catch {
      return { products: [], total: 0 };
    }
  },

  async search(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<PagedResult<ProductListDto>>('/products', {
        params: { page: 1, pageSize: 50, search: query },
      });
      return response.data.items.map(mapProduct);
    } catch {
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<CategoryListDto[]>('/categories');
      return response.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: cat.productCount,
      }));
    } catch {
      return [];
    }
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    try {
      const response = await apiClient.get<PagedResult<ProductListDto>>('/products', {
        params: { page: 1, pageSize: limit + 1 },
      });
      return response.data.items
        .filter((p) => p.id !== productId)
        .slice(0, limit)
        .map(mapProduct);
    } catch {
      return [];
    }
  },
};
