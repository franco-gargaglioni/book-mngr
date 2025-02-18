import "./BookInfo.css"
import { Item } from "../types/types.js";




export default function InputForm({name, label, selectedBook, isEditing, children}: { name: string, label: string, selectedBook:Item, isEditing: boolean, children:React.ReactNode} ){
    return(
        <div className="detail row">
            <label htmlFor={label}>
                <strong>{children}</strong>
            </label>
            <input id={label} type="text" defaultValue={selectedBook[name as keyof Item]}  disabled={!isEditing} name={name}/>
        </div>
    );
}