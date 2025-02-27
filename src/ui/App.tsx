import { useEffect, useState, useContext } from 'react';
import {FaPlus} from "react-icons/fa";
import BookInfo from './components/BookInfo.tsx'
import NewBookForm from './components/NewBookForm.tsx';
import './App.css';
import SearchBar from './components/searchBar.tsx';
import SearchBarList from './components/SearchBarList.tsx';
import { SelectedBookContext } from './context/SelectedBookContext';

import {Item} from './types/types.ts'
import Dropdown from './components/Dropdown.tsx';
import fatasyGif from './assets/fantasy.gif';
import spaceGif from './assets/space.gif';
import PajarosGif from './assets/Pajaros.gif';
import PlayaGif from './assets/Playa.gif';
import CascadaGif from './assets/Cascada.gif';
import InviernoGif from './assets/Invierno.gif';
import Castillo from './assets/Castillo.gif';

function App() {
    const [results, setResults] = useState<Item[]>([]);
    const [originalResults, setOriginalResults] = useState<Item[]>([]);
    const [selectedBook, setSelectedBook] = useState<Item | null>(null);
    const [isWriting, setIsWriting] = useState(false);
    const [createNewBook, setCreateNewBook] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [showMessage, setShowMessage] = useState(false);

    //Para que no aparezca scroll (feo)
    document.body.style.overflow = "scroll"
  
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          //@ts-ignore
          const books = await window.electron.getBookList();
          setOriginalResults(books);
          setResults(books);
          fetchCategories(books);
        } catch (err) {
          console.error('Error subscribing to book list:', err);
        }
      };

      const backgrounds: { [key: number]: string } = {
        0: `url(${PajarosGif})`,
        1: `url(${PlayaGif})`,
        2: `url(${CascadaGif})`,
        3: `url(${spaceGif})`,
        4: `url(${InviernoGif})`,
        5: `url(${Castillo})`,
        6: `url(${fatasyGif})`,
      };
  
      const today = new Date().getDay();
      const backgroundImage = backgrounds[today];
  
      // Set the background on the <html> element
      const htmlEl = document.documentElement;
      htmlEl.style.backgroundImage = backgroundImage;
      htmlEl.style.backgroundSize = 'cover';
      htmlEl.style.backgroundRepeat = 'repeat';



  
      fetchBooks();
      return () => {
      };
    }, []);

    const fetchCategories = async (books:any) => {
      try {
        const categoriesSet = new Set(books.map((item:Item) => {
          if (item["Género"] != "" && item["Género"] != null){
            return item["Género"];
          }
        })
        );
        const categories = Array.from(categoriesSet) as string[];
        categories.unshift("ALL")   
        setCategories(categories);
      } catch (err) {
        console.error('Error while fetching categories:', err);
      }
    }

    useEffect(() => {
        const handleBookListUpdate = (_event: any, updatedBooks: Item[]) => {
          setOriginalResults(updatedBooks);
          setResults(updatedBooks);
        };
    
        //@ts-ignore
        window.electron.onBookList(handleBookListUpdate);
    
        return () => {
          //@ts-ignore
          window.electron.removeBookList(handleBookListUpdate);
        };
      }, []);
  
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsWriting(true);
      const searchTerm = e.target.value.toLowerCase();
  
      if (searchTerm === '') {
        setIsWriting(false);
        setResults(originalResults);
      } else {
        const filteredResults = originalResults.filter((item) =>
          item.Name.toLowerCase().includes(searchTerm)
          || item.Autor.toLowerCase().includes(searchTerm)
        );
        setResults(filteredResults);
      }
    };

    const handleCreateNewBook = () => {
        setCreateNewBook(true);
    }

    const handleCategorieFilter = (searchTerm: string) => {
      setIsWriting(true);
      let filteredResults: any;
      if (searchTerm === "ALL") {
        setResults(originalResults);
        fetchCategories(originalResults);
        filteredResults = originalResults; 
      } else {
        filteredResults = originalResults.filter((item) =>{
          return item.Género.toLowerCase().includes(searchTerm.toLowerCase());
        }
        );
        setResults(filteredResults);
        fetchCategories(originalResults);
      }
    }

    const handleHiddenClick = () => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Message disappears after 3 seconds
    };
  

    return (
        <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook, createNewBook, setCreateNewBook }}>
          <div className='main-container'> 
            {(() => {
              if (createNewBook) {
                return <NewBookForm />;
              } else if (selectedBook) {
                return <BookInfo />;
              } else {
                return (
                  <div className='elements-container'>
                    <div className="searchBarContainer">
                      <SearchBar onSearch={handleSearch} />
                      {isWriting ? <SearchBarList results={results} /> : null}
                    </div>
                    <div className='button-add-container'>
                      <button className='button-add' onClick={handleCreateNewBook}>
                        <FaPlus />
                      </button>
                    </div>
                    <div className='dropdown-container'>
                      <Dropdown 
                      buttonText='Categories'
                      content={
                        <ul>
                          {categories.map((item: string, index: number) => (
                            <li onClick={() => handleCategorieFilter (item)} key={index}>{item}</li>
                          ))}
                        </ul>
                      }
                      />
                    </div>
                  </div>
                );
              }
            })()}
          </div>

          {/* Hidden clickable area (styled to be unobtrusive) */}
          <div className="hidden-click-area" onClick={handleHiddenClick}>
            {/* This area can be empty or have a subtle indicator */}
          </div>

          {/* Toast message */}
          {showMessage && (
            <div className="toast-message">
              Love you! Frank.
            </div>
          )}
        </SelectedBookContext.Provider>
      );
  }

export default App;