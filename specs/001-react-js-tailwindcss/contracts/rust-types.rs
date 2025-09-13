/**
 * Rust Type Definitions for Automatic Book Screenshot Application
 * 
 * This file defines Rust structs and enums that correspond to the TypeScript
 * interfaces in tauri-commands.ts. These types are used in the Tauri backend.
 * 
 * Generated: 2025-09-13
 * Spec Reference: ../spec.md
 * Data Model: ../data-model.md
 * TypeScript Contract: ./tauri-commands.ts
 */

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use chrono::{DateTime, Utc};
use uuid::Uuid;

// ============================================================================
// Core Data Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Screenshot {
    pub id: Uuid,
    pub file_path: PathBuf,
    pub page_number: u32,
    pub timestamp: DateTime<Utc>,
    pub book_session_id: Uuid,
    pub file_size_bytes: u64,
    pub image_width: u32,
    pub image_height: u32,
    pub capture_duration_ms: u32,
    pub metadata: ScreenshotMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScreenshotMetadata {
    pub display_scale: f64,
    pub color_space: String,
    pub checksum: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookSession {
    pub id: Uuid,
    pub book_title: String,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub status: SessionStatus,
    pub target_app: AppTarget,
    pub settings: CaptureSettings,
    pub output_directory: PathBuf,
    pub total_pages_captured: u32,
    pub total_pages_estimated: Option<u32>,
    pub last_page_captured: u32,
    pub error_count: u32,
    pub session_summary: Option<SessionSummary>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SessionStatus {
    Initializing,
    WaitingForStart,
    Capturing,
    Paused,
    Completed,
    Cancelled,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionSummary {
    pub total_duration_ms: u64,
    pub pages_per_minute: f64,
    pub average_capture_time_ms: f64,
    pub total_file_size_mb: f64,
    pub error_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppTarget {
    pub id: Uuid,
    pub app_name: String,
    pub bundle_identifier: String,
    pub process_id: u32,
    pub window_id: u64,
    pub window_title: String,
    pub detection_time: DateTime<Utc>,
    pub automation_strategy: AutomationStrategy,
    pub last_interaction: DateTime<Utc>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AutomationStrategy {
    KeyboardEvents {
        page_forward_key: String,
        page_backward_key: String,
        modifier_keys: Vec<String>,
    },
    AccessibilityAPI {
        forward_action: String,
        backward_action: String,
    },
    AppleScript {
        forward_script: String,
        backward_script: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureSettings {
    pub page_turn_delay_ms: u32,
    pub screenshot_format: ImageFormat,
    pub filename_pattern: String,
    pub auto_detect_completion: bool,
    pub max_capture_attempts: u32,
    pub keyboard_shortcuts: KeyboardShortcuts,
    pub storage_settings: StorageSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ImageFormat {
    PNG { compression_level: u8 },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeyboardShortcuts {
    pub start_capture: String,
    pub pause_capture: String,
    pub stop_capture: String,
    pub emergency_stop: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageSettings {
    pub base_directory: PathBuf,
    pub organize_by_date: bool,
    pub max_disk_usage_mb: Option<u64>,
    pub cleanup_failed_sessions: bool,
}

// ============================================================================
// Permission Management Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionStatus {
    pub screen_recording: PermissionState,
    pub accessibility: PermissionState,
    pub global_shortcuts: PermissionState,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PermissionState {
    Granted,
    Denied,
    NotDetermined,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PermissionType {
    ScreenRecording,
    Accessibility,
    GlobalShortcuts,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionRequestResult {
    pub success: bool,
    pub granted_permissions: Vec<PermissionType>,
    pub denied_permissions: Vec<PermissionType>,
    pub error: Option<String>,
}

// ============================================================================
// Application Detection Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AutomationTestResult {
    pub success: bool,
    pub response_time_ms: u32,
    pub error: Option<String>,
    pub recommended_strategy: Option<AutomationStrategy>,
}

// ============================================================================
// Settings Management Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub default_capture_settings: CaptureSettings,
    pub global_shortcuts: KeyboardShortcuts,
    pub ui_preferences: UIPreferences,
    pub legal_consent: LegalConsent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UIPreferences {
    pub theme: Theme,
    pub show_progress_notifications: bool,
    pub minimize_to_tray: bool,
    pub start_minimized: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Theme {
    Light,
    Dark,
    System,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegalConsent {
    pub has_accepted_terms: bool,
    pub acceptance_date: Option<DateTime<Utc>>,
    pub version: String,
}

// ============================================================================
// System Status Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemStatus {
    pub version: String,
    pub platform: String,
    pub permissions: PermissionStatus,
    pub active_sessions: u32,
    pub disk_space_available: u64,
    pub memory_usage: u64,
    pub errors: Vec<SystemError>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemError {
    pub id: Uuid,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub severity: ErrorSeverity,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ErrorSeverity {
    Info,
    Warning,
    Error,
    Critical,
}

// ============================================================================
// Event Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureProgressEvent {
    pub session_id: Uuid,
    pub current_page: u32,
    pub total_pages: Option<u32>,
    pub elapsed_time_ms: u64,
    pub estimated_remaining_ms: Option<u64>,
    pub capture_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureErrorEvent {
    pub session_id: Uuid,
    pub page_number: u32,
    pub error: String,
    pub retry_attempt: u32,
    pub max_retries: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionStatusEvent {
    pub session_id: Uuid,
    pub old_status: SessionStatus,
    pub new_status: SessionStatus,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionChangeEvent {
    pub permission_type: PermissionType,
    pub old_state: PermissionState,
    pub new_state: PermissionState,
}

// ============================================================================
// Command Result Types
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandSuccess<T> {
    pub success: bool,
    pub data: Option<T>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandError {
    pub success: bool,
    pub error: String,
}

pub type CommandResult<T> = Result<T, String>;

// ============================================================================
// Command Argument Types
// ============================================================================

#[derive(Debug, Clone, Deserialize)]
pub struct CreateSessionArgs {
    pub book_title: String,
    pub app_target_id: Uuid,
    pub settings: CaptureSettings,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GetSessionArgs {
    pub session_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListSessionsArgs {
    pub limit: Option<u32>,
    pub offset: Option<u32>,
    pub status: Option<SessionStatus>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateSessionArgs {
    pub session_id: Uuid,
    pub settings: HashMap<String, serde_json::Value>, // Partial update
}

#[derive(Debug, Clone, Deserialize)]
pub struct DeleteSessionArgs {
    pub session_id: Uuid,
    pub delete_files: bool,
}

#[derive(Debug, Clone, Deserialize)]
pub struct StartCaptureArgs {
    pub session_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct PauseCaptureArgs {
    pub session_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ResumeCaptureArgs {
    pub session_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct StopCaptureArgs {
    pub session_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GetAppDetailsArgs {
    pub process_id: u32,
}

#[derive(Debug, Clone, Deserialize)]
pub struct TestAutomationArgs {
    pub app_target_id: Uuid,
    pub test_type: String, // "keyboardEvent" | "accessibility" | "appleScript"
}

#[derive(Debug, Clone, Deserialize)]
pub struct RequestPermissionsArgs {
    pub permission_types: Vec<PermissionType>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GetScreenshotsArgs {
    pub session_id: Uuid,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DeleteScreenshotsArgs {
    pub screenshot_ids: Vec<Uuid>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ExportScreenshotsArgs {
    pub session_id: Uuid,
    pub output_directory: PathBuf,
    pub format: String, // "png" | "jpeg" | "pdf"
    pub quality: Option<u8>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateSettingsArgs {
    pub settings: HashMap<String, serde_json::Value>, // Partial update
}

#[derive(Debug, Clone, Deserialize)]
pub struct RecordLegalConsentArgs {
    pub accepted: bool,
    pub version: String,
}

// ============================================================================
// Response Types
// ============================================================================

#[derive(Debug, Clone, Serialize)]
pub struct ExportScreenshotsResponse {
    pub success: bool,
    pub export_path: Option<PathBuf>,
    pub file_count: Option<u32>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DeleteResponse {
    pub success: bool,
    pub deleted_count: Option<u32>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct StopCaptureResponse {
    pub success: bool,
    pub session_summary: Option<SessionSummary>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergencyStopResponse {
    pub success: bool,
    pub stopped_sessions: Vec<Uuid>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct LegalDisclaimerResponse {
    pub disclaimer_text: String,
    pub version: String,
}

// ============================================================================
// Default Implementations
// ============================================================================

impl Default for CaptureSettings {
    fn default() -> Self {
        Self {
            page_turn_delay_ms: 2000,
            screenshot_format: ImageFormat::PNG { compression_level: 6 },
            filename_pattern: "page_{page:04d}_{timestamp}.png".to_string(),
            auto_detect_completion: true,
            max_capture_attempts: 3,
            keyboard_shortcuts: KeyboardShortcuts::default(),
            storage_settings: StorageSettings::default(),
        }
    }
}

impl Default for KeyboardShortcuts {
    fn default() -> Self {
        Self {
            start_capture: "CmdOrCtrl+Shift+S".to_string(),
            pause_capture: "CmdOrCtrl+Shift+P".to_string(),
            stop_capture: "CmdOrCtrl+Shift+Q".to_string(),
            emergency_stop: "CmdOrCtrl+Shift+Escape".to_string(),
        }
    }
}

impl Default for StorageSettings {
    fn default() -> Self {
        Self {
            base_directory: dirs::document_dir()
                .unwrap_or_else(|| PathBuf::from("~/Documents"))
                .join("BookScreenshots"),
            organize_by_date: true,
            max_disk_usage_mb: Some(10_000), // 10GB default limit
            cleanup_failed_sessions: true,
        }
    }
}

impl Default for UIPreferences {
    fn default() -> Self {
        Self {
            theme: Theme::System,
            show_progress_notifications: true,
            minimize_to_tray: false,
            start_minimized: false,
        }
    }
}

impl Default for LegalConsent {
    fn default() -> Self {
        Self {
            has_accepted_terms: false,
            acceptance_date: None,
            version: "1.0".to_string(),
        }
    }
}

// ============================================================================
// Validation Implementations
// ============================================================================

impl CaptureSettings {
    pub fn validate(&self) -> Result<(), String> {
        if self.page_turn_delay_ms < 500 || self.page_turn_delay_ms > 10_000 {
            return Err("Page turn delay must be between 500ms and 10,000ms".to_string());
        }
        
        if self.max_capture_attempts == 0 || self.max_capture_attempts > 10 {
            return Err("Max capture attempts must be between 1 and 10".to_string());
        }
        
        if self.filename_pattern.is_empty() {
            return Err("Filename pattern cannot be empty".to_string());
        }
        
        Ok(())
    }
}

impl BookSession {
    pub fn is_active(&self) -> bool {
        matches!(self.status, SessionStatus::Capturing | SessionStatus::Paused)
    }
    
    pub fn can_be_started(&self) -> bool {
        matches!(self.status, SessionStatus::WaitingForStart | SessionStatus::Paused)
    }
    
    pub fn can_be_paused(&self) -> bool {
        matches!(self.status, SessionStatus::Capturing)
    }
}