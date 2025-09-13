/**
 * Playwright E2E Test Contracts for Automatic Book Screenshot Application
 * 
 * This file defines TypeScript interfaces and types specifically for
 * Playwright end-to-end testing of the Tauri application.
 * 
 * Generated: 2025-09-13
 * Spec Reference: ../spec.md
 * Testing Framework: Playwright + Tauri
 */

import { Page, Locator, test as base } from '@playwright/test';

// ============================================================================
// Page Object Model Interfaces
// ============================================================================

export interface MainPage {
  // Navigation elements
  settingsButton: Locator;
  helpButton: Locator;
  minimizeButton: Locator;
  closeButton: Locator;

  // Core functionality
  detectAppsButton: Locator;
  startCaptureButton: Locator;
  pauseCaptureButton: Locator;
  stopCaptureButton: Locator;
  emergencyStopButton: Locator;

  // Status indicators
  permissionStatus: Locator;
  captureStatus: Locator;
  progressIndicator: Locator;
  sessionInfo: Locator;

  // Actions
  clickDetectApps(): Promise<void>;
  startCapture(): Promise<void>;
  pauseCapture(): Promise<void>;
  stopCapture(): Promise<void>;
  emergencyStop(): Promise<void>;
  waitForPermissions(): Promise<void>;
}

export interface PermissionDialog {
  // Permission dialog elements
  dialogContainer: Locator;
  screenRecordingStatus: Locator;
  accessibilityStatus: Locator;
  globalShortcutsStatus: Locator;

  // Action buttons
  requestPermissionsButton: Locator;
  skipButton: Locator;
  retryButton: Locator;

  // Legal disclaimer
  legalDisclaimerText: Locator;
  acceptTermsCheckbox: Locator;
  acceptTermsButton: Locator;

  // Actions
  acceptLegalTerms(): Promise<void>;
  requestAllPermissions(): Promise<void>;
  waitForPermissionGrant(): Promise<void>;
}

export interface SettingsPage {
  // Settings categories
  captureSettingsTab: Locator;
  shortcutsSettingsTab: Locator;
  storageSettingsTab: Locator;
  advancedSettingsTab: Locator;

  // Capture settings
  pageTurnDelaySlider: Locator;
  pageTurnDelayInput: Locator;
  maxRetriesInput: Locator;
  autoDetectCompletionCheckbox: Locator;

  // Keyboard shortcuts
  startCaptureShortcut: Locator;
  pauseCaptureShortcut: Locator;
  stopCaptureShortcut: Locator;
  emergencyStopShortcut: Locator;

  // Storage settings
  baseDirectoryInput: Locator;
  browseDirectoryButton: Locator;
  organizeByDateCheckbox: Locator;
  maxDiskUsageInput: Locator;

  // Action buttons
  saveSettingsButton: Locator;
  resetToDefaultsButton: Locator;
  cancelButton: Locator;

  // Actions
  updatePageTurnDelay(delayMs: number): Promise<void>;
  updateShortcut(action: string, shortcut: string): Promise<void>;
  changeStorageDirectory(path: string): Promise<void>;
  saveSettings(): Promise<void>;
  resetToDefaults(): Promise<void>;
}

export interface AppDetectionPage {
  // App list
  appListContainer: Locator;
  appListItems: Locator;
  refreshAppsButton: Locator;
  noAppsFoundMessage: Locator;

  // App details
  appNameLabel: Locator;
  appVersionLabel: Locator;
  windowTitleLabel: Locator;
  automationStrategyLabel: Locator;

  // Test automation
  testAutomationButton: Locator;
  automationTestResult: Locator;

  // Actions
  selectApp(appName: string): Promise<void>;
  testAutomation(): Promise<boolean>;
  refreshAppList(): Promise<void>;
  waitForAppsDetected(): Promise<void>;
}

export interface CaptureProgressPage {
  // Progress information
  currentPageNumber: Locator;
  totalPagesEstimate: Locator;
  elapsedTime: Locator;
  estimatedRemainingTime: Locator;
  captureRate: Locator;

