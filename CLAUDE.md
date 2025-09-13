# Claude Code Development Context

**Project**: Automatic Book Screenshot Application  
**Tech Stack**: Tauri + React.js + TailwindCSS + Rust  
**Platform**: macOS 12+  
**Last Updated**: 2025-09-13

## Project Overview

Building a macOS desktop application that automatically captures screenshots of e-book pages (starting with Kindle) while navigating through books via keyboard automation. The app uses Tauri framework for optimal performance and security.

## Current Development Phase

**Status**: Phase 1 Complete - Design & Architecture  
**Next**: Run `/tasks` command to generate implementation tasks  
**Branch**: `001-react-js-tailwindcss`

## Architecture Summary

- **Frontend**: React 18+ with TypeScript 5.0+ and TailwindCSS 3.0+
- **Backend**: Rust 1.75+ with Tauri 1.5+
- **Screenshot**: ScreenCaptureKit API (macOS 12+)
- **Automation**: macOS Accessibility API + CGEvent
- **Storage**: Local filesystem with SQLite metadata
- **Global Shortcuts**: tauri-plugin-global-shortcut

## Key Files & Documentation

### Specification Documents
- `specs/001-react-js-tailwindcss/spec.md` - Complete feature specification
- `specs/001-react-js-tailwindcss/plan.md` - Implementation plan
- `specs/001-react-js-tailwindcss/research.md` - Technical research
- `specs/001-react-js-tailwindcss/data-model.md` - Data entities and relationships
- `specs/001-react-js-tailwindcss/quickstart.md` - Development setup guide

### API Contracts
- `specs/001-react-js-tailwindcss/contracts/tauri-commands.ts` - TypeScript interfaces
- `specs/001-react-js-tailwindcss/contracts/rust-types.rs` - Rust type definitions

## Core Data Entities

```rust
// Main entities from data-model.md
struct BookSession {
    id: Uuid,
    book_title: String,
    status: SessionStatus, // Capturing, Paused, Completed, etc.
    target_app: AppTarget,
    settings: CaptureSettings,
    // ... see data-model.md for complete definition
}

struct Screenshot {
    id: Uuid,
    file_path: PathBuf,
    page_number: u32,
    book_session_id: Uuid,
    // ... metadata and timing info
}

struct AppTarget {
    app_name: String, // "Kindle"
    bundle_identifier: String, // "com.amazon.Kindle"
    automation_strategy: AutomationStrategy,
    // ... process and window details
}
```

## Essential Tauri Commands

```typescript
// From contracts/tauri-commands.ts
interface CreateSessionCommand {
  command: 'create_session';
  args: { bookTitle: string; appTargetId: string; settings: CaptureSettings };
  returns: BookSession;
}

interface StartCaptureCommand {
  command: 'start_capture';
  args: { sessionId: string };
  returns: { success: boolean; error?: string };
}

// See contracts/ for complete API definitions
```

## Development Guidelines

### TDD Approach (Required)
1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Clean up code while keeping tests green
4. **Commit pattern**: test → implementation → refactor

### Project Structure
```
src/                 # React frontend
├── components/      # UI components (capture/, settings/, progress/)
├── hooks/          # React custom hooks
├── services/       # Tauri command wrappers
└── types/          # TypeScript definitions

src-tauri/          # Rust backend
├── src/
│   ├── commands/   # Tauri command handlers
│   ├── screenshot/ # Screenshot capture library
│   ├── automation/ # macOS automation library
│   └── storage/    # File management library
└── Cargo.toml

tests/
├── contract/       # API contract tests
├── integration/    # Cross-platform integration
└── e2e/           # End-to-end automation
```

### Technology-Specific Patterns

#### React + TypeScript
- Use functional components with hooks
- Implement custom hooks for Tauri commands
- Type all props and state with TypeScript
- Use React Context for global state (no Redux needed)

#### Tauri Integration
```rust
// Command handler pattern
#[tauri::command]
async fn create_session(
    app_handle: tauri::AppHandle,
    args: CreateSessionArgs,
) -> Result<BookSession, String> {
    // Implementation
}
```

```typescript
// Frontend service pattern
import { invoke } from '@tauri-apps/api/tauri';

export async function createSession(args: CreateSessionArgs): Promise<BookSession> {
  return await invoke('create_session', args);
}
```

#### macOS Integration
- Use ScreenCaptureKit for screenshots (with Core Graphics fallback)
- AXSwift + CGEvent for automation
- Handle permission requests gracefully
- Test on both Intel and Apple Silicon

## Current Implementation Status

### Phase 0: Research ✅
- Technology stack decisions documented
- macOS API patterns researched
- Performance and security considerations analyzed

### Phase 1: Design ✅
- Data model with 4 core entities defined
- 25+ Tauri commands specified with full type safety
- Project structure and testing strategy established
- Development environment documented

### Phase 2: Tasks (Next)
- Run `/tasks` command to generate implementation tasks
- Expected: 25-30 numbered, ordered tasks
- TDD approach: tests before implementation

## Common Development Tasks

### Running the App
```bash
cargo tauri dev           # Development with hot reload
cargo tauri build         # Production build
cargo test               # Run Rust tests
pnpm test               # Run frontend tests
```

### Key Dependencies
```toml
# Cargo.toml
[dependencies]
tauri = { version = "1.5", features = ["api-all"] }
screencapturekit = "0.2"
uuid = { version = "1.0", features = ["v4", "serde"] }
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
```

```json
// package.json key deps
{
  "dependencies": {
    "@tauri-apps/api": "^1.5.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "vitest": "^1.0.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## Performance & Security Notes

- **Bundle Size**: Targeting 3-10MB (vs Electron's 80-120MB)
- **Memory**: <200MB peak usage during capture
- **Permissions**: Screen Recording + Accessibility required
- **Legal**: User consent flow implemented for copyright compliance
- **Error Handling**: Graceful degradation for permission denied

## Testing Strategy

1. **Contract Tests**: Verify Tauri command interfaces match exactly
2. **Integration Tests**: Test with real macOS APIs (not mocked)
3. **E2E Tests with Playwright**: Full automation workflow with page object model
   - Complete user journeys from app launch to session completion
   - Permission dialogs and system integration testing
   - Visual regression testing with screenshots
   - Mock book applications for reliable testing
4. **Performance Tests**: Screenshot capture timing and memory usage

## Quick References

- **Troubleshooting**: See quickstart.md for common issues
- **API Reference**: All commands documented in contracts/
- **Data Model**: Complete entity relationships in data-model.md
- **Architecture**: Full technical decisions in research.md

## Next Development Steps

1. Run `/tasks` command to generate implementation roadmap
2. Set up project structure with `cargo tauri init`
3. Implement contract tests first (TDD requirement)
4. Build screenshot capture library
5. Add macOS automation capabilities
6. Create React UI components
7. Integration testing with real applications

---
*This context is maintained for AI development assistance. See quickstart.md for full development setup.*