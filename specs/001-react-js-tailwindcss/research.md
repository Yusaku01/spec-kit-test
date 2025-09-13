# Technical Research: Automatic Book Screenshot Application

**Generated**: 2025-09-13  
**Scope**: Phase 0 research for macOS desktop application  
**Spec Reference**: [spec.md](./spec.md)

## Research Summary

This document consolidates technical research for implementing a macOS desktop application that automates e-book screenshot capture using Tauri framework with React.js frontend and Rust backend.

## 1. Screenshot Capture Technology

### Decision: ScreenCaptureKit + Core Graphics Fallback
- **Primary**: ScreenCaptureKit API (macOS 12+)
- **Fallback**: Core Graphics CGDisplayCreateImage (macOS 10.15+)

### Rationale:
- **ScreenCaptureKit**: Modern, performant, better permission integration
- **Hardware acceleration**: Both APIs support GPU-accelerated capture
- **Permission handling**: ScreenCaptureKit integrates with Privacy & Security settings
- **Quality**: Lossless PNG capture with metadata support

### Alternatives Considered:
- **AVFoundation**: Overkill for static screenshots, video-oriented
- **NSWindow.dataWithPDF**: Application-specific, requires cooperation from target app
- **Metal Performance Shaders**: Too low-level, unnecessary complexity

### Implementation Pattern:
```rust
use screencapturekit::*;

async fn capture_display() -> Result<CGImage, Error> {
    let content = SCShareableContent::current().await?;
    let display = content.displays.first().unwrap();
    
    let filter = SCContentFilter::new(display);
    let config = SCStreamConfiguration::new();
    
    SCScreenshotManager::capture_image(&filter, &config).await
}
```

## 2. macOS Application Automation

### Decision: AXSwift + CGEvent for Keyboard Automation
- **Window Management**: AXSwift (Swift accessibility framework)
- **Keyboard Events**: Core Graphics CGEvent API
- **Permission**: macOS Accessibility API

### Rationale:
- **AXSwift**: High-level Swift wrapper, well-maintained
- **CGEvent**: Low-level keyboard simulation, reliable across apps
- **Cross-app automation**: Works with sandboxed and non-sandboxed apps
- **Kindle compatibility**: Tested with Kindle for Mac

### Alternatives Considered:
- **AppleScript**: Unreliable, app-dependent, deprecated patterns
- **NSAccessibility directly**: Lower-level, more complex error handling
- **Third-party automation tools**: External dependencies, licensing issues

### Implementation Pattern:
```rust
use objc::*;
use core_graphics::event::*;

fn send_page_turn() -> Result<(), Error> {
    let source = CGEventSource::new(CGEventSourceStateID::HIDSystemState)?;
    let key_down = CGEvent::new_keyboard_event(source, 0x7C, true)?; // Right arrow
    let key_up = CGEvent::new_keyboard_event(source, 0x7C, false)?;
    
    key_down.post(CGEventTapLocation::HID)?;
    key_up.post(CGEventTapLocation::HID)?;
    Ok(())
}
```

## 3. Cross-Platform Desktop Framework

### Decision: Tauri 1.5+ with React + TypeScript Frontend
- **Backend**: Rust with Tauri
- **Frontend**: React 18+ with TypeScript 5.0+
- **Styling**: TailwindCSS 3.0+
- **Build**: Vite for fast development

### Rationale:
- **Bundle size**: 3-10MB vs Electron's 80-120MB
- **Security**: Memory-safe Rust backend, sandboxed WebView
- **Performance**: Lower RAM usage, faster startup than Electron
- **React compatibility**: Full support with modern tooling
- **Rust requirement**: Perfect fit for user's tech stack preference

### Alternatives Considered:
- **Electron**: Larger bundle, higher resource usage, security concerns
- **Native Swift**: macOS-only, can't use React/TailwindCSS easily
- **Flutter Desktop**: Dart learning curve, less mature desktop support
- **Qt + Python**: Good cross-platform but doesn't meet React requirement

### Project Structure:
```
project/
├── src/                 # React frontend
│   ├── components/
│   ├── hooks/
│   └── services/
├── src-tauri/          # Rust backend
│   ├── src/
│   │   ├── commands/
│   │   ├── screenshot/
│   │   └── automation/
│   └── Cargo.toml
└── package.json
```

## 4. Global Hotkey Implementation

### Decision: tauri-plugin-global-shortcut
- **Plugin**: Official Tauri global shortcut plugin
- **Fallback**: Carbon API (HotKey framework) for advanced features

