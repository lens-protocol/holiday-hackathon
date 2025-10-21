import { SiweMessage } from 'siwe';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '@/utils/session.options';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    const siwe = await siweMessage.verify({ signature });

    if (!siwe.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    session.address = siweMessage.address;
    session.chainId = siweMessage.chainId;

    await session.save();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
