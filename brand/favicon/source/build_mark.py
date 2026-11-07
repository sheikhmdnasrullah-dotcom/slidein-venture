"""
SlideIn mark: two folded paper ribbons that interlock into an S, joined by one black square.
Run:  Blender -b -P source/build_mark.py -- [--save-blend] [--res 2048] [--samples 96] [--out renders/master-3d.png]

The ribbon centrelines are the SAME numbers as brand/source/slidein-symbol-master.svg (512 grid, y down), so the
3D object and the vector artwork are one geometry. One unit = 100 grid px.
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
RES = int(opt('--res', 2048)); SAMPLES = int(opt('--samples', 96))
HERE = os.path.dirname(os.path.abspath(bpy.data.filepath or __file__)) if False else os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', opt('--out', 'renders/master-3d.png'))

W = 96.0           # ribbon width (grid px)
R = 56.0           # centreline corner radius
S = 0.01           # grid px -> blender units
T = 0.30           # sheet thickness
GAP = 0.0

def arc(cx, cy, r, a0, a1, n=28):
    return [(cx + r*math.cos(math.radians(a0 + (a1-a0)*i/n)), cy + r*math.sin(math.radians(a0 + (a1-a0)*i/n))) for i in range(n+1)]

# ribbon 1: right terminal -> left along the top -> down the left -> into the middle bar
P1 = [(440,108),(164,108)] + arc(164,164,56,-90,-180)[1:] + [(108,200)] + arc(164,200,56,180,90)[1:] + [(304,256)]
# ribbon 2: the same ribbon turned 180 degrees about the centre
P2 = [(512-x, 512-y) for (x,y) in P1]

def offset_polygon(pts, half):
    L, Rr = [], []
    for i, p in enumerate(pts):
        a = pts[max(i-1, 0)]; b = pts[min(i+1, len(pts)-1)]
        tx, ty = b[0]-a[0], b[1]-a[1]; l = math.hypot(tx, ty) or 1
        nx, ny = -ty/l, tx/l
        L.append((p[0]+nx*half, p[1]+ny*half)); Rr.append((p[0]-nx*half, p[1]-ny*half))
    return L + Rr[::-1]

def to_world(p, z=0.0):
    return Vector(((p[0]-256)*S, -(p[1]-256)*S, z))

def slab(name, poly, z0, z1, mat, bevel=0.035):
    bm = bmesh.new()
    vs = [bm.verts.new(to_world(p, z0)) for p in poly]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    verts = [e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=verts, vec=Vector((0, 0, z1 - z0)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    bev = ob.modifiers.new('bevel', 'BEVEL'); bev.width = bevel; bev.segments = 5; bev.limit_method = 'ANGLE'; bev.angle_limit = math.radians(30)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    for p in me.polygons: p.use_smooth = True
    return ob

def material(name, rgb, rough, spec=0.5, coat=0.0, sheen=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = rough
    for k, v in (('Specular IOR Level', spec), ('Specular', spec)):
        if k in b.inputs: b.inputs[k].default_value = v
    for k, v in (('Coat Weight', coat), ('Clearcoat', coat)):
        if k in b.inputs: b.inputs[k].default_value = v
    for k, v in (('Sheen Weight', sheen), ('Sheen', sheen)):
        if k in b.inputs: b.inputs[k].default_value = v
    return m

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    return tuple(((x/12.92) if x <= 0.04045 else ((x+0.055)/1.055)**2.4) for x in c)

# ── scene
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
mat_a = material('orange_deep', srgb('#C94700'), 0.42, 0.5, 0.15)
mat_b = material('orange', srgb('#FF6200'), 0.38, 0.5, 0.2)
mat_k = material('matte_black', srgb('#0B0B0C'), 0.55, 0.3, 0.0)

HALF = W/2
slab('ribbon_1', offset_polygon(P1, HALF), 0.0, T, mat_a)
slab('ribbon_2', offset_polygon(P2, HALF), T, 2*T, mat_b)
sq = [(208,208),(304,208),(304,304),(208,304)]
slab('stop_square', sq, 2*T, 2*T + 0.10, mat_k, bevel=0.02)

# ground that only catches the shadow
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -0.001))
ground = bpy.context.object; ground.is_shadow_catcher = True

# ── studio light: big warm softbox, cool-ish fill, faint orange bounce, ivory ambient
def area(name, loc, energy, size, rgb, target=Vector((0, 0, 0.3))):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.size = size; d.color = rgb
    o = bpy.data.objects.new(name, d); bpy.context.collection.objects.link(o); o.location = loc
    o.rotation_euler = (target - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area('key', (-3.2, -3.4, 6.5), 520, 6.0, (1.0, 0.96, 0.9))
area('fill', (4.5, -1.5, 3.5), 260, 5.0, (0.92, 0.95, 1.0))
area('bounce', (2.5, 3.5, 0.6), 120, 3.0, (1.0, 0.45, 0.12))
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.96, 0.93, 0.87, 1); bg.inputs[1].default_value = 0.5

# ── camera: orthographic, a few degrees off the vertical so thickness + folds read
cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = 5.7
cam = bpy.data.objects.new('cam', cam_d); bpy.context.collection.objects.link(cam)
from mathutils import Euler
# pitch the camera forward and yaw it slightly about the world Y axis: thickness and folds read,
# the S stays upright (no in-plane roll)
cam_rot = Euler((math.radians(16), math.radians(-11), 0), 'XYZ')
cam.rotation_euler = cam_rot
cam.location = Vector((0, 0, 0.3)) + cam_rot.to_matrix() @ Vector((0, 0, 14))
sc.camera = cam

sc.render.engine = 'CYCLES'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.cycles.device = 'CPU'   # Metal kernel compilation crashes headless here; CPU is plenty for one object
sc.render.resolution_x = sc.render.resolution_y = RES
sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'; sc.render.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'   # AgX desaturates the brand orange to salmon
sc.render.filepath = os.path.abspath(OUT)
os.makedirs(os.path.dirname(sc.render.filepath), exist_ok=True)
if '--save-blend' in argv:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(os.path.join(HERE, 'slidein-mark.blend')))
if '--no-render' not in argv:
    bpy.ops.render.render(write_still=True)
print('WROTE', sc.render.filepath)
