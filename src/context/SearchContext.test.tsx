import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SearchProvider, useSearch } from './SearchContext';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  },
}));

describe('SearchContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <SearchProvider>{children}</SearchProvider>
    </MemoryRouter>
  );

  it('provides default filters', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.filters.location).toBe('');
    expect(result.current.filters.radius).toBe(20);
    expect(result.current.filters.guests).toBe(1);
  });

  it('updates filters correctly', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.updateFilter('location', 'New York');
    });

    expect(result.current.filters.location).toBe('New York');
  });

  it('updates multiple filters via setFilters', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        location: 'London',
        guests: 3
      });
    });

    expect(result.current.filters.location).toBe('London');
    expect(result.current.filters.guests).toBe(3);
  });
});
