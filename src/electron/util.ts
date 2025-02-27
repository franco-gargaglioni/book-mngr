import * as fs from 'fs';
import * as path from 'path';

import { app, BrowserWindow } from "electron";
import { fileURLToPath } from 'url';



export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = isDev()
    ? path.resolve(__dirname, 'data/data.json') // Development path
    : path.resolve(app.getAppPath(), 'data/data.json'); // Production path




interface Item {
    "Leído?": string;
    "Name": string;
    "Autor": string;
    "Género": string;
    "Idioma": string;
    "Reseña": string;
    "Préstamo": string;
    "id": number;
}

export async function updateDataFile(mainWindow: BrowserWindow, updatedData: any, prevData: any): Promise<{ success: boolean; error?: string; updatedData?: any; }> {

    try {
        console.log(updatedData);
        const mergedData = prevData.map((item: any) =>
            item.Name === updatedData.Name ? { ...item, ...updatedData } : item
        );
        await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2), 'utf8');
        console.log('Data file updated successfully.');

        mainWindow.webContents.send('bookList', mergedData);

        const updatedBook = mergedData.find((item: any) => item.Name === updatedData.Name);
        return { success: true, updatedData: updatedBook };
    } catch (err: any) {
        console.error('Error writing file:', err.message);
        return { success: false, error: err.message };
    }
}


export async function deleteBook(mainWindow: BrowserWindow, bookToDelete: any, prevData: any): Promise<{ success: boolean; error?: string; updatedData?: any; }> {

    try {
        const newJsonFile = prevData.filter((book: any) => book.Name !== bookToDelete.Name)
        await fs.promises.writeFile(filePath, JSON.stringify(newJsonFile, null, 2), 'utf8');
        console.log('Book deleted successfully.');

        mainWindow.webContents.send('bookList', newJsonFile);

        return { success: true, updatedData: newJsonFile };
    } catch (err: any) {
        console.error('Error writing file:', err.message);
        return { success: false, error: err.message };
    }
}


export function watchDataFile(mainWindow: BrowserWindow) {

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return;
        }

        try {
            const data: Item[] = JSON.parse(jsonData);
            mainWindow.webContents.send('bookList', data);
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
        }
    });


    fs.watch(filePath, (eventType, filename) => {
        if (eventType === 'change') {
            console.log('File changed:', filename);

            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    console.error('Error reading file:', err.message);
                    return;
                }

                try {
                    const data: Item[] = JSON.parse(jsonData);
                    mainWindow.webContents.send('bookList', data);
                } catch (parseErr) {
                    console.error('Error parsing JSON data:', parseErr);
                }
            });
        }
    });
}

export async function createNewBook(mainWindow:BrowserWindow, newBook:any, prevData: any ){
    try {
        const mergedData = prevData;
        mergedData.push(newBook);

        await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2), 'utf8');
        console.log('Data file updated successfully.');

        mainWindow.webContents.send('bookList', mergedData);

        const updatedBook = mergedData.find((item: any) => item.Name === newBook.Name);
        return { success: true, updatedData: newBook };
    } catch (err: any) {
        console.error('Error writing file:', err.message);
        return { success: false, error: err.message };
    }
}

