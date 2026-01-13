"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Participant {
  id: string;
  name: string;
  character: string;
  bio: string;
  position: {
    x: number;
    y: number;
  };
}

interface Message {
  content: string;
  speaker: {
    id: string;
    name: string;
    character: string;
    bio: string;
  };
  recipient: {
    id: string;
    name: string;
    character: string;
    bio: string;
  };
  timestamp: string;
}

interface Conversation {
  conversationId: string;
  participants: Participant[];
  messages: Message[];
  startTime: string;
  endTime?: string;
  totalMessages: number;
  location: {
    x: number;
    y: number;
  };
  completed: boolean;
}

export default function AgentPage() {
  const { address } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/npc/history/${address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cyber-black">
        <div className="w-8 h-8 border-4 border-neon-pink rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cyber-black text-neon-pink">
        <p>Error: {error}</p>
      </div>
    );
  }

  const latestConversation = conversations[0];
  const agentInfo = latestConversation?.participants.find(
    (p) => p.id === address
  );

  return (
    <main className="min-h-screen bg-cyber-black text-white p-8">
      {agentInfo && (
        <div className="max-w-4xl mx-auto">
          {/* Agent Header */}
          <div className="mb-8 p-6 bg-cyber-gray-800/50 border border-neon-blue/30">
            <div className="flex items-start gap-6">
              <div className="w-[192px] h-[192px] overflow-hidden relative">
                <div
                  className="absolute"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundImage: `url(${agentInfo.character})`,
                    backgroundPosition: "0 0",
                    imageRendering: "pixelated",
                    transform: "scale(3)",
                    transformOrigin: "top left",
                  }}
                />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-neon-pink mb-2">
                  {agentInfo.name}
                </h1>
                <p className="text-gray-300">{agentInfo.bio}</p>
              </div>
            </div>
          </div>

          {/* Conversation History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neon-blue mb-4">
              CONVERSATION_LOG
            </h2>
            {conversations.map((conv) => (
              <div
                key={conv.conversationId}
                className="p-4 bg-cyber-gray-800/50 border border-neon-blue/30 hover:border-neon-pink transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-neon-pink">
                      Conversation with:{" "}
                      {conv.participants.find((p) => p.id !== address)?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(conv.startTime).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-neon-blue/20 text-neon-blue">
                    {conv.completed ? "COMPLETED" : "IN_PROGRESS"}
                  </span>
                </div>
                <div className="space-y-2">
                  {conv.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 ${
                        msg.speaker.id === address
                          ? "bg-neon-pink/10"
                          : "bg-neon-blue/10"
                      }`}
                    >
                      <p className="text-sm text-gray-400">
                        {msg.speaker.name}:
                      </p>
                      <p className="text-white">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
