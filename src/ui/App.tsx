import { useEffect, useState, useContext } from 'react';
import {FaPlus} from "react-icons/fa";
import BookInfo from './components/BookInfo.tsx'
import NewBookForm from './components/NewBookForm.tsx';
import './App.css';
import SearchBar from './components/searchBar.tsx';
import SearchBarList from './components/SearchBarList.tsx';
import { SelectedBookContext } from './context/SelectedBookContext';

import {Item} from './types/types.ts'

function App() {
    const [results, setResults] = useState<Item[]>([]);
    const [originalResults, setOriginalResults] = useState<Item[]>([]);
    const [selectedBook, setSelectedBook] = useState<Item | null>(null);
    const [isWriting, setIsWriting] = useState(false);
    const [createNewBook, setCreateNewBook] = useState(false);

    //Para que no aparezca scroll (feo)
    document.body.style.overflow = "hidden"
  
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          //@ts-ignore
          const books = await window.electron.getBookList();
          setOriginalResults(books);
          setResults(books);
        } catch (err) {
          console.error('Error subscribing to book list:', err);
        }
      };
  
      fetchBooks();
      return () => {
      };
    }, []);

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
        );
        setResults(filteredResults);
      }
    };

    const handleCreateNewBook = () => {
        setCreateNewBook(true);
    }
  

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
                      <button onClick={handleCreateNewBook}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </SelectedBookContext.Provider>
      );
  }

export default App;