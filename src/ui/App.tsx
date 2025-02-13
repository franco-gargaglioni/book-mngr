import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar.tsx';
import SearchBarList from './components/SearchBarList.tsx';

interface Item {
    "Leído?": string;
    "Name": string;
    "Autor": string;
    "Género": string;
    "Idioma": string;
    "Reseña": string;
    "Préstamo": string;
    "id": number;
}

function App() {
    const [results, setResults] = useState<Item[]>([]);

    useEffect(() => {

      const fetchBooks = async () => {
          try {
              //@ts-ignore
              const books = await window.electron.subscribeBookList();
              setResults(books);
          } catch (err) {
              console.error('Error subscribing to book list:', err);
          }
      };

      fetchBooks();
  }, []);

    return (
        <div>
            <div className="searchBarContainer">
                <SearchBar />
                <SearchBarList results={results} />
            </div>
        </div>
    );
}

export default App;