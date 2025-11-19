# Implementation Plan: Photo Album Organizer

**Branch**: `001-photo-album-organizer` | **Date**: November 19, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-photo-album-organizer/spec.md`

## Summary

Build a photo album organization application where users can create albums grouped by date, upload photos to albums displayed in a tile grid, and reorganize albums via drag-and-drop. The application uses Vite with vanilla HTML, CSS, and JavaScript. Photos are stored locally in the browser, and metadata is persisted in a local SQLite database (via sql.js in browser).

## Technical Context

**Language/Version**: JavaScript ES2022+ (targeting modern browsers)  
**Primary Dependencies**: 
- Vite 5.x (build tool and dev server)
- sql.js (SQLite in browser via WebAssembly)
- Minimal additional libraries (vanilla JS preferred)

**Storage**: 
- Photo files: Browser IndexedDB (via native IndexedDB API)
- Metadata: Local SQLite database (sql.js running in browser)

**Testing**: Vitest (Vite-native test runner)  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Single-page web application  
**Performance Goals**: 
- Initial load: <1.5s (FCP)
- Photo tile rendering: <2s for 500 photos
- Drag-and-drop save: <1s
- Thumbnail generation: <500ms per photo

**Constraints**: 
- Minimal external dependencies (vanilla JS approach)
- Browser-only storage (no backend server)
- IndexedDB quota limits (~50GB typical, varies by browser)
- SQLite database size managed within browser storage limits
- Single-device application: IndexedDB is local to browser/device, no cross-device sync

**Scale/Scope**: 
- 100 albums maximum
- 500 photos per album maximum
- Support for JPEG, PNG, HEIC, WebP formats
- Single-user application (no authentication/multi-user)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Reference**: Development Constitution from `.specify/memory/constitution.md`

### Code Quality Principles ✅
- **Readability**: Vanilla JS with clear naming conventions enforced
- **Organization**: Clear separation between data layer (SQLite), storage layer (IndexedDB), and UI components
- **Error Handling**: Explicit error boundaries for storage operations, file uploads, and drag-drop
- **Code Review**: All changes reviewed before merge to main

### Testing Standards ✅
- **Coverage**: Target 80% minimum, 100% for critical paths (duplicate detection, data persistence)
- **Test Pyramid**: Unit tests for storage/database operations, integration tests for UI workflows, E2E tests for critical user journeys
- **Independence**: Tests use mock data and don't depend on browser storage state
- **Automation**: Vitest runs in CI on every PR

### UX Consistency ✅
- **Design System**: Consistent spacing, colors, typography via CSS custom properties
- **Accessibility**: Keyboard navigation for all interactions, ARIA labels for drag-drop operations
- **Responsive**: Mobile-first approach with breakpoints for tablet/desktop
- **Feedback**: Loading states for photo uploads, visual feedback for drag-drop, confirmation dialogs for destructive actions

### Performance Requirements ✅
- **Load Times**: FCP <1.5s, LCP <2.5s, TTI <3.5s (aligned with constitution)
- **Bundle Size**: Initial JS <200KB gzipped (Vite code-splitting for photo processing utilities)
- **Runtime Performance**: 60 FPS for drag-drop animations, debounced search/filter operations
- **Network**: N/A (local-only application, no network requests)
- **Database**: Indexed queries on album_id, date fields; pagination for large result sets

### Enforcement ✅
- **Linting**: ESLint with recommended rules
- **Type Checking**: JSDoc for type hints (no TypeScript per vanilla JS requirement)
- **Formatting**: Prettier for consistent code style
- **Performance Budget**: Lighthouse CI checks on builds

**Violations**: None - all constitution principles can be met with the specified tech stack.

**Post-Design Re-check**: [To be completed after Phase 1]

## Project Structure

### Documentation (this feature)

```text
specs/001-photo-album-organizer/
├── plan.md              # This file
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
│   └── database-schema.sql
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
photo-album-organizer/
├── index.html              # Main entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── .eslintrc.json          # Linting rules
├── .prettierrc             # Code formatting
├── public/
│   └── sql-wasm.wasm       # SQLite WebAssembly binary (from sql.js)
├── src/
│   ├── main.js             # Application initialization
│   ├── styles/
│   │   ├── main.css        # Global styles and CSS custom properties
│   │   ├── layout.css      # Grid and flexbox layouts
│   │   └── components.css  # Component-specific styles
│   ├── data/
│   │   ├── database.js     # SQLite database initialization and queries
│   │   ├── storage.js      # IndexedDB operations for photo files
│   │   └── migrations.js   # Database schema migrations
│   ├── services/
│   │   ├── album-service.js        # Album CRUD operations
│   │   ├── photo-service.js        # Photo upload, retrieval, deletion
│   │   ├── thumbnail-service.js    # Thumbnail generation (Canvas API)
│   │   └── hash-service.js         # File hashing for duplicate detection
│   ├── components/
│   │   ├── album-list.js           # Main page album grid
│   │   ├── album-card.js           # Individual album card with drag-drop
│   │   ├── photo-grid.js           # Photo tile grid within album
│   │   ├── photo-tile.js           # Individual photo tile
│   │   ├── upload-dialog.js        # Photo upload interface
│   │   ├── album-form.js           # Create/edit album modal
│   │   └── confirmation-dialog.js  # Delete confirmation
│   ├── utils/
│   │   ├── drag-drop.js            # Drag-and-drop utilities
│   │   ├── file-reader.js          # File reading and validation
│   │   ├── date-formatter.js       # Date formatting utilities
│   │   └── notifications.js        # Toast/notification system
│   └── state/
│       └── app-state.js            # Simple state management (event-driven)
└── tests/
    ├── unit/
    │   ├── database.test.js
    │   ├── storage.test.js
    │   ├── hash-service.test.js
    │   └── thumbnail-service.test.js
    ├── integration/
    │   ├── album-workflow.test.js
    │   ├── photo-upload.test.js
    │   └── drag-drop.test.js
    └── e2e/
        └── user-journeys.test.js
