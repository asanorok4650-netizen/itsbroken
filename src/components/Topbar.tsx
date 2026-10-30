import type { PageKey } from '../types';

type SidebarProps = {
  activePage: PageKey;
  sidebarOpen: boolean;
  onPageSelect: (page: PageKey) => void;
  onToggleSidebar: () => void;
};

const NAV_LABELS: Record<PageKey, { label: string; icon: string }> = {
  home: { label: 'ホーム', icon: '⌂' },
  discover: { label: '探索', icon: '◈' },
  friends: { label: 'フレンド', icon: '♧' },
  recent: { label: '最近プレイしたゲーム', icon: '◷' },
};

export default function Sidebar({
  activePage,
  sidebarOpen,
  onPageSelect,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      <a
        className="brand"
        href="#"
        aria-label="RBXL Player ホーム"
        onClick={(event) => {
          event.preventDefault();
          onPageSelect('home');
        }}
      >
        <span className="brand-mark">R</span>
        <span>RBXL Player</span>
      </a>

      <nav className="main-nav" aria-label="メインメニュー">
        {(Object.keys(NAV_LABELS) as PageKey[]).map((page) => (
          <button
            key={page}
            type="button"
            className={`nav-item ${activePage === page ? 'active' : ''}`}
            data-page={page}
            onClick={() => onPageSelect(page)}
          >
            <span className="nav-icon">{NAV_LABELS[page].icon}</span>
            {NAV_LABELS[page].label}
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
  );
}
