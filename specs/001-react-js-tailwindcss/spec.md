# Feature Specification: Automatic Book Screenshot Application

**Feature Branch**: `001-react-js-tailwindcss`  
**Created**: 2025-09-12  
**Status**: Draft  
**Input**: User description: "React.js + TailwindCSS + Rustで、簡単な自動スクショアプリを作成したい。使用環境は Macで、Kindleなどの書籍を自動でページめくり + 自動スクショするようなイメージ。起動するトリガーは特定のキーボードコマンドを叩くと起動するようにしたい"

## Execution Flow (main)

```
1. Display legal disclaimer and obtain user consent
   - If declined: EXIT "User did not accept terms"
2. Request macOS accessibility and screen recording permissions
   - If denied: ERROR "Required permissions not granted"
3. Detect target e-book application (Kindle, etc.)
   - If not found: PROMPT "Please open supported e-book application"
4. Obtain book title for directory creation
   - Try window title extraction first, fallback to user prompt
5. Create screenshot directory structure
   - Verify disk space availability
6. Wait for user activation via keyboard shortcut
7. Begin automated capture loop:
   - Take screenshot of current page
   - Save with timestamp and page number
   - Wait configured interval (default 2 seconds)
   - Send page turn command to e-book application
   - Check for stop/pause signals
   - Repeat until end of book or user stops
8. Display completion summary and session statistics
9. Return: SUCCESS (screenshots saved to configured location)
```

---

## Quick Guidelines

- Focus on WHAT users need and WHY
- Avoid HOW to implement (no tech stack, APIs, code structure)
- Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

A book reader wants to automatically capture screenshots of every page while reading e-books (like Kindle) on their Mac. They activate the system with a keyboard shortcut, and the application automatically navigates through pages while taking screenshots, allowing them to create a visual archive of their reading material.

### Acceptance Scenarios

1. **Given** user has a supported e-book application open with a book loaded, **When** they press the configured keyboard shortcut, **Then** the screenshot application activates and begins automated page capture
2. **Given** the screenshot application is running, **When** a page is displayed, **Then** the system captures a screenshot and automatically advances to the next page
3. **Given** the user wants to stop the automated process, **When** they press the stop keyboard shortcut, **Then** the application stops capturing and returns control to the user
4. **Given** the automation process completes, **When** the book reaches the end, **Then** the system stops automatically and notifies the user

### Edge Cases

- What happens when the target application loses focus during automation?
- How does the system handle protected or DRM-restricted content?
- What occurs if the target application becomes unresponsive during page turning?
- How does the system detect when a page has fully loaded before taking a screenshot?
- How does the system resume from interruption or unexpected quit during processing?
- What happens when processing multiple books consecutively?
- How does the system handle screenshot capture failures or storage write errors?
- What occurs when disk space is insufficient for storing screenshots?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST activate via configurable keyboard shortcut combination
- **FR-002**: System MUST detect and integrate with supported e-book applications (starting with Kindle) using macOS accessibility permissions and window management APIs
- **FR-003**: System MUST automatically advance pages in the target e-book application
- **FR-004**: System MUST capture screenshots of each page after navigation
- **FR-005**: System MUST store screenshots in user-configurable directory with default location `~/Documents/BookScreenshots/[書籍名]/` and filename format `page_[番号]_[タイムスタンプ].png`
- **FR-006**: System MUST provide a mechanism to stop the automation process
- **FR-007**: System MUST automatically stop when reaching the final page, display completion notification with screenshot count, and save session summary
- **FR-008**: System MUST wait 2 seconds between page turns (configurable from 0.5 to 10 seconds) to allow page loading completion
- **FR-009**: System MUST operate without interfering with other Mac applications
- **FR-010**: System MUST provide feedback to user about automation status (running, stopped, completed)
- **FR-011**: System MUST save screenshots in PNG format for high quality lossless compression
- **FR-012**: System MUST display real-time progress indicator showing current page number, elapsed time, and remaining page count
- **FR-013**: System MUST provide pause and resume functionality via keyboard shortcuts
- **FR-014**: System MUST allow users to customize keyboard shortcuts for start, stop, pause, and resume actions
- **FR-015**: System MUST display legal disclaimer and require user confirmation before first use, warning about copyright and DRM restrictions
- **FR-016**: System MUST limit functionality to personal use only and display warnings about commercial or distribution use
- **FR-017**: System MUST obtain book title from application window title or prompt user for manual input to create appropriate directory structure

### Key Entities _(include if feature involves data)_

- **Screenshot**: Image file captured from e-book page, includes metadata like timestamp, page number, book identifier
- **Book Session**: Automation session for a specific book, tracks progress, settings, and output location
- **Application Target**: Supported e-book application that can be automated (Kindle, etc.)

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
