# Design Brief: Learn with Dr. Adil

**Purpose**: Neo-brutalist medical exam prep platform for Indian medical students preparing for board exams and clinical practice.

| Attribute | Value |
|-----------|-------|
| **Aesthetic** | Neo-brutalist: clinical red + professional blue, Material Symbols icons, 4px/4px black box-shadows, Plus Jakarta Sans headlines + Be Vietnam Pro body |
| **Tone** | Authoritative, educational, supportive—guides students through structured MCQ practice and PYQ archives |
| **Differentiation** | Dr. Adil's personal brand: no gamification, no progress tracking, pure practice focus with instant admin content updates |

**Color Palette**

| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| Primary | `0.508 0.140 17.4` | `#af101a` | Clinical red: CTAs, focus states, practice session indicators |
| Secondary | `0.426 0.117 257.5` | `#005f7b` | Professional blue: category headers, module structure |
| Accent | `0.65 0.15 195` | `#1eb980` | Teal highlight: completion badges, active module states |
| Foreground | `0.145 0 0` | `#1a1c1c` | Text on light backgrounds (AA+ contrast) |
| Muted | `0.89 0 0` | `#e0e0e0` | Subtle separators, disabled states |
| Background | `0.99 0 0` | `#fafafa` | Page base, card fills |
| Border | `0.88 0 0` | `#d9d9d9` | Edges, dividers, input outlines |
| Destructive | `0.577 0.245 27.325` | `#d32f2f` | Error states, warning alerts |

**Typography**

| Role | Font | Weight | Scale | Usage |
|------|------|--------|-------|-------|
| Display | Plus Jakarta Sans | 700 | 32–42px | Page titles, hero sections |
| Headline | Plus Jakarta Sans | 600 | 20–24px | Module/subject headers, card titles |
| Label | Plus Jakarta Sans | 500 | 14px | Button text, field labels, badges |
| Body | Be Vietnam Pro | 400 | 16px | Content, descriptions, MCQ options |
| Caption | Be Vietnam Pro | 500 | 12px | Metadata, timestamps, hints |

**Elevation & Depth**

| Level | Shadow | Usage |
|-------|--------|-------|
| Cards | `neo-brutal: 4px 4px 0px rgba(0,0,0,1)` | Subject cards, module containers, PYQ archive cards |
| Inputs | `neo-brutal-sm: 2px 2px 0px rgba(0,0,0,1)` | Form fields, quiz inputs |
| Hover | `neo-brutal: 4px 4px 0px` with offset | Interactive elements lift on `:hover` |
| Pressed | `transform: translate(2px, 2px); box-shadow: none` | Tactile press feedback (neo-brutal-press) |

**Structural Zones**

| Zone | Background | Border | Treatment | Spacing |
|------|-----------|--------|-----------|---------|
| Header | `bg-card` with border-b | `1px border-border` | 4px neo-brutal shadow for depth | `px-6 py-4` |
| Content (main) | `bg-background` | None | Open, breathing space | `px-6 py-8` |
| Sidebar (modules list) | `bg-muted/15` | `border-r border-border` | Subtle depth to differentiate | `px-4 py-6` |
| Card (subject/module) | `bg-card` | `1px border-border` | 4px neo-brutal shadow | `p-6` |
| Footer | `bg-muted/40` with border-t | `1px border-border` | Grounded, light contrast | `px-6 py-4` |

**Spacing & Rhythm**

- Base unit: 4px
- Scale: 4, 8, 16, 24, 32, 48px
- Card padding: 24px (6 units)
- Component gap: 16px (4 units)
- Content margins: 32–48px vertical

**Component Patterns**

1. **Buttons**: Plus Jakarta Sans 500, 14px. Primary = red bg, white text, 4px neo-brutal shadow. Secondary = muted bg, dark text, 2px shadow. Hover: lift (translate up 2px), darker shadow.
2. **Cards**: White bg, 1px border, 4px neo-brutal shadow. On click: shadow → none, translate down 2px (active state).
3. **Input Fields**: Border 1px, focus = primary ring (2px), 2px neo-brutal shadow.
4. **Navigation**: Tabs use underline on active, Plus Jakarta Sans 600 14px.
5. **Badges**: Small pills with color-coded bg (success=teal, destructive=red, neutral=grey). No shadow.

**Motion**

- Default transition: `all 0.2s ease-out`
- Shadow press: `100ms` (instant tactile response)
- Tab switch: `150ms` fade-in
- Modal enter: `200ms` scale + fade (0.95 → 1)

**Constraints**

- No gradients, no blur effects, no semi-transparent overlays
- No emojis in UI except Dr. Adil's personal introduction
- All colors use OKLCH tokens, never hardcoded hex
- Icons: Material Symbols Outlined, wght 400, opsz 24
- Responsive: Mobile-first, breakpoints at 640px (sm), 1024px (md), 1280px (lg)

**Signature Detail**

The neo-brutal shadow system creates tactile, "printed" feel — cards look pressable. On interaction, offset resets and shadow disappears, mimicking physical button press. This reinforces the platform's educational rigor: no skeuomorphic excess, pure interaction clarity.
