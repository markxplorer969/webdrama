import { getDramaDetail } from '@/app/actions/drama-detail';
import { notFound } from 'next/navigation';
import DramaClientView from '@/components/drama/DramaClientView';

interface DramaDetailPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function DramaDetailPage({ params }: DramaDetailPageProps) {
  const { bookId } = await params;
  
  let dramaDetail;
  
  try {
    dramaDetail = await getDramaDetail(bookId);
  } catch (error) {
    console.error('Error loading drama detail:', error);
  }

  if (!dramaDetail) {
    notFound();
  }

  // Pass the drama data to the client component
  return <DramaClientView drama={dramaDetail} />;
}