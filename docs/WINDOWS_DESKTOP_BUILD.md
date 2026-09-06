# Marathi Typing Master — Windows Desktop (.EXE) Build & Packaging Guide

This document outlines the architecture, build steps, and distribution instructions for packaging **Marathi Typing Master** as a professional standalone Windows application (`MarathiTypingMasterSetup.exe`).

---

## 1. Architecture Overview

```
                         MARATHI TYPING MASTER
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
               Desktop App                 Online AI API (Optional)
                     │                           │
              React + Electron             Your Web Server
                     │                           │
             100% Offline Core              Gemini API
             • Student Profiles                  │
             • GCC-TBC 30/40 WPM           Secret stays
             • ISM Remington Keyboard      here safely!
             • Audio Engine & WPM Stats
```

### Security & Privacy
- **No API Keys in the .EXE**: The Gemini API key is never bundled inside the client.
- **Offline Reliability**: The core typing tutor, chapter curriculum, Remington layout, exam simulations, multi-student profiles, and audio feedback work completely offline with zero internet requirement.
- **Sandboxed Electron**: Built with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.

---

## 2. Project Scripts

The following commands are configured in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the web version dev server on `http://localhost:3000`. |
| `npm run build` | Builds the web application for production deployment. |
| `npm run electron:compile` | Bundles `electron/main.ts` and `electron/preload.ts` into `dist-electron/` using `esbuild`. |
| `npm run electron:build` | Compiles the React UI with relative assets (`./`) and builds the Electron main process. |
| `npm run electron:dev` | Launches the Electron desktop window connected to your dev server. |
| `npm run dist:win` | Generates the professional Windows NSIS installer: `release/MarathiTypingMasterSetup.exe`. |

---

## 3. How to Build the Windows Installer (`.exe`)

### Option A: Build Locally on a Windows PC (Fastest & Simplest)

#### Requirements
- Node.js 18+ or 20+
- A Windows computer

#### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd marathi-typing-master
npm install
```

#### Step 2: Build the Installer
```bash
npm run dist:win
```

#### Output
The installer will be generated in the `release/` folder:
- **`release/MarathiTypingMasterSetup.exe`**: The complete standalone Windows installer.

---

### Option B: Cloud Build via GitHub Actions (Optional)

If you wish to have GitHub compile the `.exe` in the cloud:
1. On GitHub.com, go to your repository.
2. Click **Add file** → **Create new file**.
3. Name it `.github/workflows/build-windows.yml`.
4. Copy and paste the contents from `docs/github-workflow-template.yml`.
5. Commit the file. You can now trigger the build from the **Actions** tab on GitHub!

---

## 4. Installer Features Configured in `electron-builder.json`

- **NSIS Custom Installer**: Standard Windows installation wizard.
- **Desktop Shortcut**: Automatically creates a "Marathi Typing Master" shortcut on the student's Windows desktop.
- **Start Menu Shortcut**: Adds an entry under Windows Start Menu.
- **Single Instance Lock**: Prevents multiple copies from running simultaneously and corrupting typing logs.
- **Uninstaller**: Provides clean uninstall entry in *Windows Settings → Installed Apps*.
- **Icon**: High-resolution branding with the Marathi Typing Master icon.

---

## 5. Code Signing (Optional for Development, Recommended for Public Release)

### Development / Local Labs:
During lab testing, code signing is not required. When Windows SmartScreen appears:
1. Click **More info**
2. Click **Run anyway**

### Commercial Public Distribution:
When ready for public distribution, configure your EV or Standard Code Signing Certificate in `electron-builder.json`:
```json
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "YOUR_PASSWORD"
}
```
Or use Microsoft Azure Trusted Signing.
