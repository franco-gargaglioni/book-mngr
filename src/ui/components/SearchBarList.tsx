import './SearchBarList.css'
import SearchBarResult from './SearchBarResult'

import {Item} from '../types/types.ts'


export default function SearchbarList({results}: {results:Item[]} ){
    return (
        <div className="results-list">
            {
                results.map((result) =>{
                    return <ul key={result.id}>
                        <SearchBarResult result={result} />
                    </ul>
                }
            )
            }
        </div>
    )
}