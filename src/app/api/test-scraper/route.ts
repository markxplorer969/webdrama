import { NextResponse } from 'next/server';
import { dramabox } from '@/lib/scrapers/dramabox';

export async function GET() {
  try {
    console.log('Testing scraper...');
    const result = await dramabox.home();
    console.log('Scraper result:', result);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Scraper test successful'
    });
  } catch (error) {
    console.error('Scraper test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: 'Scraper test failed'
    }, { status: 500 });
  }
}