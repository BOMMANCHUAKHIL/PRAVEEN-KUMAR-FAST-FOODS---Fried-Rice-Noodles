import { useState, useEffect, useMemo } from 'react';
import { Product, products as allProducts } from '../data/products';

interface UseProductsOptions {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'popular';
  page?: number;
  itemsPerPage?: number;
}

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setSortBy: (value: 'name' | 'price-asc' | 'price-desc' | 'popular') => void;
  setPage: (value: number) => void;
  loading: boolean;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const {
    search: initialSearch = '',
    category: initialCategory = '',
    sortBy: initialSortBy = 'popular',
    page: initialPage = 1,
    itemsPerPage = 6,
  } = options;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'popular'>(initialSortBy);
  const [currentPage, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case 'popular':
      default:
        // Featured items first, then by availability
        result.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
        break;
    }

    return result;
  }, [search, category, sortBy]);

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, sortBy]);

  return {
    products: allProducts,
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    totalItems,
    setSearch,
    setCategory,
    setSortBy,
    setPage,
    loading,
  };
};