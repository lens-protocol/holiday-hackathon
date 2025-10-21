import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/utils/session.options';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  await session.destroy();
  return NextResponse.json({ ok: true });
}
