# CouponVault

A Next.js application for managing coupons and gift cards, tracking balances, and monitoring expiry dates.

## Project Overview

*   **Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Styling:** Tailwind CSS (v4) with Vanilla CSS patterns
*   **Icons:** Lucide React
*   **State Management:** React Hooks (useState, useMemo, useCallback)
*   **Testing:** Vitest

### Architecture
*   **`src/app/api`**: Next.js API Routes for coupon CRUD operations.
*   **`src/components`**: React components following a directory-based structure (`Component/index.ts`, `Component.tsx`, `styles.ts`).
*   **`src/services`**: API client logic for interacting with the backend.
*   **`src/utils`**: Common utility functions for formatting, clipboard, and notifications.
*   **`src/types`**: Centralized TypeScript interfaces and types.
*   **`prisma/schema.prisma`**: Database model definition.

## Building and Running

### Prerequisites
*   Node.js (LTS recommended)
*   PostgreSQL database

### Key Commands
*   `npm install`: Install dependencies.
*   `npm run dev`: Start development server on `http://localhost:3000`.
*   `npm run build`: Build for production.
*   `npm run lint`: Run ESLint.
*   `npm run test`: Run tests with Vitest.
*   `npm run prisma:migrate`: Run database migrations.
*   `npm run prisma:studio`: Open Prisma Studio to explore data.

## Development Conventions

### Component Structure
Each major component should be in its own directory within `src/components`:
```
src/components/MyComponent/
├── index.ts        # Entry point (export default)
├── MyComponent.tsx # Main component logic
├── styles.ts       # Tailwind CSS class strings
└── MyComponent.test.ts
```

### Styling
*   Use Tailwind CSS classes.
*   Prefer keeping long class strings in a separate `styles.ts` file within the component directory to keep the JSX clean.
*   Utilize `clsx` and `tailwind-merge` (via `src/utils/cn.ts`) for conditional classes.

### Data Fetching
*   Use the service layer in `src/services/coupons-api.ts` for API interactions.
*   API routes are located in `src/app/api/coupons`.

### Types
*   Always define types in `src/types/index.ts`.
*   Use Prisma-generated types where appropriate, but maintain clean frontend-facing interfaces.

### Testing
*   Write unit tests for utilities and components using Vitest.
*   Test files should be co-located with the code they test or in the `src/test` directory.

---

# AI Agents Guidelines

This project is optimized for collaboration with AI agents. To ensure the best results, please follow these guidelines.

## Specialized Instructions

*   **Code Standards:** Refer to [/.github/instructions/code-standards.instructions.md](.github/instructions/code-standards.instructions.md) for detailed coding and architectural guidelines.

## Working with Agents

### Sub-Agents
When performing complex tasks, utilize specialized sub-agents:
*   `codebase_investigator`: For deep architectural analysis or complex bug hunting.
*   `generalist`: For batch operations across multiple files.

### Development Workflow
1.  **Research:** Use `grep_search` and `glob` to understand existing patterns before proposing changes.
2.  **Strategy:** Outline your plan and wait for confirmation if the change is significant.
3.  **Execution:** Use surgical `replace` calls instead of rewriting entire files when possible.
4.  **Verification:** Always run `npm run test` and `npm run lint` after making changes.

## Memory and Persistence
*   **Project Memory:** Use the private project memory folder for local-only notes and workflows.
*   **Instruction Updates:** If you discover a new convention or requirement that the team should follow, update this file (`AGENTS.md`).
