import { useContext } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';

import './BookInfo.css'

export default function BookInfo() {
    const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);

    console.log('BookInfo Rendered. Selected Book:', selectedBook);

    if (!selectedBook) {
        return null;
    }

    const handleBack = () => {
        setSelectedBook(null);
    };

    return (
        <div className="book-info">
            <div className='header-book-info-container'>
                <h1>{selectedBook.Name}</h1>
            </div>
            <div className='book-info-container'>
                <div className='column-book-info left'>
                </div>
                <div className='column-book-info middle'>
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
                            <strong>Leído?:</strong> {selectedBook['Leído']}
                        </div>
                        <div className="detail">
                            <strong>Préstamo:</strong> {selectedBook.Préstamo}
                        </div>
                        <div className="detail">
                            <strong>Reseña:</strong> {selectedBook.Reseña}
                        </div>
                    </div>
                </div>
                <div className='column-book-info right'>
                </div>
            </div>
            <div className='button-book-info-container'>
                <div className='middle'></div>
                    <button className='button-back-to-search left' onClick={handleBack}>Back to Search</button>
                <div className='left'></div>
                <div className='right'></div>
            </div>
        </div>
    );
}