  // Progress indicators
  progressBar: Locator;
  progressPercentage: Locator;
  recentScreenshots: Locator;

  // Live feedback
  lastCapturedImage: Locator;
  captureStatusMessage: Locator;
  errorCount: Locator;

  // Control buttons (during capture)
  pauseButton: Locator;
  stopButton: Locator;
  emergencyStopButton: Locator;

  // Actions
  waitForProgressUpdate(): Promise<void>;
  waitForCaptureCompletion(): Promise<void>;
  verifyProgressData(): Promise<boolean>;
}

export interface SessionSummaryPage {
  // Summary information
  sessionId: Locator;
  bookTitle: Locator;
  totalDuration: Locator;
  totalPagesCaptured: Locator;
  averageCaptureTime: Locator;
  totalFileSize: Locator;
  errorRate: Locator;

  // File actions
  openOutputDirectoryButton: Locator;
  exportScreenshotsButton: Locator;
  deleteSessionButton: Locator;

  // Navigation
  newSessionButton: Locator;
  viewSessionsButton: Locator;
  closeButton: Locator;

  // Actions
  openOutputDirectory(): Promise<void>;
  exportScreenshots(format: 'png' | 'jpeg' | 'pdf'): Promise<void>;
  deleteSession(): Promise<void>;
  startNewSession(): Promise<void>;
}

// ============================================================================
// Test Data Interfaces
// ============================================================================

export interface TestBookSession {
  bookTitle: string;
  expectedPages?: number;
  appName: string;
  settings?: Partial<TestCaptureSettings>;
}

export interface TestCaptureSettings {
  pageTurnDelayMs: number;
  maxCaptureAttempts: number;
  autoDetectCompletion: boolean;
  outputDirectory: string;
}

export interface TestAppTarget {
  appName: string;
  bundleIdentifier: string;
  windowTitle: string;
  isAutomatable: boolean;
}

export interface ExpectedPermissions {
  screenRecording: 'granted' | 'denied' | 'notDetermined';
  accessibility: 'granted' | 'denied' | 'notDetermined';
  globalShortcuts: 'granted' | 'denied' | 'notDetermined';
}

// ============================================================================
// Test Fixtures and Helpers
// ============================================================================

export interface TauriTestFixture {
  mainPage: MainPage;
  permissionDialog: PermissionDialog;
  settingsPage: SettingsPage;
  appDetectionPage: AppDetectionPage;
  captureProgressPage: CaptureProgressPage;
  sessionSummaryPage: SessionSummaryPage;

  // Helper methods
  launchApp(): Promise<void>;
  grantAllPermissions(): Promise<void>;
  setupMockBookApp(): Promise<void>;
  cleanupTestData(): Promise<void>;
  takeScreenshot(name: string): Promise<void>;
}

// Test context extension
export const test = base.extend<TauriTestFixture>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPageImpl(page);
    await use(mainPage);
  },

  permissionDialog: async ({ page }, use) => {
    const permissionDialog = new PermissionDialogImpl(page);
    await use(permissionDialog);
  },

  settingsPage: async ({ page }, use) => {
    const settingsPage = new SettingsPageImpl(page);
    await use(settingsPage);
  },

  appDetectionPage: async ({ page }, use) => {
    const appDetectionPage = new AppDetectionPageImpl(page);
    await use(appDetectionPage);
  },

  captureProgressPage: async ({ page }, use) => {
    const captureProgressPage = new CaptureProgressPageImpl(page);
    await use(captureProgressPage);
  },

  sessionSummaryPage: async ({ page }, use) => {
    const sessionSummaryPage = new SessionSummaryPageImpl(page);
    await use(sessionSummaryPage);
  },
});

// ============================================================================
// Page Object Model Implementations
// ============================================================================

class MainPageImpl implements MainPage {
  constructor(private page: Page) {}

