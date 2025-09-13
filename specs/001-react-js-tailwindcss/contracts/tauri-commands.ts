/**
 * Tauri Command Contracts for Automatic Book Screenshot Application
 * 
 * This file defines TypeScript interfaces for all Tauri commands
 * used in the frontend-backend communication.
 * 
 * Generated: 2025-09-13
 * Spec Reference: ../spec.md
 * Data Model: ../data-model.md
 */

// ============================================================================
// Core Data Types
// ============================================================================

export interface Screenshot {
  id: string;
  filePath: string;
  pageNumber: number;
  timestamp: string; // ISO 8601 format
  bookSessionId: string;
  fileSizeBytes: number;
  imageWidth: number;
  imageHeight: number;
  captureDurationMs: number;
  metadata: ScreenshotMetadata;
}

export interface ScreenshotMetadata {
  displayScale: number;
  colorSpace: string;
  checksum: string;
}

export interface BookSession {
  id: string;
  bookTitle: string;
  startTime: string; // ISO 8601 format
  endTime?: string; // ISO 8601 format
  status: SessionStatus;
  targetApp: AppTarget;
  settings: CaptureSettings;
  outputDirectory: string;
  totalPagesCaptured: number;
  totalPagesEstimated?: number;
  lastPageCaptured: number;
  errorCount: number;
  sessionSummary?: SessionSummary;
}

export type SessionStatus = 
  | 'Initializing'
  | 'WaitingForStart'
  | 'Capturing'
  | 'Paused'
  | 'Completed'
  | 'Cancelled'
  | 'Failed';

export interface SessionSummary {
  totalDurationMs: number;
  pagesPerMinute: number;
  averageCaptureTimeMs: number;
  totalFileSizeMb: number;
  errorRate: number;
}

export interface AppTarget {
  id: string;
  appName: string;
  bundleIdentifier: string;
  processId: number;
  windowId: number;
  windowTitle: string;
  detectionTime: string; // ISO 8601 format
  automationStrategy: AutomationStrategy;
  lastInteraction: string; // ISO 8601 format
  isActive: boolean;
}

export type AutomationStrategy = 
  | { type: 'KeyboardEvents'; pageForwardKey: string; pageBackwardKey: string; modifierKeys: string[] }
  | { type: 'AccessibilityAPI'; forwardAction: string; backwardAction: string }
  | { type: 'AppleScript'; forwardScript: string; backwardScript: string };

export interface CaptureSettings {
  pageTurnDelayMs: number;
  screenshotFormat: ImageFormat;
  filenamePattern: string;
  autoDetectCompletion: boolean;
  maxCaptureAttempts: number;
  keyboardShortcuts: KeyboardShortcuts;
  storageSettings: StorageSettings;
}

export type ImageFormat = { type: 'PNG'; compressionLevel: number };

export interface KeyboardShortcuts {
  startCapture: string; // Global shortcut string (e.g., "CmdOrCtrl+Shift+S")
  pauseCapture: string;
  stopCapture: string;
  emergencyStop: string;
}

export interface StorageSettings {
  baseDirectory: string;
  organizeByDate: boolean;
  maxDiskUsageMb?: number;
  cleanupFailedSessions: boolean;
}

// ============================================================================
// Permission Management Commands
// ============================================================================

/**
 * Check current permission status for required macOS permissions
 */
export interface CheckPermissionsCommand {
  command: 'check_permissions';
  args: {};
  returns: PermissionStatus;
}

export interface PermissionStatus {
  screenRecording: PermissionState;
  accessibility: PermissionState;
  globalShortcuts: PermissionState;
}

export type PermissionState = 'granted' | 'denied' | 'notDetermined';

/**
 * Request required permissions from macOS
 */
export interface RequestPermissionsCommand {
  command: 'request_permissions';
  args: {
    permissionTypes: PermissionType[];
  };
  returns: PermissionRequestResult;
}

export type PermissionType = 'screenRecording' | 'accessibility' | 'globalShortcuts';

export interface PermissionRequestResult {
  success: boolean;
  grantedPermissions: PermissionType[];
  deniedPermissions: PermissionType[];
  error?: string;
}

