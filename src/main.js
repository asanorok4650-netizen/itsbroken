// Classic-script entry point: compatible with local index.html previews.
document.addEventListener('DOMContentLoaded', function () {
  if (window.RBXLPlayer && typeof window.RBXLPlayer.initNavigation === 'function') {
    window.RBXLPlayer.initNavigation();
    window.RBXLPlayer.initLibrary();
  }
});
