import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch data');
    throw error;
  }
  return res.json();
};

interface HomeData {
  trending: Array<{
    rank: string;
    title: string;
    book_id: string;
    image: string;
    views: string;
    episodes: string;
  }>;
  latest: Array<{
    title: string;
    book_id: string;
    image: string;
    views: string;
    episodes: string;
  }>;
  updatedAt: string | null;
}

export const useHomeData = () => {
  const { data, error, isLoading, mutate } = useSWR<HomeData>('/api/home', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate
  };
};