import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '@/utils/session.options';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    return NextResponse.json({
      address: session.address,
      chainId: session.chainId,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
