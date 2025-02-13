import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
    subscribeBookList: async () => {
        const books = await ipcRenderer.invoke('get-book-list');
        return books;
    },
});