"""
Phase 7 — Keyframed 3D Choreography in Blender 5.2.3 LTS.
Creates deliberate, ease-in/ease-out keyframed animations across a 120-frame timeline (24 fps)
that synchronize with normalized scroll progress (0.00 -> 1.00) in React Three Fiber.
"""

import bpy
import math
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

from create_geometry import build_entire_scene


def apply_bezier_auto_clamped(obj: bpy.types.Object):
    """Ensure all F-curves on an object's Blender 5.2 layered Action use smooth AUTO_CLAMPED Bezier handles."""
    if not obj.animation_data or not obj.animation_data.action:
        return
    act = obj.animation_data.action
    slot = obj.animation_data.action_slot
    if not act.layers or not act.layers[0].strips:
        return
    cb = act.layers[0].strips[0].channelbag(slot)
    if not cb:
        return
    for fcurve in cb.fcurves:
        for kp in fcurve.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"
        fcurve.update()


def keyframe_transform(
    obj: bpy.types.Object,
    frame: int,
    location: tuple[float, float, float] | None = None,
    rotation_deg: tuple[float, float, float] | None = None,
    scale: tuple[float, float, float] | None = None,
):
    if location is not None:
        obj.location = location
        obj.keyframe_insert(data_path="location", frame=frame)
    if rotation_deg is not None:
        obj.rotation_euler = (
            math.radians(rotation_deg[0]),
            math.radians(rotation_deg[1]),
            math.radians(rotation_deg[2]),
        )
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)


