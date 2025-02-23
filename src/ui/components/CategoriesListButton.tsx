import { ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./CategoriesListButton.css"



export default function CategoriesListButton({children, open, toggle}: {children:ReactNode, open:boolean, toggle:React.MouseEventHandler}){
    return(
        <div onClick={toggle} className={`button-dropdown ${open ?
            "button-open" : null}`}
            >
            {children}
            <span className="toggle-icon">
                { open ? <FaChevronUp /> : 
                <FaChevronDown />}
            </span>
        </div>
    );
}