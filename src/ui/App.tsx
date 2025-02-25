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

function App() {
    const [results, setResults] = useState<Item[]>([]);
    const [originalResults, setOriginalResults] = useState<Item[]>([]);
    const [selectedBook, setSelectedBook] = useState<Item | null>(null);
    const [isWriting, setIsWriting] = useState(false);
    const [createNewBook, setCreateNewBook] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

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
  
      fetchBooks();
      return () => {
      };
    }, []);

    const fetchCategories = async (books:any) => {
      console.log("TRYING TO FETCH CATEGORIES");
      try {
        const categoriesSet = new Set(books.map((item:Item) => {
          if (item["Género"] != "" && item["Género"] != null){
            return item["Género"];
          }
        })
        );
        const categories = Array.from(categoriesSet) as string[];
        setCategories(categories);
      } catch (err) {
        console.error('Error while fetching categories:', err);
      }
    }

    useEffect(() => {
        const handleBookListUpdate = (_event: any, updatedBooks: Item[]) => {
          setOriginalResults(updatedBooks);
          setResults(updatedBooks);
          fetchCategories(updatedBooks);
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
        fetchCategories(originalResults);
      } else {
        const filteredResults = originalResults.filter((item) =>
          item.Name.toLowerCase().includes(searchTerm)
          || item.Autor.toLowerCase().includes(searchTerm)
        );
        setResults(filteredResults);
        fetchCategories(originalResults);
      }
    };

    const handleCreateNewBook = () => {
        setCreateNewBook(true);
    }

    const handleCategorieFilter = (searchTerm: string) => {
      setIsWriting(true);
  
      if (searchTerm === '') {
        setIsWriting(false);
        setResults(originalResults);
        fetchCategories(originalResults);
      } else {
        console.log("TERMINO DE BUSQUEDA" + searchTerm);
        const filteredResults = originalResults.filter((item) =>{
          return item.Género.toLowerCase().includes(searchTerm.toLowerCase());
        }
        );
        console.log(filteredResults);
        setResults(filteredResults);
        fetchCategories(originalResults);
      }
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
        </SelectedBookContext.Provider>
      );
  }

export default App;