type EmptyStateProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonId?: string;
  onOpenFile?: () => void;
};

export default function EmptyState({
  title = '表示できるゲームがありません',
  description = 'ファイルを追加するか、検出されたワールドがない場合は別の名前で検索してください。',
  buttonLabel = 'ファイルを開く',
  buttonId,
  onOpenFile,
}: EmptyStateProps) {
  return (
    <div className="empty-card" id={buttonId ? 'upload-panel' : undefined}>
      <div className="empty-icon">▧</div>
      <strong>{title}</strong>
      <span>{description}</span>
      {onOpenFile && (
        <button type="button" className="open-file-button" id={buttonId} onClick={onOpenFile}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
