import './SearchBarList.css'

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
    console.log("|||||||||||||||||||||||||||||||||||||" + results)
    return (
        <div className="results-list">
            {
                results.map((result) =>{
                    return <ul>
                        <li key={result.id}>{result.Name}</li>
                    </ul>
                }
            )
            }
        </div>
    )
}