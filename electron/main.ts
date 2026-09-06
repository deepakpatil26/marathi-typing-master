import { app, BrowserWindow, Menu, shell, screen } from 'electron';
import path from 'path';
import fs from 'fs';

// Ensure single instance lock so student profile files / localStorage don't corrupt
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow: BrowserWindow | null = null;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const iconDist = path.join(__dirname, '../dist/pwa-512x512.png');
  const iconPublic = path.join(__dirname, '../public/pwa-512x512.png');
  const appIcon = fs.existsSync(iconDist) ? iconDist : (fs.existsSync(iconPublic) ? iconPublic : undefined);

  mainWindow = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(860, height),
    minWidth: 960,
    minHeight: 680,
    title: 'मराठी टायपिंग मास्टर (Marathi Typing Master)',
    backgroundColor: '#03151e',
    icon: appIcon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
      spellcheck: false, // Prevent spellcheck red squiggles under Marathi phonetic text
    },
    show: false, // Show gracefully once ready-to-show
  });

  // Build native application menu
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload App (ताजे करा)',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.reload()
        },
        { type: 'separator' },
        {
          label: 'Exit (बाहेर पडा)',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen (पूर्ण स्क्रीन)',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Zoom In (आकार वाढवा)',
          accelerator: 'CmdOrCtrl+Plus',
          role: 'zoomIn'
        },
        {
          label: 'Zoom Out (आकार कमी करा)',
          accelerator: 'CmdOrCtrl+-',
          role: 'zoomOut'
        },
        {
          label: 'Reset Zoom (मूळ आकार)',
          accelerator: 'CmdOrCtrl+0',
          role: 'resetZoom'
        },
        ...(process.env.NODE_ENV === 'development'
          ? [
              { type: 'separator' as const },
              {
                label: 'Developer Tools',
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => mainWindow?.webContents.toggleDevTools()
              }
            ]
          : [])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Official Website (अधिकृत संकेतस्थळ)',
          click: () => {
            shell.openExternal('https://marathitypingmaster.com');
          }
        },
        {
          label: 'GCC-TBC Typing Exam Guidelines',
          click: () => {
            shell.openExternal('https://mscepune.in');
          }
        },
        { type: 'separator' },
        {
          label: 'About Marathi Typing Master (माहिती)',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                alert("मराठी टायपिंग मास्टर v1.0.0\\nISM DVBW Remington Layout\\nGCC-TBC 30 & 40 WPM Exam Prep\\n100% Offline & Private");
              `);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open external URLs in default system browser, not in the Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Graceful show
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // In production, load the built index.html from dist
  // If DEV_SERVER_URL is provided, load that instead
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
