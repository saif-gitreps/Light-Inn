import { Button } from "./ui/button";

export type PaginationProps = {
   page: number;
   pages: number;
   onPageChange: (page: number) => void;
};

function Pagination({ page, pages, onPageChange }: PaginationProps) {
   const pageNumbers = [];
   for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
   }

   return (
      <div className="flex justify-center">
         <ul className="flex border ">
            {pageNumbers.map((pageNumber) => (
               <li
                  key={pageNumber}
                  className={`px-2 py-1 ${page === pageNumber}? "bg-gray-200" : ""`}
               >
                  <Button variant="outline" onClick={() => onPageChange(pageNumber)}>
                     {pageNumber}
                  </Button>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Pagination;