  get settingsButton() { return this.page.locator('[data-testid="settings-button"]'); }
  get helpButton() { return this.page.locator('[data-testid="help-button"]'); }
  get minimizeButton() { return this.page.locator('[data-testid="minimize-button"]'); }
  get closeButton() { return this.page.locator('[data-testid="close-button"]'); }

  get detectAppsButton() { return this.page.locator('[data-testid="detect-apps-button"]'); }
  get startCaptureButton() { return this.page.locator('[data-testid="start-capture-button"]'); }
  get pauseCaptureButton() { return this.page.locator('[data-testid="pause-capture-button"]'); }
  get stopCaptureButton() { return this.page.locator('[data-testid="stop-capture-button"]'); }
  get emergencyStopButton() { return this.page.locator('[data-testid="emergency-stop-button"]'); }

  get permissionStatus() { return this.page.locator('[data-testid="permission-status"]'); }
  get captureStatus() { return this.page.locator('[data-testid="capture-status"]'); }
  get progressIndicator() { return this.page.locator('[data-testid="progress-indicator"]'); }
  get sessionInfo() { return this.page.locator('[data-testid="session-info"]'); }

  async clickDetectApps() {
    await this.detectAppsButton.click();
  }

  async startCapture() {
    await this.startCaptureButton.click();
  }

  async pauseCapture() {
    await this.pauseCaptureButton.click();
  }

  async stopCapture() {
    await this.stopCaptureButton.click();
  }

  async emergencyStop() {
    await this.emergencyStopButton.click();
  }

  async waitForPermissions() {
    await this.permissionStatus.waitFor({ state: 'visible' });
  }
}

class PermissionDialogImpl implements PermissionDialog {
  constructor(private page: Page) {}

  get dialogContainer() { return this.page.locator('[data-testid="permission-dialog"]'); }
  get screenRecordingStatus() { return this.page.locator('[data-testid="screen-recording-status"]'); }
  get accessibilityStatus() { return this.page.locator('[data-testid="accessibility-status"]'); }
  get globalShortcutsStatus() { return this.page.locator('[data-testid="global-shortcuts-status"]'); }

  get requestPermissionsButton() { return this.page.locator('[data-testid="request-permissions-button"]'); }
  get skipButton() { return this.page.locator('[data-testid="skip-button"]'); }
  get retryButton() { return this.page.locator('[data-testid="retry-button"]'); }

  get legalDisclaimerText() { return this.page.locator('[data-testid="legal-disclaimer-text"]'); }
  get acceptTermsCheckbox() { return this.page.locator('[data-testid="accept-terms-checkbox"]'); }
  get acceptTermsButton() { return this.page.locator('[data-testid="accept-terms-button"]'); }

  async acceptLegalTerms() {
    await this.acceptTermsCheckbox.check();
    await this.acceptTermsButton.click();
  }

  async requestAllPermissions() {
    await this.requestPermissionsButton.click();
  }

  async waitForPermissionGrant() {
    await this.page.waitForTimeout(2000); // Wait for system dialog
  }
}

class SettingsPageImpl implements SettingsPage {
  constructor(private page: Page) {}

  get captureSettingsTab() { return this.page.locator('[data-testid="capture-settings-tab"]'); }
  get shortcutsSettingsTab() { return this.page.locator('[data-testid="shortcuts-settings-tab"]'); }
  get storageSettingsTab() { return this.page.locator('[data-testid="storage-settings-tab"]'); }
  get advancedSettingsTab() { return this.page.locator('[data-testid="advanced-settings-tab"]'); }

  get pageTurnDelaySlider() { return this.page.locator('[data-testid="page-turn-delay-slider"]'); }
  get pageTurnDelayInput() { return this.page.locator('[data-testid="page-turn-delay-input"]'); }
  get maxRetriesInput() { return this.page.locator('[data-testid="max-retries-input"]'); }
  get autoDetectCompletionCheckbox() { return this.page.locator('[data-testid="auto-detect-completion-checkbox"]'); }

