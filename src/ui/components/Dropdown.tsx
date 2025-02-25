import { ReactNode, useState } from "react";
import CategoriesListButton from "./CategoriesListButton.tsx";
import CategorieContent from "./CategorieContent";

import "./Dropdown.css"

export default function Dropdown({buttonText, content}: {buttonText:string, content:ReactNode}){
    const [open,setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open:boolean) => !open);
    }

    return(
        <div className="dropdown">
            <CategoriesListButton 
            toggle={toggleDropdown}
            open={open}>
                {buttonText}
            </CategoriesListButton>
            <CategorieContent open={open}>
                {content}
            </CategorieContent>
        </div>
    );

}