(function () {
  function grab(storage) {
    const items = [];
    try {
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        items.push([k, storage.getItem(k)]);
      }
    } catch (e) {}
    return items;
  }

  browser.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.type !== "GET_STORAGE") return;

    return Promise.resolve({
      ok: true,
      payload: {
        href: location.href,
        local: grab(window.localStorage),
        session: grab(window.sessionStorage)
      }
    });
  });
})();
