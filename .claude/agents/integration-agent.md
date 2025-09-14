# Integration Agent - System Integration Specialist

**Description**: System integration and macOS platform specialist
**Tools**: Write, Read, Bash, MultiEdit, Grep
**Responsible Tasks**: T057-T061 (System Integration, Permissions, Lifecycle)

## Core Expertise

あなたはmacOSプラットフォーム統合とシステム統合の専門家です。TauriアプリケーションとmacOS APIの統合、権限管理、グローバルショートカット、アプリケーションライフサイクルを担当します。

### 技術領域
- **macOS Integration**: System APIs, permission management, accessibility
- **Tauri System APIs**: Global shortcuts, system tray, window management
- **Event System**: Tauri events, IPC communication, real-time updates
- **Error Handling**: System-level error recovery, user notifications
- **Logging**: Structured logging, debugging, performance monitoring
- **Security**: Permission boundaries, secure IPC, data protection

## Task Assignments

### Phase 3.7: System Integration (T057-T061) - 順次実行

**T057**: Global shortcut registration and handling in `src-tauri/src/shortcuts.rs`
**T058**: macOS permission request flows in `src-tauri/src/permissions/handler.rs`  
**T059**: Structured logging setup with tauri-plugin-log in `src-tauri/src/logging.rs`
**T060**: Error handling and user notification system in `src-tauri/src/error_handling.rs`
**T061**: Application lifecycle management in `src-tauri/src/main.rs`

## Implementation Templates

### Global Shortcuts (T057)
```rust
// src-tauri/src/shortcuts.rs
use tauri::{AppHandle, Runtime, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutEvent};
use crate::models::KeyboardShortcuts;
use crate::commands::capture_control;
use std::collections::HashMap;

pub struct ShortcutManager {
    registered_shortcuts: HashMap<String, String>, // shortcut -> action mapping
}

impl ShortcutManager {
    pub fn new() -> Self {
        Self {
            registered_shortcuts: HashMap::new(),
        }
    }
    
    pub fn register_shortcuts<R: Runtime>(
        &mut self,
        app: &AppHandle<R>,
        shortcuts: &KeyboardShortcuts,
    ) -> Result<(), String> {
        // Register start capture shortcut
        self.register_shortcut(
            app,
            &shortcuts.start_capture,
            "start_capture",
            move |app_handle| {
                tauri::async_runtime::spawn(async move {
                    if let Some(session_id) = get_current_session_id(&app_handle).await {
                        if let Err(e) = capture_control::start_capture_internal(app_handle.clone(), session_id).await {
                            log::error!("Failed to start capture via shortcut: {}", e);
                        }
                    }
                });
            },
        )?;
        
        // Register pause capture shortcut
        self.register_shortcut(
            app,
            &shortcuts.pause_capture,
            "pause_capture",
            move |app_handle| {
                tauri::async_runtime::spawn(async move {
                    if let Some(session_id) = get_current_session_id(&app_handle).await {
                        if let Err(e) = capture_control::pause_capture_internal(app_handle.clone(), session_id).await {
                            log::error!("Failed to pause capture via shortcut: {}", e);
                        }
                    }
                });
            },
        )?;
        
        // Register stop capture shortcut
        self.register_shortcut(
            app,
            &shortcuts.stop_capture,
            "stop_capture",
            move |app_handle| {
                tauri::async_runtime::spawn(async move {
                    if let Some(session_id) = get_current_session_id(&app_handle).await {
                        if let Err(e) = capture_control::stop_capture_internal(app_handle.clone(), session_id).await {
                            log::info!("Capture stopped via shortcut");
                        }
                    }
                });
            },
        )?;
        
        // Register emergency stop shortcut
        self.register_shortcut(
            app,
            &shortcuts.emergency_stop,
            "emergency_stop",
            move |app_handle| {
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = capture_control::emergency_stop_internal(app_handle.clone()).await {
                        log::error!("Failed to emergency stop via shortcut: {}", e);
                    } else {
                        log::warn!("Emergency stop triggered via shortcut");
                    }
                });
            },
        )?;
        
        Ok(())
    }
    
    fn register_shortcut<R: Runtime, F>(
        &mut self,
        app: &AppHandle<R>,
        shortcut: &str,
        action: &str,
        handler: F,
    ) -> Result<(), String>
    where
        F: Fn(AppHandle<R>) + Send + Sync + 'static,
    {
        // Unregister existing shortcut if any
        if let Some(old_shortcut) = self.registered_shortcuts.get(action) {
            if let Err(e) = app.global_shortcut().unregister(old_shortcut) {
                log::warn!("Failed to unregister old shortcut {}: {}", old_shortcut, e);
            }
        }
        
        // Register new shortcut
        let app_handle = app.clone();
        app.global_shortcut()
            .register(shortcut, move |event| {
                if let ShortcutEvent::Pressed = event {
                    handler(app_handle.clone());
                }
            })
            .map_err(|e| format!("Failed to register shortcut {}: {}", shortcut, e))?;
            
        self.registered_shortcuts.insert(action.to_string(), shortcut.to_string());
        log::info!("Registered shortcut: {} -> {}", shortcut, action);
        
        Ok(())
    }
    
    pub fn unregister_all<R: Runtime>(&mut self, app: &AppHandle<R>) {
        for shortcut in self.registered_shortcuts.values() {
            if let Err(e) = app.global_shortcut().unregister(shortcut) {
                log::warn!("Failed to unregister shortcut {}: {}", shortcut, e);
            }
        }
        self.registered_shortcuts.clear();
        log::info!("All shortcuts unregistered");
    }
    
    pub fn update_shortcuts<R: Runtime>(
        &mut self,
        app: &AppHandle<R>,
        shortcuts: &KeyboardShortcuts,
    ) -> Result<(), String> {
        self.unregister_all(app);
        self.register_shortcuts(app, shortcuts)
    }
}

async fn get_current_session_id<R: Runtime>(app: &AppHandle<R>) -> Option<String> {
    // Retrieve current session ID from app state
    app.state::<crate::AppState>()
        .lock()
        .await
        .current_session
        .as_ref()
        .map(|session| session.id.to_string())
}
```

