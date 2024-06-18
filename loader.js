// ES Modules を使うためのローダー
(async () => {
  const src = chrome.runtime.getURL("src/main.js");
  await import(src);
})();
