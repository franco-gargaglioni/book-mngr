import { useContext, useState } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import ConfirmationModal from "./ConfirmationModal.tsx"

import {FaArrowLeft, FaTrash} from "react-icons/fa"
import './BookInfo.css';
import './ConfirmationModal.css'

import { Item } from '../types/types.js'; 

import iconImage from "../assets/quill-pen.png"

export default function BookInfo() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!selectedBook) {
    return null;
  }

  const handleBack = () => {
    setSelectedBook(null);
  };

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleDelete  = async () => {
    console.log("deleting...")
    try{
        //@ts-ignore
        const result = await window.electron.deleteData(selectedBook);
        if (result.success) {
            setSelectedBook(null);
        }
      } catch (err) {
        console.error('Error updating data:', err);
      }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    handleDelete();
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const fd = new FormData(e.currentTarget);
    const editedBook = Object.fromEntries(fd.entries()) as unknown as Item;
    console.log('Edited Book:', editedBook);
  
    try {
      //@ts-ignore
      const result = await window.electron.updateData(editedBook);
      if (result.success) {
        console.log('Data was updated successfully:', result.updatedData);
  
        setSelectedBook(result.updatedData);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  return (
    <div className='book-info-page-container'>
        <form  onSubmit={handleSubmit} className={"book-info " + (isEditing? "input-editing" : "")}>
        <div className="header-book-info-container">
            <div className='back-to-search-container'>
                <button className="button-back-to-search" onClick={handleBack}>
                    <FaArrowLeft/>
                </button>
            </div>
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
                {isEditing ? 
                <>
                
                    <button
                        type='button'
                        className={"button-edit" + (isEditing ? " editing" : "")}
                        onClick={handleEdit}
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className={"button-save"}
                    >
                        Save
                    </button>
                    </>
                    :
                    <> 
                        <button
                            type='button'
                            className={"button-edit" + (isEditing ? " editing" : "")}
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            type='submit'
                            className={"button-save"}
                        >
                            Save
                        </button>
                    </>
                }
            </div>
            </div>
            <div className="column-book-info right">
                <div className="delete-icon-container">
                    <button type="button" title="Delete this book" onClick={() => setShowDeleteModal(true)}>
                        <FaTrash id="delete-icon" />
                    </button>
                </div>
            </div>

        </div>
        </form>

        {showDeleteModal && (
        <ConfirmationModal>
            <div className="confirm-content">
            <p>Are you sure you want to delete this book?</p>
            <div className="confirm-buttons">
                <button className="confirm" onClick={handleDeleteConfirm}>Confirm</button>
                <button className="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
            </div>
        </ConfirmationModal>
        )}
    </div>
  );
}
