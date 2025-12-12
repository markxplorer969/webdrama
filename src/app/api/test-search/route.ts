import { NextResponse, NextRequest } from 'next/server';
import { searchAction } from '@/app/actions/search';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await searchAction(formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}