  get startCaptureShortcut() { return this.page.locator('[data-testid="start-capture-shortcut"]'); }
  get pauseCaptureShortcut() { return this.page.locator('[data-testid="pause-capture-shortcut"]'); }
  get stopCaptureShortcut() { return this.page.locator('[data-testid="stop-capture-shortcut"]'); }
  get emergencyStopShortcut() { return this.page.locator('[data-testid="emergency-stop-shortcut"]'); }

  get baseDirectoryInput() { return this.page.locator('[data-testid="base-directory-input"]'); }
  get browseDirectoryButton() { return this.page.locator('[data-testid="browse-directory-button"]'); }
  get organizeByDateCheckbox() { return this.page.locator('[data-testid="organize-by-date-checkbox"]'); }
  get maxDiskUsageInput() { return this.page.locator('[data-testid="max-disk-usage-input"]'); }

  get saveSettingsButton() { return this.page.locator('[data-testid="save-settings-button"]'); }
  get resetToDefaultsButton() { return this.page.locator('[data-testid="reset-to-defaults-button"]'); }
  get cancelButton() { return this.page.locator('[data-testid="cancel-button"]'); }

  async updatePageTurnDelay(delayMs: number) {
    await this.pageTurnDelayInput.fill(delayMs.toString());
  }

  async updateShortcut(action: string, shortcut: string) {
    const shortcutInput = this.page.locator(`[data-testid="${action}-shortcut"]`);
    await shortcutInput.fill(shortcut);
  }

  async changeStorageDirectory(path: string) {
    await this.baseDirectoryInput.fill(path);
  }

  async saveSettings() {
    await this.saveSettingsButton.click();
  }

  async resetToDefaults() {
    await this.resetToDefaultsButton.click();
  }
}

class AppDetectionPageImpl implements AppDetectionPage {
  constructor(private page: Page) {}

  get appListContainer() { return this.page.locator('[data-testid="app-list-container"]'); }
  get appListItems() { return this.page.locator('[data-testid="app-list-item"]'); }
  get refreshAppsButton() { return this.page.locator('[data-testid="refresh-apps-button"]'); }
  get noAppsFoundMessage() { return this.page.locator('[data-testid="no-apps-found-message"]'); }

  get appNameLabel() { return this.page.locator('[data-testid="app-name-label"]'); }
  get appVersionLabel() { return this.page.locator('[data-testid="app-version-label"]'); }
  get windowTitleLabel() { return this.page.locator('[data-testid="window-title-label"]'); }
  get automationStrategyLabel() { return this.page.locator('[data-testid="automation-strategy-label"]'); }

  get testAutomationButton() { return this.page.locator('[data-testid="test-automation-button"]'); }
  get automationTestResult() { return this.page.locator('[data-testid="automation-test-result"]'); }

  async selectApp(appName: string) {
    await this.page.locator(`[data-testid="app-list-item"][data-app-name="${appName}"]`).click();
  }

  async testAutomation(): Promise<boolean> {
    await this.testAutomationButton.click();
    await this.automationTestResult.waitFor({ state: 'visible' });
    const result = await this.automationTestResult.textContent();
    return result?.includes('success') || false;
  }

  async refreshAppList() {
    await this.refreshAppsButton.click();
  }

  async waitForAppsDetected() {
    await this.appListItems.first().waitFor({ state: 'visible', timeout: 10000 });
  }
}

class CaptureProgressPageImpl implements CaptureProgressPage {
  constructor(private page: Page) {}

  get currentPageNumber() { return this.page.locator('[data-testid="current-page-number"]'); }
  get totalPagesEstimate() { return this.page.locator('[data-testid="total-pages-estimate"]'); }
  get elapsedTime() { return this.page.locator('[data-testid="elapsed-time"]'); }
  get estimatedRemainingTime() { return this.page.locator('[data-testid="estimated-remaining-time"]'); }
  get captureRate() { return this.page.locator('[data-testid="capture-rate"]'); }

