# Stack Tracker Testing & Coverage

## Jest Multi-Project Setup

This project uses Jest's multi-project configuration to ensure robust, isolated testing for both frontend (React/component) and backend (unit, Firebase) code.

### How It Works
- **Frontend tests** (React/components):
  - Use `src/client-test/setupTests.ts` for proper React/MUI environment, matchers, and act() suppression.
  - Run on all `.test.tsx`, `.test.jsx`, and `.test.js` files (except backend).
- **Backend tests** (Firebase/unit):
  - Use `jest.empty-setup.js` (no frontend setup, no React/matchMedia patching).
  - Run on all `src/firebase/**/*.test.ts` files.

### Running All Tests
- Simply run:
  ```sh
  npm test
  ```
  This will run both frontend and backend tests, each with the correct setup, and combine coverage into a single report.

### Running Only Backend Tests
- Run:
  ```sh
  npm test -- --selectProjects backend
  ```

### Running Only Frontend Tests
- Run:
  ```sh
  npm test -- --selectProjects frontend
  ```

### Coverage
- Coverage is automatically collected and unified across both projects.
- Reports are available in the `coverage/` directory after each run.

### Why Multi-Project?
- No more stack overflow or recursion errors from setup file conflicts.
- No need for special environment variables or CLI flags.
- CI/CD and local runs are robust, simple, and unified.

---

## Test Structure
- **Frontend/component tests:**
  - `src/**/*.test.tsx`, `src/**/*.test.jsx`, `src/**/*.test.js`
- **Backend/unit tests:**
  - `src/firebase/**/*.test.ts`

## Adding New Tests
- Place new frontend/component tests in their respective directories with `.test.tsx`/`.test.js` extension.
- Place new backend/unit tests in `src/firebase/` with `.test.ts` extension.

## Troubleshooting
- If you see stack overflow errors in backend tests, ensure they are in the correct directory and not loading the frontend setup.
- For frontend tests, use the React Testing Library and matchers as usual.

---

For more, see [Jest Multi-Project Docs](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)
