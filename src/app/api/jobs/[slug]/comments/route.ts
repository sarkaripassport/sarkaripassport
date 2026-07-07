import { NextResponse } from 'next/server';
import { addJobComment } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    if (!body.name || !body.text) {
      return NextResponse.json(
        { error: 'Name and comment text are required' },
        { status: 400 }
      );
    }

    const commentData = {
      name: body.name.trim(),
      text: body.text.trim(),
    };

    const newComment = await addJobComment(slug, commentData);

    if (!newComment) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
