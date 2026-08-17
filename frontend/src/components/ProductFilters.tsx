import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

export type SortOption =
  | 'name'
  | 'price-asc'
  | 'price-desc'
  | 'popular';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  categories?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    icon: '🍚',
  },
  {
    id: 'noodles',
    name: 'Noodles',
    icon: '🍜',
  },
  {
    id: 'manchurian',
    name: 'Manchurian',
    icon: '🥦',
  },
  {
    id: 'chicken',
    name: 'Chicken',
    icon: '🍗',
  },
  {
    id: 'starters',
    name: 'Starters',
    icon: '🍽️',
  },
];

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  categories = defaultCategories,
}: ProductFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    {
      value: 'popular',
      label: 'Most Popular',
    },
    {
      value: 'name',
      label: 'Name A-Z',
    },
    {
      value: 'price-asc',
      label: 'Price: Low to High',
    },
    {
      value: 'price-desc',
      label: 'Price: High to Low',
    },
  ];

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(
      selectedCategory === category ? '' : selectedCategory
    );

    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for food..."
            className="w-full pl-12 pr-12 py-3 bg-white border border-[#e2d3c0] rounded-2xl focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="px-4 py-3 bg-white border border-[#e2d3c0] rounded-2xl focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition appearance-none pr-10"
            style={{
              backgroundImage:
                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
            }}
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen((open) => !open)}
            className={`px-4 py-3 rounded-2xl border transition flex items-center gap-2 ${
              category
                ? 'bg-deep-maroon text-white border-deep-maroon'
                : 'bg-white border-[#e2d3c0] hover:bg-gray-50'
            }`}
          >
            <FaFilter />

            <span className="hidden sm:inline">
              Filter
            </span>

            {category && (
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                1
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-2xl border border-[#e2d3c0] shadow-lg">
          <div className="flex flex-wrap gap-2">
            {/* All */}
            <button
              type="button"
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                !category
                  ? 'bg-deep-maroon text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>

            {/* Categories */}
            {categories.map((cat: Category) => (
              <button
                type="button"
                key={cat.id}
                onClick={() =>
                  handleCategoryChange(cat.id)
                }
                className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
                  category === cat.id
                    ? 'bg-deep-maroon text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}