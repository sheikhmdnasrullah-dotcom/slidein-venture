"""
Phase 3 & 4 — SlideIn Studio Material Library for Blender 5.2.3 LTS.
Creates physically plausible PBR materials using Principled BSDF.
"""

import bpy


def srgb_to_linear(c: float) -> float:
    if c <= 0.04045:
        return c / 12.92
    return ((c + 0.055) / 1.055) ** 2.4


def hex_to_rgba(hex_str: str, alpha: float = 1.0) -> tuple[float, float, float, float]:
    h = hex_str.lstrip("#")
    r = srgb_to_linear(int(h[0:2], 16) / 255.0)
    g = srgb_to_linear(int(h[2:4], 16) / 255.0)
    b = srgb_to_linear(int(h[4:6], 16) / 255.0)
    return (r, g, b, alpha)


def make_pbr_material(
    name: str,
    hex_color: str,
    roughness: float = 0.3,
    metallic: float = 0.0,
    coat_weight: float = 0.0,
    coat_roughness: float = 0.2,
    specular_ior: float = 0.5,
    emission_hex: str | None = None,
    emission_strength: float = 0.0,
    alpha: float = 1.0,
) -> bpy.types.Material:
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name=name)

    tree = mat.node_tree
    bsdf = tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = tree.nodes.new(type="ShaderNodeBsdfPrincipled")

    bsdf.inputs["Base Color"].default_value = hex_to_rgba(hex_color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular_ior
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = coat_weight
    if "Coat Roughness" in bsdf.inputs:
        bsdf.inputs["Coat Roughness"].default_value = coat_roughness
    if "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha

    if emission_hex and emission_strength > 0.0:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = hex_to_rgba(emission_hex, 1.0)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission_strength

    return mat


def create_all_materials() -> dict[str, bpy.types.Material]:
    """Build and return the complete SlideIn 3D material dictionary."""
    mats = {
        # Top instrument plates & floating tile faces: warm matte-satin porcelain ivory
        "porcelain_ivory": make_pbr_material(
            name="Mat_Porcelain_Ivory",
            hex_color="#FAF8F4",
            roughness=0.24,
            metallic=0.0,
            coat_weight=0.16,
            coat_roughness=0.22,
            specular_ior=0.52,
        ),
        # Middle Playbook slab & recessed wells: warm tactile ceramic
        "warm_ceramic": make_pbr_material(
            name="Mat_Warm_Ceramic",
            hex_color="#EEE9DF",
            roughness=0.33,
            metallic=0.0,
            coat_weight=0.08,
            coat_roughness=0.28,
            specular_ior=0.48,
        ),
        # Secondary structural stone & rounded-square path
        "stone_bezel": make_pbr_material(
            name="Mat_Stone_Bezel",
            hex_color="#DDD5C7",
            roughness=0.40,
            metallic=0.02,
            coat_weight=0.04,
            specular_ior=0.45,
        ),
        # Playbook base slab & floating object lower chassis: deep architectural graphite
        "graphite_chassis": make_pbr_material(
            name="Mat_Graphite_Chassis",
            hex_color="#23211F",
            roughness=0.35,
            metallic=0.08,
            coat_weight=0.12,
            coat_roughness=0.25,
            specular_ior=0.55,
        ),
        # Primary orbital meridian & precision 3D relief glyphs: crisp near-black graphite ink
        "graphite_ink": make_pbr_material(
            name="Mat_Graphite_Ink",
            hex_color="#171615",
            roughness=0.28,
            metallic=0.12,
            coat_weight=0.08,
            specular_ior=0.55,
        ),
        # Signature SlideIn Orange: Playbook pill inlay, upper tangent arc, anchor pips & orbital bead
        "slidein_orange": make_pbr_material(
            name="Mat_SlideIn_Orange",
            hex_color="#FF6200",
            roughness=0.20,
            metallic=0.02,
            coat_weight=0.22,
            coat_roughness=0.18,
            specular_ior=0.58,
            emission_hex="#FF6200",
            emission_strength=0.06,
        ),
        # Subtle warm studio floor/backdrop for Blender preview renders (not exported to GLB)
        "studio_backdrop": make_pbr_material(
            name="Mat_Studio_Backdrop",
            hex_color="#F6F4F0",
            roughness=0.85,
            metallic=0.0,
            coat_weight=0.0,
            specular_ior=0.35,
        ),
    }
    return mats


if __name__ == "__main__":
    created = create_all_materials()
    print(f"Created {len(created)} SlideIn PBR materials:", list(created.keys()))
