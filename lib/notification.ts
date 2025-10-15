import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (error) {
    console.log('Firebase init error:', error);
  }
}

export interface NotificationPayload {
  title: string;
  body: string;
  link: string;
  category: string;
}

export async function sendPushNotification(
  token: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const message = {
      notification: {
        title: `[${getCategoryLabel(payload.category)}] ${payload.title}`,
        body: payload.body,
      },
      data: {
        link: payload.link,
        category: payload.category,
      },
      token: token,
    };

    await admin.messaging().send(message);
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'korean-community': '한인교민',
    'security': '치안',
    'disaster': '재해/날씨',
    'clark-subic': '클락/수빅',
    'politics': '정치',
    'general': '일반',
  };
  return labels[category] || '뉴스';
}
