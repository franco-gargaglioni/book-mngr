import React, { createContext, useState,useEffect } from 'react';

import {Item} from '../types/types.ts'

interface SelectedBookContextType {
    selectedBook: Item | null;
    setSelectedBook: (book: Item | null) => void;
}

export const SelectedBookContext = createContext<SelectedBookContextType>({
    selectedBook: null,
    setSelectedBook: () => {},
});

export const SelectedBookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedBook, setSelectedBook] = useState<Item | null>(null);

    useEffect(() => {
        console.log('Selected Book Updated:', selectedBook);
    }, [selectedBook]);


    return (
        <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
            {children}
        </SelectedBookContext.Provider>
    );
};