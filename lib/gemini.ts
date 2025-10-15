`import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function translateToKorean(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = \`다음 필리핀 뉴스 제목과 내용을 자연스러운 한국어로 번역해주세요. 
뉴스의 핵심 내용을 정확하게 전달하되, 한국 독자가 이해하기 쉽게 번역해주세요.

원문:
\${text}

번역:\`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function reviewAndSummarize(title: string, content: string, category: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = \`다음은 "\${category}" 카테고리의 필리핀 뉴스입니다.
이 뉴스를 한국인 독자를 위해 요약하고 리뷰해주세요. 
- 핵심 내용 3줄 요약
- 한국 교민들에게 미치는 영향 (있다면)
- 주의사항 또는 권고사항 (있다면)

제목: \${title}
내용: \${content}

요약 및 리뷰:\`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Review error:', error);
    return '요약을 생성할 수 없습니다.';
  }
}`
    },
    {
