import {app, BrowserWindow,ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { watchDataFile, isDev, updateDataFile } from './util.js';
import { getPreloadPath } from './pathResolver.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.on('ready', () => {
    try {
        const preloadPath = getPreloadPath();

        const mainWindow = new BrowserWindow({
            webPreferences: {
                preload: preloadPath,
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        ipcMain.handle('get-book-list', async () => {
            const filePath = path.resolve(__dirname, 'data/data.json');
            const jsonData = await fs.promises.readFile(filePath, 'utf8');
            const data = JSON.parse(jsonData);
            return data;
        });

        ipcMain.handle('updateData', async (event, updatedData) => {
            const result = await updateDataFile(updatedData);
            return result;
        });

        if (isDev()) {
            mainWindow.loadURL('http://localhost:5123'); // Load the React app in development
        } else {
            mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')); // Load the React app in production
        }

        
        watchDataFile(mainWindow);
    } catch (err) {
        console.error('Error during app initialization:', err);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled promise rejection:', err);
});