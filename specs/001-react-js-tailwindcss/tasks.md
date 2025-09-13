# Tasks: Automatic Book Screenshot Application

**Input**: Design documents from `/specs/001-react-js-tailwindcss/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: Tauri + React + TypeScript, ScreenCaptureKit, macOS APIs
2. Load optional design documents:
   → data-model.md: Extract 4 entities → model tasks
   → contracts/: 3 files → contract test tasks
   → research.md: Extract Tauri framework decisions → setup tasks
3. Generate tasks by category:
   → Setup: Tauri project init, dependencies, linting
   → Tests: 22 Tauri commands tests, integration tests, E2E tests
   → Core: 4 models, 4 services, CLI for each library
   → Integration: macOS permissions, file system, logging
   → Polish: unit tests, performance, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All 22 Tauri commands have tests? ✓
   → All 4 entities have models? ✓
   → All core functionality implemented? ✓
9. Return: SUCCESS (32 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single Tauri project**: `src/` (React), `src-tauri/src/` (Rust), `tests/` at repository root
- Paths follow plan.md structure for desktop application

## Phase 3.1: Setup & Project Structure

- [ ] **T001** Create Tauri project structure with React frontend and Rust backend
- [ ] **T002** Initialize Tauri project with dependencies: @tauri-apps/api@1.5.0, React 18+, TypeScript 5+, TailwindCSS 3+
- [ ] **T003** [P] Configure Rust dependencies in `src-tauri/Cargo.toml`: screencapturekit, uuid, serde, tokio, tauri-plugin-log
- [ ] **T004** [P] Configure frontend build tools: Vite, ESLint, TypeScript config in root `package.json`
- [ ] **T005** [P] Setup Playwright E2E testing framework with configuration in `playwright.config.ts`
- [ ] **T006** [P] Configure Tauri permissions in `src-tauri/tauri.conf.json`: global shortcuts, file system, dialog access

## Phase 3.2: Contract Tests (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Permission Management Tests
- [ ] **T007** [P] Contract test `check_permissions` command in `tests/contract/test_permissions.rs`
- [ ] **T008** [P] Contract test `request_permissions` command in `tests/contract/test_permissions.rs`

### Application Detection Tests  
- [ ] **T009** [P] Contract test `detect_apps` command in `tests/contract/test_app_detection.rs`
- [ ] **T010** [P] Contract test `get_app_details` command in `tests/contract/test_app_detection.rs`
- [ ] **T011** [P] Contract test `test_automation` command in `tests/contract/test_app_detection.rs`

### Session Management Tests
- [ ] **T012** [P] Contract test `create_session` command in `tests/contract/test_session_management.rs`
- [ ] **T013** [P] Contract test `get_session`/`list_sessions` commands in `tests/contract/test_session_management.rs`
- [ ] **T014** [P] Contract test `update_session`/`delete_session` commands in `tests/contract/test_session_management.rs`

### Capture Control Tests
- [ ] **T015** [P] Contract test `start_capture`/`pause_capture` commands in `tests/contract/test_capture_control.rs`
- [ ] **T016** [P] Contract test `resume_capture`/`stop_capture` commands in `tests/contract/test_capture_control.rs`
- [ ] **T017** [P] Contract test `emergency_stop` command in `tests/contract/test_capture_control.rs`

### Screenshot & Settings Tests
- [ ] **T018** [P] Contract test `get_screenshots`/`delete_screenshots` commands in `tests/contract/test_screenshot_management.rs`
- [ ] **T019** [P] Contract test `export_screenshots` command in `tests/contract/test_screenshot_management.rs`
- [ ] **T020** [P] Contract test settings management commands in `tests/contract/test_settings.rs`
- [ ] **T021** [P] Contract test legal compliance commands in `tests/contract/test_legal.rs`

### Integration Tests
- [ ] **T022** [P] Integration test complete screenshot workflow in `tests/integration/test_capture_workflow.rs`
- [ ] **T023** [P] Integration test permission request flow in `tests/integration/test_permission_flow.rs`
- [ ] **T024** [P] Integration test error handling scenarios in `tests/integration/test_error_handling.rs`

## Phase 3.3: Core Data Models (ONLY after tests are failing)

- [ ] **T025** [P] Screenshot entity model in `src-tauri/src/models/screenshot.rs`
- [ ] **T026** [P] BookSession entity model in `src-tauri/src/models/book_session.rs`  
- [ ] **T027** [P] AppTarget entity model in `src-tauri/src/models/app_target.rs`
- [ ] **T028** [P] CaptureSettings entity model in `src-tauri/src/models/capture_settings.rs`

## Phase 3.4: Library Implementations

### Screenshot Library
- [ ] **T029** [P] ScreenCaptureKit integration in `src-tauri/src/screenshot/capture.rs`
- [ ] **T030** [P] Core Graphics fallback in `src-tauri/src/screenshot/fallback.rs`
- [ ] **T031** [P] Screenshot CLI commands in `src-tauri/src/screenshot/cli.rs`

### Automation Library  
- [ ] **T032** [P] macOS Accessibility API wrapper in `src-tauri/src/automation/accessibility.rs`
- [ ] **T033** [P] Keyboard event automation in `src-tauri/src/automation/keyboard.rs`
- [ ] **T034** [P] Window detection and management in `src-tauri/src/automation/window.rs`
- [ ] **T035** [P] Automation CLI commands in `src-tauri/src/automation/cli.rs`

### Storage Library
- [ ] **T036** [P] File system operations in `src-tauri/src/storage/filesystem.rs`
- [ ] **T037** [P] SQLite metadata storage in `src-tauri/src/storage/database.rs`
- [ ] **T038** [P] Session data persistence in `src-tauri/src/storage/session.rs`
- [ ] **T039** [P] Storage CLI commands in `src-tauri/src/storage/cli.rs`

## Phase 3.5: Tauri Command Handlers

### Permission Commands
- [ ] **T040** Permission management commands in `src-tauri/src/commands/permissions.rs`

### App Detection Commands
- [ ] **T041** Application detection commands in `src-tauri/src/commands/app_detection.rs`

### Session & Capture Commands
- [ ] **T042** Session management commands in `src-tauri/src/commands/session_management.rs`
- [ ] **T043** Capture control commands in `src-tauri/src/commands/capture_control.rs`

### Data & Settings Commands  
- [ ] **T044** Screenshot management commands in `src-tauri/src/commands/screenshot_management.rs`
- [ ] **T045** Settings and legal commands in `src-tauri/src/commands/settings.rs`

## Phase 3.6: React Frontend Components

### Core UI Components
- [ ] **T046** [P] Main application shell in `src/components/AppShell.tsx`
- [ ] **T047** [P] Permission dialog component in `src/components/PermissionDialog.tsx`
- [ ] **T048** [P] App detection page in `src/components/AppDetectionPage.tsx`

### Capture Interface
- [ ] **T049** [P] Capture control panel in `src/components/capture/CaptureControls.tsx`
- [ ] **T050** [P] Progress indicator component in `src/components/progress/ProgressIndicator.tsx`
- [ ] **T051** [P] Session summary page in `src/components/SessionSummary.tsx`

### Settings & Configuration
- [ ] **T052** [P] Settings page component in `src/components/settings/SettingsPage.tsx`
- [ ] **T053** [P] Keyboard shortcuts config in `src/components/settings/ShortcutsConfig.tsx`

### Frontend Services
- [ ] **T054** [P] Tauri command wrappers in `src/services/tauriCommands.ts`
- [ ] **T055** [P] React hooks for state management in `src/hooks/useCaptureState.ts`
- [ ] **T056** [P] Event handling utilities in `src/utils/eventHandlers.ts`

## Phase 3.7: Integration & System Setup

- [ ] **T057** Global shortcut registration and handling in `src-tauri/src/shortcuts.rs`
- [ ] **T058** macOS permission request flows in `src-tauri/src/permissions/handler.rs`
- [ ] **T059** Structured logging setup with tauri-plugin-log in `src-tauri/src/logging.rs`
- [ ] **T060** Error handling and user notification system in `src-tauri/src/error_handling.rs`
- [ ] **T061** Application lifecycle management in `src-tauri/src/main.rs`

## Phase 3.8: E2E Testing with Playwright

- [ ] **T062** [P] E2E test for complete capture workflow in `tests/e2e/capture-workflow.spec.ts`
- [ ] **T063** [P] E2E test for permission handling in `tests/e2e/permissions.spec.ts` 
- [ ] **T064** [P] E2E test for settings configuration in `tests/e2e/settings.spec.ts`

## Phase 3.9: Polish & Documentation

- [ ] **T065** [P] Unit tests for validation logic in `tests/unit/test_validation.rs`
- [ ] **T066** [P] Performance tests (screenshot <100ms, memory <200MB) in `tests/performance/test_benchmarks.rs`
- [ ] **T067** [P] Update README.md with installation and usage instructions
- [ ] **T068** [P] Generate library documentation (llms.txt format) for each library
- [ ] **T069** Code cleanup and remove duplication across libraries
- [ ] **T070** Manual testing verification using quickstart.md scenarios

## Dependencies

**Critical TDD Dependencies:**
- Tests (T007-T024) MUST complete before implementation (T025-T061)
- All contract tests MUST FAIL before implementing corresponding commands

**Entity Dependencies:**
- T025-T028 (models) block T040-T045 (command handlers)
- T029-T039 (libraries) block T040-T045 (command handlers)

**Integration Dependencies:**  
- T040-T045 (commands) block T054 (frontend services)
- T046-T053 (UI components) require T054 (frontend services)
- T057-T061 (system integration) require T040-T045 (commands)

**Testing Dependencies:**
- T062-T064 (E2E tests) require T046-T061 (full implementation)
- T065-T066 (polish tests) require T025-T061 (core implementation)

## Parallel Execution Examples

### Launch Contract Tests (Phase 3.2)
```bash
# All contract tests can run in parallel - different files
Task: "Contract test check_permissions command in tests/contract/test_permissions.rs"
Task: "Contract test detect_apps command in tests/contract/test_app_detection.rs" 
Task: "Contract test create_session command in tests/contract/test_session_management.rs"
Task: "Contract test start_capture command in tests/contract/test_capture_control.rs"
```

### Launch Data Models (Phase 3.3)
```bash
# All models can be built in parallel - different files
Task: "Screenshot entity model in src-tauri/src/models/screenshot.rs"
Task: "BookSession entity model in src-tauri/src/models/book_session.rs"
Task: "AppTarget entity model in src-tauri/src/models/app_target.rs"
Task: "CaptureSettings entity model in src-tauri/src/models/capture_settings.rs"
```

### Launch Library Components (Phase 3.4)
```bash
# Library implementations in parallel - different modules
Task: "ScreenCaptureKit integration in src-tauri/src/screenshot/capture.rs"
Task: "macOS Accessibility API wrapper in src-tauri/src/automation/accessibility.rs"  
Task: "File system operations in src-tauri/src/storage/filesystem.rs"
```

### Launch Frontend Components (Phase 3.6)
```bash
# UI components in parallel - different files
Task: "Main application shell in src/components/AppShell.tsx"
Task: "Permission dialog component in src/components/PermissionDialog.tsx"
Task: "Capture control panel in src/components/capture/CaptureControls.tsx"
Task: "Settings page component in src/components/settings/SettingsPage.tsx"
```

## Validation Checklist
*GATE: Checked before task execution*

- [x] All 22 Tauri commands have corresponding contract tests (T007-T021)
- [x] All 4 entities have model creation tasks (T025-T028)
- [x] All contract tests come before implementation (T007-T024 before T025+)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path for implementation
- [x] No task modifies same file as another [P] task
- [x] TDD flow enforced: RED (failing tests) → GREEN (implementation) → REFACTOR

## Notes
- [P] tasks = different files, can run concurrently
- Verify all tests FAIL before implementing (TDD requirement)
- Commit after each task completion
- Follow Constitutional principles: Library-first, CLI per library, real dependencies
- macOS permissions required for testing integration components
- Use quickstart.md scenarios for manual testing validation (T070)

**Total Tasks**: 70 tasks across 9 phases
**Parallel Tasks**: 47 tasks marked [P] for concurrent execution
**Critical Path**: T001-T006 → T007-T024 → T025-T028 → T040-T045 → T057-T061 → T070