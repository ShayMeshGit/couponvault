---
description: General project code standards for structure, reuse, testing, and constants usage.
applyTo: "src/**"
---

# Code Standards

Follow these rules when generating, editing, or reviewing code in this project.

## General Project Guidelines

- Keep solutions simple, maintainable, and consistent with the existing codebase.
- Reuse existing code before creating new logic.
- Avoid duplication; extract shared logic into reusable utilities.
- Match existing TypeScript, naming, and file organization patterns.

## Strings and Constants (Required)

- Do not hardcode strings in implementation files.
- Create constants files and keep strings there.
- Use `src/constants/` for shared/global constants.
- For feature-specific values, use a local `constants.ts` in that feature folder.
- Import strings/constants from these files wherever they are needed.

## Component Folder Structure (Required)

Each component must live in its own folder and use this exact structure:

- `index.ts` - default export of the component
- `ComponentName.ts` - component implementation and logic
- `styles.ts` - component styles
- `ComponentName.test.ts` - component tests

Example:

```text
src/components/CouponCard/
	index.ts
	CouponCard.ts
	styles.ts
	CouponCard.test.ts
```

## Export Rules

- `ComponentName.ts` should contain the component implementation.
- `index.ts` must export the component as default from `ComponentName.ts`.
- Prefer named exports for helpers inside component files when useful, but keep the component default export in `index.ts`.

## Reuse and Utilities

- When logic is shared across components, extract it to a reusable utility.
- Place generic utilities in `src/utils/`.
- Keep utilities pure and focused on a single responsibility.
- Avoid duplicating logic across multiple components.

## Testing

- Every component should include `ComponentName.test.ts`.
- Tests should cover rendering and core behavior.
- If logic is extracted into utilities, add/update utility tests where relevant.

## Scope and Consistency

- Keep components small and focused.
- Match existing project naming and TypeScript conventions.
- Prefer minimal, maintainable solutions over complex abstractions.
