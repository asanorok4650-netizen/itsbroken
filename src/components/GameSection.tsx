import GameCard from './GameCard';
import EmptyState from './EmptyState';
import type { GameItem } from '../types';

type GameSectionProps = {
  id: string;
  visible: boolean;
  heading: string;
  description: string;
  items: GameItem[];
  onOpenFile?: () => void;
  onSelectGame: () => void;
};

export default function GameSection({
  id,
  visible,
  heading,
  description,
  items,
  onOpenFile,
  onSelectGame,
}: GameSectionProps) {
  return (
    <section className={`section-block ${visible ? '' : 'hidden'}`} id={id}>
      <div className="section-heading">
        <div>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="games-grid" id={id === 'recent-section' ? 'recent-games' : 'library-games'}>
        {items.length ? (
          items.map((item) => (
            <GameCard key={`${item.name}-${item.openedAt}`} item={item} onSelectGame={onSelectGame} />
          ))
        ) : (
          <EmptyState
            title="表示できるゲームがありません"
            description="ファイルを追加するか、検出されたワールドがない場合は別の名前で検索してください。"
            buttonId={id === 'library-section' ? 'empty-open-button' : undefined}
            onOpenFile={onOpenFile}
          />
        )}
      </div>
    </section>
  );
}
