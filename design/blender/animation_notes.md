# SlideIn — 3D Animation Storyboard & Scroll Choreography Specification

## 1. Animation Philosophy

Rather than attaching independent, constantly-spinning CSS loops to every object, the 3D scene behaves as **one precision-choreographed mechanical and architectural system** authored in Blender (`120 frames` at `24 fps`, normalized to `t ∈ [0, 1]`).

Every keyframe uses `BEZIER` interpolation with `AUTO_CLAMPED` handles to produce calm, deliberate ease-in/ease-out motion that reinforces the visual hierarchy and never competes with the hero typography.

---

## 2. Five-Act Scroll Storyboard (`Frames 1–120` ↔ `Scroll Progress 0.00–1.00`)

| Act | Scroll Range (`t`) | Blender Frames | Central Playbook (`playbook.glb`) | Orbital System (`orbital-system.glb`) | Floating Object Family (`floating-objects.glb`) |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Act 1 · Mess** | `0.00 – 0.20` | `1 – 24` | Three slabs begin in an expanded, deconstructed vertical separation ($\Delta z = 0.58\text{ m}$), subtly angled ($+6^\circ$ pitch, $-46^\circ$ yaw) while raw fragments drift in the foreground. | Orbital rings and rounded-square path sit at a deeper Z-plane ($z = -0.35\text{ m}$) with subtle tilt; traveller bead rests at the left horizontal entry ($180^\circ$). | The 6 peripheral artifact tiles rest in a quiet, recessed peripheral stance ($z = -0.20\text{ m}$). |
| **Act 2 · Converge** | `0.20 – 0.45` | `24 – 54` | As scattered fragments pull into Configure (`n0`), the three Playbook slabs precision-lock into their calibrated isometric formation ($\Delta z = 0.34\text{ m}$, yaw $-40^\circ$). | The orbital circle and rounded-square plane rise into focus ($z = 0.00\text{ m}$); the traveller bead advances to the upper-left tangent ($135^\circ$, `Tool_Search`). | `Anchor_Prospects` and `Anchor_Configure` elevate onto the horizontal axis, establishing the two run-mode anchors. |
| **Act 3 · Journey** | `0.45 – 0.70` | `54 – 84` | As the prospect progresses across `discover` → `research` → `qualify` → `personalize`, the Playbook slabs perform a controlled architectural expansion ($\Delta z = 0.46\text{ m}$) so the keylight catches the warm ceramic mid-plate and SlideIn orange inlay. | The traveller bead glides smoothly along the upper **SlideIn Orange Accent Arc** from $135^\circ$ (`Tool_Search`) through $90^\circ$ (apex) to $45^\circ$ (`Tool_Write`), then down to $-45^\circ$ (`Tool_Send`). | Each tangent tool tile (`Tool_Search`, `Tool_Write`, `Tool_Verify`, `Tool_Send`) performs a subtle, sequentially timed elevation ($+0.16\text{ m}$ in Z and $2.5^\circ$ keylight tilt) as its corresponding stage activates. |
| **Act 4 · Gate & Outreach** | `0.70 – 0.85` | `84 – 102` | At the approval gate (`T.approve`), the top porcelain slab and orange pill inlay present a crisp $3^\circ$ nod toward the studio keylight, confirming human approval and dispatch. | The traveller bead sweeps across the lower sector from $-45^\circ$ (`Tool_Send`) through $-135^\circ$ (`Tool_Verify`), completing verification. | `Tool_Verify` and `Tool_Send` hold elevated focus while the outreach arch completes. |
| **Act 5 · Loop Closure** | `0.85 – 1.00` | `102 – 120` | The three Playbook slabs settle into their iconic, balanced resting equilibrium ($\Delta z = 0.36\text{ m}$), matching the `prefers-reduced-motion` static reference frame at `frame 120`. | The traveller bead returns smoothly to the upper apex ($90^\circ$), closing the loop cleanly. | All 6 artifact tiles rest in balanced harmonic alignment on the tangent and anchor coordinates. |

---

## 3. Theatre.js Evaluation (Phase 10)

We evaluated `@theatre/core` and `@theatre/studio` (`https://www.theatrejs.com/`) against the existing SlideIn architecture:

1. **Framework & Peer Dependency Compatibility**:
   - The project runs **React 19.2.4**, **Next.js 16.2.10**, and **`@react-three/fiber` 9.8.2**.
   - `@theatre/r3f` (`0.5.x`) and `@theatre/studio` declare strict peer dependencies on `react@^18.0.0` and `@react-three/fiber@^8.0.0` and rely on React 18 internal fiber hooks that conflict with React 19 + R3F v9.
2. **Licensing & Bundle Footprint**:
   - `@theatre/studio` is governed by a separate dual/commercial license model from the MIT runtime and adds significant editor bundle overhead.
3. **Architectural Fit**:
   - SlideIn's Hero (`HeroStory.tsx` + `storyModel.ts`) already defines a deterministic, unit-tested normalized clock `t ∈ [0, 1]` driven by GSAP `ScrollTrigger`, and `ManagedSection.tsx` uses Framer Motion's `useScroll` (`scrollYProgress ∈ [0, 1]`).
   - By authoring the exact keyframed curves directly in **Blender 5.2.3 LTS** (`create_animation.py`), exporting them as standard glTF 2.0 `AnimationClip` tracks inside `.glb`, and scrubbing `THREE.AnimationMixer.setTime(progress * clip.duration)` inside `HeroMotionController.tsx`, we achieve **100% frame-accurate Blender-to-Web choreography** with zero third-party timeline wrapper overhead and full React 19 compatibility.
