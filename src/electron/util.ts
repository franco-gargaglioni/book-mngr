import * as fs from 'fs';
import * as path from 'path';
// import express from 'express';
// import cors from 'cors';

import { BrowserWindow } from "electron";

import { fileURLToPath } from 'url';


// const app = express();
// const PORT = 3000;

// app.use(cors());

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const POLLING_INTERVAL = 500;

// const addIdToData = (data: Item[]): Item[] => {
//     return data.map((item) => ({ ...item }));
// };

const writeDataToFile = (data: Item[], filePath: string) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to file:', filePath);
        }
    });
};

const initializeDataFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
        const defaultData: Item[] = []; // Default empty array or initial data
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
        console.log('Created data file at:', filePath);
    }
};

// const addNewBook = () => {
//     // Correct path: Look for data.json in dist-electron/data
//     const filePath = path.resolve(__dirname, 'data/data.json');

//     // Ensure the file exists
//     initializeDataFile(filePath);

//     console.log('Attempting to read file at:', filePath);

//     fs.readFile(filePath, 'utf8', (err, jsonData) => {
//         if (err) {
//             console.error('Error reading file:', err.message);
//             console.error('Error code:', err.code);
//             console.error('File path:', filePath);
//             return;
//         }
//         try {
//             const data: Item[] = JSON.parse(jsonData);
//             const newData = addIdToData(data);
//             writeDataToFile(newData, filePath);
//         } catch (parseErr) {
//             if (parseErr instanceof Error) {
//                 console.error('Error parsing JSON data:', parseErr.message);
//             } else {
//                 console.error('Unknown error parsing JSON data:', parseErr);
//             }
//         }
//     });
// };

// export function getNames(): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//         const filePath = path.resolve(__dirname, 'data/data.json');

//         console.log('Attempting to read file at:', filePath);

//         fs.readFile(filePath, 'utf8', (err, jsonData) => {
//             if (err) {
//                 console.error('Error reading file:', err.message);
//                 reject(err);
//                 return;
//             }

//             try {
//                 const data: Item[] = JSON.parse(jsonData);
//                 const names = data.map(item => item.Name); // Extract the `Name` property from each item
//                 resolve(names);
//             } catch (parseErr) {
//                 if (parseErr instanceof Error) {
//                     console.error('Error parsing JSON data:', parseErr.message);
//                 } else {
//                     console.error('Unknown error parsing JSON data:', parseErr);
//                 }
//                 reject(parseErr);
//             }
//         });
//     });
// }

// export function getIds(): Promise<number[]> {
//     return new Promise((resolve, reject) => {
//         const filePath = path.resolve(__dirname, 'data/data.json');

//         console.log('Attempting to read file at:', filePath);

//         fs.readFile(filePath, 'utf8', (err, jsonData) => {
//             if (err) {
//                 console.error('Error reading file:', err.message);
//                 reject(err);
//                 return;
//             }

//             try {
//                 const data: Item[] = JSON.parse(jsonData);
//                 const ids = data.map(item => item.id); 
//                 resolve(ids);
//             } catch (parseErr) {
//                 if (parseErr instanceof Error) {
//                     console.error('Error parsing JSON data:', parseErr.message);
//                 } else {
//                     console.error('Unknown error parsing JSON data:', parseErr);
//                 }
//                 reject(parseErr);
//             }
//         });
//     });
// }

export function watchDataFile(mainWindow: BrowserWindow) {
    const filePath = path.resolve(__dirname, 'data/data.json');


    // Send initial data
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

    // Watch the file for changes
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
// app.get('/api/books', (req, res) => {
//     console.log('TRYING TO LOAD BOOKS');
//     const filePath = path.resolve(__dirname, 'data/data.json');
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).json({ error: 'Failed to read data' });
//             return;
//         }
//         const jsonData = JSON.parse(data);
//         console.log(jsonData);
//         res.json(jsonData);
//     });
// });

