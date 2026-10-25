// Oyun çerçevesindeki tam ekran düğmesi. Tam ekran yalnızca bu düğmeye basınca açılır.
const stage = document.getElementById("stage");
const btn = document.getElementById("fullscreen-btn");
const TEXT = {
  tr: { enter: "Tam ekran", exit: "Tam ekrandan çık" },
  en: { enter: "Fullscreen", exit: "Exit fullscreen" },
};

function updateLabel() {
  const lang = (document.documentElement.lang || "tr").startsWith("tr") ? "tr" : "en";
  const text = document.fullscreenElement ? TEXT[lang].exit : TEXT[lang].enter;
  btn.setAttribute("aria-label", text);
  btn.title = text;
}

btn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
  if (request) Promise.resolve(request.call(stage)).catch(() => {});
});

document.addEventListener("fullscreenchange", updateLabel);
window.addEventListener("vc:languagechange", updateLabel);
updateLabel();
