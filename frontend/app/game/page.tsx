'use client';

import Game from '@/components/Game';

export default function GamePage() {
    return <Game farcaster={false} mapPosition={{ x: 0, y: 0 }} />;
}