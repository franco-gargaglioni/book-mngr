import './SearchBarList.css'
import SearchBarResult from './SearchBarResult'

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


export default function SearchbarList({results}: {results:Item[]} ){
    return (
        <div className="results-list">
            {
                results.map((result, index) =>{
                    return <ul key={result.id}>
                        <SearchBarResult result={result} />
                    </ul>
                }
            )
            }
        </div>
    )
}