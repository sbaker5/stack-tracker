# Stack Tracker Architecture

## Overview
Stack Tracker consists of a React frontend, RESTful API backend, and MongoDB Atlas database. It supports modular export, tag/flag management, and mobile-optimized UI.

---

## Component/Data Flow Diagram

```mermaid
graph TD
  subgraph Frontend (React)
    A[App.jsx]
    B[Pages/Views]
    C[TagFlagManager]
    D[SearchBar]
    E[ExportMenu]
    F[Context/State]
  end
  subgraph Backend (API)
    G[API Endpoints]
    H[Business Logic]
    I[MongoDB Models]
  end

  A --> B
  B --> C
  B --> D
  B --> E
  C --> F
  D --> F
  E --> F
  F --> G
  G --> H
  H --> I
```

---

## Key Technologies
- React, TypeScript, Material-UI
- Node.js/Express (API)
- MongoDB Atlas
- Jest, React Testing Library
- Netlify, GitHub Actions, Cloudflare

---

## Notes
- See `/docs/components/` for detailed component docs
- See `/docs/openapi.yaml` for API spec
