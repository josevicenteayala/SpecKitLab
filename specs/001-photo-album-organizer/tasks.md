# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-photo-album-organizer/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md  
**Tests**: Tests are NOT explicitly requested in the feature specification, therefore NO test tasks are generated.  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Single-page web application structure:
- `src/` - Application source code
- `src/js/` - JavaScript modules
- `src/css/` - Stylesheets
- `src/db/` - Database setup and operations
- `index.html` - Main HTML entry point
- `public/` - Static assets

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite project with vanilla JavaScript template
- [ ] T002 [P] Create project directory structure: src/, src/js/, src/css/, src/db/, public/
- [ ] T003 [P] Configure package.json with sql.js dependency
- [ ] T004 [P] Setup ESLint configuration file .eslintrc.json for vanilla JavaScript
- [ ] T005 [P] Setup Prettier configuration file .prettierrc
- [ ] T006 [P] Create CSS custom properties file src/css/variables.css for design tokens
- [ ] T007 [P] Create base HTML structure in index.html with viewport meta and semantic markup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Initialize SQLite database with sql.js in src/db/database.js
- [ ] T009 Create database schema for albums table in src/db/schema.sql
- [ ] T010 Create database schema for photos table in src/db/schema.sql
- [ ] T011 Create database schema for album_order table in src/db/schema.sql
- [ ] T012 Implement database initialization function in src/db/database.js
- [ ] T013 [P] Setup IndexedDB wrapper for photo file storage in src/js/storage.js
- [ ] T014 [P] Create utility for file hash calculation (duplicate detection) in src/js/utils/hash.js
- [ ] T015 [P] Create thumbnail generator utility in src/js/utils/thumbnail.js
- [ ] T016 [P] Implement error boundary and global error handler in src/js/utils/errorHandler.js
- [ ] T017 [P] Create notification/toast UI component in src/js/components/notification.js
- [ ] T018 [P] Setup CSS grid system and responsive breakpoints in src/css/layout.css
- [ ] T019 [P] Create base styles for accessibility (focus indicators, ARIA support) in src/css/accessibility.css
- [ ] T019a [P] Create reusable confirmation dialog component in src/js/components/confirmDialog.js
- [ ] T019b [P] Style confirmation dialog in src/css/components/dialog.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Albums (Priority: P1) 🎯 MVP

**Goal**: Users can create albums with dates, view all albums on main page sorted chronologically, and view photos within albums in a tile grid

**Independent Test**: Create several albums with different dates, add photos to them, and verify they appear on the main page sorted chronologically. Open an album and verify photos display in a 4-column tile grid.

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create Album model class in src/js/models/Album.js with CRUD methods
- [ ] T021 [P] [US1] Create Photo model class in src/js/models/Photo.js with CRUD methods
- [ ] T022 [US1] Implement AlbumService in src/js/services/albumService.js (getAll, create, getById methods)
- [ ] T023 [US1] Implement PhotoService in src/js/services/photoService.js (getByAlbumId, add methods)
- [ ] T024 [P] [US1] Create main page UI structure in src/js/views/mainView.js
- [ ] T025 [P] [US1] Create album list component in src/js/components/albumList.js
- [ ] T026 [P] [US1] Create album card component in src/js/components/albumCard.js
- [ ] T027 [P] [US1] Create album view UI in src/js/views/albumView.js
- [ ] T028 [P] [US1] Create photo tile grid component in src/js/components/photoGrid.js
- [ ] T029 [P] [US1] Create individual photo tile component in src/js/components/photoTile.js
- [ ] T030 [US1] Implement album sorting by date (chronological) in src/js/services/albumService.js
- [ ] T031 [US1] Wire up main page to display albums from database in index.html
- [ ] T032 [US1] Wire up album navigation (click album to view photos) in src/js/controllers/navigation.js
- [ ] T033 [P] [US1] Style album cards for main page in src/css/components/album-card.css
- [ ] T034 [P] [US1] Style photo tile grid with responsive layout (1 col mobile, 2 col tablet, 4 col desktop) in src/css/components/photo-grid.css
- [ ] T035 [US1] Implement photo tile uniform sizing with cropping in src/css/components/photo-tile.css
- [ ] T036 [US1] Add loading states for album and photo views in src/js/components/loader.js

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create albums, view them sorted by date, and see photos in a tile grid