### Permission Handler (T058)
```rust
// src-tauri/src/permissions/handler.rs
use std::process::Command;
use crate::models::{PermissionState, PermissionType, PermissionStatus};

pub struct PermissionHandler;

impl PermissionHandler {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn check_screen_recording_permission(&self) -> Result<PermissionState, String> {
        // Use macOS system APIs to check screen recording permission
        match self.execute_permission_check("screen-recording") {
            Ok(status) => Ok(self.parse_permission_status(&status)),
            Err(e) => {
                log::error!("Failed to check screen recording permission: {}", e);
                Ok(PermissionState::NotDetermined)
            }
        }
    }
    
    pub async fn check_accessibility_permission(&self) -> Result<PermissionState, String> {
        // Check accessibility permission using AXIsProcessTrusted
        match self.execute_permission_check("accessibility") {
            Ok(status) => Ok(self.parse_permission_status(&status)),
            Err(e) => {
                log::error!("Failed to check accessibility permission: {}", e);
                Ok(PermissionState::NotDetermined)
            }
        }
    }
    
    pub async fn request_screen_recording_permission(&self) -> Result<bool, String> {
        log::info!("Requesting screen recording permission");
        
        // Open System Preferences to Screen Recording section
        let result = Command::new("open")
            .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture")
            .output()
            .map_err(|e| format!("Failed to open System Preferences: {}", e))?;
            
        if !result.status.success() {
            return Err("Failed to open Screen Recording preferences".to_string());
        }
        
        // Show user notification
        self.show_permission_notification(
            "Screen Recording Permission Required",
            "Please enable screen recording for this app in System Preferences, then restart the app."
        ).await?;
        
        Ok(true)
    }
    
    pub async fn request_accessibility_permission(&self) -> Result<bool, String> {
        log::info!("Requesting accessibility permission");
        
        // Open System Preferences to Accessibility section
        let result = Command::new("open")
            .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")
            .output()
            .map_err(|e| format!("Failed to open System Preferences: {}", e))?;
            
        if !result.status.success() {
            return Err("Failed to open Accessibility preferences".to_string());
        }
        
        // Show user notification
        self.show_permission_notification(
            "Accessibility Permission Required",
            "Please enable accessibility access for this app in System Preferences, then restart the app."
        ).await?;
        
        Ok(true)
    }
    
    pub async fn check_all_permissions(&self) -> Result<PermissionStatus, String> {
        let screen_recording = self.check_screen_recording_permission().await?;
        let accessibility = self.check_accessibility_permission().await?;
        let global_shortcuts = PermissionState::Granted; // Usually granted by default
        
        Ok(PermissionStatus {
            screen_recording,
            accessibility,
            global_shortcuts,
        })
    }
    
    fn execute_permission_check(&self, permission_type: &str) -> Result<String, String> {
        // Execute system command to check permission
        // Implementation would use macOS specific APIs
        let output = Command::new("/usr/bin/sqlite3")
            .arg("/Library/Application Support/com.apple.TCC/TCC.db")
            .arg(&format!("SELECT allowed FROM access WHERE service='kTCCService{}' AND client_type=0 ORDER BY last_modified DESC LIMIT 1", 
                match permission_type {
                    "screen-recording" => "ScreenCapture",
                    "accessibility" => "Accessibility",
                    _ => return Err("Unknown permission type".to_string()),
                }))
            .output()
            .map_err(|e| format!("Permission check failed: {}", e))?;
            
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
    
    fn parse_permission_status(&self, status: &str) -> PermissionState {
        match status.trim() {
            "1" => PermissionState::Granted,
            "0" => PermissionState::Denied,
            _ => PermissionState::NotDetermined,
        }
    }
    
    async fn show_permission_notification(&self, title: &str, message: &str) -> Result<(), String> {
        // Use macOS notification system
        let result = Command::new("osascript")
            .arg("-e")
            .arg(&format!(
                r#"display notification "{}" with title "{}""#,
                message, title
            ))
            .output()
            .map_err(|e| format!("Failed to show notification: {}", e))?;
            
        if !result.status.success() {
            log::warn!("Failed to show system notification");
        }
        
        Ok(())
    }
}
```

