import { BufferGeometry, LatheGeometry, Vector2 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Лого збирається з трьох дисків із чіткою фаскою (замість округлого перерізу моделі):
// кільце й дві краплі. Контур і положення — з оригінальної моделі (висота 1).
// Торці мають м'який купол у нормалях, щоб у центрі диска не було «дірочки».
export function disc(R, r, h, f, x, y) {
  const arc = (cx, cy, a0, a1, n = 6) => Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + f * Math.cos(a), cy + f * Math.sin(a)];
  });
  const H = Math.PI / 2;
  const path = r > 0
    ? [[r + f, -h], [R - f, -h], ...arc(R - f, -h + f, -H, 0), ...arc(R - f, h - f, 0, H), [r + f, h],
       ...arc(r + f, h - f, H, 2 * H), ...arc(r + f, -h + f, 2 * H, 3 * H)]
    : [[0, -h], [R - f, -h], ...arc(R - f, -h + f, -H, 0), ...arc(R - f, h - f, 0, H), [0, h]];
  const g = new LatheGeometry(path.map(([px, py]) => new Vector2(px, py)), 96);
  g.rotateX(H);
  const pos = g.attributes.position, nor = g.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const rad = Math.hypot(pos.getX(i), pos.getY(i)), z = pos.getZ(i);
    if (Math.abs(Math.abs(z) - h) < 1e-5 && rad <= R - f + 1e-5 && rad >= r + f - 1e-5) {
      const k = 0.4 / R, nx = pos.getX(i) * k, ny = pos.getY(i) * k, l = Math.hypot(nx, ny, 1);
      nor.setXYZ(i, nx / l, ny / l, Math.sign(z) / l);
    }
  }
  g.translate(x, y, 0);
  return g;
}


// Увесь знак «ö»: кільце й дві краплі (висота знака 1, центр у (0, 0)).
export function markGeometry() {
  return mergeGeometries([
    disc(0.38, 0.14, 0.107, 0.03, 0, -0.135),
    disc(0.094, 0, 0.063, 0.022, -0.0675, 0.4095),
    disc(0.094, 0, 0.063, 0.022, 0.2385, 0.3615),
  ]);
}
