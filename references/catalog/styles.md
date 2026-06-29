# UI Styles Catalog

## When to read this
Use when the user asks for a visual style, aesthetic direction, or "what style should I use for X".

---

## Minimalist
**Best for:** Productivity tools, note-taking apps, reading experiences, personal portfolios, documentation sites
**Visual traits:** Ample white space, limited color palette (1–2 accent colors max), thin typography, no decorative elements, generous padding, content-first layouts
**Avoid when:** The product needs to feel exciting, playful, or premium-luxury; when users need visual cues to navigate complex workflows

---

## Glassmorphism
**Best for:** Dashboards, music/media players, auth screens, hero sections, mobile overlays
**Visual traits:** Frosted-glass effect via `backdrop-filter: blur()`, semi-transparent panels, subtle white border on top/left edges, vibrant blurred background gradients, soft shadows
**Avoid when:** Accessibility is a hard requirement (contrast ratios suffer); when content density is high; when backgrounds are plain/white

---

## Neumorphism
**Best for:** Calculator apps, audio/hardware UIs, smart-home controls, fitness dashboards
**Visual traits:** Soft extruded or recessed surfaces using dual box-shadows (light and dark), monochromatic palette, low contrast between elements and background
**Avoid when:** Accessibility (WCAG AA/AAA) is required — contrast is inherently poor; on dark backgrounds; for text-heavy interfaces

---

## Brutalist
**Best for:** Artist portfolios, editorial/news sites, counter-culture brands, experimental landing pages
**Visual traits:** Raw HTML aesthetics, high contrast, visible borders, unconventional layouts, unstyled or intentionally ugly type stacks, black outlines, garish color combinations
**Avoid when:** Enterprise software, healthcare, finance, e-commerce where trust signals matter; when audience is non-technical or design-averse

---

## Material Design (Material You / MD3)
**Best for:** Android apps, Google-adjacent products, cross-platform design systems, enterprise tools needing structure
**Visual traits:** Dynamic color tokens derived from wallpaper/brand, 5-tone palette, elevation via tonal overlays not shadows, rounded corners (extra-large radius), FABs, navigation bars
**Avoid when:** iOS-first products where platform conventions conflict; when brand identity requires strong custom visual language

---

## Flat Design
**Best for:** SaaS dashboards, icons, infographics, illustration-heavy marketing sites, mobile apps
**Visual traits:** No gradients, no shadows, solid fills, 2D shapes, bold colors, clean iconography, strong grid adherence
**Avoid when:** Products that need depth cues for interaction affordance; when differentiation from the sea of flat apps is a goal

---

## Skeuomorphic
**Best for:** Learning apps (notebooks, flashcards), audio workstations (DAWs), niche enthusiast tools where real-world metaphors aid learnability
**Visual traits:** Textures (leather, wood, paper, metal), realistic shadows, beveled buttons, gradients mimicking light sources, physical object metaphors
**Avoid when:** Modern consumer apps; when file size or render performance matters; when the real-world metaphor doesn't map to the digital feature set

---

## Corporate / Enterprise
**Best for:** B2B SaaS, internal tools, HR/ERP systems, financial platforms, healthcare portals
**Visual traits:** Restrained color palette (blue/grey dominant), conservative typography, data-dense tables, sidebar navigation, consistent iconography, low visual flair
**Avoid when:** Consumer-facing products competing on brand personality; creative agencies; gaming or entertainment

---

## Cyberpunk / Neon Noir
**Best for:** Gaming UIs, sci-fi themed apps, hackathon projects, dark-mode-first developer tools, esports platforms
**Visual traits:** Dark backgrounds (near-black), neon accent colors (cyan, magenta, acid green), glitch effects, scanlines, monospace type, angular clipping masks, glow/bloom on key elements
**Avoid when:** Professional/enterprise contexts; when accessibility or readability is critical; light-mode users

---

## Retro / Y2K
**Best for:** Nostalgia-driven brands, fashion/streetwear, social media tools targeting Gen Z, music platforms
**Visual traits:** Gradients (chrome, iridescent), pixel fonts or bubbly rounded type, stark outlines, early-2000s color palette, CRT-style effects, star/burst decorative shapes
**Avoid when:** Professional trust-building contexts; when the audience skews older than millennials in a non-ironic way

---

## Claymorphism
**Best for:** Children's apps, consumer mobile, lifestyle/wellness brands, food/beverage marketing
**Visual traits:** 3D puffy shapes with soft rounded edges, pastel colors, inner highlight stroke, soft multi-layered shadow, inflated blob shapes, playful illustrations
**Avoid when:** Data-heavy UIs; professional/enterprise tools; dark-mode environments where depth cues flatten

---

