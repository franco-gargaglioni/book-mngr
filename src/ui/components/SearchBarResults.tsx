

import "./SearchBarResults.css"

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

export default function SearchBarResults( {results}: {results: Item[]}){

    return(
    <div className='results-list'>
        {
            results.map((result:Item) => {
                return <div key={result.id}>{result.Name}</div>
            })
        }
    </div>

    )
    
}