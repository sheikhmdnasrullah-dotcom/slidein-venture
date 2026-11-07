# SlideIn — 3D Art Direction & Architectural Scene Specification

## 1. Existing Visual Audit & Shortcomings (Phase 1 Findings)

Inspection of the live SlideIn website (`http://localhost:3000/`) across `1920×1080`, `1536×960`, `1440×900`, and `390×844` (mobile) revealed three distinct visual layers:

1. **The Hero Scroll Story (`components/Hero/story/HeroStory.tsx` & `StoryStage.tsx`)**:
   - Presents the headline `"Hyper-Personalised Emails at Scale."` above a 5-act scroll-scrubbed stage (`mess` → `converge` → `journey` → `gate` → `loop`).
   - While the 2D typographic ticker, 7 stage nodes (`configure` through `converse`), and layered dossier card have clean editorial discipline, the spatial stage behind them lacks architectural depth.
2. **The Orbital & Playbook Composition (`components/Sections/ManagedSection.tsx` & `components/Sections/orbit/`)**:
   - Contains the core geometric visual language of SlideIn:
     - A central 3-slab **Playbook** object (`PlaybookStack.tsx`) in isometric pose (`rotateX(55deg) rotateZ(-40deg)`).
     - A mathematical **Orbital & Rounded-Square System** (`OrbitGeometry.tsx`) where a circle ($R = 186$) and a rounded square ($\text{half-side} = 150, R_c = 63.08$) touch at four $45^\circ$ tangent points ($\pm 131.52, \pm 131.52$), joined by two horizontal anchor beams and an upper SlideIn orange accent arc.
     - Six **Floating Interface Objects** (`ArtifactTile.tsx`): four tool tiles (`Search`, `Write`, `Send`, `Verify`) on the tangent points and two larger run-mode anchors (`prospects`, `configure`) on the horizontal axis.
   - **Shortcomings**: Currently simulated with flat SVG paths and fake CSS 3D (`6 stacked <b> DOM elements` with `translateZ` steps). The edges lack genuine bevel specular catchlights, inter-slab ambient occlusion, realistic surface roughness differentiation, and studio bounce lighting.
3. **The Global Backdrop (`components/BackgroundWallpaper/StudioScene3D.tsx`)**:
   - Previously rendered 6 blurred, cartoon-colored Three.js shapes (sky-blue macOS mail envelope, yellow-gold target with green arrow, red/blue airmail stripes) around the viewport periphery. This conflicted with SlideIn's disciplined warm ivory, architectural graphite, and signature orange identity.

---

## 2. Cohesive 3D Visual Language (Blender 5.2.3 LTS Production)

### Geometry & Proportions
- **Coordinate Mapping**: $100\text{ design units} = 2.00\text{ Blender meters}$ ($1\text{ design unit} = 0.02\text{ m}$).
  - Stage dimensions: $1080 \times 540\text{ design units} \rightarrow 21.60\text{ m} \times 10.80\text{ m}$ studio field, centered at $(0, 0, 0)$.
  - Primary Circle Radius: $R = 3.72\text{ m}$ ($186\text{ design units}$).
  - Rounded Square Half-Side: $H = 3.00\text{ m}$ ($150\text{ design units}$), Corner Radius $R_c = 1.2616\text{ m}$ ($63.08\text{ design units}$), satisfying $(H - R_c)\sqrt{2} + R_c = R$.
  - Four $45^\circ$ Tangent Coordinates: $(\pm 2.6304\text{ m}, \pm 2.6304\text{ m})$.
  - Two Horizontal Anchor Coordinates: $(\pm 7.40\text{ m}, 0\text{ m})$, connected by beams from $(\pm 6.16\text{ m}, 0\text{ m})$ to $(\pm 3.00\text{ m}, 0\text{ m})$.
- **Central Playbook Artifact (`playbook.glb`)**:
  - Engineered as a tactile, three-layer hardware/editorial artifact angled in a calibrated isometric presentation ($2.36\text{ m} \times 2.36\text{ m}$ footprint, rotated $-40^\circ$ around Z and tilted toward the camera):
    1. **Layer 0 — Foundation Chassis (`Playbook_Slab_Base`)**: Deep architectural graphite squircle slab with multi-segment chamfered bevels, an underside shadow recess, and a precision perimeter step lip.
    2. **Layer 1 — Compiled Knowledge Core (`Playbook_Slab_Mid`)**: Warm stone-ivory ceramic plate with fine horizontal edge lamination grooves and a central alignment boss that bridges the slabs when separated.
    3. **Layer 2 — Top Instrument Plate (`Playbook_Slab_Top`)**: Pure warm porcelain-ivory plate featuring a physically milled recessed court (`Playbook_Inset_Well`), a fine graphite inner bezel ring, and a flush-mounted **SlideIn Orange (`#FF6200`)** anodized ceramic pill inlay (`Playbook_Orange_Inlay`) in the lower-right quadrant.
