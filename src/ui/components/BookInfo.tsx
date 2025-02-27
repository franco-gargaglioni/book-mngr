import { useContext, useState, useRef, useEffect } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import ConfirmationModal from "./ConfirmationModal.tsx"
import InputForm from './InputForm.tsx';

import {FaArrowLeft, FaTrash} from "react-icons/fa"
import './BookInfo.css';
import './ConfirmationModal.css'

import { Item } from '../types/types.js'; 

import iconImage from "../assets/quill-pen.png"
import ChatGPTInfo from './ChatGPTInfo.tsx';

export default function BookInfo() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const formRef = useRef<HTMLFormElement>(null);
  const [originalValues, setOriginalValues] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatSummary, setChatSummary] = useState("No summary available");

  if (!selectedBook) {
    return null;
  }


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const propmt = "Would you please create a summary for the book titled " + selectedBook.Name + " from the author " + selectedBook.Autor + 
         " Your response should be direct. Do not begin with words such as 'Sure', 'Certainly', 'Absolutely', etc. Respond in 5 sentences maximun ( of maximum 15 words). " +
         "Avoid mentioning any details that could ruin the experience for someone who hasn't seen/read it. " + 
         "Do not create ficticional info. Always present fact-checked information.";
        //@ts-ignore
        const summary = await window.electron.createSummary(propmt);
        setChatSummary(summary);
        console.log(summary);
      } catch (err) {
        console.error('Error fetching chatGPT summary', err);
      }
    };

    fetchSummary();
    return () => {
    };
  }, []);


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
                <InputForm name="Reseña" label='resena' selectedBook={selectedBook} isEditing={isEditing} required={false}>
                    Reseña:
                </InputForm>
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
                <ChatGPTInfo content={chatSummary} />
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