---

## Phase 4: User Story 2 - Upload and Manage Photos (Priority: P2)

**Goal**: Users can upload photos to albums (multiple formats, multiple files), view them as tiles, and remove photos from albums

**Independent Test**: Select an album, upload photos (JPEG, PNG, WebP), verify they appear in the tile grid, remove photos, and confirm they are deleted from both IndexedDB and database.

### Implementation for User Story 2

- [ ] T037 [P] [US2] Create file upload UI component in src/js/components/fileUpload.js
- [ ] T038 [P] [US2] Implement multi-file selection handler in src/js/components/fileUpload.js
- [ ] T039 [US2] Add file format validation (JPEG, PNG, HEIC, WebP) with HEIC browser compatibility check in src/js/utils/fileValidator.js
- [ ] T040 [US2] Implement file hash calculation for duplicate detection in src/js/services/photoService.js
- [ ] T041 [US2] Add duplicate photo check before upload in src/js/services/photoService.js
- [ ] T042 [US2] Implement photo upload to IndexedDB in src/js/storage.js
- [ ] T043 [US2] Implement photo metadata save to SQLite in src/js/services/photoService.js
- [ ] T044 [US2] Add thumbnail generation during upload in src/js/utils/thumbnail.js
- [ ] T045 [US2] Create upload progress indicator UI in src/js/components/uploadProgress.js
- [ ] T046 [US2] Implement simultaneous multi-photo upload queue in src/js/services/uploadService.js
- [ ] T047 [P] [US2] Create photo delete UI (select and remove button) in src/js/components/photoTile.js
- [ ] T048 [US2] Implement photo removal from IndexedDB in src/js/storage.js
- [ ] T049 [US2] Implement photo metadata deletion from SQLite in src/js/services/photoService.js
- [ ] T050 [US2] Wire up confirmation dialog (from T019a) for photo deletion in src/js/controllers/uploadController.js
- [ ] T051 [US2] Show notification when duplicate photo detected in src/js/controllers/uploadController.js
- [ ] T052 [P] [US2] Style file upload component in src/css/components/file-upload.css
- [ ] T053 [P] [US2] Style upload progress indicator in src/css/components/upload-progress.css
- [ ] T055 [US2] Enforce maximum limit of 500 photos per album in src/js/services/photoService.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can create albums, upload photos with duplicate detection, and remove photos

---

## Phase 5: User Story 3 - Reorganize Albums via Drag and Drop (Priority: P3)

**Goal**: Users can manually reorder albums on main page by dragging and dropping them, with custom order persisting across sessions

**Independent Test**: View main page with multiple albums, drag an album to a new position, drop it, refresh the page, and verify the custom order persists.

### Implementation for User Story 3

- [ ] T056 [P] [US3] Implement drag-and-drop event listeners in src/js/components/albumCard.js
- [ ] T057 [P] [US3] Create drag handle visual indicator in src/js/components/albumCard.js
- [ ] T058 [US3] Implement drag start handler with visual feedback in src/js/controllers/dragDropController.js
- [ ] T059 [US3] Implement drag over handler with drop zone highlighting in src/js/controllers/dragDropController.js
- [ ] T060 [US3] Implement drop handler with position calculation in src/js/controllers/dragDropController.js
- [ ] T061 [US3] Implement drop validation (valid drop zones only) in src/js/controllers/dragDropController.js
- [ ] T062 [US3] Add return-to-origin animation for invalid drops in src/js/controllers/dragDropController.js
- [ ] T063 [US3] Create AlbumOrderService to manage custom order in src/js/services/albumOrderService.js
- [ ] T064 [US3] Implement save custom album order to database in src/js/services/albumOrderService.js
- [ ] T065 [US3] Update album sorting to respect custom order when set in src/js/services/albumService.js
- [ ] T066 [US3] Ensure drag-drop save completes in under 1 second (async optimization) in src/js/services/albumOrderService.js
- [ ] T067 [P] [US3] Style drag-and-drop visual feedback (cursor, opacity) in src/css/components/drag-drop.css
- [ ] T068 [P] [US3] Style drop zone highlighting in src/css/components/drag-drop.css
- [ ] T069 [P] [US3] Add touch device support for drag-and-drop in src/js/controllers/dragDropController.js
- [ ] T070 [P] [US3] Add keyboard accessibility for album reordering in src/js/controllers/keyboardReorderController.js

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can create albums, upload photos, and reorder albums with persistence

