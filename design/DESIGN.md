---
name: Social Coffee Design System
colors:
  surface: '#fff8f7'
  surface-dim: '#e1d8d7'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2f0'
  surface-container: '#f5eceb'
  surface-container-high: '#efe6e5'
  surface-container-highest: '#e9e1df'
  on-surface: '#1e1b1a'
  on-surface-variant: '#504443'
  inverse-surface: '#342f2f'
  inverse-on-surface: '#f8efee'
  outline: '#827472'
  outline-variant: '#d4c3c1'
  surface-tint: '#795553'
  primary: '#321716'
  on-primary: '#ffffff'
  primary-container: '#4a2c2a'
  on-primary-container: '#bd928f'
  inverse-primary: '#eabcb8'
  secondary: '#645d55'
  on-secondary: '#ffffff'
  secondary-container: '#ebe1d6'
  on-secondary-container: '#6a635b'
  tertiary: '#351700'
  on-tertiary: '#ffffff'
  tertiary-container: '#532905'
  on-tertiary-container: '#cd8f62'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#eabcb8'
  on-primary-fixed: '#2e1413'
  on-primary-fixed-variant: '#5f3e3c'
  secondary-fixed: '#ebe1d6'
  secondary-fixed-dim: '#cec5bb'
  on-secondary-fixed: '#1f1b14'
  on-secondary-fixed-variant: '#4c463e'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#fcb888'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#6a3b16'
  background: '#fff8f7'
  on-background: '#1e1b1a'
  surface-variant: '#e9e1df'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-padding: 20px
  card-gap: 16px
---

## Brand & Style

The design system is centered on the concept of "Digital Hygge"—creating a sense of warmth, safety, and community within a mobile interface. It targets urban explorers and social seekers who value authentic, local connections over high-speed digital noise.

The aesthetic direction is **Warm Minimalism**. It leverages the clean structure of modern SaaS interfaces but replaces sterile whites and greys with a rich, organic palette inspired by specialty coffee culture. The UI avoids sharp edges and harsh transitions, opting for high-quality whitespace and tactile, card-based layouts that mimic physical coasters or menus. The emotional goal is to make the user feel like they are already inside a cozy cafe before they even arrive.

## Colors

The palette is anchored by "Espresso Brown" for core branding and high-contrast typography, ensuring a grounded, premium feel. "Latte Beige" serves as the primary canvas, providing a softer, less fatiguing background than pure white.

"Vibrant Coral" is reserved strictly for primary calls to action (CTAs) and notifications to ensure they pop against the earthy base tones. "Soft Caramel" acts as a bridge, used for secondary accents, icons, and subtle dividers.

**Dark Mode Logic:**
In the dark variant, the "Latte Beige" backgrounds are inverted to a deep "Roasted Bean" brown (#2C1E1C). Text roles are swapped, using the cream tones for readability against the dark surfaces. Shadows should shift from neutral grey to a deep, warm brown tint to maintain the organic aesthetic.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, geometric clarity and modern proportions. The large x-height ensures excellent readability in coffee shop environments with varying light conditions.

- **Headlines:** Use heavy weights (700-800) with slight negative letter-spacing for a tight, editorial look.
- **Body:** Standard reading text should use a 1.5x line-height ratio to maintain the airy, minimal feel.
- **Labels:** Small labels use semi-bold weights and slight tracking (letter spacing) to ensure legibility when used in tight spaces like chips or badges.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high internal padding to evoke a sense of luxury and calm. 

- **Mobile:** 4-column grid with 20px outside margins.
- **Desktop:** 12-column grid centered at 1140px.
- **Rhythm:** An 8px linear scale is used for all spatial relationships. Card containers should use `lg` (32px) padding for primary content and `md` (24px) for secondary lists. 

Generous whitespace is mandatory; avoid crowding elements. Every interactive card should have at least 16px of clearance from its neighbor to maintain a clean, "un-cluttered" interface.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

1.  **Level 0 (Background):** The "Latte Beige" base.
2.  **Level 1 (Cards/Surfaces):** Pure white or a slightly lighter cream than the background.
3.  **Shadows:** Use a "Coffee Tint" shadow—low opacity (10-15%) with a warm brown hue (#4A2C2A) instead of black. Shadows should be very diffused (e.g., `0px 10px 30px rgba(74, 44, 42, 0.08)`).
4.  **Interaction:** On hover or tap, cards should elevate further with a slightly more pronounced shadow or a subtle 1.02x scale to provide tactile feedback.

## Shapes

The shape language is profoundly **Rounded**. This mirrors the circular nature of coffee cups and communal tables.

- **Primary Containers:** 16px (1rem) corner radius.
- **Large Cards/Hero Images:** 24px (1.5rem) corner radius.
- **Interactive Elements:** Buttons and Input fields should follow the 16px standard or be fully pill-shaped for search bars.
- **Icons:** Use rounded caps and joins to match the soft typography.

## Components

- **Buttons:** Primary buttons use the "Vibrant Coral" fill with white text. They should have a minimum height of 56px for a "thumb-friendly" touch target. Secondary buttons use a "Soft Caramel" outline or ghost style.
- **Cards:** The primary navigation unit. Cards must feature the 16px corner radius and ambient warm shadow. Image-heavy cards (e.g., cafe previews) should use a subtle dark-to-transparent gradient overlay at the bottom to ensure text legibility.
- **Chips:** Used for coffee attributes (e.g., "Quiet," "Fast Wi-Fi," "Oat Milk"). These are pill-shaped with a light "Soft Caramel" background and dark "Espresso Brown" text.
- **Input Fields:** Use a subtle "Soft Caramel" 1px border that thickens and darkens to "Espresso Brown" on focus. Backgrounds for inputs should be slightly darker than the page background to create an "inset" look.
- **Bottom Navigation:** A frosted-glass effect (Backdrop Blur) using the "Latte Beige" color at 80% opacity, allowing the warm background colors to bleed through while maintaining legibility.
- **Progress Indicators:** Use the "Vibrant Coral" for activity, styled as a smooth, rounded line or a custom "pouring coffee" animation.