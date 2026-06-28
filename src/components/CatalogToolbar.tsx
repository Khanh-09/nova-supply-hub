import { useEffect, useState, useCallback } from 'react';
import { SUPPLY_CATALOG, type SupplyItem } from '../lib/contract';

export type SortOption = 'price-asc' | 'price-desc' | 'name';

interface CatalogToolbarProps {
  onFilterChange: (filtered: SupplyItem[]) => void;
}

const CATEGORIES = ['All', ...Array.from(new Set(SUPPLY_CATALOG.map((i) => i.category)))];

function filterItems(search: string, category: string, sort: SortOption): SupplyItem[] {
  let items = [...SUPPLY_CATALOG];

  if (category !== 'All') {
    items = items.filter((i) => i.category === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }

  items.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return items;
}

export default function CatalogToolbar({ onFilterChange }: CatalogToolbarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<SortOption>('name');

  const applyFilters = useCallback(() => {
    onFilterChange(filterItems(search, category, sort));
  }, [search, category, sort, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="catalog-toolbar glass">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search supplies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search supplies"
        />
      </div>
      <div className="toolbar-filters">
        <div className="category-pills" role="tablist" aria-label="Categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              className={`pill ${category === cat ? 'pill-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort by"
        >
          <option value="name">Name A–Z</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
}
