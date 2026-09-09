import { NextResponse } from 'next/server';
import { SearchService } from '@/lib/services/search.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || undefined;
    const brandSlug = searchParams.get('brand') || undefined;
    const minPriceKes = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPriceKes = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'best_value';
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);

    const result = await SearchService.searchProducts({
      query,
      categorySlug,
      brandSlug,
      minPriceKes,
      maxPriceKes,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Products GET Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}
