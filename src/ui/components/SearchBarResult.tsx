import { useContext } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';

interface Item {
    Leído?: string;
    Name: string;
    Autor: string;
    Género: string;
    Idioma: string;
    Reseña: string;
    Préstamo: string;
    id: number;
}

export default function SearchBarResult({ result }: { result: Item }) {
    const { setSelectedBook } = useContext(SelectedBookContext);

    const handleClick = () => {
        setSelectedBook(result);
    };

    return (
        <div className="search-bar-result" onClick={handleClick}>
            {result.Name}
        </div>
    );
}