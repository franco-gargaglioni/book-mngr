 import "./SearchBarResult.css"

interface Item {
    Leído?: string,
    Name: string,
    Autor: string,
    Género: string,
    Idioma: string,
    Reseña:string,
    Préstamo: string,
    id: number,
  }

export default function SearchBarResult( {result}: {result: Item}){

    return(
    <div className="search-bar-result" onClick={(e) => alert("toDo")}>
        {result.Name}
    </div>

    )
    
}