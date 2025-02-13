import {FaSearch} from "react-icons/fa"
import "./SearchBar.css";
import { ChangeEvent } from "react";


interface SearchBarProps {
    onSearch: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBar({ onSearch }: SearchBarProps) {

    return (
        <div className="input-wrapper">        
            <FaSearch id="search-icon" />
            <input onChange={onSearch} placeholder="Search for you book..."/>
        </div>
    )
}