---

## Phase 6: User Story 4 - Manage Albums (Priority: P4)

**Goal**: Users can create new albums with name and date, edit album properties, and delete albums with all their photos

**Independent Test**: Create a new album with name and date, edit its properties, verify changes persist, delete an album, and confirm it and all its photos are removed from main page and storage.

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create album creation form UI in src/js/components/albumForm.js
- [ ] T072 [P] [US4] Create album edit form UI (reuse albumForm with edit mode) in src/js/components/albumForm.js
- [ ] T073 [US4] Implement form validation (name required, date required, no nesting support) in src/js/utils/formValidator.js
- [ ] T074 [US4] Wire up album creation to AlbumService.create in src/js/controllers/albumController.js
- [ ] T075 [US4] Wire up album edit to AlbumService.update in src/js/controllers/albumController.js
- [ ] T076 [US4] Update main page to show newly created albums in correct date position in src/js/views/mainView.js
- [ ] T077 [US4] Update main page when album date changes (re-sort) in src/js/views/mainView.js
- [ ] T078 [P] [US4] Create album delete UI (delete button) in src/js/components/albumCard.js
- [ ] T079 [US4] Wire up confirmation dialog (from T019a) for album deletion in src/js/controllers/albumController.js
- [ ] T080 [US4] Implement cascade delete for all photos in album from IndexedDB in src/js/services/photoService.js
- [ ] T081 [US4] Implement cascade delete for all photo metadata in SQLite in src/js/services/photoService.js
- [ ] T082 [US4] Implement album deletion from SQLite in src/js/services/albumService.js
- [ ] T083 [US4] Remove deleted album from main page UI in src/js/views/mainView.js
- [ ] T084 [US4] Show success notification after album deletion in src/js/controllers/albumController.js
- [ ] T085 [US4] Enforce maximum limit of 100 albums in src/js/services/albumService.js
- [ ] T086 [P] [US4] Style album form in src/css/components/album-form.css
- [ ] T087 [P] [US4] Style form validation errors in src/css/components/form-validation.css

**Checkpoint**: All user stories should now be independently functional - full CRUD on albums, photo upload/delete, drag-and-drop reordering

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T088 [P] Handle unsupported photo format error with user-friendly message in src/js/utils/fileValidator.js
- [ ] T089 [P] Handle large file size (>50MB) with warning and optional rejection in src/js/utils/fileValidator.js
- [ ] T090 [P] Handle album creation without date with validation error in src/js/utils/formValidator.js
- [ ] T091 [P] Display multiple albums with same date sorted alphabetically by name (secondary sort) in src/js/services/albumService.js
- [ ] T092 [P] Implement virtualization for albums with hundreds of photos (lazy loading tiles) in src/js/components/photoGrid.js
- [ ] T093 [P] Handle concurrent edits gracefully (last-write-wins with refresh) in src/js/services/albumService.js
- [ ] T094 [P] Handle network-like errors during drag-drop save with retry in src/js/services/albumOrderService.js
- [ ] T095 [P] Handle corrupt photo metadata gracefully (skip and log error) in src/js/services/photoService.js
- [ ] T096 [P] Add responsive layout for mobile devices (single column album grid) in src/css/responsive.css
- [ ] T097 [P] Add responsive layout for tablet devices (2-column album grid) in src/css/responsive.css
- [ ] T098 [P] Optimize photo tile rendering for performance (CSS contain, will-change) in src/css/components/photo-tile.css
- [ ] T099 [P] Add loading skeleton for album list in src/js/components/albumListSkeleton.js
- [ ] T100 [P] Add empty state UI when no albums exist in src/js/components/emptyState.js
- [ ] T101 [P] Add empty state UI when album has no photos in src/js/components/emptyState.js
- [ ] T102 [P] Implement browser storage quota check and warning in src/js/utils/storageMonitor.js
- [ ] T103 [P] Add ARIA labels and roles for all interactive elements in index.html and components
- [ ] T104 [P] Test and fix keyboard navigation flow in src/js/controllers/keyboardController.js
- [ ] T105 [P] Add focus trap for modal dialogs in src/js/components/modal.js
- [ ] T106 [P] Optimize bundle size with code splitting in vite.config.js
- [ ] T107 [P] Add service worker for offline capability (optional enhancement) in src/sw.js
- [ ] T108 Create README.md with setup instructions and feature overview
- [ ] T109 Document database schema and API in docs/architecture.md
- [ ] T110 Run Lighthouse CI and address performance issues
- [ ] T111 Code cleanup and refactoring for consistency
- [ ] T112 Final cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 (uses Album and Photo models) but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 (reorders albums) but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Uses models from US1 but independently testable

