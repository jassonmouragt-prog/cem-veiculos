# Plan: Apply Brand Font and Red Gradient to Sessions

The user wants to update the typography across all landing page sections and apply a specific red gradient to elements currently using the solid red color (`#E8231F`). This will unify the visual identity and match the requested design aesthetic.

## User Review Required

> [!IMPORTANT]
> I will be applying a modern, high-impact font suitable for an automotive brand (likely a robust sans-serif like 'Outfit' or 'Archivo Black' if available, otherwise utilizing a clean, bold system stack that mirrors the requested reference style). The red highlights will transition from solid red to a vibrant linear gradient.

- **Typography**: Update headers and section titles to a more distinctive, bold brand font.
- **Red Gradient**: Replace the solid primary red (`#E8231F`) with a linear gradient (e.g., from `#E8231F` to a slightly deeper or more vibrant red) for text highlights, badges, and primary buttons.

## Technical Details

### Styling Changes

- **src/styles.css**:
    - Import the new brand font from Google Fonts (e.g., 'Outfit' and 'Archivo Black').
    - Update `@theme` to include a custom utility for the red gradient.
    - Update base headings and section title styles to use the new brand font.
    - Add a utility class `.text-brand-gradient` for text clipping and gradient fill.

### Component Changes

- **src/components/landing/*.tsx**:
    - Update instances of `text-[#E8231F]` and `bg-[#E8231F]` to use the new gradient utility or updated primary variables.
    - Ensure section titles and specific highlighted words use the new font and gradient where appropriate.
    - Update the `Header`, `Hero`, `FeaturedVehicles`, `WhyChooseUs`, and `FinancingCTA` components to reflect these changes.

### Business Logic

- No changes to functionality or routing.
