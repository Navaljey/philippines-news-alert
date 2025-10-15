import { NextRequest, NextResponse } from 'next/server';
import { translateToKorean, reviewAndSummarize } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { title, content, category } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content required' },
        { status: 400 }
      );
    }

    const titleKo = await translateToKorean(title);
    const summary = await reviewAndSummarize(title, content, category);

    return NextResponse.json({
      success: true,
      titleKo,
      summary,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { success: false, error: 'Translation failed' },
      { status: 500 }
    );
  }
}
