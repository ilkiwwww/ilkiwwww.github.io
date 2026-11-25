import { Vector3 } from "three";

// Деформація скла у вершинному шейдері (вбудовується в MeshTransmissionMaterial
// через onBeforeCompile). Вершина зсувається вздовж нормалі на суму:
//   • низькочастотний 3D simplex-шум — повільне «дихання» товщі скла;
//   • локальне здуття під курсором (uBulge, uPointer);
//   • хвиля від кліку, що біжить від точки кліку й згасає (uRipple*).
// Нормаль перераховується скінченними різницями по дотичних, тож заломлення
// відповідає деформованій поверхні.

export function createDeformUniforms() {
  return {
    uTime: { value: 0 },
    uAmp: { value: 0.015 },
    uFreq: { value: 1.2 },
    uSpeed: { value: 0.25 },
    uPointer: { value: new Vector3(0, 0, 10) },
    uBulge: { value: 0 },
    uRippleOrigin: { value: new Vector3(0, 0, 10) },
    uRippleAge: { value: 10 },
    uRippleAmp: { value: 0.03 },
  };
}

// Simplex 3D — Ashima Arts / Stefan Gustavson (MIT).
const SIMPLEX = /* glsl */ `
vec3 e_mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 e_mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 e_permute(vec4 x){return e_mod289(((x*34.0)+10.0)*x);}
vec4 e_taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float e_snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=e_mod289(i);
  vec4 p=e_permute(e_permute(e_permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=e_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const HEADER = /* glsl */ `
uniform float uTime; uniform float uAmp; uniform float uFreq; uniform float uSpeed;
uniform vec3 uPointer; uniform float uBulge;
uniform vec3 uRippleOrigin; uniform float uRippleAge; uniform float uRippleAmp;
${SIMPLEX}
float eDisp(vec3 p){
  float n = e_snoise(p * uFreq + vec3(0.0, uTime * uSpeed, uTime * uSpeed * 0.7)) * uAmp;
  float dp = distance(p, uPointer);
  float bulge = uBulge * 0.02 * exp(-dp * dp / 0.012);
  float dr = distance(p, uRippleOrigin);
  float front = uRippleAge * 0.9;
  float ripple = uRippleAmp * exp(-uRippleAge * 2.2) * exp(-pow((dr - front) / 0.09, 2.0));
  return n + bulge + ripple;
}
vec3 eDeform(vec3 p, vec3 n){ return p + n * eDisp(p); }
`;

const BEGIN_NORMAL = /* glsl */ `
vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
  vec3 objectTangent = vec3( tangent.xyz );
#endif
vec3 eDisplaced = eDeform(position, normal);
{
  vec3 tg = normalize(abs(normal.y) < 0.99 ? cross(normal, vec3(0.0, 1.0, 0.0)) : cross(normal, vec3(1.0, 0.0, 0.0)));
  vec3 bt = normalize(cross(normal, tg));
  float e = 0.004;
  vec3 pT = eDeform(position + tg * e, normal);
  vec3 pB = eDeform(position + bt * e, normal);
  vec3 nn = normalize(cross(pT - eDisplaced, pB - eDisplaced));
  if (dot(nn, normal) < 0.0) nn = -nn;
  objectNormal = nn;
}
`;

// Обгортає onBeforeCompile матеріалу: спершу власний патч drei, потім наш.
// Ідемпотентно: у dev StrictMode ефект спрацьовує двічі.
export function applyDeform(material, uniforms) {
  if (material.userData.emoteDeform) return;
  material.userData.emoteDeform = true;
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.call(material, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    if (shader.vertexShader.includes("eDeform(")) return;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${HEADER}`)
      .replace("#include <beginnormal_vertex>", BEGIN_NORMAL)
      .replace("#include <begin_vertex>", "vec3 transformed = eDisplaced;");
  };
  const prevKey = material.customProgramCacheKey?.bind(material);
  material.customProgramCacheKey = () => (prevKey ? prevKey() : "") + "|emote-deform";
  material.needsUpdate = true;
}