// ============================================================================
// Application Detection Commands
// ============================================================================

/**
 * Scan for supported e-book applications
 */
export interface DetectAppsCommand {
  command: 'detect_apps';
  args: {};
  returns: AppTarget[];
}

/**
 * Get details about a specific application
 */
export interface GetAppDetailsCommand {
  command: 'get_app_details';
  args: {
    processId: number;
  };
  returns: AppTarget | null;
}

/**
 * Test automation capability for an application
 */
export interface TestAutomationCommand {
  command: 'test_automation';
  args: {
    appTargetId: string;
    testType: 'keyboardEvent' | 'accessibility' | 'appleScript';
  };
  returns: AutomationTestResult;
}

export interface AutomationTestResult {
  success: boolean;
  responseTimeMs: number;
  error?: string;
  recommendedStrategy?: AutomationStrategy;
}

// ============================================================================
// Session Management Commands
// ============================================================================

/**
 * Create a new screenshot session
 */
export interface CreateSessionCommand {
  command: 'create_session';
  args: {
    bookTitle: string;
    appTargetId: string;
    settings: CaptureSettings;
  };
  returns: BookSession;
}

/**
 * Get session details
 */
export interface GetSessionCommand {
  command: 'get_session';
  args: {
    sessionId: string;
  };
  returns: BookSession | null;
}

/**
 * List all sessions
 */
export interface ListSessionsCommand {
  command: 'list_sessions';
  args: {
    limit?: number;
    offset?: number;
    status?: SessionStatus;
  };
  returns: BookSession[];
}

/**
 * Update session settings
 */
export interface UpdateSessionCommand {
  command: 'update_session';
  args: {
    sessionId: string;
    settings: Partial<CaptureSettings>;
  };
  returns: BookSession;
}

/**
 * Delete a session and its files
 */
export interface DeleteSessionCommand {
  command: 'delete_session';
  args: {
    sessionId: string;
    deleteFiles: boolean;
  };
  returns: { success: boolean; error?: string };
}

// ============================================================================
// Capture Control Commands
// ============================================================================

/**
 * Start screenshot capture for a session
 */
export interface StartCaptureCommand {
  command: 'start_capture';
  args: {
    sessionId: string;
  };
  returns: { success: boolean; error?: string };
}

/**
 * Pause the current capture session
 */
export interface PauseCaptureCommand {
  command: 'pause_capture';
  args: {
    sessionId: string;
  };
  returns: { success: boolean; error?: string };
}

/**
 * Resume a paused capture session
 */
export interface ResumeCaptureCommand {
  command: 'resume_capture';
  args: {
    sessionId: string;
  };
  returns: { success: boolean; error?: string };
}

/**
 * Stop capture and complete the session
 */
export interface StopCaptureCommand {
  command: 'stop_capture';
  args: {
    sessionId: string;
  };
  returns: { success: boolean; sessionSummary?: SessionSummary; error?: string };
}

/**
 * Emergency stop - immediately halt all capture operations
 */
export interface EmergencyStopCommand {
  command: 'emergency_stop';
  args: {};
  returns: { success: boolean; stoppedSessions: string[]; error?: string };
}

// ============================================================================
// Screenshot Management Commands
// ============================================================================

/**
 * Get screenshots for a session
 */
export interface GetScreenshotsCommand {
  command: 'get_screenshots';
  args: {
    sessionId: string;
    limit?: number;
    offset?: number;
  };
  returns: Screenshot[];
}

/**
 * Delete specific screenshots
 */
export interface DeleteScreenshotsCommand {
  command: 'delete_screenshots';
  args: {
    screenshotIds: string[];
  };
  returns: { success: boolean; deletedCount: number; error?: string };
}

/**
 * Export screenshots to different format or location
 */
export interface ExportScreenshotsCommand {
  command: 'export_screenshots';
  args: {
    sessionId: string;
    outputDirectory: string;
    format: 'png' | 'jpeg' | 'pdf';
    quality?: number; // 1-100 for JPEG
  };
  returns: { success: boolean; exportPath: string; fileCount: number; error?: string };
}

// ============================================================================
// Settings Management Commands
// ============================================================================

/**
 * Get application settings
 */
