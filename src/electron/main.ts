import {app, BrowserWindow,ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { watchDataFile, isDev, updateDataFile, deleteBook, createNewBook } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { createSummary } from './chatGPT.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.on('ready', () => {
    try {
        const preloadPath = getPreloadPath();

        console.log("DIRECTORIO _______________" + app.getAppPath());

        const mainWindow = new BrowserWindow({
        icon: path.join(app.getAppPath(), 'app-icon.png'),
        //fullscreen: true,
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
            const filePath = path.resolve(__dirname, 'data/data.json');
            const jsonData = await fs.promises.readFile(filePath, 'utf8');
            const prevData = JSON.parse(jsonData);
            const result = await updateDataFile(mainWindow,updatedData,prevData);
            return result;
        });
        
        ipcMain.handle('deleteBook', async (event, book) => {
            const filePath = path.resolve(__dirname, 'data/data.json');
            const jsonData = await fs.promises.readFile(filePath, 'utf8');
            const prevData = JSON.parse(jsonData);
            const result = await deleteBook(mainWindow,book,prevData);
            return result;
        });

        ipcMain.handle('createNewBook', async (event, newBook) => {
            console.log("Calling to create new book");
            const filePath = path.resolve(__dirname, 'data/data.json');
            const jsonData = await fs.promises.readFile(filePath, 'utf8');
            const prevData = JSON.parse(jsonData);
            const result = await createNewBook(mainWindow,newBook,prevData);
            return result;
        });

        ipcMain.handle('createSummary', async (event, data) => {
            const result = await createSummary(mainWindow,data);
            console.log(result);
            return result;
        })

        if (isDev()) {
            mainWindow.loadURL('http://localhost:5123'); // Load the React app in development
        } else {
            mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')); // Load the React app in production
            mainWindow.maximize();
            mainWindow.setMenu(null);
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