## Aurora / Gradient Mesh
**Best for:** SaaS landing pages, AI product marketing, premium consumer apps, creative agency sites
**Visual traits:** Large fluid mesh gradients in background, semi-transparent frosted cards over them, smooth color blending across the spectrum, minimal UI chrome, full-bleed hero sections
**Avoid when:** Accessibility contrast requirements are strict; when content must be the visual focus without a vibrant backdrop

---

## Dark Mode / Low-Light
**Best for:** Developer tools, code editors, media consumption apps, late-night productivity tools, terminals
**Visual traits:** Near-black or dark-grey surfaces (not pure #000), elevated surfaces get lighter (not shadow-based), muted accent colors, reduced contrast for secondary text, careful use of color to avoid vibration
**Avoid when:** Products used primarily outdoors in bright light; when the primary user base prefers light mode by default

---

## Swiss / International Typographic
**Best for:** Design agencies, architecture firms, high-end editorial, museum/cultural institution sites
**Visual traits:** Strong grid system, Helvetica/Neue Haas Grotesk or similar grotesque sans-serifs, asymmetric layouts, black/white with a single spot color, large type hierarchy, no decorative illustration
**Avoid when:** Playful or casual products; when imagery is a core content type; consumer apps needing warmth

---

## Organic / Natural
**Best for:** Health and wellness, sustainable brands, food/farm-to-table, outdoor/adventure, meditation apps
**Visual traits:** Earth tones (terracotta, sage, cream, warm beige), irregular/hand-drawn shapes, serif or humanist sans type, botanical photography, soft grain textures, loose grid
**Avoid when:** Tech products needing precision/speed signals; dark-mode-first UIs; high-density data tools

---

## Luxury / Editorial
**Best for:** Fashion brands, jewelry, premium hospitality, finance (private banking), perfume/beauty
**Visual traits:** Generous white space, thin serif typefaces (Didot, Canela), black/gold/ivory palette, full-bleed photography, minimal navigation, cinematic pacing on scroll
**Avoid when:** Utility-first tools; when affordability/accessibility of price is a brand signal; high information-density screens

---

## Playful / Whimsical
**Best for:** Children's products, edtech for kids, casual games, onboarding flows, celebration/rewards moments
**Visual traits:** Bold saturated colors, rounded everything, hand-drawn or cartoon illustration, bouncy micro-animations, fun copywriting tone reflected in UI labels, confetti/particle effects
**Avoid when:** Professional or regulated industries; when users are in task-critical flows; B2B contexts

---

## Memphis / Pop Art
**Best for:** Youth-oriented brands, 90s revival aesthetics, merchandise stores, music/concert platforms
**Visual traits:** Geometric shapes scattered as decoration, clashing primary + neon colors, squiggles and dots as texture, bold thick borders, mix of type weights, irreverent compositions
**Avoid when:** When visual clarity is paramount; serious/sensitive content; enterprise or healthcare

---

## Monochromatic
**Best for:** Photography portfolios, luxury brands, editorial content, developer tools wanting visual restraint
**Visual traits:** Single hue across all UI elements with tonal variation for hierarchy, strong typographic differentiation replaces color-based hierarchy, accent color used sparingly (if at all)
**Avoid when:** When color is load-bearing for status/feedback (error/success/warning states need distinct hues); data visualization

---

## Futuristic / Sci-Fi HUD
**Best for:** Defense/aerospace dashboards, data visualization tools, AR/VR interfaces, fintech analytics, game UI overlays
**Visual traits:** Dark base, glowing line-art borders, circular progress rings, hex grids, technical readout typography (mono or condensed), animated scan lines, blueprint-style diagrams
**Avoid when:** Consumer-facing apps needing approachability; contexts where complexity signals distrust; mobile form factors with small targets

---

## Cottagecore / Soft Vintage
**Best for:** Recipe/food blogs, wedding planning, stationery brands, lifestyle newsletters, journaling apps
**Visual traits:** Warm cream/blush/dusty-rose palette, vintage serif or script typography, watercolor or etching illustration style, floral motifs, soft grain paper textures, cozy composition
**Avoid when:** Tech-forward products; dark-mode UIs; any brand needing to signal speed or performance

---

## Bento Grid
**Best for:** Product landing pages (especially SaaS/AI tools), feature showcase sections, app store screenshots, portfolio homepages
**Visual traits:** Irregular mosaic card grid, each card showcases one feature with an illustration or screenshot, mixed card sizes, rounded corners, subtle shadows, light/neutral background
**Avoid when:** Content-heavy apps where grid breaks down under real data; when consistent row/column scanning matters (data tables)

---

## Utility / Functional
**Best for:** Developer tools, CLI companions, admin panels, internal ops tools, monitoring dashboards
**Visual traits:** Tight spacing, monospace or system UI fonts, muted grays, information density over decoration, functional color (green=ok, red=error, yellow=warn), minimal border radius
**Avoid when:** Consumer-facing marketing; onboarding experiences requiring delight; brand-building contexts