export interface GetSettingsCommand {
  command: 'get_settings';
  args: {};
  returns: AppSettings;
}

export interface AppSettings {
  defaultCaptureSettings: CaptureSettings;
  globalShortcuts: KeyboardShortcuts;
  uiPreferences: UIPreferences;
  legalConsent: LegalConsent;
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  showProgressNotifications: boolean;
  minimizeToTray: boolean;
  startMinimized: boolean;
}

export interface LegalConsent {
  hasAcceptedTerms: boolean;
  acceptanceDate?: string; // ISO 8601 format
  version: string;
}

/**
 * Update application settings
 */
export interface UpdateSettingsCommand {
  command: 'update_settings';
  args: {
    settings: Partial<AppSettings>;
  };
  returns: AppSettings;
}

/**
 * Reset settings to defaults
 */
export interface ResetSettingsCommand {
  command: 'reset_settings';
  args: {};
  returns: AppSettings;
}

// ============================================================================
// Legal Compliance Commands
// ============================================================================

/**
 * Show legal disclaimer and get user consent
 */
export interface ShowLegalDisclaimerCommand {
  command: 'show_legal_disclaimer';
  args: {};
  returns: { disclaimerText: string; version: string };
}

/**
 * Record user consent to legal terms
 */
export interface RecordLegalConsentCommand {
  command: 'record_legal_consent';
  args: {
    accepted: boolean;
    version: string;
  };
  returns: { success: boolean; error?: string };
}

// ============================================================================
// System Status Commands
// ============================================================================

/**
 * Get system status and health check
 */
export interface GetSystemStatusCommand {
  command: 'get_system_status';
  args: {};
  returns: SystemStatus;
}

export interface SystemStatus {
  version: string;
  platform: string;
  permissions: PermissionStatus;
  activeSessions: number;
  diskSpaceAvailable: number; // bytes
  memoryUsage: number; // bytes
  errors: SystemError[];
}

export interface SystemError {
  id: string;
  message: string;
  timestamp: string; // ISO 8601 format
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// ============================================================================
// Event Types (for Tauri event system)
// ============================================================================

export interface CaptureProgressEvent {
  sessionId: string;
  currentPage: number;
  totalPages?: number;
  elapsedTimeMs: number;
  estimatedRemainingMs?: number;
  captureRate: number; // pages per minute
}

export interface CaptureErrorEvent {
  sessionId: string;
  pageNumber: number;
  error: string;
  retryAttempt: number;
  maxRetries: number;
}

export interface SessionStatusEvent {
  sessionId: string;
  oldStatus: SessionStatus;
  newStatus: SessionStatus;
  timestamp: string; // ISO 8601 format
}

export interface PermissionChangeEvent {
  permissionType: PermissionType;
  oldState: PermissionState;
  newState: PermissionState;
}

// ============================================================================
// Union Type for All Commands
// ============================================================================

export type TauriCommand = 
  | CheckPermissionsCommand
  | RequestPermissionsCommand
  | DetectAppsCommand
  | GetAppDetailsCommand
  | TestAutomationCommand
  | CreateSessionCommand
  | GetSessionCommand
  | ListSessionsCommand
  | UpdateSessionCommand
  | DeleteSessionCommand
  | StartCaptureCommand
  | PauseCaptureCommand
  | ResumeCaptureCommand
  | StopCaptureCommand
  | EmergencyStopCommand
  | GetScreenshotsCommand
  | DeleteScreenshotsCommand
  | ExportScreenshotsCommand
  | GetSettingsCommand
  | UpdateSettingsCommand
  | ResetSettingsCommand
  | ShowLegalDisclaimerCommand
  | RecordLegalConsentCommand
  | GetSystemStatusCommand;

// ============================================================================
// Error Types
// ============================================================================

export interface TauriError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type TauriResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: TauriError;
};

// ============================================================================
// Utility Types for Frontend
// ============================================================================

export type CommandName = TauriCommand['command'];

export type CommandArgs<T extends CommandName> = Extract<TauriCommand, { command: T }>['args'];

export type CommandResult<T extends CommandName> = Extract<TauriCommand, { command: T }>['returns'];