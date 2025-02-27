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
    onBookList: (callback: (event: any, data: any) => void) => {
      ipcRenderer.on('bookList', callback);
    },
    removeBookList: (callback: (event: any, data: any) => void) => {
      ipcRenderer.removeListener('bookList', callback);
    },
    deleteData: async (deleteData: any) => {
        const result = await ipcRenderer.invoke('deleteBook', deleteData);
        return result;
      },
      createNewBook: async (newBook: any) => {
        const result = await ipcRenderer.invoke('createNewBook', newBook);
        return result;
      },
      createSummary: async(data:any) => {
        const result = await ipcRenderer.invoke('createSummary', data);
        return result;
      }
  });