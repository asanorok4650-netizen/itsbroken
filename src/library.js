(function () {
  window.RBXLPlayer = window.RBXLPlayer || {};
  window.RBXLPlayer.initLibrary = function () {
    var fileInput = document.querySelector('#file-input');
    var status = document.querySelector('#status-message');
    var recentContainer = document.querySelector('#recent-games');
    var searchInput = document.querySelector('#search-input');
    var openSelectors = ['#open-file-button', '#empty-open-button', '#upload-panel'];
    openSelectors.forEach(function (selector) {
      var button = document.querySelector(selector);
      if (button) button.addEventListener('click', function () { fileInput.click(); });
    });

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      var extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'rbxl' && extension !== 'rbxlx') {
        status.textContent = '対応しているファイルは .rbxl / .rbxlx です。';
        return;
      }
      var items = readItems();
      var next = [{ name: file.name, size: file.size, openedAt: new Date().toISOString(), format: extension }].concat(items.filter(function (item) { return item.name !== file.name; })).slice(0, 12);
      try {
        localStorage.setItem('rbxl-player-recent-v1', JSON.stringify(next));
        render(next);
        status.textContent = file.name + ' をライブラリに追加しました。※現在は画面表示のみで、ゲームの解析・実行機能は未実装です。';
      } catch (error) {
        status.textContent = 'ブラウザに保存できませんでした。ブラウザの保存設定をご確認ください。';
      }
      fileInput.value = '';
    });

    function readItems() {
      try { return JSON.parse(localStorage.getItem('rbxl-player-recent-v1') || '[]'); }
      catch (error) { return []; }
    }
    function formatSize(bytes) {
      if (!Number.isFinite(bytes)) return 'サイズ不明';
      return bytes < 1048576 ? Math.max(1, Math.round(bytes / 1024)) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
    }
    function render(items) {
      var query = searchInput.value.trim().toLowerCase();
      var filtered = items.filter(function (item) { return item.name.toLowerCase().indexOf(query) !== -1; });
      if (!filtered.length) {
        recentContainer.innerHTML = '<div class="empty-card"><div class="empty-icon">▧</div><strong>表示できるゲームがありません</strong><span>ファイルを追加するか、検索ワードを変更してください。</span></div>';
        return;
      }
      recentContainer.replaceChildren.apply(recentContainer, filtered.map(function (item) {
        var card = document.createElement('article'); card.className = 'game-card';
        var thumb = document.createElement('div'); thumb.className = 'game-thumb'; thumb.textContent = '▧';
        var info = document.createElement('div'); info.className = 'game-info';
        var name = document.createElement('strong'); name.textContent = item.name;
        var meta = document.createElement('small'); meta.textContent = item.format.toUpperCase() + ' • ' + formatSize(item.size);
        info.append(name, meta); card.append(thumb, info);
        card.addEventListener('click', function () { status.textContent = 'RBXLの解析・実行機能は次の開発段階で実装します。'; });
        return card;
      }));
    }
    searchInput.addEventListener('input', function () { render(readItems()); });
    render(readItems());
  };
})();
