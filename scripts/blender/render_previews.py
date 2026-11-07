"""
Phase 14 — Render, Inspect and Refine using Blender 5.2.3 LTS Headless CLI.
Saves `design/blender/slidein_hero.blend` and renders multi-angle & multi-frame
studio previews using Cycles (with Apple Metal GPU acceleration).
"""

import bpy
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

from create_geometry import build_entire_scene
from create_animation import build_animations


def configure_cycles_metal(samples: int = 48, res_x: int = 1600, res_y: int = 900):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = False  # Clean deterministic multi-sample path tracing
    scene.render.resolution_x = res_x
    scene.render.resolution_y = res_y
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False

    # Enable Metal GPU acceleration on macOS if available
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for dev in prefs.devices:
            dev.use = True
        scene.cycles.device = "GPU"
    except Exception as exc:
        print("Metal GPU fallback to CPU:", exc)
        scene.cycles.device = "CPU"


def render_all_previews():
    build_entire_scene()
    build_animations()

    blend_dir = os.path.join(PROJECT_ROOT, "design", "blender")
    os.makedirs(blend_dir, exist_ok=True)
    blend_path = os.path.join(blend_dir, "slidein_hero.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Saved editable Blender project: {blend_path}")

    out_dir = os.path.join(PROJECT_ROOT, "public", "renders", "hero-previews")
    os.makedirs(out_dir, exist_ok=True)

    scene = bpy.context.scene
    hero_cam = bpy.data.objects.get("Hero_Camera")
    close_cam = bpy.data.objects.get("Playbook_Closeup_Camera")

    # 1. Close-up high-detail inspection render of the Central Playbook Object (Frame 72)
    configure_cycles_metal(samples=64, res_x=1200, res_y=900)
    if close_cam:
        scene.camera = close_cam
        scene.frame_set(72)
        close_path = os.path.join(out_dir, "playbook_closeup_v1.png")
        scene.render.filepath = close_path
        bpy.ops.render.render(write_still=True)
        print("Rendered close-up preview:", close_path)

    # 2. Full Composition Storyboard Frames from the Website Camera Angle
    configure_cycles_metal(samples=48, res_x=1600, res_y=800)
    if hero_cam:
        scene.camera = hero_cam
        for frame in (1, 36, 72, 120):
            scene.frame_set(frame)
            frame_path = os.path.join(out_dir, f"hero_scene_frame_{frame:03d}.png")
            scene.render.filepath = frame_path
            bpy.ops.render.render(write_still=True)
            print(f"Rendered frame {frame}: {frame_path}")


if __name__ == "__main__":
    render_all_previews()
    print("=== ALL BLENDER PREVIEW RENDERS COMPLETED ===")
