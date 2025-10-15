import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/notification';

export async function POST(request: NextRequest) {
  try {
    const { token, title, body, link, category } = await request.json();

    if (!token || !title || !body) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await sendPushNotification(token, {
      title,
      body,
      link,
      category,
    });

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Notification failed' },
      { status: 500 }
    );
  }
}