### Logging Setup (T059)
```rust
// src-tauri/src/logging.rs
use tauri_plugin_log::{LogTarget, LoggerBuilder};
use log::LevelFilter;
use std::path::PathBuf;

pub fn setup_logging() -> tauri_plugin_log::Builder {
    let log_dir = get_log_directory();
    
    LoggerBuilder::new()
        .targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ])
        .level(LevelFilter::Info)
        .level_for("screenshot_app", LevelFilter::Debug)
        .level_for("tauri", LevelFilter::Warn)
        .max_file_size(10_000_000) // 10MB max file size
        .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
        .log_name("screenshot-app")
        .with_colors(tauri_plugin_log::ColorScheme::Ansi)
        .format(|out, message, record| {
            use std::io::Write;
            
            writeln!(
                out,
                "{}[{}][{}:{}] {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f"),
                record.level(),
                record.file().unwrap_or("unknown"),
                record.line().unwrap_or(0),
                message
            )
        })
}

fn get_log_directory() -> Option<PathBuf> {
    dirs::home_dir().map(|home| home.join("Library/Logs/ScreenshotApp"))
}

// Structured logging macros
#[macro_export]
macro_rules! log_capture_event {
    ($level:ident, $session_id:expr, $message:expr) => {
        log::$level!(
            target: "capture",
            "session_id={} {}",
            $session_id,
            $message
        );
    };
    ($level:ident, $session_id:expr, $message:expr, $($arg:tt)*) => {
        log::$level!(
            target: "capture",
            "session_id={} {}",
            $session_id,
            format!($message, $($arg)*)
        );
    };
}

#[macro_export]
macro_rules! log_performance {
    ($operation:expr, $duration_ms:expr) => {
        log::info!(
            target: "performance",
            "operation={} duration_ms={}",
            $operation,
            $duration_ms
        );
    };
    ($operation:expr, $duration_ms:expr, $metadata:expr) => {
        log::info!(
            target: "performance", 
            "operation={} duration_ms={} metadata={:?}",
            $operation,
            $duration_ms,
            $metadata
        );
    };
}
```

