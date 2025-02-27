import { useContext, useState, useRef, useEffect } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import ConfirmationModal from "./ConfirmationModal.tsx"
import InputForm from './InputForm.tsx';
import StarRating from './StarRatingProps.tsx';

import {FaArrowLeft, FaTrash} from "react-icons/fa"
import './BookInfo.css';
import './ConfirmationModal.css'

import { Item } from '../types/types.js'; 

import iconImage from "../assets/quill-pen.png"

export default function BookInfo() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const formRef = useRef<HTMLFormElement>(null);
  const [originalValues, setOriginalValues] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rating, setRating] = useState<number>(0);

  if (!selectedBook) {
    return null;
  }

  useEffect(() => {
    const score = selectedBook["Reseña"];

    if (score === "❔")
      setRating(0);
    else {
      setRating(score.length)
    }
  }, [])


  const handleBack = () => {
    setSelectedBook(null);
  };

  const handleEdit = () => {
    if (!isEditing) {
        // When entering edit mode, save current values
        setOriginalValues({ ...selectedBook });
      } else {
        // When canceling, restore original values
        setSelectedBook(originalValues);
        formRef.current?.reset();
      }
      setIsEditing((prev) => !prev);
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
    setOriginalValues(null);
  
    const fd = new FormData(e.currentTarget);
    transformRating(fd);
    const editedBook = Object.fromEntries(fd.entries()) as unknown as Item;
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

  const handleRatingChange = (newRating: number) => {
    if (isEditing){
      setRating(newRating);
    }
  };

  const transformRating = (form: FormData) => {
    const ratingValue = form.get("Reseña");
    const numericRating = Number(ratingValue);
    let estrellas = "";
    
    if (numericRating === 0) {
      form.set("Reseña", "❔");
    } else {
      for (let i = 0; i < numericRating; i++) {
        estrellas = estrellas.concat("⭐");
      }
      form.set("Reseña", estrellas);
    }
  };

  return (
    <div className='book-info-page-container'>
        <form ref={formRef} key={selectedBook.Name} onSubmit={handleSubmit} className={"book-info " + (isEditing? "input-editing" : "")}>
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
                <InputForm name='Autor' label='autor' selectedBook={selectedBook} isEditing={isEditing} required={true}>
                    Autor:
                </InputForm>
                <InputForm name='Género' label='genero' selectedBook={selectedBook} isEditing={isEditing} required={true}>
                    Género:
                </InputForm>
                <InputForm name='Idioma' label='idioma' selectedBook={selectedBook} isEditing={isEditing} required={true}>
                    Idioma:
                </InputForm>
                <InputForm name='Leído' label='leido' selectedBook={selectedBook} isEditing={isEditing} required={true}>
                    Leído?:
                </InputForm>
                <InputForm name='Préstamo' label='prestamo' selectedBook={selectedBook} isEditing={isEditing} required={false}>
                    Préstamo
                </InputForm>
                <div className="detail row">
                  <label htmlFor="resena">
                    <strong>Reseña:</strong>
                  </label>
                  <input style={{display: 'none'}} required={true} id="resena" type="text" defaultValue={rating} value={rating}  disabled={!isEditing} name="Reseña"/>
                  <StarRating rating={rating} onRatingChange={handleRatingChange} />
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
                    <div className="delete-icon-container">
                        <button className="button-delete" type="button" title="Delete this book" onClick={() => setShowDeleteModal(true)}>
                            <FaTrash id="delete-icon" />
                        </button>
                    </div>
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
                        <div className="delete-icon-container">
                            <button className="button-delete" type="button" title="Delete this book" onClick={() => setShowDeleteModal(true)}>
                                <FaTrash id="delete-icon" />
                            </button>
                        </div>
                    </>
                }
            </div>
            </div>
            <div className="column-book-info right">
            </div>

        </div>
        </form>

        {showDeleteModal && (
        <ConfirmationModal>
            <div className="confirm-content">
            <p>Are you sure you want to delete this book?</p>
            <div className="confirm-buttons">
                <button className="confirm" onClick={handleDeleteConfirm}>Confirm</button>
                <button className="cancel" onClick={handleEdit}>Cancel</button>
            </div>
            </div>
        </ConfirmationModal>
        )}
    </div>
  );
}
