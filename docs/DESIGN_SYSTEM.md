# CodeLearn UI/UX Design System

## Design Philosophy

CodeLearn follows a **premium dark technology/education aesthetic** inspired by modern edtech startups. The design avoids generic LMS appearances and instead creates a polished, immersive experience that feels like a professional product.

## Color System

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0e1a` | Main background |
| `--bg-secondary` | `#111827` | Cards, panels |
| `--neon-blue` | `#3b82f6` | Primary accent, links |
| `--neon-cyan` | `#06b6d4` | Secondary accent, highlights |
| `--neon-purple` | `#8b5cf6` | Tertiary accent, gradients |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--neon-green` | `#10b981` | Success states |
| `--neon-yellow` | `#f59e0b` | Warnings |
| `--neon-pink` | `#ec4899` | Errors, special badges |
| `--text-primary` | `#f1f5f9` | Main text |
| `--text-secondary` | `#94a3b8` | Secondary text |
| `--text-muted` | `#64748b` | Placeholder text |

## Typography

- **Font Family (UI):** Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Font Family (Code):** JetBrains Mono, Fira Code, monospace
- **Base Size:** 16px (1rem)
- **Scale:** 0.75rem → 2.5rem
- **Weight:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Components

### Card
```css
background: var(--bg-glass);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-card);
backdrop-filter: blur(12px);
transition: all 200ms ease;

&:hover {
  border-color: var(--border-glow);
  box-shadow: var(--shadow-glow-blue);
  transform: scale(1.02);
}
```

### Button (Primary)
```css
background: linear-gradient(135deg, #3b82f6, #8b5cf6);
color: white;
border: none;
border-radius: var(--radius-md);
padding: 10px 24px;
font-weight: 600;
cursor: pointer;
transition: all 200ms ease;

&:hover { opacity: 0.9; }
&:active { transform: scale(0.97); }
&:disabled { opacity: 0.5; cursor: not-allowed; }
```

### Progress Ring
```css
stroke: var(--neon-blue);
stroke-width: 4;
fill: none;
stroke-linecap: round;
transition: stroke-dashoffset 800ms ease-out;
```

### Code Editor
```css
background: #0d1117;
border: 1px solid var(--border-subtle);
border-radius: var(--radius-md);
font-family: var(--font-mono);
font-size: var(--text-sm);
line-height: 1.6;
```

## Layout Guidelines

### Spacing
Use a 4px grid system:
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-10` = 40px
- `space-12` = 48px

### Border Radius
- Small components: 8px (`--radius-sm`)
- Cards and buttons: 12px (`--radius-md`)
- Large containers: 16px (`--radius-lg`)
- Pills/badges: 9999px (`--radius-full`)

### Shadows
- Cards: `0 4px 24px rgba(0, 0, 0, 0.4)`
- Blue glow: `0 0 20px rgba(59, 130, 246, 0.15)`
- Purple glow: `0 0 20px rgba(139, 92, 246, 0.15)`

## Animation Guidelines

| Element | Duration | Easing |
|---------|----------|--------|
| Page transitions | 300ms | ease-in-out |
| Card hover | 200ms | ease |
| Progress fill | 800ms | ease-out |
| Button press | 100ms | scale |
| Toast entrance | 400ms | slide from right |
| Skeleton loading | 1.5s | shimmer infinite |

## Responsive Breakpoints

| Breakpoint | Min Width |
|------------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

## Accessibility

- All text meets WCAG 2.1 AA contrast ratios (4.5:1 minimum)
- Keyboard navigation with visible focus indicators
- ARIA labels on all interactive elements
- Respects `prefers-reduced-motion` media query
- Screen reader compatible navigation structure

## Language Cards Design

Each programming language card features:
- Official language logo (SVG preferred)
- Language name in prominent text
- Difficulty badge (Beginner/Intermediate/Advanced)
- Level count
- "Start Learning" CTA button
- Hover effect with neon glow
- Gradient background matching language brand colors

---

**Document Version:** 1.0  
**Part of:** CODELEARN_FULL_PLAN.md
