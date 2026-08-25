# Plan: Redirect Financing Simulation to WhatsApp

The user wants the "SIMULE SEU FINANCIAMENTO" section to redirect to WhatsApp instead of performing a simulation on the site. Upon inspection, the code already redirects to WhatsApp via a link, but it displays a mock simulation UI. I will update the section to more explicitly invite the user to talk to a consultant on WhatsApp, removing the visual mock inputs that imply a local calculation.

## User Review Required

> [!NOTE]
> The current button already leads to WhatsApp. I will transform the section into a more direct call-to-action for a personalized consultation.

- **Financing CTA**: Remove the disabled mock inputs and replace them with a clearer message about speaking with a consultant.

## Technical Details

### Frontend Changes

- **src/components/landing/FinancingCTA.tsx**:
  - Remove the grid of mock inputs (`Valor do veículo`, `Entrada`, etc.).
  - Update the text content to emphasize personalized service.
  - Keep the WhatsApp link functionality.
  - Change button text to "Falar com Consultor" or "Solicitar Simulação no WhatsApp".

### Business Logic

- No changes to backend or database.
- Preserve the existing WhatsApp number and pre-filled message.
