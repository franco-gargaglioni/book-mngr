import { useContext, useState, useEffect } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import './BookInfo.css';

import { Item } from '../types/types.js'; 

import iconImage from "../assets/quill-pen.png"

export default function BookInfo() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const [isEditing, setIsEditing] = useState(false);

  console.log("RE RENDERED COMPONENT");

  if (!selectedBook) {
    return null;
  }

  const handleBack = () => {
    setSelectedBook(null);
  };

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  useEffect(() => {
    console.log('Selected Book in BookInfo:', selectedBook);
  }, [selectedBook]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
  
    const fd = new FormData(e.currentTarget);
    const editedBook = Object.fromEntries(fd.entries()) as unknown as Item;
    console.log('Edited Book:', editedBook);
  
    try {
      //@ts-ignore
      const result = await window.electron.updateData(editedBook);
      if (result.success) {
        console.log('Data was updated successfully:', result.updatedData);
  
        // Update the selectedBook state with the new data
        setSelectedBook(result.updatedData);
        console.log("THIS IS THE BOOK IN THE CONTEXT ------- " + result.updatedData.Leído);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  return (
    <form  onSubmit={handleSubmit} className="book-info">
      <div className="header-book-info-container">
        <h1>{selectedBook.Name}</h1>
        <img src={iconImage}
         alt="quill icon" style={{width: 24, height: 24, display: 'inline-block'}} />
        <label htmlFor='Name'>
        </label>
        <input id="hiddenName" type="text" defaultValue={selectedBook.Name} name='Name'></input>
      </div>
      <div className={"book-info-container " + (isEditing ? 'input-editing' : '')}>
        <div className="column-book-info left">
        </div>
        <div className="column-book-info middle">
          <div className="book-details">
            <div className="detail row">
              <label htmlFor="autor">
                <strong>Autor:</strong>
              </label>
              <input id="autor" type="text" defaultValue={selectedBook.Autor} disabled={!isEditing} name='Autor'/>
            </div>
            <div className="detail row">
              <label htmlFor="genero">
                <strong>Género:</strong>
              </label>
              <input id="genero" type="text" defaultValue={selectedBook.Género} disabled={!isEditing} name='Género'/>
            </div>
            <div className="detail row">
              <label htmlFor="idioma">
                <strong>Idioma:</strong>
              </label>
              <input id="idioma" type="text" defaultValue={selectedBook.Idioma} disabled={!isEditing} name='Idioma'/>
            </div>
            <div className="detail row">
              <label htmlFor="leido">
                <strong>Leído?:</strong>
              </label>
              <input id="leido" type="text" defaultValue={selectedBook['Leído']} disabled={!isEditing} name='Leído'/>
            </div>
            <div className="detail row">
              <label htmlFor="prestamo">
                <strong>Préstamo:</strong>
              </label>
              <input id="prestamo" type="text" defaultValue={selectedBook.Préstamo} disabled={!isEditing} name='Préstamo'/>
            </div>
            <div className="detail row">
              <label htmlFor="resena">
                <strong>Reseña:</strong>
              </label>
              <input id="resena" type="text" defaultValue={selectedBook.Reseña}  disabled={!isEditing} name='Reseña'/>
            </div>
          </div>
          <div className="book-info-buttons">
            <button className="button-back-to-search" onClick={handleBack}>
              Back to Search
            </button>
            {isEditing ? 
              <>
              
                <button
                type='button'
                className={"button-edit" + (isEditing ? " editing" : "")}
                onClick={handleEdit}
                disabled={true}
                >
                Edit
                </button>
                <button
                type='submit'
                className={"button-save"
                }
                >
                Save
                </button>
                </>
                : 
                
                <button
                type='button'
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
