import { useContext, useState } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import './BookInfo.css';

import { Item } from '../types/types.js'; 

export default function BookInfo() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedBook) {
    return null;
  }

  const handleBack = () => {
    setSelectedBook(null);
  };

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('handleSubmit');
    const fd = new FormData(e.currentTarget);
    const editedBook = Object.fromEntries(fd.entries()) as unknown as Item;
    try{
        //@ts-ignore
        const result = await window.electron.updateData(editedBook);
        if (result.success) {
        console.log('Data was updated successfully:', result.updatedData);
        }
    } catch (err){
        console.error('Error subscribing to book list:', err);
    }

    
  };

  return (
    <form  onSubmit={handleSubmit} className="book-info">
      <div className="header-book-info-container">
        <h1>{selectedBook.Name}</h1>
      </div>
      <div className="book-info-container">
        <div className="column-book-info left">
        </div>
        <div className="column-book-info middle">
          <div className="book-details">
            <div className="detail row">
              <label htmlFor="autor">
                <strong>Autor:</strong>
              </label>
              <input id="autor" type="text" defaultValue={selectedBook.Autor} disabled={isEditing} name='Autor'/>
            </div>
            <div className="detail row">
              <label htmlFor="genero">
                <strong>Género:</strong>
              </label>
              <input id="genero" type="text" defaultValue={selectedBook.Género} name='Género'/>
            </div>
            <div className="detail row">
              <label htmlFor="idioma">
                <strong>Idioma:</strong>
              </label>
              <input id="idioma" type="text" defaultValue={selectedBook.Idioma} name='Idioma'/>
            </div>
            <div className="detail row">
              <label htmlFor="leido">
                <strong>Leído?:</strong>
              </label>
              <input id="leido" type="text" defaultValue={selectedBook['Leído']} name='Leído'/>
            </div>
            <div className="detail row">
              <label htmlFor="prestamo">
                <strong>Préstamo:</strong>
              </label>
              <input id="prestamo" type="text" defaultValue={selectedBook.Préstamo} name='Préstamo'/>
            </div>
            <div className="detail row">
              <label htmlFor="resena">
                <strong>Reseña:</strong>
              </label>
              <input id="resena" type="text" defaultValue={selectedBook.Reseña}  name='Reseña'/>
            </div>
          </div>
          <div className="book-info-buttons">
            <button className="button-back-to-search" onClick={handleBack}>
              Back to Search
            </button>
            {isEditing ? 
                <button
                type='submit'
                className={"button-edit" + (isEditing ? " editing" : "")}
                onClick={handleEdit}
                >
                Save
                </button>
                
                : 
                
                <button
                className={"button-edit" + (isEditing ? " editing" : "")}
                onClick={handleEdit}
                >
                Edit
                </button>
            }

          </div>
        </div>
        <div className="column-book-info right">
        </div>
      </div>
    </form>
  );
}