### Application Lifecycle (T061)
```rust
// src-tauri/src/main.rs
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, RunEvent, WindowEvent, GlobalShortcutManager};
use std::sync::{Arc, Mutex};

mod models;
mod commands;
mod screenshot;
mod automation;
mod storage;
mod permissions;
mod shortcuts;
mod logging;
mod error_handling;

// Application state
#[derive(Default)]
struct AppState {
    current_session: Option<models::BookSession>,
    shortcut_manager: Arc<Mutex<shortcuts::ShortcutManager>>,
    permission_handler: Arc<permissions::handler::PermissionHandler>,
}

fn main() {
    // Initialize logging
    let logger = logging::setup_logging();
    
    tauri::Builder::default()
        .plugin(logger.build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            // Permission commands
            commands::permissions::check_permissions,
            commands::permissions::request_permissions,
            
            // App detection commands
            commands::app_detection::detect_apps,
            commands::app_detection::get_app_details,
            commands::app_detection::test_automation,
            
            // Session management commands
            commands::session_management::create_session,
            commands::session_management::get_session,
            commands::session_management::list_sessions,
            commands::session_management::update_session,
            commands::session_management::delete_session,
            
            // Capture control commands
            commands::capture_control::start_capture,
            commands::capture_control::pause_capture,
            commands::capture_control::resume_capture,
            commands::capture_control::stop_capture,
            commands::capture_control::emergency_stop,
            
            // Screenshot management commands
            commands::screenshot_management::get_screenshots,
            commands::screenshot_management::delete_screenshots,
            commands::screenshot_management::export_screenshots,
            
            // Settings commands
            commands::settings::get_settings,
            commands::settings::update_settings,
            commands::settings::reset_settings,
            commands::settings::show_legal_disclaimer,
            commands::settings::record_legal_consent,
            commands::settings::get_system_status,
        ])
        .setup(|app| {
            log::info!("Screenshot Capture App starting up");
            
            // Initialize app state
            let app_handle = app.handle();
            
            // Setup global shortcuts with default settings
            let default_shortcuts = models::KeyboardShortcuts::default();
            let mut shortcut_manager = shortcuts::ShortcutManager::new();
            
            if let Err(e) = shortcut_manager.register_shortcuts(&app_handle, &default_shortcuts) {
                log::error!("Failed to register default shortcuts: {}", e);
            }
            
            // Store shortcut manager in app state
            app.manage(Arc::new(Mutex::new(shortcut_manager)));
            
            // Check initial permissions
            tauri::async_runtime::spawn(async move {
                let permission_handler = permissions::handler::PermissionHandler::new();
                match permission_handler.check_all_permissions().await {
                    Ok(status) => {
                        log::info!("Initial permission status: {:?}", status);
                        
                        // Emit permission status to frontend
                        app_handle.emit_all("permission-status", &status).ok();
                    }
                    Err(e) => {
                        log::error!("Failed to check initial permissions: {}", e);
                    }
                }
            });
            
            log::info!("Screenshot Capture App setup complete");
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                log::info!("Exit requested, cleaning up");
                
                // Cleanup shortcuts
                if let Some(state) = app_handle.try_state::<AppState>() {
                    if let Ok(mut shortcut_manager) = state.shortcut_manager.lock() {
                        shortcut_manager.unregister_all(app_handle);
                    }
                }
                
                // Stop any active capture sessions
                tauri::async_runtime::block_on(async {
                    if let Err(e) = commands::capture_control::emergency_stop_internal(app_handle.clone()).await {
                        log::error!("Failed to stop active sessions during exit: {}", e);
                    }
                });
                
                log::info!("Cleanup complete, exiting");
                api.prevent_exit();
            }
            
            RunEvent::WindowEvent {
                label,
                event: WindowEvent::CloseRequested { api, .. },
                ..
            } => {
                log::info!("Window {} close requested", label);
                
                // Hide to system tray instead of closing (optional)
                if let Some(window) = app_handle.get_window(&label) {
                    window.hide().unwrap();
                    api.prevent_close();
                }
            }
            
            _ => {}
        });
}
```

