// Чи є в браузері WebGL: без нього 3D-сцени не монтуються, лишається текст на чорному.
export const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
})();
