import { NextResponse } from 'next/server';
import { SearchService } from '@/lib/services/search.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const suggestions = await SearchService.getAutocomplete(query);
    return NextResponse.json({ suggestions });
  } catch (error: any) {
    return NextResponse.json({ suggestions: [] });
  }
}
