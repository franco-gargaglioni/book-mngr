import { useContext } from 'react';
import { SelectedBookContext } from '../context/SelectedBookContext';


import {Item} from '../types/types.ts'
import './SearchBarResult.css'


export default function SearchBarResult({ result }: { result: Item }) {
    const { setSelectedBook } = useContext(SelectedBookContext);

    const handleClick = () => {
        setSelectedBook(result);
        console.log(result);
    };

    return (
        <div className="search-bar-result" onClick={handleClick}>
            {result.Name}
        </div>
    );
}