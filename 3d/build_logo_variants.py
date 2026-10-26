"""EMOTE «ö» — лого у чотирьох матеріалах з localhost (puffy.html / cta.html).

Запуск у Blender (з GUI):
    /Applications/Blender.app/Contents/MacOS/Blender --python 3d/build_logo_variants.py
Запуск без вікна з рендером прев'ю:
    /Applications/Blender.app/Contents/MacOS/Blender -b --python 3d/build_logo_variants.py -- render /шлях/preview.png

Форма — та сама, що на сайті: кільце й дві краплі з гострою фаскою
(профіль + Screw, висота знака 1, кільце R 0.38 / діра 0.14, краплі 0.094).
Матеріали: Metal (фіолетовий метал із потертостями), Fur (хутро: hair-частинки від
темного кореня до лілового кінчика), Puff (надутий глянцевий пластик), Glass (скло).
Колір акценту — #5D43BB.
"""
import math
import os
import sys

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PAINT = "#5D43BB"


def lin(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (f(r), f(g), f(b), a)


def set_input(node, names, value):
    """Імена входів Principled змінились між 3.x і 4.x — пробуємо кілька."""
    for n in names:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return True
    return False


# ---------- сцена ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = 1600, 700

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.012, 0.012, 0.016, 1)
bg.inputs["Strength"].default_value = 1.0


# ---------- геометрія ----------
def disc_mesh(name, R, r, h, f):
    """Диск із фаскою: профіль (радіус, висота) + Screw навколо осі Z."""
    H = math.pi / 2

    def arc(cx, cz, a0, a1, n=6):
        return [(cx + f * math.cos(a0 + (a1 - a0) * i / n), cz + f * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]

    if r > 0:
        path = ([(r + f, -h), (R - f, -h)] + arc(R - f, -h + f, -H, 0) + arc(R - f, h - f, 0, H)
                + [(r + f, h)] + arc(r + f, h - f, H, 2 * H) + arc(r + f, -h + f, 2 * H, 3 * H))
        closed = True
    else:
        path = [(0, -h), (R - f, -h)] + arc(R - f, -h + f, -H, 0) + arc(R - f, h - f, 0, H) + [(0, h)]
        closed = False
    verts = [(x, 0.0, z) for x, z in path]
    edges = [(i, i + 1) for i in range(len(verts) - 1)] + ([(len(verts) - 1, 0)] if closed else [])
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, edges, [])
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    md = ob.modifiers.new("Screw", "SCREW")
    md.axis, md.angle, md.steps, md.render_steps = "Z", math.tau, 128, 128
    md.use_merge_vertices, md.merge_threshold = True, 1e-5
    bpy.ops.object.modifier_apply(modifier="Screw")
    # нормалі назовні, плавне згладжування лише по фасці
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    if hasattr(me, "use_auto_smooth"):
        me.use_auto_smooth, me.auto_smooth_angle = True, math.radians(40)
    elif hasattr(bpy.ops.object, "shade_smooth_by_angle"):
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(40))
    ob.select_set(False)
    return ob


def place(ob, parent, x, z, face_front=True):
    ob.parent = parent
    ob.location = (x, 0, z)
    if face_front:
        ob.rotation_euler = (H_X, 0, 0)  # вісь диска Z -> до камери (-Y)


H_X = math.pi / 2
PARTS = [  # (ім'я, R, r, h, f, x, z)
    ("ring", 0.38, 0.14, 0.107, 0.03, 0.0, -0.135),
    ("dot_l", 0.094, 0.0, 0.063, 0.022, -0.0675, 0.4095),
    ("dot_r", 0.094, 0.0, 0.063, 0.022, 0.2385, 0.3615),
]


def mark_discs(label, root):
    obs = []
    for n, R, r, h, f, x, z in PARTS:
        ob = disc_mesh(f"{label}_{n}", R, r, h, f)
        place(ob, root, x, z)
        obs.append(ob)
    return obs


def mark_puff(label, root):
    obs = []
    bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.142, major_segments=96, minor_segments=48)
    ring = bpy.context.active_object
    ring.name = f"{label}_ring"; ring.scale = (1, 1, 0.86)
    place(ring, root, 0.0, -0.135)
    obs.append(ring)
    for n, x, z in (("dot_l", -0.0675, 0.4095), ("dot_r", 0.2385, 0.3615)):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.094, segments=64, ring_count=32)
        d = bpy.context.active_object
        d.name = f"{label}_{n}"; d.scale = (1, 1, 0.88)
        place(d, root, x, z)
        obs.append(d)
    for ob in obs:
        bpy.context.view_layer.objects.active = ob
        ob.select_set(True)
        bpy.ops.object.shade_smooth()
        ob.select_set(False)
    return obs


