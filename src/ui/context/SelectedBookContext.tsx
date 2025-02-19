import React, { createContext, useState,useEffect } from 'react';

import {Item} from '../types/types.ts'

interface SelectedBookContextType {
    selectedBook: Item | null;
    setSelectedBook: (book: Item | null) => void;
    createNewBook: boolean;
    setCreateNewBook: (value: boolean) => void;
}

export const SelectedBookContext = createContext<SelectedBookContextType>({
    selectedBook: null,
    setSelectedBook: () => {},
    createNewBook: false,
    setCreateNewBook: () => {},
});

export const SelectedBookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedBook, setSelectedBook] = useState<Item | null>(null);
    const [createNewBook, setCreateNewBook] = useState(false);

    useEffect(() => {
    }, [selectedBook]);


    return (
        <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook, createNewBook, setCreateNewBook }}>
            {children}
        </SelectedBookContext.Provider>
    );
};