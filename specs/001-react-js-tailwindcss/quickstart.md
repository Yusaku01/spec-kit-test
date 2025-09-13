# Quickstart Guide: Automatic Book Screenshot Application

**Generated**: 2025-09-13  
**Spec Reference**: [spec.md](./spec.md)  
**Implementation Plan**: [plan.md](./plan.md)

## Overview

This guide helps you set up the development environment and get the automatic book screenshot application running locally on macOS. The application uses Tauri framework with React.js frontend and Rust backend.

## Prerequisites

### System Requirements
- **macOS**: 12.0 (Monterey) or later
- **Xcode**: Latest version with Command Line Tools
- **Rust**: 1.75.0 or later
- **Node.js**: 18.0 or later
- **pnpm**: 8.0 or later (recommended) or npm/yarn

### macOS Permissions (Required)
The application requires these permissions to function:
- **Screen Recording**: For capturing screenshots
- **Accessibility**: For automating e-book applications
- **Input Monitoring**: For global keyboard shortcuts

⚠️ **Note**: These permissions must be granted manually in System Preferences after first launch.

## Quick Setup

### 1. Install Development Tools

```bash
# Install Rust via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Node.js via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm

# Install Tauri CLI
cargo install tauri-cli
```

### 2. Clone and Setup Project

```bash
# Clone the repository
git clone <repository-url>
cd automatic-book-screenshot

# Install frontend dependencies
pnpm install

# Install Rust dependencies and build
cargo build

# Verify Tauri setup
cargo tauri info
```

### 3. Development Environment

```bash
# Start development server with hot reload
cargo tauri dev

# Or alternatively with pnpm
pnpm tauri dev
```

This will:
- Start the React development server on `http://localhost:1420`
- Launch the Tauri application window
- Enable hot reload for both frontend and backend changes

## Project Structure

```
automatic-book-screenshot/
├── src/                          # React frontend
│   ├── components/               # UI components
│   │   ├── capture/             # Screenshot capture UI
│   │   ├── settings/            # Settings and configuration
│   │   ├── progress/            # Progress indicators
│   │   └── common/              # Shared components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # Tauri command wrappers
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Frontend utilities
│   ├── App.tsx                  # Main React component
│   └── main.tsx                 # React entry point
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── commands/            # Tauri command handlers
│   │   ├── screenshot/          # Screenshot capture library
│   │   ├── automation/          # macOS automation library
│   │   ├── storage/             # File management library
│   │   ├── permissions/         # macOS permission handling
│   │   ├── models/              # Data models and types
│   │   ├── lib.rs               # Library root
│   │   └── main.rs              # Application entry point
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri configuration
│   └── build.rs                 # Build scripts
├── tests/
│   ├── contract/                # API contract tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── public/                      # Static assets
├── package.json                 # Node.js dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Key Development Commands

### Frontend Development
```bash
# Install new dependencies
pnpm add <package-name>
pnpm add -D <dev-package-name>

# Run type checking
pnpm type-check

# Run linting
pnpm lint
pnpm lint:fix

# Run tests
pnpm test
pnpm test:watch

# Run E2E tests with Playwright
pnpm test:e2e
pnpm test:e2e:headed
pnpm test:e2e:debug
```

### Backend Development
```bash
# Add Rust dependencies
cargo add <crate-name>

# Run tests
cargo test

# Run specific test
cargo test test_name

# Check code
cargo check
cargo clippy

# Format code
cargo fmt
```

### Tauri Commands
```bash
# Development with debug build
cargo tauri dev

# Build for production
cargo tauri build

# Generate app icons
cargo tauri icon path/to/icon.png

# Update Tauri
cargo update tauri
pnpm update @tauri-apps/cli @tauri-apps/api
```

## Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Development settings
TAURI_DEBUG=true
RUST_LOG=debug

# Application settings
DEFAULT_SCREENSHOT_DIR=~/Documents/BookScreenshots
DEFAULT_PAGE_DELAY=2000
MAX_CONCURRENT_CAPTURES=1

# Feature flags
ENABLE_EXPERIMENTAL_FEATURES=false
ENABLE_TELEMETRY=false
```

