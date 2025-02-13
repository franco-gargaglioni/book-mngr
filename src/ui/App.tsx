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
    const [originalResults, setOriginalResults] = useState<Item[]>([]);

    useEffect(() => {

      const fetchBooks = async () => {
          try {
              //@ts-ignore
              const books = await window.electron.subscribeBookList();
              setOriginalResults(books);
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
        <div>
            <div className="searchBarContainer">
              <SearchBar onSearch={handleSearch} />
                <SearchBarList results={results} />
            </div>
        </div>
    );
}

export default App;