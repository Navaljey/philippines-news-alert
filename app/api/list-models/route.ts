import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' });
    }

    // 사용 가능한 모델 목록 조회
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `API error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    
    // generateContent를 지원하는 모델만 필터링
    const generateContentModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    );

    return NextResponse.json({
      success: true,
      totalModels: data.models?.length || 0,
      generateContentModels: generateContentModels?.map((m: any) => m.name) || [],
      allModels: data.models || []
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error)
    });
  }
}
