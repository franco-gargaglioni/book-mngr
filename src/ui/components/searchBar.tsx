import {FaSearch} from "react-icons/fa"
import "./SearchBar.css";


interface SearchBarProps {
    onSearch: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBar({ onSearch }: SearchBarProps) {

    return (
        <div className="input-wrapper">        
            <FaSearch id="search-icon" />
            <input onChange={onSearch} placeholder="Search for your book..."/>
        </div>
    )
}