  get progressBar() { return this.page.locator('[data-testid="progress-bar"]'); }
  get progressPercentage() { return this.page.locator('[data-testid="progress-percentage"]'); }
  get recentScreenshots() { return this.page.locator('[data-testid="recent-screenshots"]'); }

  get lastCapturedImage() { return this.page.locator('[data-testid="last-captured-image"]'); }
  get captureStatusMessage() { return this.page.locator('[data-testid="capture-status-message"]'); }
  get errorCount() { return this.page.locator('[data-testid="error-count"]'); }

  get pauseButton() { return this.page.locator('[data-testid="pause-button"]'); }
  get stopButton() { return this.page.locator('[data-testid="stop-button"]'); }
  get emergencyStopButton() { return this.page.locator('[data-testid="emergency-stop-button"]'); }

  async waitForProgressUpdate() {
    await this.currentPageNumber.waitFor({ state: 'visible' });
  }

  async waitForCaptureCompletion() {
    await this.page.waitForSelector('[data-testid="capture-completed"]', { timeout: 30000 });
  }

  async verifyProgressData(): Promise<boolean> {
    const currentPage = await this.currentPageNumber.textContent();
    const elapsedTime = await this.elapsedTime.textContent();
    return !!(currentPage && elapsedTime);
  }
}

class SessionSummaryPageImpl implements SessionSummaryPage {
  constructor(private page: Page) {}

  get sessionId() { return this.page.locator('[data-testid="session-id"]'); }
  get bookTitle() { return this.page.locator('[data-testid="book-title"]'); }
  get totalDuration() { return this.page.locator('[data-testid="total-duration"]'); }
  get totalPagesCaptured() { return this.page.locator('[data-testid="total-pages-captured"]'); }
  get averageCaptureTime() { return this.page.locator('[data-testid="average-capture-time"]'); }
  get totalFileSize() { return this.page.locator('[data-testid="total-file-size"]'); }
  get errorRate() { return this.page.locator('[data-testid="error-rate"]'); }

  get openOutputDirectoryButton() { return this.page.locator('[data-testid="open-output-directory-button"]'); }
  get exportScreenshotsButton() { return this.page.locator('[data-testid="export-screenshots-button"]'); }
  get deleteSessionButton() { return this.page.locator('[data-testid="delete-session-button"]'); }

  get newSessionButton() { return this.page.locator('[data-testid="new-session-button"]'); }
  get viewSessionsButton() { return this.page.locator('[data-testid="view-sessions-button"]'); }
  get closeButton() { return this.page.locator('[data-testid="close-button"]'); }

  async openOutputDirectory() {
    await this.openOutputDirectoryButton.click();
  }

  async exportScreenshots(format: 'png' | 'jpeg' | 'pdf') {
    await this.exportScreenshotsButton.click();
    await this.page.selectOption('[data-testid="export-format-select"]', format);
    await this.page.click('[data-testid="confirm-export-button"]');
  }

  async deleteSession() {
    await this.deleteSessionButton.click();
    await this.page.click('[data-testid="confirm-delete-button"]');
  }

  async startNewSession() {
    await this.newSessionButton.click();
  }
}

// ============================================================================
// Test Utilities
// ============================================================================

export class TestHelpers {
  static async waitForTauriReady(page: Page): Promise<void> {
    await page.waitForFunction(() => window.__TAURI_METADATA__ !== undefined);
  }

  static async mockSystemPermissions(page: Page, permissions: ExpectedPermissions): Promise<void> {
    await page.evaluate((perms) => {
      // Mock Tauri permission checks
      window.__TAURI_MOCKS__ = {
        permissions: perms
      };
    }, permissions);
  }

  static async createMockBookApp(page: Page, bookData: TestBookSession): Promise<void> {
    await page.evaluate((book) => {
      // Mock book application for testing
      window.__TAURI_MOCKS__ = {
        ...window.__TAURI_MOCKS__,
        mockBook: book
      };
    }, bookData);
  }

  static async takeAppScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }
}

export { expect } from '@playwright/test';