"""
Phase 2 — Inspect Blender 5.2.3 LTS Python API, Render Engines, and glTF 2.0 Exporter Options.
Run via:
  blender --background --python scripts/blender/inspect_scene.py
"""

import bpy
import sys

print("=== BLENDER ENVIRONMENT INSPECTION ===")
print("Blender Version:", bpy.app.version_string)
print("Blender Binary:", bpy.app.binary_path)
print("Python Version:", sys.version)

# Check available render engines
engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
print("Available Render Engines:", engines)

# Check Principled BSDF inputs in Blender 5.2
mat = bpy.data.materials.new(name="TestMat")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    print("Principled BSDF Inputs:", [inp.name for inp in bsdf.inputs])

# Check glTF export operator properties
gltf_props = [p.identifier for p in bpy.ops.export_scene.gltf.get_rna_type().properties]
print("glTF Exporter Properties:", gltf_props)
print("=== INSPECTION COMPLETE ===")
