import React, { createContext, useState } from 'react';

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

    return (
        <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
            {children}
        </SelectedBookContext.Provider>
    );
};