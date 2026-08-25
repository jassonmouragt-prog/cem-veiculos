# Plan - Create C&M Veículos Landing Page

The user wants to replace a large block of descriptive/instructional text (which is not currently present in the code but appears in the request as "old text") with a detailed landing page for "C&M Veículos". Since the "old text" is actually a set of requirements for a new page and the current `src/routes/index.tsx` is just a placeholder, I will implement the landing page as requested.

## User Review Required

> [!IMPORTANT]
> The request asks for a "visual text edit" where the "old text" is a long list of requirements. I will treat this as a request to build the landing page described in those requirements, as the "old text" itself isn't literally in the code yet.

- **Theme**: Dark mode (#0a0a0a), Red highlight (#E8231F), White/Gray text.
- **WhatsApp**: Link to `https://wa.me/558699148872` with pre-filled message.

## Proposed Changes

### Styling

- Update `src/styles.css` to include the dark theme background and custom colors if necessary, though Tailwind v4 variables will be used directly.

### Components

- Create a `src/components/landing` directory for modular sections:
  - `Header.tsx`: Fixed top nav with logo and WhatsApp button.
  - `Hero.tsx`: Main section with badge, title, image, and seals.
  - `SearchBar.tsx`: Search filters card.
  - `FeaturedVehicles.tsx`: Grid of vehicle cards with filters.
  - `WhyChooseUs.tsx`: Benefits section.
  - `FinancingCTA.tsx`: Simulated financing card with WhatsApp link.
  - `Testimonials.tsx`: Customer reviews and Google rating.
  - `Location.tsx`: Address, hours, and map section.
  - `Footer.tsx`: 5-column footer with social links.

### Routes

- Rewrite `src/routes/index.tsx` to compose these sections into the full landing page.

## Technical Details

- Use `lucide-react` for icons.
- Use `shadcn/ui` components (Button, Input, Select, Card, Badge, Tabs) which are already available in `src/components/ui`.
- Ensure responsive design using Tailwind's grid and flexbox.
- Implement the specific vehicle data provided for the featured section.
- SEO: Add `head()` to `src/routes/index.tsx` with appropriate metadata.

## Execution

- I will first verify the existence of Lucide icons and shadcn components.
- I will build the page section by section in `src/routes/index.tsx` or separate components for better organization.
