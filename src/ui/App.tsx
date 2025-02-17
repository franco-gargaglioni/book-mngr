import { useEffect, useState, useContext } from 'react';
import { IpcRenderer } from 'electron';
import BookInfo from './components/BookInfo.tsx'
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
  
    console.log('App Re-rendered. Selected Book:', selectedBook);
  
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
          console.log('Received updated book list via IPC:', updatedBooks);
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
  
    return (
      <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
        <div className='main-container'>
          {selectedBook ? (
            <BookInfo />
          ) : (
            <div className="searchBarContainer">
              <SearchBar onSearch={handleSearch} />
              {isWriting ? <SearchBarList results={results} /> : <></>}
            </div>
          )}
        </div>
      </SelectedBookContext.Provider>
    );
  }

export default App;