'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import { Combat, GameState } from 'app/types/game';
import { useRouter } from 'next/navigation';

interface Message {
    speaker: string;
    message: string;
    conversationId: string;
    timestamp?: number;
}

interface GameProps {
    farcaster: boolean;
    mapPosition: {
        x: number;
        y: number;
    };
}

export default function Game({ farcaster, mapPosition }: GameProps) {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>({
        npcs: [],
        activeCombat: null,
        combatLog: []
    });
    const [activeCombat, setActiveCombat] = useState<Combat | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({});
    const [selectedNPC, setSelectedNPC] = useState<any>(null);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003');

        socket.on('connect', () => {
            console.log('Connected to server');
            setIsLoading(false);
        });

        socket.on('gameState', (data: GameState) => {
            setGameState(data);
        });

        socket.on('collision', (data: Combat) => {
            setActiveCombat(data);
        });

        socket.on('gameResumed', () => {
            setActiveCombat(null);
        });

        socket.on('npcMessage', (message: Message) => {
            setConversations(prev => {
                const conversationMessages = prev[message.conversationId] || [];
                const newMessage = {
                    ...message,
                    timestamp: Date.now()
                };
                return {
                    ...prev,
                    [message.conversationId]: [...conversationMessages, newMessage].slice(-3)
                };
            });
        });

        const cleanup = setInterval(() => {
            setConversations(prev => {
                const now = Date.now();
                const filtered: { [key: string]: Message[] } = {};

                Object.entries(prev).forEach(([convId, messages]) => {
                    const validMessages = messages.filter(msg =>
                        msg.timestamp && now - msg.timestamp < 4000
                    );
                    if (validMessages.length > 0) {
                        filtered[convId] = validMessages;
                    }
                });

                return filtered;
            });
        }, 1000);

        return () => {
            socket.disconnect();
            clearInterval(cleanup);
        };
    }, []);

    const handleNPCClick = (npc: any) => {
        setSelectedNPC(npc);
    };

    const handleViewDetails = (address: string) => {
        router.push(`/agents/${address}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen text-white bg-black">
                Loading...
            </div>
        );
    }

    return (
        <div className={`flex justify-center items-center ${farcaster ? 'w-screen' : 'w-screen'} min-h-screen text-white bg-black`}>
            <div className={`relative w-[1864px] h-[1337px] ${farcaster ? 'overflow-hidden' : ''}`}>
                <div 
                    className="absolute w-[1864px] h-[1337px]"
                    style={{
                        transform: farcaster ? `translate(${mapPosition.x}px, ${mapPosition.y}px)` : 'none',
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    {/* Background Image */}
                    <div className="absolute top-0 left-0 z-0 w-full h-full">
                        <Image
                            src="/Cyberpunk Scenes - 22x16.png"
                            alt="Cyberpunk Scene"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Render NPCs */}
                    {gameState.npcs.map((npc, index) => (
                        <div
                            key={index}
                            className="absolute cursor-pointer z-[4]"
                            style={{
                                left: npc.x,
                                top: npc.y,
                                width: npc.size + 30,
                                height: npc.size + 30,
                            }}
                            onClick={() => handleNPCClick(npc)}
                            title={npc.name}
                        >
                            {/* Sprite Cropping Container */}
                            <div className="w-[64px] h-[64px] overflow-hidden relative">
                                <div
                                    className="absolute"
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundImage: `url(${npc.character})`,
                                        backgroundPosition: `-${npc.animation.currentFrame * 32}px -${['down', 'left', 'right', 'up'].indexOf(npc.animation.direction) * 32}px`,
                                        imageRendering: 'pixelated',
                                        transform: 'scale(2)',
                                        transformOrigin: 'top left'
                                    }}
                                />
                            </div>

                            {/* NPC Name above sprite */}
                            <div className="absolute -top-[20px] w-full text-center text-[#0f0] text-[20px] z-[5] text-nowrap"
                                style={{
                                    textShadow: '0 0 5px rgba(0, 255, 0, 0.7)'
                                }}>
                                {npc.name}
                            </div>

                            {/* Speech bubble for conversations */}
                            {Object.entries(conversations).map(([convId, messages]) => {
                                const lastMessage = messages[messages.length - 1];
                                if (lastMessage.speaker === npc.name) {
                                    return (
                                        <div key={convId}
                                            className="absolute -top-[80px] left-1/2 -translate-x-1/2 w-[200px] 
                                        bg-black/80 text-[#0f0] p-2 rounded-lg border border-[#0f0] text-sm z-[6]"
                                            style={{
                                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
                                                animation: 'fadeInOut 4s ease-in-out'
                                            }}>
                                            {lastMessage.message}
                                            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 
                                            w-0 h-0 border-l-[8px] border-l-transparent 
                                            border-t-[8px] border-t-[#0f0] 
                                            border-r-[8px] border-r-transparent">
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ))}

                    {/* NPC Info Popup */}
                    {selectedNPC && (
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            bg-black/95 text-[#0f0] p-6 rounded-lg z-50 border-2 border-[#0f0] min-w-[300px]"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}>
                            <button 
                                className="absolute top-2 right-2 text-[#0f0] hover:text-white"
                                onClick={() => setSelectedNPC(null)}
                            >
                                ×
                            </button>
                            <h2 className="text-xl font-bold mb-2">{selectedNPC.name}</h2>
                            {/* <p className="mb-2">{selectedNPC.character}</p>
                            <p className="mb-4">{selectedNPC.instructions}</p> */}
                            <button
                                className="w-full bg-[#0f0]/20 hover:bg-[#0f0]/30 text-[#0f0] 
                                py-2 px-4 rounded border border-[#0f0] transition-colors"
                                onClick={() => handleViewDetails(selectedNPC.address)}
                            >
                                View Details
                            </button>
                        </div>
                    )}

                    {/* Combat overlay */}
                    {activeCombat && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-black/80 text-[#0f0] rounded-lg z-[5] border-2 border-[#0f0]"
                            style={{
                                boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)'
                            }}>
                            <h2 className="text-center mb-2.5">Combat!</h2>
                            <p className="text-center">{activeCombat.npc1} vs {activeCombat.npc2}</p>
                        </div>
                    )}

                    {/* Conversation Log */}
                    <div className="absolute right-4 top-4 w-[300px] max-h-[400px] overflow-y-auto bg-black/90 
                    text-[#0f0] p-4 rounded-lg border-2 border-[#0f0] z-[7]"
                        style={{
                            boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                        }}>
                        <h3 className="text-center mb-2 text-xl border-b border-[#0f0] pb-2">Conversations</h3>
                        {Object.values(conversations).map((messages, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                {messages.map((msg, msgIdx) => (
                                    <div key={msgIdx} className="mb-1 last:mb-0">
                                        <span className="font-bold">{msg.speaker}:</span> {msg.message}
                                    </div>
                                ))}
                                {idx < Object.values(conversations).length - 1 && (
                                    <div className="border-b border-[#0f0]/30 my-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
