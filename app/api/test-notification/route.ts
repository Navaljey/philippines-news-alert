import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/notification';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ 
        error: 'Token required' 
      }, { status: 400 });
    }

    const success = await sendPushNotification(token, {
      title: '테스트 알림',
      body: '올롱가포 마을에 홍수 발생',
      link: 'https://newsinfo.inquirer.net/test',
      category: 'disaster',
    });

    return NextResponse.json({ 
      success,
      message: success ? 'Notification sent!' : 'Failed to send'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: String(error) 
    }, { status: 500 });
  }
}