- **Orbital & Geometrical System (`orbital-system.glb`)**:
  - Constructed from precision-beveled Blender curves converted to clean quad meshes:
    - `Orbit_Circle_Track`: Full circular meridian ($R = 3.72\text{ m}$) with a fine rectangular-beveled cross-section at $z = -0.02\text{ m}$.
    - `Orbit_Square_Boundary`: Rounded-square path ($6.00\text{ m} \times 6.00\text{ m}, R_c = 1.2616\text{ m}$) layered at $z = -0.06\text{ m}$ to establish subtle dimensional separation at the four tangent intersections.
    - `Orbit_Orange_Arc`: Restrained SlideIn Orange accent arc spanning the upper $90^\circ$ sector ($45^\circ \text{ to } 135^\circ$) at $z = +0.015\text{ m}$.
    - `Orbit_Beam_Left` & `Orbit_Beam_Right`: Horizontal axial beams with precision spherical orange terminal nodes (`Orbit_Terminal_Left`, `Orbit_Terminal_Right`) and a single animated spherical orange traveller (`Orbit_Traveller_Bead`).
- **Floating 3D Object Family (`floating-objects.glb`)**:
  - Six cohesive hardware-grade artifact tiles sharing identical bevel profiles, corner radii ($31\%$ squircle profile), dual-layer chassis construction (graphite base plate + warm ivory ceramic top face + recessed central court), and crisp 3D relief glyphs:
    - Four tangent tool tiles ($1.12\text{ m} \times 1.12\text{ m}$): `Tool_Search` (upper-left), `Tool_Write` (upper-right), `Tool_Send` (lower-right), `Tool_Verify` (lower-left).
    - Two horizontal anchor tiles ($1.76\text{ m} \times 1.76\text{ m}$): `Anchor_Prospects` (left) and `Anchor_Configure` (right), each carrying a flush-mounted SlideIn Orange indicator pip in the upper-right corner.

---

## 3. Material & Surface Specification

All materials use Blender 5.2's `Principled BSDF` with physically plausible PBR values that export cleanly to glTF 2.0:

| Material Name | Base Color (sRGB / Hex) | Roughness | Metallic | Coat Weight | Purpose |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `Mat_Porcelain_Ivory` | `#FAF8F4` `(0.980, 0.973, 0.957)` | `0.24` | `0.00` | `0.16` | Playbook Top Slab & Artifact Tile Faces |
| `Mat_Warm_Ceramic` | `#F1ECE3` `(0.945, 0.925, 0.890)` | `0.34` | `0.00` | `0.08` | Playbook Middle Slab & Recessed Courts |
| `Mat_Stone_Bezel` | `#E3DCD1` `(0.890, 0.863, 0.820)` | `0.42` | `0.02` | `0.00` | Secondary Orbital Track & Trim Rings |
| `Mat_Graphite_Chassis` | `#23211F` `(0.137, 0.129, 0.122)` | `0.36` | `0.08` | `0.10` | Playbook Base Slab & Tile Lower Chassis |
| `Mat_Graphite_Ink` | `#161514` `(0.086, 0.082, 0.078)` | `0.30` | `0.12` | `0.05` | Precision 3D Relief Glyphs & Primary Orbit |
| `Mat_SlideIn_Orange` | `#FF6200` `(1.000, 0.384, 0.000)` | `0.22` | `0.02` | `0.20` | Playbook Pill Inlay, Upper Arc, Pips & Bead |

---

## 4. Studio Lighting & Camera Architecture

- **Key Light (Upper-Left Softbox)**: Large warm-white area light (`#FFFDF9`) positioned at $(-7.5, +6.5, +9.0)$ casting soft directional highlights across the upper-left bevels and top faces, with gentle shadows falling down and slightly right.
- **Fill Light (Right Diffuser)**: Broad low-intensity warm ivory fill (`#FAF3E8`) at $(+8.0, -2.0, +7.0)$ to keep graphite shadow faces readable without flattening contrast.
- **Rim / Bounce Light (Subtle SlideIn Orange)**: Warm amber-orange studio bounce light (`#FF7A29`) beneath and behind the central Playbook at $(+1.2, -3.5, +2.2)$ creating a natural warm reflection along the lower bevels.
- **Camera Framing**: Orthographic-like long-focal-length perspective camera (`focal_length = 85mm`, `FOV ≈ 23.9°`) positioned along $(0, -2.2, 24.5)$ looking at $(0, 0, 0)$, eliminating wide-angle distortion at the periphery while preserving genuine 3D parallax and depth separation.
