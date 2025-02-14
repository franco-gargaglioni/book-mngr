import { useEffect, useState, useContext } from 'react';
import BookInfo from './components/BookInfo.tsx'
import './App.css';
import SearchBar from './components/searchBar.tsx';
import SearchBarList from './components/SearchBarList.tsx';
import { SelectedBookProvider } from './context/SelectedBookContext';
import { SelectedBookContext } from './context/SelectedBookContext';

import {Item} from './types/types.ts'

function App() {
    const [results, setResults] = useState<Item[]>([]);
    const [originalResults, setOriginalResults] = useState<Item[]>([]);
    const { selectedBook } = useContext(SelectedBookContext);

    console.log('App Re-rendered. Selected Book:', selectedBook);

    useEffect(() => {

      const fetchBooks = async () => {
          try {
              //@ts-ignore
              const books = await window.electron.subscribeBookList();
              setOriginalResults(books);
              setResults(books);
          } catch (err) {
              console.error('Error subscribing to book list:', err);
          }
      };

      fetchBooks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
        setResults(originalResults);
    } else {
        const filteredResults = originalResults.filter((item) =>
            item.Name.toLowerCase().includes(searchTerm)
        );
        setResults(filteredResults);
    }
};

    return (
        <div className='main-container'>
            {selectedBook ? (
              
                <BookInfo />
            ) : (
                <div className="searchBarContainer">
                    <SearchBar onSearch={handleSearch} />
                    <SearchBarList results={results} />
                </div>
            )}
        </div>
    );
}

export default App;