### Rationale:
- **Native integration**: Part of Tauri ecosystem
- **Cross-platform**: Works on macOS, Windows, Linux
- **Simple API**: Easy configuration and conflict avoidance
- **User customization**: Built-in shortcut registration system

### Alternatives Considered:
- **Carbon API directly**: More complex, macOS-only
- **NSEvent global monitoring**: Requires additional permissions
- **Third-party crates**: Smaller ecosystem, less maintenance

### Implementation Pattern:
```rust
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutEvent};

fn setup_shortcuts(app: &tauri::App) -> Result<(), Error> {
    app.global_shortcut().register("CmdOrCtrl+Shift+S", |event| {
        if let ShortcutEvent::Pressed = event {
            // Trigger screenshot capture
        }
    })?;
    Ok(())
}
```

## 5. DRM and Legal Handling

### Decision: Screen-Level Capture with User Consent
- **Approach**: Capture visible screen content only
- **Detection**: No active DRM bypass attempts
- **Legal**: User consent + disclaimer before first use

### Rationale:
- **Legal compliance**: Screen capture generally permitted for personal use
- **Technical simplicity**: No reverse engineering or DRM circumvention
- **User responsibility**: Clear disclaimers about terms of service
- **Fair use**: Personal archival typically covered

### Alternatives Considered:
- **Content detection**: Too complex, unreliable
- **API integration**: Amazon doesn't provide public APIs
- **OCR-based capture**: Lower quality, processing overhead

### Implementation Approach:
```rust
#[tauri::command]
async fn start_capture_with_consent() -> Result<String, String> {
    if !user_has_accepted_terms() {
        return Err("Legal terms must be accepted".to_string());
    }
    
    // Proceed with capture
    Ok("Capture started".to_string())
}
```

## 6. State Management and Progress Tracking

### Decision: React Context + Tauri Events
- **Frontend State**: React Context API for UI state
- **Backend Communication**: Tauri event system for progress updates
- **Persistence**: Local storage for settings, file system for sessions

### Rationale:
- **Real-time updates**: Tauri events for async progress
- **Type safety**: TypeScript interfaces for all communication
- **Simplicity**: No need for Redux/Zustand complexity
- **Performance**: Minimal overhead for desktop app use case

### Implementation Pattern:
```typescript
// Frontend context
const CaptureContext = createContext<CaptureState>({
  isCapturing: false,
  currentPage: 0,
  totalPages: 0,
  elapsedTime: 0
});

// Backend events
app.emit('capture-progress', {
  page: current_page,
  total: estimated_total,
  elapsed_ms: start_time.elapsed().as_millis()
});
```

## 7. Testing Strategy

### Decision: Multi-Level Testing with Real APIs
- **Contract Tests**: Tauri command interfaces
- **Integration Tests**: Real macOS APIs with test automation
- **E2E Tests**: Full workflow with mock applications
- **Unit Tests**: Individual library functions

### Rationale:
- **TDD compliance**: Tests written before implementation
- **Real dependencies**: Test against actual macOS APIs
- **CI/CD friendly**: Automated testing in macOS environments
- **Debugging**: Real API responses for troubleshooting

### Testing Tools:
- **Rust**: `cargo test` with `tokio-test` for async
- **Frontend**: Vitest + React Testing Library
- **Integration**: Tauri's testing framework
- **E2E**: Custom automation scripts

## 8. Performance Optimization

### Decision: Async Rust + Web Workers for Heavy Tasks
- **Screenshot capture**: Async Rust with tokio
- **File I/O**: Non-blocking filesystem operations
- **UI responsiveness**: Web Workers for background processing
- **Memory management**: Streaming large files, bounded queues

### Rationale:
- **60fps UI**: Non-blocking operations preserve responsiveness
- **Large files**: Streaming prevents memory overflow
- **Concurrent capture**: Multiple screenshots can be processed in parallel
- **Resource limits**: Bounded queues prevent memory exhaustion

### Performance Targets:
- **Screenshot capture**: <100ms per image
- **Memory usage**: <200MB peak
- **File I/O**: <50ms to save PNG to disk
- **UI responsiveness**: <16ms frame budget maintained

## Conclusion

The research validates the technical feasibility of the automatic book screenshot application using:

1. **Tauri framework** for optimal bundle size and performance
2. **ScreenCaptureKit** for modern, high-quality screenshot capture
3. **AXSwift + CGEvent** for reliable cross-application automation
4. **React + TypeScript** for maintainable, type-safe frontend development
5. **Official Tauri plugins** for global shortcuts and system integration

All technical requirements can be met within the constitutional constraints, with no significant architectural complexity or performance concerns identified.

**Next Phase**: Proceed to data model design and API contract definition.