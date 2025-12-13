import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

interface DramaItem {
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes: string;
}

interface HomeDataResponse {
  latest: DramaItem[];
  trending: DramaItem[];
}

interface LatestResponse {
  success: boolean;
  data: DramaItem[];
  page: number;
  hasMore: boolean;
}

const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 10 minutes
};

export const useTrending = () => {
  const { data, error, isLoading } = useSWR<HomeDataResponse>(
    '/api/drama/home',
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch trending dramas');
      }
      return response.json();
    },
    swrConfig
  );

  return {
    trending: data?.trending || [],
    isLoading,
    error: error?.message || null
  };
};

export const useLatest = (page: number = 1, options?: { keepPreviousData?: boolean }) => {
  const { keepPreviousData = false } = options || {};
  
  const { data, error, isLoading } = useSWR<LatestResponse>(
    `/api/drama/latest?page=${page}`,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch latest dramas');
      }
      return response.json();
    },
    {
      ...swrConfig,
      keepPreviousData
    }
  );

  return {
    latest: data?.data || [],
    hasMore: data?.hasMore || false,
    isLoading,
    error: error?.message || null,
    page
  };
};