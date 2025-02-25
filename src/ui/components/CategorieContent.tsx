import { ReactNode } from "react";

import "./CategorieContent.css"

export default function CategorieContent({children, open}: {children:ReactNode, open:boolean}){
    return(
        <div className={`dropdown-content-container 
            ${open ? "content-open" : null} `}>
            {children}
        </div>
        );
}