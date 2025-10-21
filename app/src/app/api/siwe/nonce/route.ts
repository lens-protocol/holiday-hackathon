import { NextResponse } from 'next/server';
import { generateSiweNonce } from 'viem/siwe';

export async function GET() {
  const nonce = generateSiweNonce();

  return NextResponse.json({ nonce });
}