### Within Each User Story

- Models before services
- Services before UI components
- Core implementation before styling
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: All tasks marked [P] (T002-T007) can run in parallel
- **Foundational Phase**: Tasks T013-T019 marked [P] can run in parallel after database setup (T008-T012)
- **User Story 1**: Tasks T020-T021, T024-T029, T033-T035 can run in parallel within their groups
- **User Story 2**: Tasks T037-T038, T047, T052-T054 can run in parallel
- **User Story 3**: Tasks T056-T057, T067-T070 can run in parallel
- **User Story 4**: Tasks T071-T072, T078, T086-T087 can run in parallel
- **Polish Phase**: Most tasks (T088-T107) can run in parallel
- **Different user stories** can be worked on in parallel by different team members after Phase 2

---

## Parallel Example: User Story 1

```bash
# Developer 1: Models
git checkout -b us1-models
# Work on T020, T021

# Developer 2: Services  
git checkout -b us1-services
# Wait for models, then work on T022, T023

# Developer 3: UI Components
git checkout -b us1-ui-components
# Work on T024-T029 in parallel

# Developer 4: Styling
git checkout -b us1-styling
# Work on T033-T035 in parallel
```

---

## Implementation Strategy

### Recommended Approach: MVP First

1. **Week 1**: Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. **Week 2-3**: Complete Phase 3 (User Story 1 - P1) = **MVP Release**
   - Users can create albums and view photos
   - Core value delivered early
3. **Week 4**: Complete Phase 4 (User Story 2 - P2)
   - Photo upload and management
   - Feature completeness
4. **Week 5**: Complete Phase 5 (User Story 3 - P3)
   - Drag-and-drop enhancement
5. **Week 6**: Complete Phase 6 (User Story 4 - P4)
   - Full CRUD on albums
6. **Week 7**: Phase 7 (Polish) and launch preparation

### MVP Scope (Fastest Path to Value)

**Minimum for launch**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only)

This delivers:
- Album creation and viewing
- Photo display in tile grid
- Chronological sorting by date
- Complete data persistence

Users can start organizing photos immediately with this MVP.

---

## Task Summary

- **Total Tasks**: 112
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 12 tasks (blocking)
- **User Story 1 (P1)**: 17 tasks 🎯 MVP
- **User Story 2 (P2)**: 19 tasks
- **User Story 3 (P3)**: 15 tasks
- **User Story 4 (P4)**: 17 tasks
- **Polish Phase**: 25 tasks
- **Parallel Opportunities**: 50+ tasks can run in parallel across different phases

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`  
✅ All user story tasks have [Story] labels (US1, US2, US3, US4)  
✅ Setup and Foundational tasks have no story labels  
✅ All tasks include specific file paths  
✅ Tasks are organized by user story for independent implementation  
✅ Each phase has clear checkpoints and goals  
✅ Dependencies and parallel opportunities are documented