```

**Structure Decision**: Single-page web application structure chosen based on:
- No backend server requirement (local-only storage)
- Vite as build tool (optimized for SPA development)
- Clear separation of concerns: data layer (SQLite), storage layer (IndexedDB), service layer, UI components
- Vanilla JS with modular component approach (no framework)

## Complexity Tracking

> No constitution violations - complexity tracking not required.

---

## Phase 0: Research & Unknowns

**OBJECTIVE**: Resolve all "NEEDS CLARIFICATION" items from Technical Context and document technology choices.

### Research Tasks

The following items require investigation and will be documented in `research.md`:

1. **SQLite in Browser (sql.js)**
   - Decision: How to initialize and manage sql.js in Vite project
   - Rationale: Evaluate performance vs. native IndexedDB for metadata
   - Alternatives: Pure IndexedDB, LocalForage, Dexie.js

2. **Photo File Storage Strategy**
   - Decision: IndexedDB blob storage implementation
   - Rationale: Browser storage quotas and performance characteristics
   - Alternatives: FileSystem Access API, localStorage (not viable for images)

3. **Thumbnail Generation**
   - Decision: Canvas API with createImageBitmap for efficient resizing
   - Rationale: Evaluate resize algorithms (bilinear, bicubic) for quality vs. speed
   - Alternatives: OffscreenCanvas for web workers, third-party libraries

4. **File Hashing for Duplicates**
   - Decision: SubtleCrypto Web API (SHA-256) for content hashing
   - Rationale: Native browser API, suitable performance for client-side hashing
   - Alternatives: SparkMD5, third-party hashing libraries

5. **Drag-and-Drop Implementation**
   - Decision: Native HTML5 Drag and Drop API vs. pointer events
   - Rationale: Evaluate touch device support and visual feedback capabilities
   - Alternatives: SortableJS, custom pointer event handler

6. **HEIC Format Support**
   - Decision: Browser native support vs. heic2any conversion library
   - Rationale: Safari supports HEIC natively, other browsers need conversion
   - Alternatives: Server-side conversion (not applicable), reject HEIC in non-Safari browsers

7. **Database Schema Design**
   - Decision: Table structure for albums, photos, album_order
   - Rationale: Normalization vs. denormalization for performance
   - Alternatives: Document all schema design decisions

8. **State Management Pattern**
   - Decision: Event-driven state with CustomEvents vs. observer pattern
   - Rationale: Vanilla JS approaches without introducing framework complexity
   - Alternatives: Redux-like pattern, Proxy-based reactivity

9. **Build Optimization**
   - Decision: Vite code-splitting strategy for optimal bundle size
   - Rationale: Lazy-load photo processing utilities, inline critical CSS
   - Alternatives: Document bundle optimization techniques

10. **Error Recovery Strategy**
    - Decision: How to handle corrupted SQLite database or IndexedDB failures
    - Rationale: Define recovery mechanisms and user communication
    - Alternatives: Database migrations, export/import functionality

**Output**: `research.md` with all decisions documented, no remaining "NEEDS CLARIFICATION" markers.

---

## Phase 1: Design & Contracts

**PREREQUISITES**: `research.md` complete, all technical unknowns resolved

### Deliverables

1. **data-model.md**
   - Albums table schema (id, name, date, custom_order, created_at, updated_at)
   - Photos table schema (id, album_id, filename, file_hash, upload_timestamp, file_size, format, width, height)
   - Album_order table (tracking custom drag-drop positions)
   - IndexedDB object store structure for photo blobs
   - Validation rules and constraints
   - Migration strategy for schema changes

2. **contracts/database-schema.sql**
   - SQLite DDL statements for all tables
   - Indexes on frequently queried columns (album_id, date, file_hash)
   - Constraints (foreign keys, uniqueness, check constraints)
   - Initial data (if any)

3. **contracts/api-interfaces.js** (JSDoc definitions)
   - AlbumService interface methods
   - PhotoService interface methods
   - StorageService interface methods
   - DatabaseService interface methods
   - Component event contracts (CustomEvent types)

4. **quickstart.md**
   - Development setup instructions
   - How to run dev server (`npm run dev`)
   - How to run tests (`npm run test`)
   - How to build for production (`npm run build`)
   - How to reset database/storage for testing
   - Common troubleshooting scenarios

5. **Agent Context Update**
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
   - Add: Vite, sql.js, vanilla JavaScript, IndexedDB
   - Update agent-specific context file with project stack

### Post-Design Constitution Check

Re-evaluate constitution compliance after design artifacts complete:
- [ ] Database schema follows performance requirements (indexed queries)
- [ ] Component interfaces support testability (dependency injection compatible)
- [ ] Error handling strategy documented for all failure modes
- [ ] Accessibility considerations in component contracts
- [ ] Performance budgets validated against design decisions

**Output**: All Phase 1 artifacts in `specs/001-photo-album-organizer/`, agent context updated.

---

## Phase 2: Task Breakdown

**NOTE**: This phase is executed by `/speckit.tasks`, NOT by `/speckit.plan`.

The planning command stops here. Task breakdown will:
- Generate `tasks.md` with implementation tasks
- Prioritize based on user story priorities (P1-P4)
- Create testable, independent tasks
- Estimate complexity and dependencies
- Map tasks to source files in project structure

**Next Command**: `/speckit.tasks` to generate implementation task list.

---

## Notes & Decisions

### Key Technical Decisions

1. **User Input Override**: Despite spec mentioning "Browser local storage with IndexedDB", user specified "metadata is stored in a local SQLite database". Implementation uses:
   - SQLite (via sql.js) for structured metadata (albums, photos metadata)
   - IndexedDB for binary blob storage (actual photo files)
   - This hybrid approach optimizes for SQL query capabilities + efficient blob storage

2. **HEIC Support Strategy**: Conditional based on browser
   - Safari: Native HEIC support
   - Others: Use heic2any library for conversion (added as dependency)
   - Graceful degradation: Show format warning if conversion fails

3. **No Network Dependency**: Application is fully offline-capable
   - sql.js WASM file served from public/ directory
   - No CDN dependencies
   - Service worker (future enhancement) could enable true PWA

4. **Performance Trade-offs**:
   - Thumbnail generation on upload (upfront cost) vs. on-demand (lazy)
   - Decision: Generate on upload, cache in IndexedDB
   - Rationale: Meets 2s load time requirement for 500 photos

5. **Vanilla JS Component Pattern**:
   - Web Components (Custom Elements) considered but rejected for simplicity
   - Chosen: Simple factory functions returning DOM nodes
   - Event-driven communication via CustomEvents
   - Rationale: Minimal learning curve, no framework lock-in

### Remaining Open Questions (For Phase 2)

- Should we add export/backup functionality for user data?
- Should we implement service worker for offline PWA capabilities?
- How to handle browser storage quota exceeded errors?
- Should we add photo editing capabilities (crop, rotate)?
- Multi-select for batch operations on photos?

These questions will be addressed during task breakdown based on priorities.

---

## Success Metrics Validation

Mapping success criteria from spec to implementation approach:

| Success Criteria | Implementation Strategy |
|------------------|-------------------------|
| SC-001: Create album + add photos <60s | Streamlined UI, batch upload support, optimistic UI updates |
| SC-002: View 100 albums without scrolling | Virtual scrolling or pagination after threshold, responsive grid layout |
| SC-003: Drag-drop save <1s | Optimistic UI update, async SQLite write, IndexedDB batch update |
| SC-004: 500 photo tiles load <2s | Pre-generated thumbnails, lazy image loading, efficient IndexedDB queries |
| SC-005: 90% first-attempt success | Clear UI affordances, inline validation, helpful error messages |
| SC-006: 50 simultaneous uploads | Web Workers for parallel thumbnail generation, batch IndexedDB writes |
| SC-007: Persistence across sessions | SQLite + IndexedDB for durable storage, tested recovery mechanisms |
| SC-008: 95% photo identification | Sufficient thumbnail size (200x200px), maintain recognizable crops |

All success criteria are achievable with the proposed technical approach.

---

**Status**: Phase 0 Research - Ready to Begin  
**Next Steps**: Generate `research.md` by dispatching research agents for unknowns listed above.
