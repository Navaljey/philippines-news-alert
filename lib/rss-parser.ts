// 번역 함수에 더 상세한 로깅 추가
async function translateToKorean(text: string): Promise<string> {
  try {
    console.log('Translating text:', text.substring(0, 50) + '...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return text;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following English text to Korean. Only provide the translation, nothing else:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    
    console.log('Translation successful');
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // 실패 시 원문 반환
  }
}
