export interface MapElement {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: 'building' | 'obstacle' | 'ground';
  name: string;
}

export interface NPC {
  x: number;
  y: number;
  size: number;
  name: string;
  character: string;
  animation: {
    currentFrame: number;
    direction: string;
  };
}

export interface GameState {
  npcs: NPC[];
  activeCombat: Combat | null;
  combatLog: string[];
}

export interface Combat {
  npc1: string;
  npc2: string;
} 