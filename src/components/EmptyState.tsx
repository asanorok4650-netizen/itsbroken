import type { GameItem } from '../types';

type GameCardProps = {
  item: GameItem;
  onSelectGame: () => void;
};

const formatSize = (bytes: number): string => {
  if (!Number.isFinite(bytes)) {
    return 'サイズ不明';
  }

  return bytes < 1048576
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1048576).toFixed(1)} MB`;
};

export default function GameCard({ item, onSelectGame }: GameCardProps) {
  return (
    <article className="game-card" onClick={onSelectGame}>
      <div className="game-thumb">▧</div>
      <div className="game-info">
        <strong>{item.name}</strong>
        <small>
          {item.format.toUpperCase()} • {formatSize(item.size)}
        </small>
      </div>
    </article>
  );
}