# ---------- матеріали ----------
def principled(mat):
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return nt, bsdf, out


def mat_metal():
    m = bpy.data.materials.new("Metal · worn violet")
    nt, bsdf, out = principled(m)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    # плями потертого металу
    n1 = nt.nodes.new("ShaderNodeTexNoise"); n1.inputs["Scale"].default_value = 7.0; n1.inputs["Detail"].default_value = 4
    nt.links.new(mp.outputs["Vector"], n1.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB"); cr.color_ramp.elements[0].position = 0.55; cr.color_ramp.elements[1].position = 0.78
    nt.links.new(n1.outputs["Fac"], cr.inputs["Fac"])
    # Mix: у 4.x+ — ShaderNodeMix (RGBA), у старіших — MixRGB
    try:
        mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
        mix.inputs[6].default_value = lin(PAINT); mix.inputs[7].default_value = lin("#7f6bf0")
        nt.links.new(cr.outputs["Color"], mix.inputs[0])
        mix_out = mix.outputs[2]
    except Exception:
        mix = nt.nodes.new("ShaderNodeMixRGB")
        mix.inputs["Color1"].default_value = lin(PAINT); mix.inputs["Color2"].default_value = lin("#7f6bf0")
        nt.links.new(cr.outputs["Color"], mix.inputs["Fac"])
        mix_out = mix.outputs["Color"]
    nt.links.new(mix_out, bsdf.inputs["Base Color"])
    # дрібне зерно: bump + шорсткість
    n2 = nt.nodes.new("ShaderNodeTexNoise"); n2.inputs["Scale"].default_value = 420.0; n2.inputs["Detail"].default_value = 2
    nt.links.new(mp.outputs["Vector"], n2.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.12; bump.inputs["Distance"].default_value = 0.01
    nt.links.new(n2.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    rough = nt.nodes.new("ShaderNodeMath"); rough.operation = "MULTIPLY_ADD"
    rough.inputs[1].default_value = 0.22; rough.inputs[2].default_value = 0.34
    nt.links.new(cr.outputs["Color"], rough.inputs[0])
    nt.links.new(rough.outputs["Value"], bsdf.inputs["Roughness"])
    bsdf.inputs["Metallic"].default_value = 1.0
    set_input(bsdf, ["Coat Weight", "Clearcoat"], 0.15)
    return m


def mat_glass():
    m = bpy.data.materials.new("Glass · violet smoke")
    nt, bsdf, out = principled(m)
    bsdf.inputs["Base Color"].default_value = (1, 1, 1, 1)
    bsdf.inputs["Roughness"].default_value = 0.02
    set_input(bsdf, ["IOR"], 1.6)
    set_input(bsdf, ["Transmission Weight", "Transmission"], 1.0)
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    vol.inputs["Color"].default_value = lin("#7a63e6"); vol.inputs["Density"].default_value = 6.0
    nt.links.new(vol.outputs["Volume"], out.inputs["Volume"])
    return m


def mat_puff():
    m = bpy.data.materials.new("Puff · glossy plastic")
    nt, bsdf, out = principled(m)
    bsdf.inputs["Base Color"].default_value = lin(PAINT)
    bsdf.inputs["Roughness"].default_value = 0.2
    set_input(bsdf, ["Coat Weight", "Clearcoat"], 1.0)
    set_input(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.05)
    set_input(bsdf, ["Sheen Weight", "Sheen"], 0.3)
    return m


def mat_fur_body():
    m = bpy.data.materials.new("Fur · body")
    nt, bsdf, out = principled(m)
    bsdf.inputs["Base Color"].default_value = lin("#2e2260")
    bsdf.inputs["Roughness"].default_value = 0.95
    return m


def mat_fur_hair():
    m = bpy.data.materials.new("Fur · hair")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    hair = nt.nodes.new("ShaderNodeBsdfHairPrincipled")
    hair.parametrization = "COLOR"
    hair.inputs["Roughness"].default_value = 0.45
    info = nt.nodes.new("ShaderNodeHairInfo")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin("#3b1fa8")   # корінь — глибокий фіолетовий
    ramp.color_ramp.elements[1].color = lin("#c9a2ff")   # кінчик — світлий ліловий
    nt.links.new(info.outputs["Intercept"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], hair.inputs["Color"])
    nt.links.new(hair.outputs["BSDF"], out.inputs["Surface"])
    return m


def add_hair(ob, count, length, name):
    ob.data.materials.append(bpy.data.materials["Fur · hair"])
    mod = ob.modifiers.new(name, "PARTICLE_SYSTEM")
    ps = ob.particle_systems[-1]
    s = ps.settings
    s.type = "HAIR"
    s.count = count
    s.hair_length = length
    s.child_type = "INTERPOLATED"
    for attr in ("child_nbr", "child_percent"):
        if hasattr(s, attr):
            setattr(s, attr, 8)
            break
    s.rendered_child_count = 24
    s.child_radius = 0.04
    s.clump_factor = 0.4
    s.roughness_1 = 0.03
    s.roughness_2 = 0.2
    s.radius_scale = 0.0025
    s.material = len(ob.data.materials)  # слот із хутром
    s.use_advanced_hair = False


# ---------- збирання ----------
VARIANTS = ["Metal", "Fur", "Puff", "Glass"]
MATS = {"metal": mat_metal(), "glass": mat_glass(), "puff": mat_puff(), "fur_body": mat_fur_body(), "fur_hair": mat_fur_hair()}
SPACING = 1.35
roots = {}
for i, name in enumerate(VARIANTS):
    root = bpy.data.objects.new(f"{name} · root", None)
    root.location = (i * SPACING, 0, 0)
    root.rotation_euler = (0, 0, math.radians(-28))  # трохи під кутом, щоб було видно товщину
    scene.collection.objects.link(root)
    roots[name] = root

metal = mark_discs("Metal", roots["Metal"])
for ob in metal: ob.data.materials.append(MATS["metal"])

fur = mark_discs("Fur", roots["Fur"])
for ob in fur: ob.data.materials.append(MATS["fur_body"])
add_hair(fur[0], 6000, 0.055, "FurRing")
add_hair(fur[1], 1200, 0.045, "FurDotL")
add_hair(fur[2], 1200, 0.045, "FurDotR")

puff = mark_puff("Puff", roots["Puff"])
for ob in puff: ob.data.materials.append(MATS["puff"])

glass = mark_discs("Glass", roots["Glass"])
for ob in glass: ob.data.materials.append(MATS["glass"])

# підписи
for i, name in enumerate(VARIANTS):
    cu = bpy.data.curves.new(f"label_{name}", "FONT")
    cu.body = name.upper(); cu.size = 0.07; cu.align_x = "CENTER"
    t = bpy.data.objects.new(f"label · {name}", cu)
    scene.collection.objects.link(t)
    t.location = (i * SPACING, 0, -0.72); t.rotation_euler = (H_X, 0, 0)
    lm = bpy.data.materials.new(f"label_{name}")
    lm.use_nodes = True
    em = lm.node_tree.nodes["Principled BSDF"]
    set_input(em, ["Emission Color", "Emission"], (1, 1, 1, 1)); set_input(em, ["Emission Strength"], 1.0)
    t.data.materials.append(lm)

# світло: довгі смуги збоку, зверху й спереду (як студія в браузері)
def area(name, loc, rot, size_x, size_y, energy, color=(1, 1, 1)):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape, ld.size, ld.size_y, ld.energy, ld.color = "RECTANGLE", size_x, size_y, energy, color
    lo = bpy.data.objects.new(name, ld)
    lo.location, lo.rotation_euler = loc, rot
    scene.collection.objects.link(lo)
    return lo

cx = (len(VARIANTS) - 1) * SPACING / 2
area("key left", (cx - 4.6, -3.0, 0.8), (H_X, 0, math.radians(-55)), 0.7, 3.0, 900)
area("key right", (cx + 4.6, -3.0, 0.4), (H_X, 0, math.radians(55)), 0.7, 3.0, 700, (0.9, 0.85, 1.0))
area("top strip", (cx, -2.0, 2.4), (math.radians(40), 0, 0), 6.0, 0.7, 500)
area("front fill", (cx, -6.0, 0.5), (H_X, 0, 0), 5.0, 2.0, 300, (0.95, 0.9, 1.0))

# камера
cam = bpy.data.cameras.new("Camera"); cam.lens = 55
co = bpy.data.objects.new("Camera", cam)
co.location = (cx, -9.0, 0.02); co.rotation_euler = (H_X, 0, 0)
scene.collection.objects.link(co)
scene.camera = co

# збереження й (за потреби) рендер
blend_path = os.path.join(HERE, "emote-logo-variants.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)
if ARGS[:1] == ["render"]:
    scene.render.filepath = ARGS[1] if len(ARGS) > 1 else os.path.join(HERE, "emote-logo-variants.png")
    bpy.ops.render.render(write_still=True)
print("DONE", blend_path)
