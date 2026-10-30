import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

type PageKey = 'home' | 'discover' | 'friends' | 'recent';
type GameFormat = 'rbxl' | 'rbxlx';

type GameItem = {
  name: string;
  size: number;
  openedAt: string;
  format: GameFormat;
};

const PAGE_CONFIG: Record<
  PageKey,
  { title: string; subtitle: string; sectionIds: string[] }
> = {
  home: {
    title: 'ホーム',
    subtitle: 'お気に入りのワールドに戻ろう。',
    sectionIds: ['recent-section', 'library-section'],
  },
  discover: {
    title: '探索',
    subtitle: '新しいワールドを見つけよう。',
    sectionIds: ['discover-section'],
  },
  friends: {
    title: 'フレンド',
    subtitle: '一緒に遊ぶ仲間を見つけよう。',
    sectionIds: ['friends-section'],
  },
  recent: {
    title: '最近プレイしたゲーム',
    subtitle: '最近開いたワールド。',
    sectionIds: ['recent-section'],
  },
};

const readItems = (): GameItem[] => {
  try {
    const raw = localStorage.getItem('rbxl-player-recent-v1');
    return raw ? (JSON.parse(raw) as GameItem[]) : [];
  } catch (error) {
    return [];
  }
};

const formatSize = (bytes: number): string => {
  if (!Number.isFinite(bytes)) return 'サイズ不明';
  return bytes < 1048576
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1048576).toFixed(1)} MB`;
};

const buildEmptyState = (isLibraryView: boolean) => (
  <div className="empty-card" id={isLibraryView ? 'upload-panel' : undefined}>
    <div className="empty-icon">▧</div>
    <strong>表示できるゲームがありません</strong>
    <span>ファイルを追加するか、検出されたワールドがない場合は別の名前で検索してください。</span>
    <button
      type="button"
      className="open-file-button"
      id={isLibraryView ? 'empty-open-button' : undefined}
      onClick={() => fileInputRef?.current?.click()}
    >
      ファイルを開く
    </button>
  </div>
);

const fileInputRef = { current: null as HTMLInputElement | null };

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [games, setGames] = useState<GameItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setGames(readItems());
  }, []);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return games;
    return games.filter((item) => item.name.toLowerCase().includes(query));
  }, [games, searchQuery]);

  const handlePageSelect = (page: PageKey) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (extension !== 'rbxl' && extension !== 'rbxlx') {
      setStatusMessage('対応しているファイルは .rbxl / .rbxlx です。');
      event.target.value = '';
      return;
    }

    const nextGames = [
      {
        name: file.name,
        size: file.size,
        openedAt: new Date().toISOString(),
        format: extension as GameFormat,
      },
      ...games.filter((item) => item.name !== file.name),
    ].slice(0, 12);

    try {
      localStorage.setItem('rbxl-player-recent-v1', JSON.stringify(nextGames));
      setGames(nextGames);
      setStatusMessage(
        `${file.name} をライブラリに追加しました。※現在は画面表示のみで、ゲームの解析・実行機能は未実装です。`,
      );
    } catch (error) {
      setStatusMessage(
        'ブラウザに保存できませんでした。ブラウザの保存設定をご確認ください。',
      );
    }

    event.target.value = '';
  };

  const currentPageInfo = PAGE_CONFIG[activePage];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <a
          className="brand"
          href="#"
          data-page="home"
          onClick={(event) => {
            event.preventDefault();
            handlePageSelect('home');
          }}
          aria-label="RBXL Player ホーム"
        >
          <span className="brand-mark">R</span>
          <span>RBXL Player</span>
        </a>

        <nav className="main-nav" aria-label="メインメニュー">
          {Object.entries(PAGE_CONFIG).map(([page, config]) => (
            <button
              key={page}
              type="button"
              className={`nav-item ${activePage === page ? 'active' : ''}`}
              data-page={page}
              onClick={() => handlePageSelect(page as PageKey)}
            >
              <span className="nav-icon">
                {page === 'home' ? '⌂' : page === 'discover' ? '◈' : page === 'friends' ? '♧' : '◷'}
              </span>
              {config.title}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            ローカルのワールドを
            <br />
            ブラウザで楽しもう。
          </div>
          <div className="profile-mini">
            <div className="avatar">G</div>
            <div>
              <strong>Guest User</strong>
              <small>Local session</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            type="button"
            className="mobile-menu"
            id="mobile-menu"
            aria-label="メニューを開く"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>

          <label className="search-box" htmlFor="search-input">
            <span>⌕</span>
            <input
              id="search-input"
              type="search"
              value={searchQuery}
              placeholder="ワールドを検索"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">YOUR WORLDS, YOUR WAY</p>
              <h1 id="page-title">{currentPageInfo.title}</h1>
              <p className="subheading" id="page-subtitle">
                {currentPageInfo.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="open-file-button"
              id="open-file-button"
              onClick={() => fileInputRef.current?.click()}
            >
              ワールドを開く
            </button>
          </div>

          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept=".rbxl,.rbxlx"
            hidden
            onChange={handleFileChange}
          />

          <section
            className={`section-block ${currentPageInfo.sectionIds.includes('recent-section') ? '' : 'hidden'}`}
            id="recent-section"
          >
            <div className="section-heading">
              <div>
                <h2>最近プレイしたゲーム</h2>
                <p>最近開いたワールドがここに表示されます。</p>
              </div>
            </div>

            <div className="games-grid" id="recent-games">
              {filteredGames.length ? (
                filteredGames.map((item) => (
                  <article
                    key={`${item.name}-${item.openedAt}`}
                    className="game-card"
                    onClick={() => {
                      setStatusMessage(
                        'RBXLの解析・実行機能は次の開発段階で実装します。',
                      );
                    }}
                  >
                    <div className="game-thumb">▧</div>
                    <div className="game-info">
                      <strong>{item.name}</strong>
                      <small>
                        {item.format.toUpperCase()} • {formatSize(item.size)}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                buildEmptyState(false)
              )}
            </div>
          </section>

          <section
            className={`section-block ${currentPageInfo.sectionIds.includes('library-section') ? '' : 'hidden'}`}
            id="library-section"
          >
            <div className="section-heading">
              <div>
                <h2>ゲームライブラリ</h2>
                <p>このブラウザで開いたワールド。</p>
              </div>
            </div>

            <div className="games-grid" id="library-games">
              {filteredGames.length ? (
                filteredGames.map((item) => (
                  <article
                    key={`${item.name}-${item.openedAt}-library`}
                    className="game-card"
                    onClick={() => {
                      setStatusMessage(
                        'RBXLの解析・実行機能は次の開発段階で実装します。',
                      );
                    }}
                  >
                    <div className="game-thumb">▧</div>
                    <div className="game-info">
                      <strong>{item.name}</strong>
                      <small>
                        {item.format.toUpperCase()} • {formatSize(item.size)}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                buildEmptyState(true)
              )}
            </div>
          </section>

          <section
            className={`section-block ${currentPageInfo.sectionIds.includes('friends-section') ? '' : 'hidden'}`}
            id="friends-section"
          >
            <div className="section-heading">
              <div>
                <h2>フレンド</h2>
                <p>フレンド機能は今後の開発で追加します。</p>
              </div>
            </div>
            <div className="empty-card">
              <div className="empty-icon">✦</div>
              <strong>利用可能なフレンドはまだありません</strong>
              <span>マルチプレイヤー対応時に、ここにプレイヤー一覧が表示されます。</span>
            </div>
          </section>

          <section
            className={`section-block ${currentPageInfo.sectionIds.includes('discover-section') ? '' : 'hidden'}`}
            id="discover-section"
          >
            <div className="section-heading">
              <div>
                <h2>探索</h2>
                <p>ゲームの検索・発見機能は今後追加します。</p>
              </div>
            </div>
            <div className="empty-card">
              <div className="empty-icon">◌</div>
              <strong>発見機能はまだ準備中です</strong>
              <span>将来的にはBabylon.js連携と共同プレイのためのワールド探索が実装されます。</span>
            </div>
          </section>

          <p className="status-message" id="status-message" role="status" aria-live="polite">
            {statusMessage}
          </p>

          <footer>
            RBXL Player <span>•</span> Browser-based world player
          </footer>
        </section>
      </main>
    </div>
  );
}
