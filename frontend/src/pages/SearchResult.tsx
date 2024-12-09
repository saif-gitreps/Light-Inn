import { useSearchContext } from "../contexts/SearchContext";

function SearchResult() {
   const search = useSearchContext();

   return (
      <div>
         <h1>Search Result</h1>
      </div>
   );
}

export default SearchResult;
