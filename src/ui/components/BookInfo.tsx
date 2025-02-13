import { useContext } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';

export default function BookInfo() {
    const { selectedBook } = useContext(SelectedBookContext);

    if (!selectedBook) {
        return null;
    }

    return (
        <div className="book-info">
            <h1>{selectedBook.Name}</h1>
            <div className="book-details">
                <div className="detail">
                    <strong>Autor:</strong> {selectedBook.Autor}
                </div>
                <div className="detail">
                    <strong>Género:</strong> {selectedBook.Género}
                </div>
                <div className="detail">
                    <strong>Idioma:</strong> {selectedBook.Idioma}
                </div>
                <div className="detail">
                    <strong>Leído?:</strong> {selectedBook["Leído?"]}
                </div>
                <div className="detail">
                    <strong>Préstamo:</strong> {selectedBook.Préstamo}
                </div>
                <div className="detail">
                    <strong>Reseña:</strong> {selectedBook.Reseña}
                </div>
            </div>
        </div>
    );
}