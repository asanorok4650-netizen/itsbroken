(function () {
  window.RBXLPlayer = window.RBXLPlayer || {};
  window.RBXLPlayer.initNavigation = function () {
    var sidebar = document.querySelector('#sidebar');
    var title = document.querySelector('#page-title');
    var subtitle = document.querySelector('#page-subtitle');
    var sections = {
      home: ['ホーム', 'お気に入りのワールドに戻ろう。', ['recent-section', 'library-section']],
      discover: ['探索', '新しいワールドを見つけよう。', ['discover-section']],
      friends: ['フレンド', '一緒に遊ぶ仲間を見つけよう。', ['friends-section']],
      recent: ['最近プレイしたゲーム', '最近開いたワールド。', ['recent-section']]
    };
    function showPage(page) {
      var config = sections[page] || sections.home;
      title.textContent = config[0];
      subtitle.textContent = config[1];
      document.querySelectorAll('.section-block').forEach(function (section) { section.classList.add('hidden'); });
      config[2].forEach(function (id) { var el = document.getElementById(id); if (el) el.classList.remove('hidden'); });
      document.querySelectorAll('.nav-item').forEach(function (button) { button.classList.toggle('active', button.dataset.page === page); });
      sidebar.classList.remove('open');
    }
    document.querySelectorAll('[data-page]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        showPage(button.dataset.page);
      });
    });
    document.querySelector('#mobile-menu').addEventListener('click', function () { sidebar.classList.toggle('open'); });
  };
})();
