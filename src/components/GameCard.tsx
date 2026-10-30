type TopbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleSidebar: () => void;
};

export default function Topbar({
  searchQuery,
  onSearchChange,
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu"
        id="mobile-menu"
        aria-label="メニューを開く"
        onClick={onToggleSidebar}
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
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </header>
  );
}
