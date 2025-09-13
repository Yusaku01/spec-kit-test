# Implementation Plan: Automatic Book Screenshot Application

**Branch**: `001-react-js-tailwindcss` | **Date**: 2025-09-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-react-js-tailwindcss/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A desktop application for macOS that automatically captures screenshots of e-book pages (starting with Kindle) while navigating through books via keyboard automation. Uses Tauri framework with React.js frontend and Rust backend for optimal performance and security.

## Technical Context
**Language/Version**: Rust 1.75+ / TypeScript 5.0+ / React 18+
**Primary Dependencies**: Tauri 1.5+, ScreenCaptureKit (macOS 12+), AXSwift, KeyboardShortcuts, React Router
**Storage**: Local filesystem (~/Documents/BookScreenshots/)
**Testing**: cargo test (Rust), vitest (Frontend), tauri test (Integration), Playwright (E2E)
**Target Platform**: macOS 12+ (Monterey and later)
**Project Type**: single (desktop application)
**Performance Goals**: <100ms screenshot capture, <200MB memory usage, 2-second page intervals
**Constraints**: macOS accessibility permissions required, DRM content limitations, weekly permission re-auth
**Scale/Scope**: Single-user desktop app, thousands of screenshots per session, configurable automation

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (tauri desktop app only)
- Using framework directly? Yes (Tauri commands directly, no wrapper abstractions)
- Single data model? Yes (Screenshot, BookSession, AppTarget entities only)
- Avoiding patterns? Yes (direct API calls, minimal abstraction layers)

**Architecture**:
- EVERY feature as library? Yes - screenshot, automation, storage, ui libraries
- Libraries listed: 
  - screenshot-lib: ScreenCaptureKit integration + fallback
  - automation-lib: macOS accessibility API wrapper
  - storage-lib: File system operations + metadata
  - ui-lib: React components + TailwindCSS themes
- CLI per library: 
  - screenshot-cli: --capture --target --format
  - automation-cli: --send-key --find-window --list-apps
  - storage-cli: --save --list --cleanup
- Library docs: llms.txt format planned for each library

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes (tests written first, must fail)
- Git commits show tests before implementation? Yes (commit pattern: test → impl)
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes (actual macOS APIs, real file system)
- Integration tests for: Tauri commands, screenshot APIs, automation workflows
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:
- Structured logging included? Yes (tauri-plugin-log with JSON format)
- Frontend logs → backend? Yes (unified log stream via Tauri events)
- Error context sufficient? Yes (stack traces + system state)

**Versioning**:
- Version number assigned? 0.1.0 (MAJOR.MINOR.BUILD)
- BUILD increments on every change? Yes (automated via CI)
- Breaking changes handled? Yes (API versioning + migration guides)

## Project Structure

### Documentation (this feature)
```
specs/001-react-js-tailwindcss/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (SELECTED)
src/
├── components/          # React UI components
│   ├── capture/        # Screenshot UI
│   ├── settings/       # Configuration UI
│   └── progress/       # Status displays
├── services/           # Tauri command wrappers
├── hooks/              # React custom hooks
└── utils/              # Frontend utilities

src-tauri/
├── src/
│   ├── screenshot/     # Screenshot capture library
│   ├── automation/     # macOS automation library
│   ├── storage/        # File management library
│   ├── commands/       # Tauri command definitions
│   └── lib/           # Shared utilities
└── Cargo.toml

tests/
├── contract/          # Tauri API contract tests
├── integration/       # Cross-platform integration tests
└── e2e/              # End-to-end automation tests
```

**Structure Decision**: Option 1 (Single desktop application project)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - ScreenCaptureKit API integration patterns
   - macOS Accessibility API permissions and usage
   - Tauri global shortcut implementation
   - React state management for long-running processes
   - DRM detection and handling strategies

2. **Generate and dispatch research agents**:
   ```
   Task: "Research ScreenCaptureKit best practices for screenshot capture"
   Task: "Find macOS Accessibility API patterns for app automation"
   Task: "Investigate Tauri global shortcut plugin usage"
   Task: "Research React patterns for background task management"
   Task: "Find legal approaches to DRM content handling"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical decisions documented

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Screenshot: filepath, timestamp, page_number, book_id, metadata
   - BookSession: book_title, start_time, end_time, total_pages, settings
   - AppTarget: app_name, window_id, process_id, automation_strategy

2. **Generate API contracts** from functional requirements:
   - Tauri commands for each user action
   - Event system for progress updates
   - Configuration management APIs
   - Output TypeScript interfaces to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per Tauri command
   - Assert request/response schemas with actual macOS APIs
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Complete screenshot automation workflow
   - Permission request and error handling
   - Configuration persistence and restoration

5. **Update CLAUDE.md incrementally**:
   - Add Tauri development context
   - Include macOS API patterns
   - Document testing approach for desktop apps
   - Keep under 150 lines for token efficiency

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each Tauri command → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent libraries)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations identified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*