import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, useEnvironment } from "@react-three/drei";
import { ACESFilmicToneMapping, Color, MathUtils } from "three";
import { applyDeform, createDeformUniforms } from "./deform.js";
import { markGeometry } from "./markGeometry.js";

// 3D-сцена фінального CTA: велике скляне лого «ö» позаду заголовка (заголовок
// і кнопка — звичайний HTML поверх полотна, див. Cta.jsx). Форма — три диски
// з гострою фаскою (кільце й дві краплі, див. disc() нижче), HDRI —
// public/glass/studio.exr (лише відблиски). Скло темне, «димчасте»: крізь нього
// видно чорний простір, читаються відблиски й райдужні краї.
//
// Рух: лого гойдається навколо анфасу й плаває, тягнеться до курсора, поверхня
// ледь «дихає»; мишею можна покрутити (з інерцією), клік — хвиля. На тачі —
// без перетягування (сторінка скролиться). При prefers-reduced-motion —
// статичний анфас. Рендер іде лише поки секція на екрані.

const BLACK = new Color("#000000");
const DAMP = 0.05;
const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function GlassMark({ scale, offsetY, mobile }) {
  const group = useRef();
  const mesh = useRef();
  const material = useRef();
  const uniforms = useMemo(createDeformUniforms, []);
  const { gl, pointer } = useThree();
  const s = useRef({ dragX: 0, dragY: 0, velX: 0, velY: 0, dragging: false, lastX: 0, lastY: 0, tiltX: 0, tiltY: 0, hover: false });

  const geometry = useMemo(markGeometry, []);

  useLayoutEffect(() => {
    if (material.current) applyDeform(material.current, uniforms);
  }, [uniforms]);

  // Перетягування — лише мишею: на тачі сторінка має скролитись.
  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    const down = (e) => {
      if (e.pointerType !== "mouse") return;
      st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY; st.velX = st.velY = 0;
    };
    const move = (e) => {
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX, dy = e.clientY - st.lastY;
      st.lastX = e.clientX; st.lastY = e.clientY;
      st.dragY += dx * 0.008; st.dragX += dy * 0.008;
      st.velY = dx * 0.48; st.velX = dy * 0.48;
    };
    const up = () => { st.dragging = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const st = s.current;
    const k = 1 - Math.pow(1 - DAMP, dt * 60);
    if (!st.dragging) {
      st.dragX += st.velX * dt; st.dragY += st.velY * dt;
      const decay = Math.exp(-3.07 * dt);
      st.velX *= decay; st.velY *= decay;
      if (Math.abs(st.velX) + Math.abs(st.velY) < 0.05) { st.dragX *= Math.exp(-0.6 * dt); st.dragY *= Math.exp(-0.6 * dt); }
    }
    st.tiltX = MathUtils.lerp(st.tiltX, -pointer.y * 0.12, k);
    st.tiltY = MathUtils.lerp(st.tiltY, pointer.x * 0.18, k);
    const idle = REDUCED ? 0 : 1;
    const g = group.current;
    g.rotation.y = idle * 0.38 * Math.sin(t * 0.26) + st.tiltY + st.dragY;
    g.rotation.x = idle * 0.03 * Math.sin(t * 0.37) + st.tiltX + st.dragX;
    g.rotation.z = idle * 0.02 * Math.sin(t * 0.29 + 1.0);
    g.position.y = offsetY + idle * 0.03 * scale * Math.sin(t * 0.6);
    uniforms.uTime.value = REDUCED ? 0 : t;
    uniforms.uBulge.value = MathUtils.lerp(uniforms.uBulge.value, st.hover && !st.dragging ? 1 : 0, k);
    uniforms.uRippleAge.value += dt;
  });

  const toLocal = (e) => mesh.current.worldToLocal(e.point.clone());

  return (
    <group ref={group} scale={scale}>
      <mesh
        ref={mesh}
        geometry={geometry}
        onPointerMove={(e) => { s.current.hover = true; uniforms.uPointer.value.copy(toLocal(e)); }}
        onPointerOut={() => { s.current.hover = false; }}
        onClick={(e) => { if (REDUCED) return; uniforms.uRippleOrigin.value.copy(toLocal(e)); uniforms.uRippleAge.value = 0; }}
      >
        <MeshTransmissionMaterial
          ref={material}
          background={BLACK}
          transmission={1}
          thickness={1.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.25}
          anisotropicBlur={0.18}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={REDUCED ? 0 : 0.1}
          backside
          backsideThickness={1}
          attenuationColor="#1a1b22"
          attenuationDistance={0.8}
          color="#dfe2ea"
          samples={mobile ? 6 : 10}
          resolution={mobile ? 256 : 512}
        />
      </mesh>
    </group>
  );
}

function Layout({ mobile, onReady }) {
  const env = useEnvironment({ files: "/glass/studio.exr" });
  const viewport = useThree((s) => s.viewport);
  // Сюди доходимо, лише коли HDRI і модель завантажились (Suspense)
  useEffect(() => { onReady?.(); }, [onReady]);
  // Знак (висота моделі 1) — 87% висоти сцени, точно по центру (Figma: 617 з 709)
  const scale = mobile ? Math.min(viewport.height * 0.8, viewport.width * 1.15) : viewport.height * 0.87;
  const offsetY = 0;
  return (
    <>
      <Environment map={env} />
      <directionalLight position={[-2.5, 2.5, 3]} intensity={2.2} color="#ffd6ad" />
      <directionalLight position={[3, 0.6, -2.5]} intensity={4.5} color="#86b4ff" />
      <directionalLight position={[0, 0, 4]} intensity={0.25} />
      <directionalLight position={[0, -3, 1]} intensity={0.4} color="#dfe6ff" />
      <GlassMark scale={scale} offsetY={offsetY} mobile={mobile} />
    </>
  );
}

export default function CtaScene({ containerRef, onReady }) {
  const [active, setActive] = useState(false);
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const el = containerRef.current;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [containerRef]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 28, near: 0.1, far: 50, position: [0, 0, 6] }}
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, alpha: false }}
      className="touch-pan-y"
    >
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <Layout mobile={mobile} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

