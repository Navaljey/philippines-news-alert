import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔥🔥🔥 TEST API CALLED! 🔥🔥🔥');
  
  return NextResponse.json({
    success: true,
    message: 'Test API works!',
    timestamp: new Date().toISOString()
  });
}
