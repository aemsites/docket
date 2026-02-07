(function loadLazy() {
  import('./utils/lazyhash.js');
  import('./utils/favicon.js');
  import('./utils/footer.js').then(({ default: footer }) => footer());
  import('../deps/rum.js').then(({ sampleRUM }) => {
    sampleRUM('load');
    sampleRUM('lazy');
    sampleRUM.observe(document.querySelectorAll('main div[data-block-name]'));
    sampleRUM.observe(document.querySelectorAll('main picture > img'));
    window.setTimeout(() => { sampleRUM('cwv'); }, 3000);
  });

  const loadQuickEdit = async (...args) => {
    // eslint-disable-next-line import/no-cycle
    const { default: initQuickEdit } = await import('/scripts/utils/quickedit.js');
    initQuickEdit(...args);
  };

  const addSidekickListeners = (sk) => {
    sk.addEventListener('custom:quick-edit', loadQuickEdit);
  };

  const sk = document.querySelector('aem-sidekick');
  if (sk) {
    addSidekickListeners(sk);
  } else {
    // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
    // sidekick now loaded
      addSidekickListeners(document.querySelector('aem-sidekick'));
    }, { once: true });
  }
}());
