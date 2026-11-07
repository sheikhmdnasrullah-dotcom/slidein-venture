"""
Phase 4, 5 & 6 — Procedural 3D Geometry Construction in Blender 5.2.3 LTS.
Builds:
  1. Collection_Playbook: Multi-layer precision Playbook artifact (Playbook_Root & 3 slabs + inlays).
  2. Collection_OrbitalSystem: Mathematical circular orbit, rounded-square path, orange upper arc, beams & bead.
  3. Collection_FloatingObjects: Coherent 6-object product family (4 tangent tools + 2 horizontal anchors).
  4. Collection_StageStudio: Studio cyclorama, softbox area lights, and 85mm camera for renders.
"""

import bpy
import bmesh
import math
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

from create_materials import create_all_materials


def clear_scene():
    """Remove all existing objects, meshes, curves, and lights for a clean reproducible build."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block_collection in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.lights,
        bpy.data.cameras,
        bpy.data.actions,
    ):
        for block in list(block_collection):
            block_collection.remove(block)


def get_or_create_collection(name: str) -> bpy.types.Collection:
    col = bpy.data.collections.get(name)
    if col is None:
        col = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(col)
    return col


def link_exclusively(obj: bpy.types.Object, col: bpy.types.Collection):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)


def shade_smooth_with_bevel(
    obj: bpy.types.Object,
    bevel_width: float = 0.022,
    segments: int = 4,
    profile: float = 0.55,
    angle_deg: float = 32.0,
    apply_modifiers: bool = True,
):
    """Apply precision bevel and weighted smooth normals to a mesh object."""
    if obj.type != "MESH":
        return
    bev = obj.modifiers.new(name="PrecisionBevel", type="BEVEL")
    bev.width = bevel_width
    bev.segments = segments
    bev.profile = profile
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(angle_deg)
    bev.harden_normals = False

    for poly in obj.data.polygons:
        poly.use_smooth = True

    if apply_modifiers:
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=bev.name)


def build_rounded_rect_points(
    width: float, height: float, radius: float, corner_segments: int = 16
) -> list[tuple[float, float]]:
    """Generate 2D perimeter vertices for a precision rounded rectangle centered at (0,0)."""
    r = min(radius, width * 0.48, height * 0.48)
    hx = width * 0.5 - r
    hy = height * 0.5 - r
    corners = [
        (hx, hy, 0.0, math.pi * 0.5),
        (-hx, hy, math.pi * 0.5, math.pi),
        (-hx, -hy, math.pi, math.pi * 1.5),
        (hx, -hy, math.pi * 1.5, math.pi * 2.0),
    ]
    pts: list[tuple[float, float]] = []
    for cx, cy, a0, a1 in corners:
        for i in range(corner_segments):
            t = i / float(corner_segments)
            ang = a0 + (a1 - a0) * t
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return pts


def create_rounded_slab_mesh(
    name: str,
    width: float,
    height: float,
    depth: float,
    corner_radius: float,
    bevel_width: float = 0.024,
    bevel_segments: int = 4,
    corner_segments: int = 18,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    """Create a solid 3D rounded-rectangle slab with clean quad side topology and beveled rims."""
    mesh = bpy.data.meshes.new(name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)

    bm = bmesh.new()
    pts = build_rounded_rect_points(width, height, corner_radius, corner_segments)
    z0 = -depth * 0.5
    z1 = depth * 0.5

    bottom_verts = [bm.verts.new((x, y, z0)) for (x, y) in pts]
    top_verts = [bm.verts.new((x, y, z1)) for (x, y) in pts]
    n = len(pts)

    # Side quad faces
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bottom_verts[i], bottom_verts[j], top_verts[j], top_verts[i]))

    # Top and bottom caps
    bm.faces.new(list(reversed(bottom_verts)))
    bm.faces.new(top_verts)

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    if material:
        mesh.materials.append(material)

    shade_smooth_with_bevel(
        obj,
        bevel_width=bevel_width,
        segments=bevel_segments,
        profile=0.55,
        angle_deg=35.0,
        apply_modifiers=True,
    )
    return obj


def create_rounded_frame_tube(
    name: str,
    width: float,
    height: float,
    corner_radius: float,
    tube_radius: float,
    corner_segments: int = 18,
    bevel_resolution: int = 6,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    """Create a closed 3D rounded-rectangle tube/frame from a cyclic poly curve converted to mesh."""
    curve_data = bpy.data.curves.new(name + "_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = tube_radius
    curve_data.bevel_resolution = bevel_resolution
    curve_data.use_fill_caps = False

    pts = build_rounded_rect_points(width, height, corner_radius, corner_segments)
    spline = curve_data.splines.new(type="POLY")
    spline.points.add(len(pts) - 1)
    for idx, (x, y) in enumerate(pts):
        spline.points[idx].co = (x, y, 0.0, 1.0)
    spline.use_cyclic_u = True

    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.scene.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)

    for poly in obj.data.polygons:
        poly.use_smooth = True
    if material:
        obj.data.materials.append(material)
    return obj


def create_arc_tube(
    name: str,
    radius: float,
    angle_start_deg: float,
    angle_end_deg: float,
    tube_radius: float,
    segments: int = 96,
    bevel_resolution: int = 6,
    cyclic: bool = False,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    """Create a circular ring or sector arc tube mesh."""
    curve_data = bpy.data.curves.new(name + "_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = tube_radius
    curve_data.bevel_resolution = bevel_resolution
    curve_data.use_fill_caps = not cyclic

    spline = curve_data.splines.new(type="POLY")
    count = segments if cyclic else (segments + 1)
    spline.points.add(count - 1)

    a0 = math.radians(angle_start_deg)
    a1 = math.radians(angle_end_deg)
    for i in range(count):
        t = i / float(segments)
        ang = a0 + (a1 - a0) * t
        spline.points[i].co = (radius * math.cos(ang), radius * math.sin(ang), 0.0, 1.0)
    spline.use_cyclic_u = cyclic

    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.scene.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)

    for poly in obj.data.polygons:
        poly.use_smooth = True
    if material:
        obj.data.materials.append(material)
    return obj


def create_polyline_tube(
    name: str,
    points_3d: list[tuple[float, float, float]],
    tube_radius: float,
    bevel_resolution: int = 5,
    cyclic: bool = False,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    """Create a 3D polyline tube with rounded caps for architectural beams and relief glyphs."""
    curve_data = bpy.data.curves.new(name + "_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = tube_radius
    curve_data.bevel_resolution = bevel_resolution
    curve_data.use_fill_caps = not cyclic

    spline = curve_data.splines.new(type="POLY")
    spline.points.add(len(points_3d) - 1)
    for i, (x, y, z) in enumerate(points_3d):
        spline.points[i].co = (x, y, z, 1.0)
    spline.use_cyclic_u = cyclic

    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.scene.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)

    for poly in obj.data.polygons:
        poly.use_smooth = True
    if material:
        obj.data.materials.append(material)
    return obj


def create_uv_sphere(
    name: str,
    radius: float,
    location: tuple[float, float, float] = (0.0, 0.0, 0.0),
    segments: int = 32,
    rings: int = 18,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    mesh = bpy.data.meshes.new(name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location

    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=rings, radius=radius)
    bm.to_mesh(mesh)
    bm.free()

    for poly in mesh.polygons:
        poly.use_smooth = True
    if material:
        mesh.materials.append(material)
    return obj


def build_playbook_collection(mats: dict[str, bpy.types.Material]) -> bpy.types.Collection:
    """
    Phase 4 — Rebuild the Central Playbook Object in Blender.
    Three precision-machined layers in an isometric rig with internal alignment core,
    recessed top court, and flush SlideIn Orange pill inlay.
    """
    col = get_or_create_collection("Collection_Playbook")

    root = bpy.data.objects.new("Playbook_Root", None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 1.0
    # Calibrated isometric pose matching the website camera view:
    # tilted 53 deg in X and rotated -40 deg in Z so all 3 slab thicknesses & top inlay read crisply
    root.location = (0.0, -0.18, 0.35)
    root.rotation_euler = (math.radians(53.0), 0.0, math.radians(-40.0))
    link_exclusively(root, col)

    slab_w = 2.24
    slab_h = 2.24
    slab_r = 0.65  # 29% squircle corner radius

    # 1. Layer 0 — Foundation Graphite Base Slab
    slab_base = create_rounded_slab_mesh(
        name="Playbook_Slab_Base",
        width=slab_w,
        height=slab_h,
        depth=0.22,
        corner_radius=slab_r,
        bevel_width=0.028,
        bevel_segments=5,
        material=mats["graphite_chassis"],
    )
    slab_base.parent = root
    slab_base.location = (0.0, 0.0, -0.38)
    link_exclusively(slab_base, col)

    # Raised precision docking plinth on the base slab
    base_plinth = create_rounded_slab_mesh(
        name="Playbook_Base_Plinth",
        width=1.72,
        height=1.72,
        depth=0.06,
        corner_radius=0.48,
        bevel_width=0.012,
        bevel_segments=3,
        material=mats["graphite_ink"],
    )
    base_plinth.parent = slab_base
    base_plinth.location = (0.0, 0.0, 0.12)
    link_exclusively(base_plinth, col)

    # Internal alignment core column bridging the slabs when separated along Z
    core_column = create_rounded_slab_mesh(
        name="Playbook_Alignment_Core",
        width=0.88,
        height=0.88,
        depth=0.72,
        corner_radius=0.28,
        bevel_width=0.016,
        bevel_segments=3,
        material=mats["graphite_chassis"],
    )
    core_column.parent = root
    core_column.location = (0.0, 0.0, 0.0)
    link_exclusively(core_column, col)

    core_orange_ring = create_rounded_frame_tube(
        name="Playbook_Core_AccentRing",
        width=0.92,
        height=0.92,
        corner_radius=0.29,
        tube_radius=0.018,
        material=mats["slidein_orange"],
    )
    core_orange_ring.parent = core_column
    core_orange_ring.location = (0.0, 0.0, 0.0)
    link_exclusively(core_orange_ring, col)

    # 2. Layer 1 — Compiled Knowledge Mid-Plate (Warm Satin Ceramic)
    slab_mid = create_rounded_slab_mesh(
        name="Playbook_Slab_Mid",
        width=slab_w,
        height=slab_h,
        depth=0.20,
        corner_radius=slab_r,
        bevel_width=0.026,
        bevel_segments=5,
        material=mats["warm_ceramic"],
    )
    slab_mid.parent = root
    slab_mid.location = (0.0, 0.0, 0.0)
    link_exclusively(slab_mid, col)

    # Subtle architectural edge groove ring around the middle slab
    mid_trim = create_rounded_frame_tube(
        name="Playbook_Mid_Trim",
        width=1.84,
        height=1.84,
        corner_radius=0.52,
        tube_radius=0.014,
        material=mats["stone_bezel"],
    )
    mid_trim.parent = slab_mid
    mid_trim.location = (0.0, 0.0, 0.102)
    link_exclusively(mid_trim, col)

    # 3. Layer 2 — Top Instrument Plate (Porcelain Ivory + Recessed Court + SlideIn Orange Inlay)
    slab_top = create_rounded_slab_mesh(
        name="Playbook_Slab_Top",
        width=slab_w,
        height=slab_h,
        depth=0.22,
        corner_radius=slab_r,
        bevel_width=0.028,
        bevel_segments=5,
        material=mats["porcelain_ivory"],
    )
    slab_top.parent = root
    slab_top.location = (0.0, 0.0, 0.38)
    link_exclusively(slab_top, col)

    # Top face recessed inner court plate & crisp perimeter bezel (16% inset)
    top_inset_plate = create_rounded_slab_mesh(
        name="Playbook_Top_Inset_Court",
        width=1.54,
        height=1.54,
        depth=0.024,
        corner_radius=0.40,
        bevel_width=0.008,
        bevel_segments=3,
        material=mats["warm_ceramic"],
    )
    top_inset_plate.parent = slab_top
    top_inset_plate.location = (0.0, 0.0, 0.106)
    link_exclusively(top_inset_plate, col)

    top_inset_bezel = create_rounded_frame_tube(
        name="Playbook_Top_Inset_Bezel",
        width=1.56,
        height=1.56,
        corner_radius=0.41,
        tube_radius=0.014,
        material=mats["stone_bezel"],
    )
    top_inset_bezel.parent = slab_top
    top_inset_bezel.location = (0.0, 0.0, 0.116)
    link_exclusively(top_inset_bezel, col)

    # Signature SlideIn Orange Pill Inlay in the lower-right quadrant of the top slab
    orange_inlay_collar = create_rounded_slab_mesh(
        name="Playbook_Inlay_Collar",
        width=0.44,
        height=0.21,
        depth=0.026,
        corner_radius=0.10,
        bevel_width=0.006,
        bevel_segments=3,
        material=mats["stone_bezel"],
    )
    orange_inlay_collar.parent = slab_top
    orange_inlay_collar.location = (0.36, -0.38, 0.114)
    link_exclusively(orange_inlay_collar, col)

    orange_inlay = create_rounded_slab_mesh(
        name="Playbook_Orange_Inlay",
        width=0.38,
        height=0.155,
        depth=0.042,
        corner_radius=0.075,
        bevel_width=0.010,
        bevel_segments=4,
        material=mats["slidein_orange"],
    )
    orange_inlay.parent = slab_top
    orange_inlay.location = (0.36, -0.38, 0.124)
    link_exclusively(orange_inlay, col)

    return col


def build_orbital_system_collection(mats: dict[str, bpy.types.Material]) -> bpy.types.Collection:
    """
    Phase 5 — Rebuild the Orbital and Geometrical System in Blender.
    Exact mathematical proportions:
      Circle R = 3.72 m (186 design units)
      Rounded square half-side H = 3.00 m (150 design units), corner radius Rc = 1.2616 m (63.08 design units)
      Four tangent points at (+/- 2.6304 m, +/- 2.6304 m)
      Upper orange arc between the two upper tangent points (45 deg to 135 deg)
      Two horizontal anchor beams (+/- 3.00 m to +/- 5.56 m) with orange terminal nodes
      One rotating orbital traveller bead
    """
    col = get_or_create_collection("Collection_OrbitalSystem")

    root = bpy.data.objects.new("Orbital_Root", None)
    root.empty_display_type = "PLAIN_AXES"
    root.location = (0.0, 0.0, 0.0)
    link_exclusively(root, col)

    R = 3.72
    HALF = 3.00
    RC = 1.2616

    # 1. Primary Circular Orbit Track
    circle_track = create_arc_tube(
        name="Orbit_Circle_Track",
        radius=R,
        angle_start_deg=0.0,
        angle_end_deg=360.0,
        tube_radius=0.018,
        segments=128,
        cyclic=True,
        material=mats["stone_bezel"],
    )
    circle_track.parent = root
    circle_track.location = (0.0, 0.0, -0.05)
    link_exclusively(circle_track, col)

    # 2. Secondary Rounded-Square Boundary Track (dimensionally layered at z = -0.10 m)
    square_track = create_rounded_frame_tube(
        name="Orbit_Square_Boundary",
        width=HALF * 2.0,
        height=HALF * 2.0,
        corner_radius=RC,
        tube_radius=0.016,
        corner_segments=24,
        material=mats["stone_bezel"],
    )
    square_track.parent = root
    square_track.location = (0.0, 0.0, -0.10)
    link_exclusively(square_track, col)

    # 3. Restrained SlideIn Orange Upper Accent Arc (45 deg to 135 deg between upper tangent points)
    orange_arc = create_arc_tube(
        name="Orbit_Orange_Arc",
        radius=R,
        angle_start_deg=45.0,
        angle_end_deg=135.0,
        tube_radius=0.028,
        segments=64,
        cyclic=False,
        material=mats["slidein_orange"],
    )
    orange_arc.parent = root
    orange_arc.location = (0.0, 0.0, 0.01)
    link_exclusively(orange_arc, col)

    # 4. Left & Right Horizontal Anchor Beams
    beam_left = create_polyline_tube(
        name="Orbit_Beam_Left",
        points_3d=[(-6.16, 0.0, -0.06), (-HALF, 0.0, -0.06)],
        tube_radius=0.016,
        material=mats["stone_bezel"],
    )
    beam_left.parent = root
    link_exclusively(beam_left, col)

    beam_right = create_polyline_tube(
        name="Orbit_Beam_Right",
        points_3d=[(HALF, 0.0, -0.06), (6.16, 0.0, -0.06)],
        tube_radius=0.016,
        material=mats["stone_bezel"],
    )
    beam_right.parent = root
    link_exclusively(beam_right, col)

    # 5. Beam Terminal Registration Nodes where beams meet the rounded square
    term_left = create_uv_sphere(
        name="Orbit_Terminal_Left",
        radius=0.068,
        location=(-HALF, 0.0, -0.02),
        material=mats["slidein_orange"],
    )
    term_left.parent = root
    link_exclusively(term_left, col)

    term_right = create_uv_sphere(
        name="Orbit_Terminal_Right",
        radius=0.068,
        location=(HALF, 0.0, -0.02),
        material=mats["slidein_orange"],
    )
    term_right.parent = root
    link_exclusively(term_right, col)

    # 6. Orbital Traveller Carrier + Bead (rotating Carrier around Z moves Bead along the exact circle)
    carrier = bpy.data.objects.new("Orbit_Traveller_Carrier", None)
    carrier.empty_display_type = "ARROWS"
    carrier.parent = root
    carrier.location = (0.0, 0.0, 0.02)
    link_exclusively(carrier, col)

    bead = create_uv_sphere(
        name="Orbit_Traveller_Bead",
        radius=0.078,
        location=(0.0, R, 0.0),
        material=mats["slidein_orange"],
    )
    bead.parent = carrier
    link_exclusively(bead, col)

    bead_halo = create_arc_tube(
        name="Orbit_Traveller_Collar",
        radius=0.115,
        angle_start_deg=0.0,
        angle_end_deg=360.0,
        tube_radius=0.014,
        segments=32,
        cyclic=True,
        material=mats["porcelain_ivory"],
    )
    bead_halo.parent = bead
    bead_halo.location = (0.0, 0.0, 0.0)
    link_exclusively(bead_halo, col)

    return col


def build_artifact_tile_chassis(
    name: str,
    size: float,
    location: tuple[float, float, float],
    has_pip: bool,
    mats: dict[str, bpy.types.Material],
    col: bpy.types.Collection,
    parent: bpy.types.Object,
) -> bpy.types.Object:
    """Create one member of the coherent 3D object family (graphite base + porcelain face + optional pip)."""
    tile_root = bpy.data.objects.new(name, None)
    tile_root.empty_display_type = "PLAIN_AXES"
    tile_root.parent = parent
    tile_root.location = location
    link_exclusively(tile_root, col)

    r_corner = size * 0.31
    depth_base = size * 0.11
    depth_face = size * 0.12

    # Lower Graphite Base Chassis (shifted slightly down in Y and back in Z for tactile edge thickness)
    base_plate = create_rounded_slab_mesh(
        name=f"{name}_Chassis",
        width=size,
        height=size,
        depth=depth_base,
        corner_radius=r_corner,
        bevel_width=size * 0.024,
        bevel_segments=4,
        material=mats["graphite_chassis"],
    )
    base_plate.parent = tile_root
    base_plate.location = (0.0, -size * 0.048, -depth_base * 0.45)
    link_exclusively(base_plate, col)

    # Upper Warm Porcelain Ivory Face Plate
    face_plate = create_rounded_slab_mesh(
        name=f"{name}_Face",
        width=size,
        height=size,
        depth=depth_face,
        corner_radius=r_corner,
        bevel_width=size * 0.026,
        bevel_segments=4,
        material=mats["porcelain_ivory"],
    )
    face_plate.parent = tile_root
    face_plate.location = (0.0, 0.0, depth_face * 0.35)
    link_exclusively(face_plate, col)

    # Subtle Recessed Inner Bezel Frame
    inner_bezel = create_rounded_frame_tube(
        name=f"{name}_Bezel",
        width=size * 0.82,
        height=size * 0.82,
        corner_radius=size * 0.24,
        tube_radius=size * 0.008,
        material=mats["stone_bezel"],
    )
    inner_bezel.parent = tile_root
    inner_bezel.location = (0.0, 0.0, depth_face * 0.96)
    link_exclusively(inner_bezel, col)

    # Optional SlideIn Orange Status Indicator Pip (reserved for the two horizontal run-mode anchors)
    if has_pip:
        pip = create_uv_sphere(
            name=f"{name}_OrangePip",
            radius=size * 0.042,
            location=(size * 0.28, size * 0.28, depth_face * 0.98),
            material=mats["slidein_orange"],
        )
        pip.scale = (1.0, 1.0, 0.55)
        pip.parent = tile_root
        link_exclusively(pip, col)

    return tile_root


def add_relief_glyph(
    tile_root: bpy.types.Object,
    glyph_kind: str,
    size: float,
    mats: dict[str, bpy.types.Material],
    col: bpy.types.Collection,
):
    """Build precision 3D tactile relief emblems on the face of each artifact tile."""
    z_surf = size * 0.105
    tube_r = size * 0.024
    s = size * 0.22

    if glyph_kind == "search":
        # Optical loupe ring + angled handle
        ring = create_arc_tube(
            name=f"{tile_root.name}_Glyph_Ring",
            radius=s * 0.68,
            angle_start_deg=0.0,
            angle_end_deg=360.0,
            tube_radius=tube_r,
            segments=40,
            cyclic=True,
            material=mats["graphite_ink"],
        )
        ring.parent = tile_root
        ring.location = (-s * 0.18, s * 0.18, z_surf)
        link_exclusively(ring, col)

        handle = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Handle",
            points_3d=[(s * 0.32, -s * 0.32, z_surf), (s * 0.85, -s * 0.85, z_surf)],
            tube_radius=tube_r * 1.05,
            material=mats["graphite_ink"],
        )
        handle.parent = tile_root
        link_exclusively(handle, col)

    elif glyph_kind == "write":
        # Precision stylus / pen nib + baseline
        stylus = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Stylus",
            points_3d=[
                (-s * 0.65, -s * 0.55, z_surf),
                (-s * 0.25, -s * 0.45, z_surf),
                (s * 0.65, s * 0.45, z_surf),
                (s * 0.35, s * 0.75, z_surf),
                (-s * 0.55, -s * 0.15, z_surf),
                (-s * 0.65, -s * 0.55, z_surf),
            ],
            tube_radius=tube_r * 0.9,
            cyclic=True,
            material=mats["graphite_ink"],
        )
        stylus.parent = tile_root
        link_exclusively(stylus, col)

        baseline = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Line",
            points_3d=[(-s * 0.72, -s * 0.82, z_surf), (s * 0.72, -s * 0.82, z_surf)],
            tube_radius=tube_r * 0.85,
            material=mats["graphite_ink"],
        )
        baseline.parent = tile_root
        link_exclusively(baseline, col)

    elif glyph_kind == "send":
        # Paper glider dispatch chevron
        wings = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Glider",
            points_3d=[
                (-s * 0.82, s * 0.12, z_surf),
                (s * 0.82, s * 0.78, z_surf),
                (s * 0.18, -s * 0.82, z_surf),
                (-s * 0.12, -s * 0.12, z_surf),
                (-s * 0.82, s * 0.12, z_surf),
            ],
            tube_radius=tube_r * 0.9,
            cyclic=True,
            material=mats["graphite_ink"],
        )
        wings.parent = tile_root
        link_exclusively(wings, col)

        crease = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Crease",
            points_3d=[(-s * 0.12, -s * 0.12, z_surf), (s * 0.82, s * 0.78, z_surf)],
            tube_radius=tube_r * 0.75,
            material=mats["graphite_ink"],
        )
        crease.parent = tile_root
        link_exclusively(crease, col)

    elif glyph_kind == "verify":
        # Shield perimeter + inner check
        shield = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Shield",
            points_3d=[
                (0.0, s * 0.88, z_surf),
                (s * 0.72, s * 0.56, z_surf),
                (s * 0.68, -s * 0.12, z_surf),
                (0.0, -s * 0.86, z_surf),
                (-s * 0.68, -s * 0.12, z_surf),
                (-s * 0.72, s * 0.56, z_surf),
                (0.0, s * 0.88, z_surf),
            ],
            tube_radius=tube_r * 0.88,
            cyclic=True,
            material=mats["graphite_ink"],
        )
        shield.parent = tile_root
        link_exclusively(shield, col)

        check = create_polyline_tube(
            name=f"{tile_root.name}_Glyph_Check",
            points_3d=[
                (-s * 0.30, -s * 0.02, z_surf),
                (-s * 0.05, -s * 0.28, z_surf),
                (s * 0.36, s * 0.22, z_surf),
            ],
            tube_radius=tube_r * 0.92,
            material=mats["graphite_ink"],
        )
        check.parent = tile_root
        link_exclusively(check, col)

    elif glyph_kind == "prospects":
        # User head circle + shoulders arch
        head = create_arc_tube(
            name=f"{tile_root.name}_Glyph_Head",
            radius=s * 0.38,
            angle_start_deg=0.0,
            angle_end_deg=360.0,
            tube_radius=tube_r * 0.88,
            segments=36,
            cyclic=True,
            material=mats["graphite_ink"],
        )
        head.parent = tile_root
        head.location = (0.0, s * 0.36, z_surf)
        link_exclusively(head, col)

        shoulders = create_arc_tube(
            name=f"{tile_root.name}_Glyph_Shoulders",
            radius=s * 0.76,
            angle_start_deg=18.0,
            angle_end_deg=162.0,
            tube_radius=tube_r * 0.88,
            segments=32,
            cyclic=False,
            material=mats["graphite_ink"],
        )
        shoulders.parent = tile_root
        shoulders.location = (0.0, -s * 0.88, z_surf)
        link_exclusively(shoulders, col)

    elif glyph_kind == "configure":
        # Three horizontal calibration tracks + staggered precision knobs
        rows = [
            (s * 0.52, -s * 0.28),
            (0.0, s * 0.32),
            (-s * 0.52, -s * 0.12),
        ]
        for idx, (ry, kx) in enumerate(rows):
            track = create_polyline_tube(
                name=f"{tile_root.name}_Glyph_Track_{idx}",
                points_3d=[(-s * 0.78, ry, z_surf), (s * 0.78, ry, z_surf)],
                tube_radius=tube_r * 0.72,
                material=mats["graphite_ink"],
            )
            track.parent = tile_root
            link_exclusively(track, col)

            knob = create_uv_sphere(
                name=f"{tile_root.name}_Glyph_Knob_{idx}",
                radius=tube_r * 1.65,
                location=(kx, ry, z_surf + tube_r * 0.3),
                material=mats["graphite_ink"],
            )
            knob.parent = tile_root
            link_exclusively(knob, col)


def build_floating_objects_collection(mats: dict[str, bpy.types.Material]) -> bpy.types.Collection:
    """
    Phase 6 — Create a Coherent 3D Object Family.
    Four tangent tool objects (56 design units = 1.12 m) and two horizontal run-mode
    anchor objects (88 design units = 1.76 m).
    """
    col = get_or_create_collection("Collection_FloatingObjects")

    root = bpy.data.objects.new("Floating_Root", None)
    root.empty_display_type = "PLAIN_AXES"
    root.location = (0.0, 0.0, 0.0)
    link_exclusively(root, col)

    D = 3.72 * math.sqrt(0.5)  # 2.6304 m (131.52 design units)
    tool_size = 1.12           # 56 design units
    anchor_size = 1.76         # 88 design units

    specs = [
        ("Tool_Search", (-D, D, 0.10), tool_size, False, "search"),
        ("Tool_Write", (D, D, 0.10), tool_size, False, "write"),
        ("Tool_Send", (D, -D, 0.10), tool_size, False, "send"),
        ("Tool_Verify", (-D, -D, 0.10), tool_size, False, "verify"),
        ("Anchor_Prospects", (-7.40, 0.0, 0.12), anchor_size, True, "prospects"),
        ("Anchor_Configure", (7.40, 0.0, 0.12), anchor_size, True, "configure"),
    ]

    for name, loc, sz, pip, glyph_kind in specs:
        tile = build_artifact_tile_chassis(
            name=name,
            size=sz,
            location=loc,
            has_pip=pip,
            mats=mats,
            col=col,
            parent=root,
        )
        add_relief_glyph(tile, glyph_kind, sz, mats, col)

    return col


def build_studio_lighting_and_camera(mats: dict[str, bpy.types.Material]) -> bpy.types.Collection:
    """
    Phase 3 & 14 — Studio Lighting, Backdrop & Camera Setup for Blender Preview Renders.
    """
    col = get_or_create_collection("Collection_StageStudio")

    # Warm ivory backdrop plane behind the composition for studio preview renders
    backdrop = create_rounded_slab_mesh(
        name="Studio_Backdrop_Plane",
        width=28.0,
        height=16.0,
        depth=0.10,
        corner_radius=0.5,
        bevel_width=0.01,
        bevel_segments=2,
        material=mats["studio_backdrop"],
    )
    backdrop.location = (0.0, 0.0, -0.55)
    link_exclusively(backdrop, col)

    # 1. Primary Studio Key Light (Upper-Left Large Softbox)
    key_data = bpy.data.lights.new(name="Studio_Key_Light", type="AREA")
    key_data.energy = 850.0
    key_data.shape = "RECTANGLE"
    key_data.size = 9.0
    key_data.size_y = 6.5
    key_data.color = (1.0, 0.985, 0.96)
    key_obj = bpy.data.objects.new(name="Studio_Key_Light", object_data=key_data)
    key_obj.location = (-6.8, 5.8, 9.5)
    key_obj.rotation_euler = (math.radians(-30.0), math.radians(-34.0), 0.0)
    link_exclusively(key_obj, col)

    # 2. Secondary Fill Light (Right Soft Diffuser)
    fill_data = bpy.data.lights.new(name="Studio_Fill_Light", type="AREA")
    fill_data.energy = 380.0
    fill_data.shape = "RECTANGLE"
    fill_data.size = 10.0
    fill_data.size_y = 8.0
    fill_data.color = (0.99, 0.96, 0.91)
    fill_obj = bpy.data.objects.new(name="Studio_Fill_Light", object_data=fill_data)
    fill_obj.location = (7.5, -2.5, 8.5)
    fill_obj.rotation_euler = (math.radians(15.0), math.radians(38.0), 0.0)
    link_exclusively(fill_obj, col)

    # 3. Gentle SlideIn Orange Bounce Light beneath Playbook
    bounce_data = bpy.data.lights.new(name="Studio_Orange_Bounce", type="AREA")
    bounce_data.energy = 140.0
    bounce_data.shape = "DISK"
    bounce_data.size = 4.2
    bounce_data.color = (1.0, 0.42, 0.08)
    bounce_obj = bpy.data.objects.new(name="Studio_Orange_Bounce", object_data=bounce_data)
    bounce_obj.location = (0.4, -1.8, 1.4)
    bounce_obj.rotation_euler = (math.radians(42.0), math.radians(-12.0), 0.0)
    link_exclusively(bounce_obj, col)

    # 4. Top Rim Highlight Light
    rim_data = bpy.data.lights.new(name="Studio_Rim_Light", type="AREA")
    rim_data.energy = 320.0
    rim_data.shape = "RECTANGLE"
    rim_data.size = 12.0
    rim_data.size_y = 4.0
    rim_data.color = (1.0, 0.99, 0.97)
    rim_obj = bpy.data.objects.new(name="Studio_Rim_Light", object_data=rim_data)
    rim_obj.location = (0.0, 6.2, 6.8)
    rim_obj.rotation_euler = (math.radians(-42.0), 0.0, 0.0)
    link_exclusively(rim_obj, col)

    # 5. Primary Website Framing Camera (85mm low-distortion perspective)
    cam_data = bpy.data.cameras.new(name="Hero_Camera")
    cam_data.lens = 85.0
    cam_data.sensor_width = 36.0
    cam_data.clip_start = 0.1
    cam_data.clip_end = 120.0
    cam_obj = bpy.data.objects.new(name="Hero_Camera", object_data=cam_data)
    cam_obj.location = (0.0, -1.4, 24.5)
    cam_obj.rotation_euler = (math.radians(3.2), 0.0, 0.0)
    link_exclusively(cam_obj, col)
    bpy.context.scene.camera = cam_obj

    # 6. Close-up Playbook Inspection Camera (for Phase 4 & 14 close-up evaluation)
    close_cam_data = bpy.data.cameras.new(name="Playbook_Closeup_Camera")
    close_cam_data.lens = 95.0
    close_cam_data.sensor_width = 36.0
    close_cam_obj = bpy.data.objects.new(name="Playbook_Closeup_Camera", object_data=close_cam_data)
    close_cam_obj.location = (0.0, -1.8, 9.2)
    close_cam_obj.rotation_euler = (math.radians(10.5), 0.0, 0.0)
    link_exclusively(close_cam_obj, col)

    # World ambient lighting (warm ivory sky)
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("SlideIn_Studio_World")
        bpy.context.scene.world = world
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs["Color"].default_value = (0.965, 0.948, 0.922, 1.0)
        bg_node.inputs["Strength"].default_value = 0.65

    return col


def build_entire_scene() -> dict[str, bpy.types.Collection]:
    clear_scene()
    mats = create_all_materials()
    c_playbook = build_playbook_collection(mats)
    c_orbital = build_orbital_system_collection(mats)
    c_floating = build_floating_objects_collection(mats)
    c_studio = build_studio_lighting_and_camera(mats)
    bpy.context.view_layer.update()
    return {
        "playbook": c_playbook,
        "orbital": c_orbital,
        "floating": c_floating,
        "studio": c_studio,
    }


if __name__ == "__main__":
    cols = build_entire_scene()
    print("=== SCENE GEOMETRY BUILT SUCCESSFULLY ===")
    for k, c in cols.items():
        print(f"Collection [{k}]: {len(c.objects)} objects -> {[o.name for o in c.objects]}")