def build_animations():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 120
    scene.render.fps = 24

    # 1. Central Playbook Root & Slabs Choreography
    pb_root = bpy.data.objects.get("Playbook_Root")
    slab_base = bpy.data.objects.get("Playbook_Slab_Base")
    slab_mid = bpy.data.objects.get("Playbook_Slab_Mid")
    slab_top = bpy.data.objects.get("Playbook_Slab_Top")

    if pb_root:
        # Act 1 (Frame 1): Deconstructed / angled entrance pose
        keyframe_transform(pb_root, 1, location=(0.0, -0.24, 0.44), rotation_deg=(57.0, -2.5, -45.0))
        # Act 2 (Frame 36): Converges into calibrated isometric alignment
        keyframe_transform(pb_root, 36, location=(0.0, -0.18, 0.35), rotation_deg=(53.0, 0.0, -40.0))
        # Act 3 (Frame 72): Harmonic inspection orientation during prospect journey
        keyframe_transform(pb_root, 72, location=(0.0, -0.14, 0.39), rotation_deg=(50.5, 1.8, -38.0))
        # Act 4 (Frame 96): Subtle approval nod toward the studio keylight at the gate
        keyframe_transform(pb_root, 96, location=(0.0, -0.16, 0.37), rotation_deg=(54.2, -1.0, -41.2))
        # Act 5 (Frame 120): Settles into the signature resting equilibrium
        keyframe_transform(pb_root, 120, location=(0.0, -0.18, 0.35), rotation_deg=(53.0, 0.0, -40.0))
        apply_bezier_auto_clamped(pb_root)

    if slab_base and slab_mid and slab_top:
        # Frame 1: Expanded separation
        keyframe_transform(slab_base, 1, location=(0.0, 0.0, -0.54))
        keyframe_transform(slab_mid, 1, location=(0.0, 0.0, 0.0))
        keyframe_transform(slab_top, 1, location=(0.0, 0.0, 0.54))

        # Frame 36: Precision docked state
        keyframe_transform(slab_base, 36, location=(0.0, 0.0, -0.34))
        keyframe_transform(slab_mid, 36, location=(0.0, 0.0, 0.0))
        keyframe_transform(slab_top, 36, location=(0.0, 0.0, 0.34))

        # Frame 72: Controlled expansion revealing internal alignment core & orange ring
        keyframe_transform(slab_base, 72, location=(0.0, 0.0, -0.48))
        keyframe_transform(slab_mid, 72, location=(0.0, 0.0, 0.02))
        keyframe_transform(slab_top, 72, location=(0.0, 0.0, 0.48))

        # Frame 96: Gate approval pulse on top slab
        keyframe_transform(slab_base, 96, location=(0.0, 0.0, -0.38))
        keyframe_transform(slab_mid, 96, location=(0.0, 0.0, 0.0))
        keyframe_transform(slab_top, 96, location=(0.0, 0.0, 0.42))

        # Frame 120: Balanced resting separation
        keyframe_transform(slab_base, 120, location=(0.0, 0.0, -0.38))
        keyframe_transform(slab_mid, 120, location=(0.0, 0.0, 0.0))
        keyframe_transform(slab_top, 120, location=(0.0, 0.0, 0.38))

        apply_bezier_auto_clamped(slab_base)
        apply_bezier_auto_clamped(slab_mid)
        apply_bezier_auto_clamped(slab_top)

    # 2. Orbital System & Traveller Bead Choreography
    orb_root = bpy.data.objects.get("Orbital_Root")
    carrier = bpy.data.objects.get("Orbit_Traveller_Carrier")

    if orb_root:
        keyframe_transform(orb_root, 1, location=(0.0, 0.0, -0.18), rotation_deg=(4.0, 0.0, 0.0))
        keyframe_transform(orb_root, 36, location=(0.0, 0.0, 0.0), rotation_deg=(0.0, 0.0, 0.0))
        keyframe_transform(orb_root, 120, location=(0.0, 0.0, 0.0), rotation_deg=(0.0, 0.0, 0.0))
        apply_bezier_auto_clamped(orb_root)

    if carrier:
        # Bead starts at upper-left tangent (+45 deg Z rotation from top apex)
        keyframe_transform(carrier, 1, rotation_deg=(0.0, 0.0, 45.0))
        # Sweeps across the upper orange arc to top apex (0 deg) by Frame 36
        keyframe_transform(carrier, 36, rotation_deg=(0.0, 0.0, 0.0))
        # Continues through Write (-45 deg), Send (-135 deg), Verify (-225 deg)
        keyframe_transform(carrier, 64, rotation_deg=(0.0, 0.0, -45.0))
        keyframe_transform(carrier, 88, rotation_deg=(0.0, 0.0, -135.0))
        keyframe_transform(carrier, 104, rotation_deg=(0.0, 0.0, -225.0))
        # Returns cleanly to top apex (-360 deg) at loop closure (Frame 120)
        keyframe_transform(carrier, 120, rotation_deg=(0.0, 0.0, -360.0))
        apply_bezier_auto_clamped(carrier)

    # 3. Floating Objects Coordinated Elevation Choreography
    D = 3.72 * math.sqrt(0.5)
    floating_timeline = [
        ("Tool_Search", (-D, D, 0.10), 42, 58),
        ("Tool_Write", (D, D, 0.10), 56, 72),
        ("Tool_Verify", (-D, -D, 0.10), 70, 88),
        ("Tool_Send", (D, -D, 0.10), 84, 102),
        ("Anchor_Prospects", (-7.40, 0.0, 0.12), 28, 52),
        ("Anchor_Configure", (7.40, 0.0, 0.12), 96, 116),
    ]

    for name, base_loc, peak_start, peak_end in floating_timeline:
        obj = bpy.data.objects.get(name)
        if not obj:
            continue
        bx, by, bz = base_loc
        # Frame 1: Recessed start state
        keyframe_transform(obj, 1, location=(bx, by - 0.12, bz - 0.16), rotation_deg=(4.0, -3.0, 0.0))
        # Frame 24: Settle onto tangent/anchor coordinates
        keyframe_transform(obj, 24, location=(bx, by, bz), rotation_deg=(0.0, 0.0, 0.0))
        # Pre-peak hold
        if peak_start > 26:
            keyframe_transform(obj, peak_start - 6, location=(bx, by, bz), rotation_deg=(0.0, 0.0, 0.0))
        # Active stage elevation highlight (lifts along Z and tilts slightly toward keylight)
        peak_mid = (peak_start + peak_end) // 2
        keyframe_transform(
            obj,
            peak_mid,
            location=(bx, by + 0.05, bz + 0.18),
            rotation_deg=(-3.5, 3.0, 0.0),
        )
        # Return to calibrated plane
        keyframe_transform(obj, min(118, peak_end + 6), location=(bx, by, bz), rotation_deg=(0.0, 0.0, 0.0))
        # Frame 120: Final resting equilibrium
        keyframe_transform(obj, 120, location=(bx, by, bz), rotation_deg=(0.0, 0.0, 0.0))
        apply_bezier_auto_clamped(obj)

    # Set default active frame to Frame 72 (the rich mid-journey inspection pose) for static previews
    scene.frame_set(72)


if __name__ == "__main__":
    build_entire_scene()
    build_animations()
    print("=== ANIMATIONS BUILT SUCCESSFULLY (FRAMES 1..120) ===")
