import { NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories API:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await saveCategories(data);
    
    // Invalidate caches to update category links across all pages
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving categories API:", error);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