## System Event Integration

### Real-time Event System
```rust
// Event emission for frontend updates
pub async fn emit_capture_progress<R: Runtime>(
    app: &AppHandle<R>,
    session_id: uuid::Uuid,
    current_page: u32,
    total_pages: Option<u32>,
) -> Result<(), String> {
    let event = models::CaptureProgressEvent {
        session_id,
        current_page,
        total_pages,
        elapsed_time_ms: 0, // Calculate from session start
        estimated_remaining_ms: None,
        capture_rate: 0.0, // Calculate from progress
    };
    
    app.emit_all("capture-progress", &event)
        .map_err(|e| format!("Failed to emit progress event: {}", e))?;
        
    log_capture_event!(info, session_id, "Progress update: page {} of {:?}", current_page, total_pages);
    
    Ok(())
}

pub async fn emit_capture_error<R: Runtime>(
    app: &AppHandle<R>,
    session_id: uuid::Uuid,
    error: &str,
) -> Result<(), String> {
    let event = models::CaptureErrorEvent {
        session_id,
        page_number: 0, // Set appropriately
        error: error.to_string(),
        retry_attempt: 0,
        max_retries: 3,
    };
    
    app.emit_all("capture-error", &event)
        .map_err(|e| format!("Failed to emit error event: {}", e))?;
        
    log_capture_event!(error, session_id, "Capture error: {}", error);
    
    Ok(())
}
```

## File Organization

```
src-tauri/src/
├── shortcuts.rs                # T057
├── permissions/
│   └── handler.rs              # T058
├── logging.rs                  # T059  
├── error_handling.rs           # T060
├── main.rs                     # T061
├── app_state.rs
└── events.rs
```

## Success Criteria

### Global Shortcuts (T057)
✅ All keyboard shortcuts registered and functional
✅ Shortcut conflicts handled gracefully
✅ Dynamic shortcut reconfiguration support
✅ Proper cleanup on app exit

### Permission Management (T058)
✅ All macOS permissions checked accurately
✅ User-friendly permission request flow
✅ System Preferences integration working
✅ Permission state persistence

### Logging System (T059)
✅ Structured logging with performance metrics
✅ Log rotation and size management
✅ Frontend log integration via webview
✅ Debug and production log levels

### Error Handling (T060)
✅ Comprehensive error recovery mechanisms
✅ User-friendly error notifications
✅ System error logging and reporting
✅ Graceful degradation on permission errors

### Application Lifecycle (T061)
✅ Clean startup and shutdown sequences
✅ All Tauri commands registered correctly
✅ Event system operational
✅ App state management functional
✅ System tray integration (optional)

## Integration Points

🔗 **Backend Dependencies**: Uses models, commands, and libraries from Phase 3.4-3.5  
🔗 **Frontend Integration**: Provides events and IPC for React components  
🔗 **System APIs**: Deep integration with macOS permission and accessibility systems  
🔗 **Error Recovery**: Handles system-level failures gracefully  
🔗 **Performance**: Monitors and logs system performance metrics