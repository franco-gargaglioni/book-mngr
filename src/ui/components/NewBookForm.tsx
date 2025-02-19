import { useContext, useState,useRef } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';
import ConfirmationModal from "./ConfirmationModal.tsx"
import InputForm from './InputForm.tsx';

import { FaArrowLeft } from "react-icons/fa"
import { Item } from '../types/types.js';
import './BookInfo.css';
import './ConfirmationModal.css'
import './NewBookForm.css'



const EmptyItem = {
    Leído: "",
    Name: "",
    Autor: "",
    Género: "",
    Idioma: "",
    Reseña: "",
    Préstamo: "",
    id: 0
}



export default function NewBookForm() {
    const {createNewBook, setCreateNewBook} = useContext(SelectedBookContext);
    const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(EmptyItem);
    const btnRef = useRef<HTMLButtonElement>(null);

    if (!createNewBook){
        return null;
    }

    if (!selectedBook && createNewBook) {
        setSelectedBook(EmptyItem);
    }

    const handleBack = () => {
        setSelectedBook(null);
        setCreateNewBook(false);
    };


    const handleCreateConfirm = () => {

        try {
            //@ts-ignore
            const result = window.electron.createNewBook(pendingFormData);
            if (result.success) {
                console.log('Data was updated successfully:', result.updatedData);

            }
        } catch (err) {
            console.error('Error updating data:', err);
        }

        setShowConfirmModal(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const newBook = Object.fromEntries(fd.entries()) as unknown as Item;
        setPendingFormData(newBook);
        setShowConfirmModal(true);
    };

    const eraseFields = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        if (btnRef.current) {
          btnRef.current.classList.add('is-active');
          btnRef.current.classList.toggle('is-toggled');
          btnRef.current.blur();
          setTimeout(() => {
            btnRef.current && btnRef.current.classList.remove('is-active');
          }, 400);
        }

        const myForm = document.getElementById('create-form-id');
        if(myForm) (myForm as HTMLFormElement).reset(); 
    }


    return (
        <div  className='book-info-page-container'>
            <form id='create-form-id' onSubmit={handleSubmit} className="book-info ">
                <div className="header-book-info-container">
                    <div className='back-to-search-container'>
                        <button className="button-back-to-search" onClick={handleBack}>
                            <FaArrowLeft />
                        </button>
                    </div>
                    <h1>Create a new book:</h1>
                    <label htmlFor='Name'>
                    </label>
                    <input id="hiddenName" type="text" defaultValue={""} name='Name'></input>
                </div>
                <div className="book-info-container ">
                    <div className="column-book-info left">
                    </div>
                    <div className="column-book-info middle">
                        <div className="book-details">
                            <InputForm name='Name' label='name' selectedBook={EmptyItem} isEditing={true} required={true} >
                                Name:
                            </InputForm>
                            <InputForm name='Autor' label='autor' selectedBook={EmptyItem} isEditing={true} required={true} >
                                Autor:
                            </InputForm>
                            <InputForm name='Género' label='genero' selectedBook={EmptyItem} isEditing={true} required={true} >
                                Género:
                            </InputForm>
                            <InputForm name='Idioma' label='idioma' selectedBook={EmptyItem} isEditing={true}  required={true}>
                                Idioma:
                            </InputForm>
                            <InputForm name='Leído' label='leido' selectedBook={EmptyItem} isEditing={true} required={true} >
                                Leído?:
                            </InputForm>
                            <InputForm name='Préstamo' label='prestamo' selectedBook={EmptyItem} isEditing={true} required={false}>
                                Préstamo
                            </InputForm>
                            <InputForm name="Reseña" label='resena' selectedBook={EmptyItem} isEditing={true} required={false}>
                                Reseña:
                            </InputForm>
                        </div>
                        <div className="book-info-buttons">
                            <button
                                type='button'
                                className="button-edit editing exploding-button js-button"
                                onClick={eraseFields}
                                ref={btnRef}
                            >
                                  <i className="Button-icon Button-icon--toggled fa fa-heart"></i>
                                  <i className="Button-icon Button-icon fa fa-heart-o"></i>
                                Clear
                            </button>
                            <button
                                type='submit'
                                className={"button-save"}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                    <div className="column-book-info right">
                    </div>

                </div>
            </form>

            {showConfirmModal && (
                <ConfirmationModal>
                    <div className="confirm-content">
                        <p>Are you sure you want to create this book?</p>
                        <div className="confirm-buttons">
                            <button className="confirmCreate" onClick={handleCreateConfirm}>Confirm</button>
                            <button className="cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                        </div>
                    </div>
                </ConfirmationModal>
            )}
        </div>
    );
}
