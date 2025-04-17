
import React from 'react';
import { Player } from '@/types';
import PlayerProfile from './PlayerProfile';

interface PlayerListProps {
  players: Player[];
}

const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {players.map((player) => (
        <PlayerProfile key={player.id} player={player} />
      ))}
    </div>
  );
};

export default PlayerList;
