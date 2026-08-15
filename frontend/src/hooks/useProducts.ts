import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { Product } from '../types/product';

interface UseProductsOptions {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'popular';
  page?: number;
  itemsPerPage?: number;
}

interface UseProductsReturn {
  // Backend products
  products: Product[];

  // Filtered/sorted products
  filteredProducts: Product[];

  // Current page products
  paginatedProducts: Product[];

  // Pagination
  totalPages: number;
  currentPage: number;
  totalItems: number;

  // Filters
  search: string;
  category: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'popular';

  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setSortBy: (
    value: 'name' | 'price-asc' | 'price-desc' | 'popular'
  ) => void;
  setPage: (value: number) => void;

  // API state
  loading: boolean;
  error: string | null;

  // API functions
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  createProduct: (
    productData: Omit<Product, 'id'>
  ) => Promise<Product>;
  updateProduct: (
    id: string,
    productData: Partial<Product>
  ) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProducts = (
  options: UseProductsOptions = {}
): UseProductsReturn => {
  const {
    search: initialSearch = '',
    category: initialCategory = '',
    sortBy: initialSortBy = 'popular',
    page: initialPage = 1,
    itemsPerPage = 6,
  } = options;

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState(initialSearch);

  const [category, setCategory] = useState(initialCategory);

  const [sortBy, setSortBy] = useState<
    'name' | 'price-asc' | 'price-desc' | 'popular'
  >(initialSortBy);

  const [currentPage, setPage] = useState(initialPage);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📦 Fetching products from backend...');

      const response = await api.get('/api/products');

      console.log('📦 Products received:', response.data);

      // Make sure response is an array
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error(
          '❌ Invalid products response:',
          response.data
        );

        setProducts([]);
        setError('Invalid product data received from server');
      }
    } catch (err: any) {
      console.error('❌ Failed to load products:', err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load products'
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // GET SINGLE PRODUCT
  // =====================================================

  const getProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      try {
        console.log(`📦 Fetching product: ${id}`);

        const response = await api.get(
          `/api/products/${id}`
        );

        console.log(
          '📦 Product received:',
          response.data
        );

        return response.data;
      } catch (err) {
        console.error(
          `❌ Failed to get product ${id}:`,
          err
        );

        return null;
      }
    },
    []
  );

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  const createProduct = useCallback(
    async (
      productData: Omit<Product, 'id'>
    ): Promise<Product> => {
      try {
        console.log(
          '➕ Creating product:',
          productData
        );

        const response = await api.post(
          '/api/products',
          productData
        );

        console.log(
          '✅ Product created:',
          response.data
        );

        // Refresh backend product list
        await fetchProducts();

        return response.data;
      } catch (err) {
        console.error(
          '❌ Failed to create product:',
          err
        );

        throw err;
      }
    },
    [fetchProducts]
  );

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const updateProduct = useCallback(
    async (
      id: string,
      productData: Partial<Product>
    ): Promise<Product> => {
      try {
        console.log(
          `✏️ Updating product ${id}:`,
          productData
        );

        const response = await api.put(
          `/api/products/${id}`,
          productData
        );

        console.log(
          '✅ Product updated:',
          response.data
        );

        // Refresh backend product list
        await fetchProducts();

        return response.data;
      } catch (err) {
        console.error(
          `❌ Failed to update product ${id}:`,
          err
        );

        throw err;
      }
    },
    [fetchProducts]
  );

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      try {
        console.log(
          `🗑️ Deleting product ${id}`
        );

        await api.delete(
          `/api/products/${id}`
        );

        console.log(
          `✅ Product ${id} deleted`
        );

        // Refresh backend product list
        await fetchProducts();
      } catch (err) {
        console.error(
          `❌ Failed to delete product ${id}:`,
          err
        );

        throw err;
      }
    },
    [fetchProducts]
  );

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // ---------------------------------------------
    // SEARCH
    // ---------------------------------------------

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || '';

        const description =
          product.description?.toLowerCase() || '';

        const tags =
          product.tags || [];

        return (
          name.includes(query) ||
          description.includes(query) ||
          tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
        );
      });
    }

    // ---------------------------------------------
    // CATEGORY
    // ---------------------------------------------

    if (category) {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // ---------------------------------------------
    // SORT
    // ---------------------------------------------

    switch (sortBy) {
      case 'name':
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'price-asc':
        result.sort(
          (a, b) =>
            (a.variants?.[0]?.price || 0) -
            (b.variants?.[0]?.price || 0)
        );
        break;

      case 'price-desc':
        result.sort(
          (a, b) =>
            (b.variants?.[0]?.price || 0) -
            (a.variants?.[0]?.price || 0)
        );
        break;

      case 'popular':
      default:
        result.sort((a, b) => {
          const aFeatured =
            a.isFeatured ? 1 : 0;

          const bFeatured =
            b.isFeatured ? 1 : 0;

          return bFeatured - aFeatured;
        });

        break;
    }

    return result;
  }, [
    products,
    search,
    category,
    sortBy,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalItems =
    filteredProducts.length;

  const totalPages =
    Math.ceil(totalItems / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start =
      (currentPage - 1) *
      itemsPerPage;

    const end =
      start + itemsPerPage;

    return filteredProducts.slice(
      start,
      end
    );
  }, [
    filteredProducts,
    currentPage,
    itemsPerPage,
  ]);

  // =====================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
    sortBy,
  ]);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    products,
    filteredProducts,
    paginatedProducts,

    totalPages,
    currentPage,
    totalItems,

    search,
    category,
    sortBy,

    setSearch,
    setCategory,
    setSortBy,
    setPage,

    loading,
    error,

    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};