### Tauri Configuration
Key settings in `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "distDir": "../dist",
    "devPath": "http://localhost:1420"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "createDir": true,
        "removeDir": true
      },
      "globalShortcut": {
        "all": true
      }
    }
  }
}
```

## Testing

### Running Tests

```bash
# Frontend unit tests
pnpm test

# Backend tests
cargo test

# Integration tests
cargo test --test integration

# E2E tests with Playwright (requires app permissions)
pnpm test:e2e
pnpm test:e2e:headed     # Run with browser UI visible
pnpm test:e2e:debug      # Run with Playwright Inspector

# Setup Playwright (first time only)
pnpm playwright install
pnpm playwright install-deps
```

### Playwright E2E Setup

```bash
# Install Playwright
pnpm add -D @playwright/test

# Initialize Playwright config
pnpm playwright codegen tauri://localhost

# Generate test selectors
pnpm playwright codegen --target typescript
```

### Test Coverage
```bash
# Frontend coverage
pnpm test:coverage

# Backend coverage
cargo tarpaulin --out html
```

### Contract Tests
Test the Tauri command contracts:

```bash
# Run contract tests
cargo test contract_tests

# Verify TypeScript types match Rust types
pnpm type-check:contracts
```

## Building for Production

### Development Build
```bash
cargo tauri build --debug
```

### Production Build
```bash
# Full production build
cargo tauri build

# Build specific target
cargo tauri build --target x86_64-apple-darwin
cargo tauri build --target aarch64-apple-darwin

# Universal binary (Intel + Apple Silicon)
cargo tauri build --target universal-apple-darwin
```

### Code Signing (for distribution)
```bash
# Set up signing identity
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name"

# Build with signing
cargo tauri build --target universal-apple-darwin
```

## Troubleshooting

### Common Issues

#### Permission Denied Errors
```
Error: Screen recording permission denied
```
**Solution**: Grant Screen Recording permission in System Preferences > Security & Privacy > Screen Recording

#### Build Failures
```
error: failed to run custom build command for 'app'
```
**Solution**: Ensure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

#### Node.js Module Issues
```
Module not found: Can't resolve '@tauri-apps/api'
```
**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
pnpm install
```

#### Rust Compilation Issues
```
error: linking with `cc` failed
```
**Solution**: Update Rust toolchain:
```bash
rustup update
cargo clean
cargo build
```

### Performance Issues

#### Slow Development Server
- Reduce the number of files watched by Vite
- Disable source maps in development
- Use `--release` flag for faster Rust compilation

#### High Memory Usage
- Limit concurrent screenshot processing
- Implement streaming for large files
- Use weak references in React components

### Debugging

#### Frontend Debugging
- Use browser DevTools (Cmd+Shift+I in dev mode)
- React Developer Tools browser extension
- Console logging with `console.log()`

#### Backend Debugging
- Add `println!()` statements for simple debugging
- Use `env_logger` for structured logging
- Run with `RUST_LOG=debug` for verbose output

#### Cross-Platform Communication
- Use Tauri's DevTools to inspect commands
- Log all Tauri command calls and responses
- Verify TypeScript types match Rust types

## Next Steps

1. **Complete the implementation** by running `/tasks` command to generate implementation tasks
2. **Set up CI/CD** for automated testing and building
3. **Configure code signing** for distribution outside the App Store
4. **Set up crash reporting** for production monitoring

## Useful Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Rust Book](https://doc.rust-lang.org/book/)
- [macOS App Development Guide](https://developer.apple.com/macos/)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the [implementation plan](./plan.md) for architecture details
3. Consult the [data model](./data-model.md) for entity relationships
4. Check API contracts in the `contracts/` directory
5. Create an issue with detailed error messages and steps to reproduce