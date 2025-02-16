import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
    getBookList: async () => {
        const books = await ipcRenderer.invoke('get-book-list');
        return books;
    },

    updateData: async (updatedData: any) => {
        const result = await ipcRenderer.invoke('updateData', updatedData);
        return result;
    },
});